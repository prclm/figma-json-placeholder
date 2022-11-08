// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useState } from 'preact/hooks'
import { Disclosure, IconButton, IconCode32 } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'

export function DevTools() {
  const [open, setOpen] = useState<boolean>(false)

  const styleFlexBox = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
  return (
    <Disclosure
      onClick={() => setOpen(open ? false : true)}
      open={open}
      title="Dev Tool"
    >
      <div style={styleFlexBox}>
        <span>Console.log() Selection:</span>
        <IconButton onClick={() => emit('LOG_SELECTION')}>
          <IconCode32 />
        </IconButton>
      </div>
    </Disclosure>
  )
}
