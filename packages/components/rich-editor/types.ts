export interface RichEditorUploadOptions {
	url?: string
	headers?: Record<string, string>
	fieldName?: string
	extraData?: Record<string, string | Blob>
	minio?: {
		endpoint: string
		bucket: string
		accessKey: string
		secretKey: string
	}
}

export interface RichEditorParams {
	modelValue?: string
	readOnly?: boolean
	uploadUrl?: string
	uploadImage?: RichEditorUploadOptions
	uploadVideo?: RichEditorUploadOptions
	responseAdapter?: (res: any) => string
}
