export {
	get,
	post,
	getRequest,
	setRequestInstance,
	getRequestOptions,
	setRequestOptions,
	request,
} from "./request"
export type { RequestConfig, RequestInstance, RequestOptions } from "./request"

export const isEqual = (a: unknown, b: unknown): boolean => {
	if (a === b) return true
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false
		return a.every((item, i) => isEqual(item, b[i]))
	}
	if (a && b && typeof a === "object" && typeof b === "object") {
		const keysA = Object.keys(a as object)
		const keysB = Object.keys(b as object)
		if (keysA.length !== keysB.length) return false
		return keysA.every((k) => isEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]))
	}
	return false
}
