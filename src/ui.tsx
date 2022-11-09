// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, Component, createRef } from 'preact'
import {
  render,
  Container,
  Text,
  Button,
  VerticalSpace,
  Divider,
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { DevTools } from './components/DevTools'
import { CreatePlaceholderForm } from './components/CreatePlaceholderForm'
import { NodeData, PluginData } from './helpers/types'
import '!./assets/ui.css'
import useStorage, { ClientStorage } from './helpers/useStorage'

type PluginProps = {
  selection: NodeData[]
  clientStorage: ClientStorage
}
type PluginState = {
  selection: NodeData[]
}

const { StorageContext } = useStorage()

class Plugin extends Component<PluginProps> {
  rootRef = createRef()

  state: PluginState = {
    selection: [],
  }

  constructor(props: PluginProps) {
    super(props)
  }

  componentDidMount() {
    const rootEl = this.rootRef.current
    const outputsize = () =>
      emit('RESIZE_WINDOW', {
        width: rootEl.offsetWidth,
        height: rootEl.offsetHeight,
      })
    outputsize()
    new ResizeObserver(outputsize).observe(rootEl)
    this.setState({
      selection: this.props.selection,
    })
    on('SELECTION_DATA_UPDATED', (selection: NodeData[]) => {
      console.log(selection)
      this.setState({
        selection: selection,
      })
    })
  }

  updatePluginData = (id: string, data: PluginData) => {
    emit('UPDATE_PLUGIN_DATA', id, data)
  }

  getRoute = () => {
    return this.state.selection.length > 0
      ? this.state.selection[0]?.pluginData?.find(
          (data) => data.key === 'route'
        )
      : undefined
  }

  render() {
    const { clientStorage } = this.props
    return (
      <StorageContext.Provider value={clientStorage}>
      <div ref={this.rootRef} id="plugin-root">
        <VerticalSpace space="medium" />
        {typeof route !== 'undefined' && (
          <Container space="medium">
            <CreatePlaceholderForm />
          </Container>
        )}
        {typeof route === 'undefined' && (
          <Container space="medium">
            <Button
              onClick={() => {
                if (this.state.selection.length === 0) return
                this.updatePluginData(this.state.selection[0].id, {
                  key: 'route',
                  value: 'users',
                })
              }}
            >
              Create Route
            </Button>
          </Container>
        )}
        <VerticalSpace space="medium" />
        <Divider />
        <DevTools />
        {JSON.stringify(this.state.selection)}
      </div>
      </StorageContext.Provider>
    )
  }
}

export default render((props: PluginProps) => <Plugin {...props} />)
