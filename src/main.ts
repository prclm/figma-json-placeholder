import {
  on,
  showUI,
  getSelectedNodesOrAllNodes,
} from '@create-figma-plugin/utilities'
import { FormState } from './components/CreatePlaceholderForm'

import useConfig from './helpers/useConfig'
import usePlaceholder from './helpers/usePlaceholder'
import { NotifyMessage, PluginError } from './helpers/useErrorNotify'
import { getSelectionData, updateSelectionData } from './helpers/scene-nodes'

export default () => {
  const { defaultUiSizes, defaultApi } = useConfig()
  const { createInstances } = usePlaceholder(defaultApi)

  showUI(
    { width: defaultUiSizes.width, height: defaultUiSizes.height },
    {
      selection: getSelectionData(),
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
  on('UPDATE_PLUGIN_DATA', (id, pluginData) => {
    figma.getNodeById(id)?.setPluginData(pluginData.key, pluginData.value)
    updateSelectionData()
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
