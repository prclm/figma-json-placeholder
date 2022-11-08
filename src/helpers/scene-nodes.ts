import { NodeData, PluginData } from './types'
import { emit } from '@create-figma-plugin/utilities'

export const getSelectionData = () => {
  const nodes = figma.currentPage.selection
  const nodesData: NodeData[] = []
  nodes.forEach((node) => {
    const pluginData = node
      .getPluginDataKeys()
      .map((key): PluginData => ({ key, value: node.getPluginData(key) }))
    nodesData.push({
      id: node.id,
      type: node.type,
      pluginData,
    })
  })
  return nodesData
}

export const updateSelectionData = () => {
  emit('SELECTION_DATA_UPDATED', getSelectionData())
}
