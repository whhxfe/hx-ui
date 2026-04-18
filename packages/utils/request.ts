import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
} from "axios"

function typedRequest<T>(promise: Promise<unknown>): Promise<T> {
	return promise as Promise<T>
}

/** 请求配置扩展 */
export interface RequestConfig extends AxiosRequestConfig {
	/** URL query 参数 */
	params?: Record<string, unknown>
	/** 请求级别 headers，会与全局 headers 合并，请求级别优先 */
	headers?: Record<string, string>
}

/** 全局请求配置 */
export interface RequestOptions {
	headers?: Record<string, string>
}

let _instance: AxiosInstance | null = null
let _options: RequestOptions = {}

function buildInstance(): AxiosInstance {
	const inst = axios.create({
		baseURL: "",
		timeout: 30000,
		headers: { "Content-Type": "application/json" },
	})

	inst.interceptors.request.use((config) => {
		const rc = config as RequestConfig
		const merged = { ..._options.headers, ...rc.headers }
		for (const [k, v] of Object.entries(merged)) {
			config.headers.set(k, v)
		}
		return config
	})

	inst.interceptors.response.use(
		(response) => {
			return response.data
		},
		(error) => {
			console.error("[request] error:", error)
			return Promise.reject(error)
		},
	)

	return inst
}

/** 获取请求实例（懒初始化） */
export function getRequest(): AxiosInstance {
	if (!_instance) _instance = buildInstance()
	return _instance
}

/** 替换全局请求实例 */
export function setRequestInstance(instance: AxiosInstance) {
	_instance = instance
}

/** 获取全局配置 */
export function getRequestOptions(): Readonly<RequestOptions> {
	return _options
}

/** 设置全局配置 */
export function setRequestOptions(options: RequestOptions) {
	_options = options
}

type NoDataMethod = "get" | "delete" | "head" | "options"
type WithDataMethod = "post" | "put" | "patch"

function createMethod<M extends NoDataMethod>(
	method: M,
): {
	<T = any>(url: string, config?: RequestConfig): Promise<T>
} & {
	<T = any>(url: string, data?: unknown, config?: RequestConfig): Promise<T>
}

function createMethod(method: "get" | "delete" | "head" | "options") {
	return <T = any>(url: string, config?: RequestConfig): Promise<T> => {
		return typedRequest<T>(getRequest().request<T>({ ...config, method, url }))
	}
}

function createPostLikeMethod(method: "post" | "put" | "patch") {
	return <T = any>(url: string, data?: unknown, config?: RequestConfig): Promise<T> => {
		return typedRequest<T>(getRequest().request<T>({ ...config, method, url, data }))
	}
}

/** 链式调用入口：request.get / request.post / ... */
export const request = {
	get: createMethod("get"),
	post: createPostLikeMethod("post"),
	put: createPostLikeMethod("put"),
	delete: createMethod("delete"),
	patch: createPostLikeMethod("patch"),
	head: createMethod("head"),
	options: createMethod("options"),
	request<T = any>(config: RequestConfig): Promise<T> {
		return typedRequest<T>(getRequest().request<T>(config))
	},
}

export type RequestInstance = typeof request

export const get = request.get
export const post = request.post
