'use client'

import ReactOTPInput from 'react-otp-input'

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  numInputs?: number
  disabled?: boolean
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  numInputs = 6,
  disabled = false
}) => {
  return (
    <ReactOTPInput
      value={value}
      onChange={onChange}
      numInputs={numInputs}
      renderInput={(props) => <input {...props} />}
      inputStyle={{
        width: '40px',
        height: '40px',
        margin: '0 6px',
        fontSize: '20px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        textAlign: 'center',
      }}
      containerStyle="flex justify-center"
      shouldAutoFocus
      disabled={disabled}
    />
  )
}

export default OTPInput 