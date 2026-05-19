import { OrbitProgress } from "react-loading-indicators"

interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  loading?: boolean
}


export const MyButton: React.FC<MyButtonProps> = ({ variant = "primary", children, loading, ...props }) => {
    const baseClasses = "px-4 py-2 rounded focus:outline-none transition-colors min-w-20 max-h-10"


    return (
        <button
            className={`${baseClasses} ${variant === "primary" ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
            {...props}
        >
            {
                loading? <OrbitProgress style={{fontSize: 5}} color="#fff" /> : children
            }
        </button>
    )

}