import { ref, watch } from "vue"
import type { RemoteConfig } from "../types"
import { get, post } from "../utils"

/**
 * 级联选择专用的远程数据 hook。
 * 直接返回后端原始数据（数组），不做任何 label/value/children 字段映射。
 * 级联面板通过 labelKey / valueKey / childrenKey 配置来解读数据。
 */
export function useCascaderRemoteOptions(remote: RemoteConfig | undefined) {
	const remoteOptions = ref<any[]>([])
	const loading = ref(false)

	async function fetchOptions() {
		if (!remote?.url) {
			remoteOptions.value = []
			return
		}

		loading.value = true
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

			remoteOptions.value = res?.data ?? []
		} catch {
			console.warn(`[useCascaderRemoteOptions] 远程数据加载失败: ${remote.url}`)
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
