import { ref, watch } from "vue"
import type { OptionItem, GroupOptionItem, RemoteConfig } from "../components/form/types"

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

function rawListLooksLikeSelectGroups(
	list: any[],
	childrenKey: string,
): boolean {
	if (!Array.isArray(list) || list.length === 0) return false
	return list.every((item) => {
		if (!item || typeof item !== "object") return false
		return (
			Array.isArray(item.options) ||
			Array.isArray(item.children) ||
			Array.isArray(item[childrenKey])
		)
	})
}

export interface UseRemoteOptionsOptions {
	/** 字段类型，用于判断是否走分组逻辑 */
	fieldType: string
	/** 分组 children key（默认 "children"） */
	childrenKey?: string
	/** 联动：父级 prop 当前选中的值，变化时自动重新请求（支持 getter 以正确追踪 reactive 依赖） */
	dependsOnValue?: (() => string | number | (string | number)[] | undefined) | (string | number | (string | number)[])
}

/**
 * 从远程 URL 获取选项数据，自动映射 label / value / children 字段。
 * 支持联动：remote.dependsOn 配置后，dependsOnValue 变化时自动重新请求。
 */
export function useRemoteOptions(
	remote: RemoteConfig | undefined,
	options: OptionItem[] | GroupOptionItem[] | undefined,
	{ fieldType, childrenKey = "children", dependsOnValue }: UseRemoteOptionsOptions,
) {
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
		const resolvedChildrenKey = remote.childrenKey || childrenKey

		// 支持 getter（用于响应式追踪）或直接值
		const depVal = typeof dependsOnValue === "function"
			? dependsOnValue()
			: dependsOnValue

		const method = (remote.method || "get") as "get" | "post"

		// dependsOnIn：显式指定注入位置；未指定则按 method 默认行为
		// 默认：GET → query，POST → body
		const injectInQuery =
			remote.dependsOnIn === "query" || (!remote.dependsOnIn && method === "get")
		const injectInBody =
			remote.dependsOnIn === "body" || (!remote.dependsOnIn && method !== "get")

		try {
			// ── GET：拼 URL 参数 ─────────────────────────���───────
			const allParams: Record<string, any> = { ...(remote.params || {}) }
			if (remote.dependsOn && depVal != null && depVal !== "" && injectInQuery) {
				const paramKey = remote.dependsOnParamKey || "value"
				const rawVal = Array.isArray(depVal) ? depVal[0] : depVal
				allParams[paramKey] = rawVal
			}

			const queryStr = Object.keys(allParams).length > 0
				? new URLSearchParams(
						Object.fromEntries(
							Object.entries(allParams).map(([k, v]) => [k, String(v)]),
						),
					).toString()
				: undefined
			const requestUrl = queryStr
				? `${remote.url}${remote.url.includes("?") ? "&" : "?"}${queryStr}`
				: remote.url

			// ── 请求头与 body ────────────────────────────────────
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			}
			let body: BodyInit | undefined

			if (method !== "get") {
				const bodyData: Record<string, any> = remote.body ? { ...remote.body } : {}
				if (remote.dependsOn && depVal != null && depVal !== "" && injectInBody) {
					const paramKey = remote.dependsOnParamKey || "value"
					const rawVal = Array.isArray(depVal) ? depVal[0] : depVal
					bodyData[paramKey] = rawVal
				}
				if (remote.bodyType === "form-data") {
					const fd = new FormData()
					Object.entries(bodyData).forEach(([k, v]) =>
						fd.append(k, String(v)),
					)
					body = fd
					delete headers["Content-Type"]
				} else {
					body = JSON.stringify(bodyData)
				}
			}

			const res = await fetch(requestUrl, { method, headers, body })
			const data = await res.json()
			const list: any[] =
				data.state === 2000 || data.code === 0
					? data.data ?? data.result ?? []
					: []

			const useGroups =
				(fieldType === "select" || fieldType === "transfer") &&
				rawListLooksLikeSelectGroups(list, resolvedChildrenKey)
			remoteOptions.value = useGroups
				? list.map((item: any) =>
						buildGroup(item, labelKey, valueKey, resolvedChildrenKey),
					)
				: list.map((item: any) =>
						buildOption(item, labelKey, valueKey, resolvedChildrenKey),
					)
		} catch {
			console.warn(`[useRemoteOptions] 远程数据加载失败: ${remote.url}`)
		} finally {
			loading.value = false
		}
	}

	// 联动：显式监听 dependsOnValue 变化（含 immediate，初始也会触发一次）
	watch(
		() => typeof dependsOnValue === "function" ? dependsOnValue() : dependsOnValue,
		() => {
			fetchOptions()
		},
		{ immediate: true },
	)

	return { remoteOptions, loading }
}
