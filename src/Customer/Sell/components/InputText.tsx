import React, { useId } from 'react'
import { FieldValues, UseFormReturn, useFormContext } from 'react-hook-form'
import { ui } from '../RegisterProductForm/ProductFormUpload'

type TProps<T extends FieldValues> = {
      methods?: UseFormReturn<T, any, undefined>
      FieldName: keyof T
      LabelMessage: string
      placehorder: string
      width?: string
      autofocus?: boolean
      require?: boolean
      defaultValue?: boolean
      flexDirectionRow?: boolean
      showError?: boolean
}

const InputText = <T extends FieldValues>(props: TProps<T>) => {
      const { placehorder, LabelMessage, width, autofocus = false, FieldName, defaultValue, flexDirectionRow, showError = true } = props
      const id = useId()

      const formNested = useFormContext()
      const {
            formState: { errors },
      } = formNested

      //console.log(([^)]+))
      // methods?.watch(FieldName as unknown as Path<T>[])

      const styleEffect = {
            widthContainer: width ? width : 'w-full',
            gap: ui.gapElementChild || 'gap-[8px]',
            fontSizeError: ui.fontSizeError || 'text-[12px]',
            colorError: ui.colorError || 'text-red-700',
            flexDirectionContrainer: flexDirectionRow ? 'flex-row' : 'flex-col',
      }

      return (
            <div className={`${styleEffect.widthContainer} ${styleEffect.gap} ${styleEffect.flexDirectionContrainer} flex  `}>
                  <label htmlFor={id} className='relative flex flex-row items-center max-w-max min-w-[100px]'>
                        <span>{LabelMessage}</span>
                        {/* {require && <span className='block absolute top-[50%] translate-y-[-40%] text-red-500 text-[24px]  right-[-12px]'>*</span>} */}
                  </label>
                  <input
                        {...formNested.register(FieldName as string)}
                        type='text'
                        placeholder={placehorder}
                        id={id}
                        autoFocus={autofocus}
                        defaultValue={defaultValue && formNested.watch(FieldName as string)}
                        className='w-[50%] border-[1px] border-slate-400 outline-none px-[12px] py-[10px] rounded-[6px]'
                  />
                  {showError && errors[FieldName as string] && (
                        <span className={`${styleEffect.fontSizeError} ${styleEffect.colorError}`}>
                              {errors[FieldName]?.message as React.ReactNode}
                        </span>
                  )}
                  {showError && errors?.attribute && (
                        <span className={`${styleEffect.fontSizeError} ${styleEffect.colorError}`}>
                              {(errors.attribute as any)[FieldName.toString().split('.')[1]]?.message}
                        </span>
                  )}
            </div>
      )
}

export default InputText
