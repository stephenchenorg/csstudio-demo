export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

export interface ImageInfo<Url = string> {
  url: Url
  path: Url
  width: number
  height: number
}

export interface UploadResponse {
  path: string
  url: string
}
