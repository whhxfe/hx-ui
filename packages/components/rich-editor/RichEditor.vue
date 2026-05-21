<!--
  HxRichEditor - 基于 wangeditor 的富文本编辑器

  依赖 @wangeditor/editor 和 @wangeditor/editor-for-vue

  用法：
    <HxRichEditor v-model="content" :upload-url="uploadUrl" />
-->
<template>
	<div v-if="isLoaded" class="hx-rich-editor">
		<Toolbar
			:editor="editorRef"
			:defaultConfig="toolbarConfig"
			:mode="mode"
			class="hx-rich-editor__toolbar"
		/>
		<Editor
			v-model="htmlContent"
			:defaultConfig="editorConfig"
			:mode="mode"
			class="hx-rich-editor__content"
			@onCreated="handleCreated"
			@onChange="handleChange"
		/>
	</div>
	<div v-else-if="loadError" class="hx-rich-editor hx-rich-editor--error">
		<p>富文本编辑器加载失败，请检查依赖是否正确安装</p>
	</div>
	<div v-else class="hx-rich-editor hx-rich-editor--loading">
		<p>加载中...</p>
	</div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css"
import { ref, shallowRef, watch, computed, onBeforeUnmount } from "vue"
import type { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor"
import { ElMessage } from "element-plus"
import type { RichEditorParams, RichEditorUploadOptions } from "./types"

const props = withDefaults(defineProps<RichEditorParams>(), {
	modelValue: "",
	readOnly: false,
	uploadUrl: "",
	uploadImage: () => ({}),
	uploadVideo: () => ({}),
	responseAdapter: (res: any) => res.url || res.data || res.data?.url || res.path
})

const emit = defineEmits<{
	"update:modelValue": [string]
	"upload-success": [string]
}>()

// ========== 动态加载 wangeditor ==========
const isLoaded = ref(false)
const loadError = ref(false)

// wangeditor 组件
const Editor = shallowRef()
const Toolbar = shallowRef()

async function loadWangEditor() {
	try {
		const [editorModule, toolbarModule] = await Promise.all([
			import("@wangeditor/editor-for-vue"),
			import("@wangeditor/editor-for-vue")
		])
		Editor.value = editorModule.Editor
		Toolbar.value = toolbarModule.Toolbar
		isLoaded.value = true
	} catch {
		loadError.value = true
		console.error("[HxRichEditor] 加载 wangeditor 失败，请安装: pnpm add @wangeditor/editor @wangeditor/editor-for-vue@5.1.12")
	}
}

// ========== 编辑器状态 ==========
const editorRef = shallowRef<IDomEditor>()
const htmlContent = ref(props.modelValue)
const mode = "default"

// ========== watch ==========
watch(
	() => props.modelValue,
	val => {
		if (val !== htmlContent.value) {
			htmlContent.value = val
		}
	}
)

watch(
	() => props.readOnly,
	val => {
		if (!editorRef.value) return
		val ? editorRef.value.disable() : editorRef.value.enable()
	}
)

// ========== toolbar config ==========
const toolbarConfig: Partial<IToolbarConfig> = {
	toolbarKeys: [
		"blockquote",
		"headerSelect",
		"bold",
		"underline",
		"italic",
		"through",
		"clearStyle",
		"color",
		"bgColor",
		"bulletedList",
		"numberedList",
		"todo",
		"justifyLeft",
		"justifyCenter",
		"justifyRight",
		"justifyJustify",
		"insertLink",
		"uploadImage",
		"uploadVideo",
		"insertTable",
		"codeBlock",
		"undo",
		"redo"
	]
}

// ========== 图片压缩 ==========
const compressImage = (file: File): Promise<File> => {
	return new Promise(resolve => {
		if (!file.type.startsWith("image/")) {
			resolve(file)
			return
		}

		const reader = new FileReader()

		reader.onload = e => {
			const img = new Image()

			img.onload = () => {
				const canvas = document.createElement("canvas")
				const ctx = canvas.getContext("2d")!

				const maxWidth = 1600
				const scale = Math.min(1, maxWidth / img.width)

				canvas.width = img.width * scale
				canvas.height = img.height * scale

				ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

				canvas.toBlob(
					blob => {
						if (!blob) {
							resolve(file)
							return
						}
						resolve(new File([blob], file.name, { type: "image/jpeg" }))
					},
					"image/jpeg",
					0.8
				)
			}

			img.src = e.target!.result as string
		}

		reader.readAsDataURL(file)
	})
}

// ========== 上传处理 ==========
const resolveUploadOption = (type: "image" | "video", option: RichEditorUploadOptions): RichEditorUploadOptions => {
	const resolvedUrl = option.url || props.uploadUrl
	if (resolvedUrl) {
		return { ...option, url: resolvedUrl }
	}
	if (option.minio) {
		return option
	}
	throw new Error(type === "image" ? "未配置图片上传地址" : "未配置视频上传地址")
}

const uploadByRequest = async (file: File, option: RichEditorUploadOptions) => {
	if (!option.url) throw new Error("未配置上传地址")

	const formData = new FormData()
	formData.append(option.fieldName || "file", file)

	if (option.extraData) {
		Object.entries(option.extraData).forEach(([k, v]) => {
			formData.append(k, v)
		})
	}

	const res = await fetch(option.url, {
		method: "POST",
		body: formData,
		headers: option.headers
	})

	const data = await res.json()
	const url = props.responseAdapter(data)
	if (!url) throw new Error("未解析到url")
	return url
}

const uploadMinio = async (file: File, option: RichEditorUploadOptions) => {
	const { endpoint, bucket } = option.minio!
	const objectName = Date.now() + "-" + file.name
	const url = `${endpoint}/${bucket}/${objectName}`

	const response = await fetch(url, {
		method: "PUT",
		body: file,
		headers: {
			"Content-Type": file.type,
			"x-amz-acl": "public-read"
		}
	})

	if (!response.ok) {
		throw new Error(`MinIO上传失败(${response.status})`)
	}
	return url
}

const upload = async (file: File, option: RichEditorUploadOptions) => {
	if (option.minio) {
		return await uploadMinio(file, option)
	}
	if (option.url) {
		return await uploadByRequest(file, option)
	}
	throw new Error("未配置上传方式")
}

// ========== editor config ==========
const editorConfig = computed<Partial<IEditorConfig>>(() => ({
	placeholder: "请输入内容...",
	readOnly: props.readOnly,
	MENU_CONF: {
		uploadImage: {
			async customUpload(file: File, insertFn: (url: string) => void) {
				try {
					const compressed = await compressImage(file)
					const uploadOption = resolveUploadOption("image", props.uploadImage || {})
					const url = await upload(compressed, uploadOption)
					insertFn(url)
					emit("upload-success", url)
				} catch (err) {
					ElMessage.error((err as Error).message)
				}
			}
		},
		uploadVideo: {
			async customUpload(file: File, insertFn: (url: string) => void) {
				try {
					const uploadOption = resolveUploadOption("video", props.uploadVideo || {})
					const url = await upload(file, uploadOption)
					insertFn(url)
					emit("upload-success", url)
				} catch (err) {
					ElMessage.error((err as Error).message)
				}
			}
		}
	}
}))

// ========== events ==========
const handleCreated = (editor: IDomEditor) => {
	editorRef.value = editor
}

const handleChange = (editor: IDomEditor) => {
	emit("update:modelValue", editor.getHtml())
}

// ========== destroy ==========
onBeforeUnmount(() => {
	editorRef.value?.destroy()
})

// ========== 初始化加载 ==========
loadWangEditor()
</script>

<style lang="scss" scoped>
.hx-rich-editor {
	width: 100%;
	border: 1px solid var(--el-border-color);
	border-radius: 6px;

	&--loading,
	&--error {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		color: var(--el-text-color-placeholder);
	}
}

.hx-rich-editor__toolbar {
	border-bottom: 1px solid var(--el-border-color-lighter);
}

.hx-rich-editor__content {
	height: 500px;
	min-height: 150px;
	overflow-y: auto;

	:deep(.w-e-editor) {
		min-height: 500px;
	}
}
</style>
