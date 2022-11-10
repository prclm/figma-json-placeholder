// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, Component, createRef, JSX } from 'preact'
import { render, Container, VerticalSpace, Divider, TabsOption, Tabs } from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { DevTools } from './components/DevTools'
import { CreatePlaceholderForm } from './components/CreatePlaceholderForm'
import { NodeData } from './helpers/types'
import '!./assets/ui.css'
import PlaceholderProvider from './components/PlaceholderProvider'
import useStorage, { ClientStorage } from './helpers/useStorage'

type PluginProps = {
  selection: NodeData[]
  clientStorage: ClientStorage
}
type PluginState = {
  selection: NodeData[]
  view: string
}

const { StorageContext } = useStorage()

class Plugin extends Component<PluginProps> {
  rootRef = createRef()

  state: PluginState = {
    selection: this.props.selection,
    view: 'Platzhalter zuweisen',
  }

  constructor(props: PluginProps) {
    super(props)
  }

  views: Array<TabsOption> = [
    {
      value: 'Platzhalter zuweisen',
      children: (
        <Container space="medium">
          <VerticalSpace space="medium" />
          <PlaceholderProvider selection={this.state.selection} />
        </Container>
      ),
    },
    {
      value: 'Daten generieren',
      children: (
        <Container space="medium">
          <VerticalSpace space="medium" />
          <CreatePlaceholderForm />
        </Container>
      ),
    },
  ]

  onViewChange = (e: JSX.TargetedEvent<HTMLInputElement>) => this.setState({ view: e.currentTarget.value })

  componentDidMount(): void {
    const rootEl = this.rootRef.current
    const outputsize = () =>
      emit('RESIZE_WINDOW', {
        width: rootEl.offsetWidth,
        height: rootEl.offsetHeight,
      })
    outputsize()
    new ResizeObserver(outputsize).observe(rootEl)

    on('SELECTION_DATA_UPDATED', (selection: NodeData[]) => {
      this.setState({
        selection: selection,
      })
    })
  }

  render() {
    const { clientStorage } = this.props
    const { selection, view } = this.state
    return (
      <StorageContext.Provider value={clientStorage}>
        <div ref={this.rootRef} id="plugin-root">
          <Tabs onChange={this.onViewChange} options={this.views} value={view} />

          <VerticalSpace space="medium" />

          <Divider />
          <DevTools selection={selection} />
        </div>
      </StorageContext.Provider>
    )
  }
}

export default render((props: PluginProps) => <Plugin {...props} />)
