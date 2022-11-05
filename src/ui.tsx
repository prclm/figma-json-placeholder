// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, Component, createRef } from 'preact'
import {
  render,
  Container,
  Text,
  VerticalSpace,
  Divider,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { DevTools } from './components/DevTools'
import '!./assets/ui.css'

type PluginProps = {
  greeting: string
}
class Plugin extends Component<PluginProps> {
  rootRef = createRef()

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
  }

  render() {
    return (
      <div ref={this.rootRef} id="plugin-root">
        <Container space="medium">
          <VerticalSpace space="medium" />
          <Text>Hallo {this.props.greeting}</Text>
          <VerticalSpace space="medium" />
        </Container>

        <Divider />
        <DevTools />
      </div>
    )
  }
}

export default render((props: PluginProps) => <Plugin {...props} />)
