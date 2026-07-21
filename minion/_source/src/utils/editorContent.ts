import siteConfig from '@/site.config'

/**
 * 處理圖文編輯器內容
 * - 將 data-id 屬性轉換為完整的圖片 URL
 * - 圖片路徑格式: data-id="editor_content/xxx.png" -> src="${apiBaseUrl}/storage/editor_content/xxx.png"
 */
export function processEditorContent(html: string | null | undefined): string {
  if (!html) return ''

  const storageBaseUrl = `${siteConfig.apiBaseUrl}/storage`

  // 替換 data-id 為 src
  return html.replace(
    /<img\s+data-id="([^"]+)"/g,
    `<img src="${storageBaseUrl}/$1"`,
  )
}
