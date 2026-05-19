import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import {useState, forwardRef, type InputHTMLAttributes,  type ReactNode} from 'react'

type FieldSize = "sm" | "md" | "lg"


interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string
  error?: string
  helper?: string
  icon?: ReactNode
  iconRight?: ReactNode
  size?: FieldSize
  fullWidth?: boolean
}

const fieldSizes: Record<FieldSize, { wrap: string; text: string; icon: number }> = {
  sm: { wrap: "h-8 px-2.5 gap-1.5 rounded-lg", text: "text-[13px]", icon: 14 },
  md: { wrap: "h-10 px-3 gap-2 rounded-[10px]", text: "text-sm", icon: 16 },
  lg: { wrap: "h-12 px-3.5 gap-2.5 rounded-xl", text: "text-[15px]", icon: 18 },
}

export const MyField = forwardRef<HTMLInputElement, FieldProps>(function Field(
  {
    
    label,
    error,
    helper,
    icon,
    iconRight,
    size = "md",
    fullWidth = true,
    type = "text",
    className = "",
    disabled,
    ...props
  },
  ref
) {
  const [focused, setFocused] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const isPassword = type === "password"
  const s = fieldSizes[size]

  const borderClass = error
    ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-500/20"
    : focused
    ? "border-[#0785CB] ring-[#0785CB]/15 ring-2"
    : "border-slate-200 hover:border-slate-300"

  return (
    <div className={["flex flex-col gap-1.5", fullWidth ? "w-full" : "", className].join(" ")}>
      {label && (
        <label className={`text-[13px] font-medium ${error ? "text-red-500" : "text-slate-700"}`}>
          {label}
        </label>
      )}

      <div
        className={[
          "flex items-center bg-white border transition-all duration-150",
          s.wrap,
          borderClass,
          disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "",
        ].join(" ")}
      >
        {icon && (
          <span className={`flex items-center shrink-0 ${focused ? "text-[#0785CB]" : "text-slate-400"} transition-colors duration-150`}>
            {icon}
          </span>
        )}

        <input
          ref={ref}
          type={isPassword ? (showPass ? "text" : "password") : type}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={[
            "flex-1 bg-transparent border-none outline-none",
            "placeholder:text-slate-300 text-slate-800",
            "disabled:cursor-not-allowed",
            s.text,
          ].join(" ")}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPass((v) => !v)}
            className="flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPass ? <EyeOff size={s.icon} /> : <Eye size={s.icon} />}
          </button>
        )}

        {iconRight && !isPassword && (
          <span className="flex items-center shrink-0 text-slate-400">{iconRight}</span>
        )}

        {error && !isPassword && !iconRight && (
          <AlertCircle size={s.icon} className="text-red-400 shrink-0" />
        )}
      </div>

      {(error || helper) && (
        <p className={`text-[12px] ${error ? "text-red-500" : "text-slate-400"}`}>
          {error ?? helper}
        </p>
      )}
    </div>
  )
})