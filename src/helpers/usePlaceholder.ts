import {
  getAbsolutePosition,
  setAbsolutePosition,
} from '@create-figma-plugin/utilities'
import { FormState } from '../components/CreatePlaceholderForm'
import useError from './useErrorNotify'
import { ApiConfig } from './types'

// eslint-disable-next-line prefer-const
const { setErrorNotify, clearNotify } = useError('usePlaceholder')
const usePlaceholder = (apiConfig: ApiConfig) => {
  const createInstances = async (data: FormState) => {
    // remove previous notifications, if any
    clearNotify()

    // get the selected node(s)
    const selection = await getSelection()

    // collection of new nodes
    const allInstanceNodes: SceneNode[] = []

    selection.forEach(async (node: SceneNode) => {
      const nodes: SceneNode[] = []

      // check if node is a component
      // TODO: ask User before auto conversion to componentNode
      const component =
        node.type === 'COMPONENT'
          ? node
          : (toComponentNode(node) as ComponentNode)

      for (let i = 1; i <= parseInt(data.instancesCount); i++) {
        const instance = component?.createInstance()
        component?.parent?.appendChild(instance)
        positionRelativeTo(instance, component, data.layoutOrientation, 100, i)
        fillPlaceholders(instance, i).catch(() => {
          // instance.remove()
          nodes.forEach((node) => node.remove())
        })
        nodes.push(instance)
      }
      allInstanceNodes.push(...nodes)
    })
    // Select all the nodes and zoom into view
    figma.viewport.scrollAndZoomIntoView([...selection, ...allInstanceNodes])
    figma.currentPage.selection = allInstanceNodes
  }

  const getSelection = (): Promise<readonly SceneNode[]> => {
    return new Promise((resolve, reject) => {
      const selection = figma.currentPage.selection
      if (selection.length > 0) {
        resolve(selection)
      } else {
        reject(
          setErrorNotify('Bitte wähle zunächst ein Component-Element aus.')
        )
      }
    })
  }

  const toComponentNode = (node: SceneNode): ComponentNode | void => {
    const component = figma.createComponent()
    node.parent?.appendChild(component)
    setAbsolutePosition(component, getAbsolutePosition(node))
    component.resizeWithoutConstraints(node.width, node.height)
    component.name = `Component of ${node.name}`
    try {
      component.appendChild(node)
      node.x = 0
      node.y = 0
      return component
    } catch (error) {
      if (error instanceof Error) {
        setErrorNotify(error.message, {}, false)
      }
      component.remove()
      throw error
    }
  }

  const positionRelativeTo = (
    node: SceneNode,
    refNode: SceneNode,
    orientation: string | 'vertical' | 'horizontal', // TODO: fix Type definition
    space: number,
    i = 0
  ) => {
    node.y =
      orientation === 'vertical'
        ? refNode.y + (refNode?.height + space) * i
        : refNode?.y
    node.x =
      orientation === 'horizontal'
        ? refNode.x + (refNode?.width + space) * i
        : refNode?.x
  }

  const fillPlaceholders = async (node: SceneNode, i: number) => {
    const regex = /{{\s*([A-Za-z/:.]+)\s*}}/g
    const find = node.name.search(regex) !== -1
    if (find) {
      const placeholder = node.name.replace(regex, '$1').split(/[:/]/g)
      const route = placeholder[0]
      const values = placeholder[1].split('.')
      const property = placeholder[2]
      const routeObj = apiConfig.routes.find((r) => r.route == route)
      if (routeObj) {
        let uri = `${apiConfig.url}/${route}/`
        if (i) uri += `${i}/`
        const response = await fetch(uri)
        const data = await response.text()
        const valueData = values.reduce((obj, val: string) => {
          if (val in obj) return obj[val]
          return null
        }, JSON.parse(data))

        if (node.type === 'TEXT') {
          await figma.loadFontAsync(node.fontName as FontName)
          node.characters = valueData || '{{not found}}'
        }

        if (node.type === 'INSTANCE') {
          if (typeof valueData === 'boolean') {
            console.log(property, valueData)
            console.log(node.componentProperties[property])
            node.setProperties({ [property]: valueData })
            // node.componentProperties[property].value = valueData
          }
        }
      } else {
        // ToDo: select reference in mainComponent and delete instances
        throw setErrorNotify(`"${route}" in "${placeholder}" ist ungültig`)
      }
    }
    // recursive for all children
    if ('children' in node)
      node.children.forEach((child: SceneNode) => fillPlaceholders(child, i))
  }

  return {
    createInstances,
  }
}
export default usePlaceholder
