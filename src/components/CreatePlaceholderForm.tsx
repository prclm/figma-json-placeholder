// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, Fragment } from 'preact'
import {
  TextboxNumeric,
  SegmentedControl,
  Button,
  useForm,
  Columns,
  IconLayoutVertical32,
  IconLayoutHorizontal32,
  IconPlus32,
  SegmentedControlOption,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'

export type FormState = {
  instancesCount: string
  layoutOrientation: string | 'vertical' | 'horizontal' // TODO: fix Type definition
}
export function CreatePlaceholderForm() {
  const { disabled, formState, handleSubmit, setFormState } =
    useForm<FormState>(
      { instancesCount: '3', layoutOrientation: 'vertical' },
      {
        close: function (formState: FormState) {
          console.log('close', formState)
        },
        submit: function (formState: FormState) {
          // console.log('submit', formState)
          emit('CREATE_PLACEHOLDER_INSTANCES', formState)
        },
        transform: function (formState: FormState) {
          console.log('transform', formState)
          // const trimmed = formState.text.trim()
          return {
            ...formState,
            // instancesCount: trimmed === '' ? 0 : trimmed.split(' ').length,
          }
        },
        validate: function (formState: FormState) {
          return parseInt(formState.instancesCount) >= 1
        },
      }
    )

  const layoutOrientationOptions: Array<SegmentedControlOption> = [
    { children: <IconLayoutVertical32 />, value: 'vertical' },
    { children: <IconLayoutHorizontal32 />, value: 'horizontal' },
  ]

  return (
    <Fragment>
      <Columns space="small" style="align-items: center;">
        <TextboxNumeric
          name="instancesCount"
          integer
          maximum={10}
          minimum={0}
          onValueInput={setFormState}
          value={formState.instancesCount}
          variant="border"
        />
        <SegmentedControl
          name="layoutOrientation"
          onValueChange={setFormState}
          options={layoutOrientationOptions}
          value={formState.layoutOrientation}
        />
        <Button disabled={disabled === true} fullWidth onClick={handleSubmit}>
          <IconPlus32 />
          Create Instances
        </Button>
      </Columns>
    </Fragment>
  )
}
