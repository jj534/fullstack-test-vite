import React, { forwardRef, InputHTMLAttributes } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import styled from 'styled-components'
import ErrorMsg from '../fonts/ErrorMsg'
import Label from '../fonts/Label'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onEnterPress?: () => void
  width?: number
  fullWidth?: boolean
  label?: string
  value?: any
  placeholder?: string
  autoFocus?: boolean
  error?: string
}

const Input = (props: InputProps) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && props.onEnterPress) {
      props.onEnterPress()
    }
  }

  return (
    <InputContainer>
      <Label {...props}>{props.label}</Label>
      <div>
        <StyledInput
          {...props}
          onKeyDown={handleKeyDown}
          error={props.error != null}
        />
      </div>
      <ErrorMsg error={props.error} />
    </InputContainer>
  )
}

interface HookedInputProps extends UseFormRegisterReturn {
  width?: number
  fullWidth?: boolean
  label: string
  error?: string
}

export const HookedInput = forwardRef<HTMLInputElement, HookedInputProps>((props: HookedInputProps, ref) => {
  return (
    <InputContainer>
      <Label {...props}>{props.label}</Label>
      <div>
        <StyledInput
          {...props}
          ref={ref}
          error={props.error != null}
        />
      </div>
      <ErrorMsg error={props.error} />
    </InputContainer>
  )
})

HookedInput.displayName = 'HookedInput'

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

interface StyledInputProps {
  fullWidth?: boolean
  error?: boolean
}

const StyledInput = styled.input<StyledInputProps>`
  flex: 1 0 auto;
  background: ${(props) => props.theme.bg};
  font-weight: 400;
  font-size: 1rem;
  border: 2px solid ${(props) => props.theme.borderDark};
  border-radius: 4px;
  padding: 8px 12px;
  transition: border 0.1s ease-in-out;
  box-shadow: none;

  // disabled
  background: ${(props) => props.disabled && props.theme.bgWash};

  // width
  width: ${(props) => props.width && `${props.width}px`};

  // fullWidth
  width: ${(props) => props.fullWidth && '100%'};

  // error
  border-color: ${(props) => props.error && props.theme.danger};

  &:focus {
    border-color: ${(props) => props.theme.brand};
  }

  &::placeholder {
    color: ${(props) => props.theme.textPlaceholder};
  }
`

export default Input
