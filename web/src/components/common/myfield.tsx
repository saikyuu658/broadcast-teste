import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField, { type StandardTextFieldProps } from '@mui/material/TextField'
import { useState, forwardRef } from 'react'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';


interface FieldProps extends StandardTextFieldProps {
  label?: string
  helper?: string
  error?: boolean
}


export const MyField = forwardRef<HTMLInputElement, FieldProps>(
  function Field({
    type = "text",
    label,
    error,
    helper,
    className = "w-full",
    ...props
  },
    ref
  ) {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
      <>
      {type == 'password'?
         <FormControl fullWidth variant="standard" className={className}>
        {label && <InputLabel error={error}>{label}</InputLabel>}
        {/* @ts-ignore */}
        <Input
          type={showPassword ? (showPassword ? "text" : "password") : type}
          error={error}
          inputRef={ref} 
          {...props}
          endAdornment={
            showPassword ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "hide the password" : "display the password"}
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : null
          }
        />
        {helper && (
          <FormHelperText error={error}>{helper}</FormHelperText>
        )}
      </FormControl>
        
        : <TextField
          variant='standard'
          type={'text'}
          label={label}
          helperText={helper}
          error={error}
          inputRef={ref}
          className={className}
          {...props}
        />
      }
      </>
    )
  })