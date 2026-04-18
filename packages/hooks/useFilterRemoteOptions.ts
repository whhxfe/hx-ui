import { ref, watch } from "vue"
import type { FilterRemoteConfig } from "../components/filter-panel/types"
import type { FilterOption } from "../components/filter-panel/types"
import { get, post } from "../utils"

export interface UseFilterRemoteOptionsOptions {
	dependsOnValue?: (() => string | number | (string | number)[] | undefined) | (string | number | (string | number)[])
}

export function useFilterRemoteOptions(
	remote: FilterRemoteConfig | undefined,
	{ dependsOnValue }: UseFilterRemoteOptionsOptions = {},
) {
	const remoteOptions = ref<FilterOption[]>([])
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

		const depVal = typeof dependsOnValue === "function"
			? dependsOnValue()
			: dependsOnValue

		const method = remote.method || "get"

		const injectInQuery =
			remote.dependsOnIn === "query" || (!remote.dependsOnIn && method === "get")
		const injectInBody =
			remote.dependsOnIn === "body" || (!remote.dependsOnIn && method !== "get")

		try {
			const allParams: Record<string, any> = { ...(remote.params || {}) }
			if (remote.dependsOn && depVal != null && depVal !== "" && injectInQuery) {
				const paramKey = remote.dependsOnParamKey || "value"
				const rawVal = Array.isArray(depVal) ? depVal[0] : depVal
				allParams[paramKey] = rawVal
			}

			let list: any[] = []
			if (method === "post") {
				const bodyData: Record<string, any> = remote.body ? { ...remote.body } : {}
				if (remote.dependsOn && depVal != null && depVal !== "" && injectInBody) {
					const paramKey = remote.dependsOnParamKey || "value"
					const rawVal = Array.isArray(depVal) ? depVal[0] : depVal
					bodyData[paramKey] = rawVal
				}
				const res: any = await post(remote.url, remote.bodyType === "form-data" ? bodyData : bodyData, {
					params: allParams,
					headers: remote.bodyType === "form-data"
						? { "Content-Type": "multipart/form-data" }
						: undefined,
				})
			list = res?.data ?? []
		} else {
			const res: any = await get(remote.url, { params: allParams })
			list = res?.data ?? []
		}

			remoteOptions.value = list.map((item: any): FilterOption => {
				const option: FilterOption = {
					label: item[labelKey],
					value: item[valueKey],
				}
				if (item.disabled) option.disabled = true
				if (Array.isArray(item[childrenKey]) && item[childrenKey].length > 0) {
					option.children = item[childrenKey].map((child: any) => ({
						label: child[labelKey],
						value: child[valueKey],
					}))
				}
				return option
			})
		} catch {
			console.warn(`[useFilterRemoteOptions] 远程数据加载失败: ${remote.url}`)
		} finally {
			loading.value = false
		}
	}

	watch(
		() => typeof dependsOnValue === "function" ? dependsOnValue() : dependsOnValue,
		() => {
			fetchOptions()
		},
		{ immediate: true },
	)

	return { remoteOptions, loading }
}
