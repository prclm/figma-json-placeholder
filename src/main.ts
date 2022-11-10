import { on, showUI, getSelectedNodesOrAllNodes } from '@create-figma-plugin/utilities'
import { FormState } from './components/CreatePlaceholderForm'

import useConfig from './helpers/useConfig'
import usePlaceholder from './helpers/usePlaceholder'
import { NotifyMessage, PluginError } from './helpers/useErrorNotify'
import { getSelectionData, updateSelectionData } from './helpers/scene-nodes'
import { StorageValue, getClientStorage } from './helpers/useStorage'

export default async () => {
  const { defaultUiSizes, defaultApi } = useConfig()
  const { createInstances } = usePlaceholder(defaultApi)
  const clientStorage = await getClientStorage()

  showUI(
    { width: defaultUiSizes.width, height: defaultUiSizes.height },
    {
      selection: getSelectionData(),
      clientStorage: clientStorage,
    }
  )

  on('LOG_SELECTION', () => {
    console.log('selected Nodes:', getSelectedNodesOrAllNodes())
  })
  on('RESIZE_WINDOW', (windowSize: { width: number; height: number }) => {
    figma.ui.resize(windowSize.width, windowSize.height)
  })
  on('CREATE_PLACEHOLDER_INSTANCES', (formData: FormState) => {
    createInstances(formData).catch((error) => handleError(error))
  })
  on('UPDATE_NODE_PLUGIN_DATA', (id, pluginData) => {
    figma.getNodeById(id)?.setPluginData(pluginData.key, JSON.stringify(pluginData.value))
    updateSelectionData()
  })
  on('SET_CLIENT_STORAGE', (key: string, value: StorageValue) => {
    figma.clientStorage.setAsync(key, value)
  })

  figma.on('selectionchange', () => updateSelectionData())
  figma.on('documentchange', () => updateSelectionData())

  const handleError = (error: Error) => {
    if (error instanceof NotifyMessage) {
      figma.notify(error.message, { error: true })
    } else if (error instanceof PluginError) {
      console.log(error.name, error.message, error?.stack)
    } else {
      console.error(error.name, error.message, error?.stack)
    }
  }
}
