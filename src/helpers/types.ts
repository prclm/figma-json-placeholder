export type RouteNames =
  | 'posts'
  | 'comments'
  | 'albums'
  | 'photos'
  | 'todos'
  | 'users'

export interface RouteConfig {
  route: RouteNames
  subroutes?: RouteNames[]
}

export interface ApiConfig {
  url: string
  routes: RouteConfig[]
}

export interface PluginData {
  key: string
  value: string
}

export interface NodeData {
  id: string
  type: NodeType
  pluginData: PluginData[]
}
