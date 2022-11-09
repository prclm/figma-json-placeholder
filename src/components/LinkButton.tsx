import { h, JSX, ComponentChildren } from 'preact'
import { Link } from '@create-figma-plugin/ui'

type LinkButtonProps = {
  children: ComponentChildren
  fullWidth?: boolean | undefined
  onClick: JSX.MouseEventHandler<HTMLAnchorElement>
}

const LinkButton = (props: LinkButtonProps) => {
  // TODO: add the right type to propsOnClick
  const onClick = (e: Event, propsOnClick: any) => {
    e.preventDefault()
    propsOnClick(e)
  }
  return (
    <Link {...props} href="" onClick={(e) => onClick(e, props.onClick)}>
      {props.children}
    </Link>
  )
}
export default LinkButton
