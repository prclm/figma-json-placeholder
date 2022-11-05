// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Fragment, h } from 'preact'
import {
  render,
  Container,
  Text,
  VerticalSpace,
  Divider,
} from '@create-figma-plugin/ui'
import { DevTools } from './components/devtools'

function Plugin(props: { greeting: string }) {
  return (
    <Fragment>
      <Container space="medium">
        <VerticalSpace space="medium" />
        <Text>Hallo {props.greeting}</Text>
        <VerticalSpace space="medium" />
      </Container>

      <Divider />
      <DevTools />
    </Fragment>
  )
}

export default render(Plugin)
