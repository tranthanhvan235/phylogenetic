// components/InputField/InputField.tsx
import React, { useState } from 'react'
import './InputField.scss'

interface InputFieldProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
}

const InputField: React.FC<InputFieldProps> = ({ value, onChange, placeholder}: any) => {
  return (
    <>
      <input
        type='text'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='input-field'
      />
    </>
  )
}

export default InputField
