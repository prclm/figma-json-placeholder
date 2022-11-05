import {
  once,
  showUI,
  getSelectedNodesOrAllNodes,
} from '@create-figma-plugin/utilities'

export default function () {
  showUI({ width: 240, height: 120 }, { greeting: 'from main.ts' })

  once('LOG_SELECTED', () => {
    console.log('LOG_SELECTED', getSelectedNodesOrAllNodes())
  })
}
