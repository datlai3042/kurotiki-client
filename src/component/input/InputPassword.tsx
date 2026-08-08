'use client'
import { Eye, EyeOff, Info } from 'lucide-react'
import React, { ReactNode, useId, useState } from 'react'
import { FieldErrors, FieldValues, FormState, Path, UseFormRegister, UseFormWatch } from 'react-hook-form'
import InputError from './InputError'

type TProps<FormType extends FieldValues> = {
      FieldKey: Path<FormType>
      error: FieldErrors<FormType>
      placeholder: string
      register: UseFormRegister<FormType>
      watch: UseFormWatch<FormType>
      unActiveLabel?: boolean
      icon?: React.ReactNode
      isValid?: boolean
}

const InputPassword = <FormType extends FieldValues>(props: TProps<FormType>) => {
      const { FieldKey, error, placeholder, register, watch, unActiveLabel = false, icon, isValid = false } = props
      const id = useId()
      const [showPassword, setShowPassword] = useState<boolean>(false)

      const input_id = `${FieldKey}-${id}`
      const input_placeholder = `Nhập ${placeholder} của bạn`
      const input_erros: React.ReactNode = error[FieldKey]?.message as ReactNode
      const [focus, setFocus] = useState(false)

      return (
            <div className='flex flex-col gap-[6px]'>
                  <div className='flex items-center p-[10px_0px]  w-full border-[1px]  border-[var(--border-color-input)] bg-background-page-color  h-max gap-[6px]  rounded-[8px] '>
                        <div className='p-[10ox] w-[90px] flex-center'>{icon ? icon : <Info />}</div>
                        <div className='flex flex-col gap-[5px]   w-full  '>
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

                              <div className='relative flex items-center w-full h-[60%]'>
                                    <input
                                          type={showPassword ? 'text' : 'password'}
                                          id={input_id}
                                          {...register(FieldKey, {
                                                onBlur: (event) => {
                                                      setFocus(false)
                                                },
                                          })}
                                          onFocus={() => setFocus(true)}
                                          className='inline-block w-full p-[2px] bg-transparent pr-[12px] opacity-100 rounded-[3px] text-text-theme   text-[14px]   font-semibold outline-transparent  placeholder:opacity-100 '
                                          placeholder={input_placeholder}
                                    />

                                    <button
                                          tabIndex={-1}
                                          type='button'
                                          className='px-[10px] right-[10px]'
                                          onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                          {!showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                              </div>
                        </div>
                  </div>

                  {input_erros && <InputError message={input_erros as string} />}
            </div>
      )
}

export default InputPassword
