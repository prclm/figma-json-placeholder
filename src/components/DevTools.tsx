// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Fragment, h } from 'preact'
import { useState } from 'preact/hooks'
import {
  Bold,
  Code,
  Disclosure,
  IconButton,
  IconCode32,
  Inline,
  Preview,
  Stack,
  Text,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { NodeData } from '../helpers/types'
import useStorage from '../helpers/useStorage'

type Props = {
  selection: NodeData[]
}

const { getStorage: storage, get: getStorage, set: setStorage } = useStorage()

export function DevTools(props: Props) {
  const initOpenState = getStorage('dev-tools-toggle-state') as boolean | undefined
  const [open, setOpen] = useState<boolean>(typeof initOpenState === 'undefined' ? false : initOpenState)
  const { selection } = props

  const styleFlexBox = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  const toggleDevTools = () => {
    const change = open ? false : true
    setOpen(change)
    setStorage('dev-tools-toggle-state', change)
  }

  return (
    <Disclosure onClick={toggleDevTools} open={open} title="Dev Tools">
      <Stack space="small">
        {selection.length > 0 ? (
          <Fragment>
            <Text>
              <Bold>Selection Data:</Bold> {selection.length} Node(s) selected
            </Text>
            <VerticalSpace space="small" />
            <Preview>
              <pre>{`[${selection.length}] ${JSON.stringify(selection, null, 2)}`}</pre>
            </Preview>
          </Fragment>
        ) : (
          <Fragment>
            <Text>
              <Bold>Plugin Storage:</Bold>
            </Text>
            <VerticalSpace space="small" />
            <Preview>
              <pre>{JSON.stringify(storage(), null, 2)}</pre>
            </Preview>
          </Fragment>
        )}

        <Inline style={styleFlexBox}>
          <Code>Console.log(selection):</Code>
          <IconButton onClick={() => emit('LOG_SELECTION')}>
            <IconCode32 />
          </IconButton>
        </Inline>
      </Stack>
    </Disclosure>
  )
}
