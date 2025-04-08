import React from 'react'
import './Button.scss'

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }: any) => {
  return (
    <button onClick={onClick} className='button'>
      {label}
    </button>
  )
}

export default Button
