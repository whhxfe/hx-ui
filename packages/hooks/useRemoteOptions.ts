import { ref, watch } from "vue"
import type { OptionItem, GroupOptionItem, RemoteConfig } from "../types"
import { get, post } from "../utils"

function buildOption(
	item: any,
	labelKey: string,
	valueKey: string,
	childrenKey: string,
): OptionItem {
	const option: OptionItem = {
		label: item[labelKey],
		value: item[valueKey],
	}
	if (item.disabled) option.disabled = true
	if (Array.isArray(item[childrenKey]) && item[childrenKey].length > 0) {
		option.children = item[childrenKey].map((child: any) =>
			buildOption(child, labelKey, valueKey, childrenKey),
		)
	}
	return option
}

function buildGroup(
	item: any,
	labelKey: string,
	valueKey: string,
	childrenKey: string,
): GroupOptionItem {
	const resolvedChildrenKey = Array.isArray(item[childrenKey])
		? childrenKey
		: Array.isArray(item.options)
			? "options"
			: Array.isArray(item.children)
				? "children"
				: childrenKey

	const groupName =
		item.label ?? item.groupName ?? item[labelKey]

	return {
		label: groupName,
		disabled: item.disabled,
		options: (item[resolvedChildrenKey] || []).map((child: any) =>
			buildOption(child, labelKey, valueKey, resolvedChildrenKey),
		),
	}
}

/**
 * 从远程 URL 获取选项数据，自动映射 label / value / children 字段。
 * 分组结构根据数据是否包含 options / children 数组自动识别。
 */
export function useRemoteOptions(remote: RemoteConfig | undefined) {
	const remoteOptions = ref<(OptionItem | GroupOptionItem)[]>([])
	const loading = ref(false)

	async function fetchOptions() {
		if (!remote?.url) {
			remoteOptions.value = []
			return
		}

		loading.value = true
		const labelKey = remote.labelKey || "label"
		const valueKey = remote.valueKey || "value"
		const childrenKey = remote.childrenKey || "children"
		const method = remote.method || "get"

		try {
			const res: any = method === "post"
				? await post(remote.url, remote.body, {
						params: remote.params,
						headers: remote.bodyType === "form-data"
							? { "Content-Type": "multipart/form-data" }
							: undefined,
					})
				: await get(remote.url, { params: remote.params })

			const list: any[] = res?.data ?? []

			// 分组数据 = 子项是扁平叶子节点（select 分组场景）
			// 如果子项本身也有 children，则是级联树形数据，不应走 buildGroup
			const hasGroups =
				list.length > 0 &&
				(Array.isArray(list[0].options) || Array.isArray(list[0].children)) &&
				!(Array.isArray(list[0].children) && list[0].children.some((child: any) => Array.isArray(child.children)))

			if (hasGroups) {
				remoteOptions.value = list.map((item: any) =>
					buildGroup(item, labelKey, valueKey, childrenKey),
				)
			} else {
				remoteOptions.value = list.map((item: any) =>
					buildOption(item, labelKey, valueKey, childrenKey),
				)
			}
		} catch {
			console.warn(`[useRemoteOptions] 远程数据加载失败: ${remote.url}`)
		} finally {
			loading.value = false
		}
	}

	watch(
		() => remote,
		() => {
			fetchOptions()
		},
		{ immediate: true, deep: true },
	)

	return { remoteOptions, loading }
}
