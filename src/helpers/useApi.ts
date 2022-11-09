import { ApiConfig, RouteConfig } from './types'
import useConfig from './useConfig'

const { defaultApi: defaultApiConfig } = useConfig()
const useApi = () => {
  const getAllApis = () => {
    return [defaultApiConfig]
  }

  const getApi = (name: string) => getAllApis().find((api) => api.name === name)

  const getRouteNames = (api: ApiConfig = defaultApiConfig) => api.routes.map((r: RouteConfig) => r.route)

  const fetchApiData = async (url: string): Promise<JSON> => {
    return await fetch(url).then(async (res) => JSON.parse(await res.text()))
  }

  const getPlaceholderKeys = async (url: string): Promise<string[]> => {
    const data = await fetchApiData(url)
    const keyStrings: Array<string> = []
    const pushKeyStrings = (obj: Record<string, any>, prev = '') => {
      const keys = Object.keys(obj)
      keys.forEach((key) => {
        const s = prev ? `${prev}.${key}` : key
        if (typeof obj[key] === 'object') {
          pushKeyStrings(obj[key], s)
        } else {
          keyStrings.push(s)
        }
      })
    }
    pushKeyStrings(data as Record<string, any>)
    return keyStrings
  }

  return {
    defaultApiConfig,
    getAllApis,
    getApi,
    getRouteNames,
    fetchApiData,
    getPlaceholderKeys,
  }
}

export default useApi
