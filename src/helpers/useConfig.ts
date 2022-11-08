import { RouteConfig, ApiConfig } from './types'

const defaultUiSizes = {
  width: 320,
  height: 0,
}
const placeholderApiUrl = 'https://jsonplaceholder.typicode.com'

const placeholderApiRoutes: RouteConfig[] = [
  { route: 'posts', subroutes: ['comments'] }, // 100 posts
  { route: 'comments' }, // 500 comments
  { route: 'albums', subroutes: ['photos'] }, // 100 albums
  { route: 'photos' }, // 5000 photos
  { route: 'todos' }, // 200 todos
  { route: 'users', subroutes: ['albums', 'todos', 'posts'] }, // 10 users
]

const useConfig = () => {
  const defaultApi: ApiConfig = {
    url: placeholderApiUrl,
    routes: placeholderApiRoutes,
  }

  return {
    defaultApi,
    defaultUiSizes,
  }
}
export default useConfig
