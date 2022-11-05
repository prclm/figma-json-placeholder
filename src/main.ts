import {
  on,
  showUI,
  getSelectedNodesOrAllNodes,
} from '@create-figma-plugin/utilities'

import { useConfig } from './helpers/useConfig'

export default function () {
  const { defaultUiSizes } = useConfig()
  showUI(
    { width: defaultUiSizes.width, height: defaultUiSizes.height },
    { greeting: 'from main.ts' }
  )

  on('LOG_SELECTED', () => {
    console.log('LOG_SELECTED', getSelectedNodesOrAllNodes())
  })
  on('RESIZE_WINDOW', function (windowSize: { width: number; height: number }) {
    figma.ui.resize(windowSize.width, windowSize.height)
  })
}
