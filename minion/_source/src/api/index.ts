import type { APIContext } from 'astro'
import type { FetchOptions, MappedResponseType, ResponseType } from 'ofetch'
import { ofetch } from 'ofetch'
import siteConfig from '@/site.config'

export async function apiFetch<T = any, R extends ResponseType = 'json'>(
  url: string,
  userOptions: FetchOptions<R> & { Astro?: APIContext } = {}
): Promise<MappedResponseType<R, T>> {
  const { Astro: astroContext, ...options } = userOptions

  const response = await ofetch(url, {
    baseURL: siteConfig.apiBaseUrl,
    ...options,
    async onRequest({ request, options }) {
      // 默認使用 zh_TW, 因為後端也是用 zh_TW, 雖然前端是使用 BCP 47 國際標準，html 的 lang 是使用 zh-TW ( 不是下底線 ）
      // 但語系因為跟著後端走，所以記得其他語系也是如此
      options.headers.set('Content-Language', 'zh_TW')
      options.headers.set('Time-Zone', 'Asia/Taipei')
      options.headers.set('Referer', 'https://dentalk.com.tw/')

      // if (userToken?.token) {
      //   options.headers.set('Authorization', `Bearer ${userToken.token}`)
      // }
    },
  })

  return response
}
