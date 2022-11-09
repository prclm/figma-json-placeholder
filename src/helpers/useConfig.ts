import { RouteConfig, ApiConfig } from './types'

const defaultUiSizes = {
  width: 320,
  height: 0,
}
const placeholderApiUrl = 'https://jsonplaceholder.typicode.com'

const placeholderApiRoutes: RouteConfig[] = [
  { route: 'posts', subroutes: ['comments'], exampleId: '1' }, // 100 posts
  { route: 'comments', exampleId: '1' }, // 500 comments
  { route: 'albums', subroutes: ['photos'], exampleId: '1' }, // 100 albums
  { route: 'photos', exampleId: '1' }, // 5000 photos
  { route: 'todos', exampleId: '1' }, // 200 todos
  { route: 'users', subroutes: ['albums', 'todos', 'posts'], exampleId: '1' }, // 10 users
]

const useConfig = () => {
  const defaultApi: ApiConfig = {
    name: '{JSON}Placeholder',
    url: placeholderApiUrl,
    routes: placeholderApiRoutes,
  }

  return {
    defaultApi,
    defaultUiSizes,
  }
}
export default useConfig
