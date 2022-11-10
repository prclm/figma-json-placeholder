import { h, Component, Fragment } from 'preact'
import { emit } from '@create-figma-plugin/utilities'
import {
  Bold,
  Container,
  IconLibrary32,
  LoadingIndicator,
  MiddleAlign,
  Stack,
  Text,
  TextboxAutocomplete,
} from '@create-figma-plugin/ui'
import { ApiConfig, NodeData } from '../helpers/types'
import useApi from '../helpers/useApi'
import LinkButton from './LinkButton'

type State = {
  currentApi: ApiConfig
  currentRoute: '' | string
  currentData: string[]
}

type Props = {
  selection: NodeData[]
}

const { defaultApiConfig, getAllApis, getApi, getRouteNames, getPlaceholderKeys } = useApi()

export default class PlaceholderProvider extends Component<Props> {
  state: State = {
    currentApi: defaultApiConfig,
    currentRoute: '',
    currentData: [],
  }

  constructor(props: Props) {
    super(props)
  }

  async componentDidUpdate(): Promise<void> {
    const { currentApi, currentRoute, currentData } = this.state
    if (currentApi && currentRoute && !currentData) {
      const id = currentApi.routes.find((r) => r.route === currentRoute)?.exampleId
      const data = await getPlaceholderKeys(`${currentApi.url}/${currentRoute}/${id}/`)
      this.setCurrentData(data)
    }
  }

  setCurrentApi = (name: string) => {
    this.setState({ currentApi: getApi(name), currentRoute: '', currentData: '' })
  }

  setCurrentRoute = (route: string) => {
    this.setState({ currentRoute: route, currentData: '' })
  }

  setCurrentData = (data: unknown) => {
    this.setState({
      currentData: data,
    })
  }

  setPlaceholder = (value: string) => {
    const { currentRoute, currentApi } = this.state
    this.props.selection.forEach((node) => {
      emit('UPDATE_NODE_PLUGIN_DATA', node.id, {
        key: 'placeholder',
        value: {
          field: value,
          route: currentRoute,
          api: {
            url: currentApi.url,
            name: currentApi.name,
          },
        },
      })
    })
  }

  render() {
    const { currentApi, currentRoute, currentData } = this.state

    return (
      <Fragment>
        <Stack space="medium">
          <Container space="extraSmall">
            {/* ROUTES VIEW */}
            {currentApi && !currentRoute && (
              <Stack space="medium">
                {/* PLACEHOLDER LIBRARY SELECTION */}
                <TextboxAutocomplete
                  icon={<IconLibrary32 />}
                  options={getAllApis().map((api) => ({ value: api.name }))}
                  value={currentApi ? currentApi.name : ''}
                  onValueInput={(name) => this.setCurrentApi(name)}
                />

                {/* ROUTES LIST */}
                {getRouteNames(currentApi).map((route) => (
                  <LinkButton onClick={() => this.setCurrentRoute(route)}>/{route}/</LinkButton>
                ))}
              </Stack>
            )}

            {/* PLACEHOLDER VIEW */}
            {currentRoute && (
              <Stack space="medium">
                <LinkButton onClick={() => this.setCurrentRoute('')}>{`< zurück`}</LinkButton>

                <Text align="left">
                  <Bold>{`/${currentRoute}/`}</Bold>
                </Text>

                {/* PLACEHOLDER LIST */}
                <Container space="medium">
                  <Stack space="medium">
                    {currentData ? (
                      currentData.map((placeholder) => (
                        <LinkButton
                          onClick={() => this.setPlaceholder(placeholder)}
                        >{`{{ ${placeholder} }}`}</LinkButton>
                      ))
                    ) : (
                      <MiddleAlign style="width: 100%;height:auto;aspect-ratio:2 / 1;">
                        <LoadingIndicator />
                      </MiddleAlign>
                    )}
                  </Stack>
                </Container>
              </Stack>
            )}
          </Container>
        </Stack>
      </Fragment>
    )
  }
}
