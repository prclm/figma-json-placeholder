// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useState } from 'preact/hooks'
import { Disclosure, IconButton, IconCode32 } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'

export function DevTools() {
  const initOpen = true
  const [open, setOpen] = useState<boolean>(initOpen)

  const styleFlexBox = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
  return (
    <Disclosure
      onClick={() => setOpen(!(open === initOpen))}
      open={open}
      title="Dev Tool"
    >
      <div style={styleFlexBox}>
        <span>Console.log() Selection:</span>
        <IconButton onClick={() => emit('LOG_SELECTED')}>
          <IconCode32 />
        </IconButton>
      </div>
    </Disclosure>
  )
}
