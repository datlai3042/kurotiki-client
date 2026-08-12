'use client'
import React, { ReactNode, useId, useState } from 'react'
import { FieldErrors, FieldValues, Path, UseFormRegister, UseFormWatch } from 'react-hook-form'
import InputPassword from './InputPassword'
import { Info } from 'lucide-react'
import InputError from './InputError'
import { InputType } from './type'

type TProps<FormType extends FieldValues> = {
      FieldKey: Path<FormType>
      error: FieldErrors<FormType>
      placeholder: string
      type: InputType
      register: UseFormRegister<FormType>
      watch: UseFormWatch<FormType>
      style?: React.CSSProperties
      unActiveLabel?: boolean
      icon?: React.ReactNode
      isValid?: boolean
}

const Input = <FormType extends FieldValues>(props: TProps<FormType>) => {
      const { FieldKey, error, placeholder, type, register, watch, style = {}, unActiveLabel = false, icon, isValid = false } = props
      const id = useId()
      const [focus, setFocus] = useState(false)
      if (type === 'password') {
            return <InputPassword {...props} />
      }
      const input_erros: React.ReactNode = error[FieldKey]?.message as ReactNode

      return (
            <div style={style} className='flex flex-col gap-[6[x]] '>
                  <div className='flex items-center p-[10px_0px]  w-full border-[1px]  border-[var(--border-color-input)] bg-background-page-color  h-max gap-[6px]  rounded-[8px] '>
                        <div className='p-[10px] w-[90px] flex-center'>{icon ? icon : <Info />}</div>

                        <div className='flex flex-col gap-[5px]   w-full'>
                              {!unActiveLabel && (
                                    <label
                                          style={{
                                                color: 'rgb(103 113 130)',
                                                fontWeight: 600,
                                          }}
                                          htmlFor={`${FieldKey}-${id}`}
                                          className='first-letter:uppercase text-left text-color-main font-bold text-[16px]'
                                    >
                                          {placeholder}
                                    </label>
                              )}
                              <input
                                    value={watch(FieldKey)}
                                    id={`${FieldKey}-${id}`}
                                    {...register(FieldKey, {
                                          onBlur: (event) => {
                                                setFocus(false)
                                          },
                                    })}
                                    onFocus={() => setFocus(true)}
                                    className='inline-block  input-form w-full  p-[2px] pr-[12px] text-[14px]  opacity-100 text-text-theme  font-semibold outline-transparent bg-transparent border-none  placeholder:opacity-100 '
                                    placeholder={`Nhập ${placeholder} của bạn`}
                              />
                        </div>
                  </div>

                  {error && error[FieldKey]?.message && <InputError message={input_erros as string} />}
                  {/* {watch(FieldKey) && <p>{watch(FieldKey)}</p>} */}
            </div>
      )
}

export default Input
