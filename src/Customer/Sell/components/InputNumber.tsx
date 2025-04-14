import React, { useId } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { ui } from '../RegisterProductForm/ProductFormUpload'

type TProps<T extends FieldValues> = {
      FieldName: keyof T
      LabelMessage: string
      placehorder: string
      width?: string
      autofocus?: boolean
      require?: boolean
}

const InputNumber = <T extends FieldValues>(props: TProps<T>) => {
      const { placehorder, LabelMessage, width, autofocus = false, FieldName } = props
      const formNested = useFormContext()
      const {
            formState: { errors },
      } = formNested
      const id = useId()

      const styleEffect = {
            widthContainer: width ? width : 'w-full',
            gap: ui.gapElementChild || 'gap-[8px]',
            fontSizeError: ui.fontSizeError || 'text-[12px]',
            colorError: ui.colorError || 'text-red-700',
      }

      return (
            <div className={`${styleEffect.widthContainer} ${styleEffect.gap} flex flex-col`}>
                  <label htmlFor={id} className='relative flex flex-row items-center max-w-max'>
                        <span>{LabelMessage}</span>
                  </label>
                  <input
                        type='number'
                        {...formNested.register(FieldName as string, {
                              setValueAs: (value) => Number(value),
                        })}
                        placeholder={placehorder}
                        id={id}
                        autoFocus={autofocus}
                        className='border-[1px] border-[var(--border-color-input)] bg-color-section-theme text-text-theme outline-none px-[16px] py-[10px] rounded-[6px]'
                  />

                  {errors[FieldName as string] && (
                        <span className={`${styleEffect.colorError} ${styleEffect.fontSizeError}`}>
                              {errors[FieldName]?.message as React.ReactNode}
                        </span>
                  )}
                  {errors?.attribute && (
                        <span className={`${styleEffect.fontSizeError} ${styleEffect.colorError}`}>
                              {(errors.attribute as any)[FieldName.toString().split('.')[1]]?.message}
                        </span>
                  )}
            </div>
      )
}

export default InputNumber
