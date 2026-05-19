// LoginScreen.tsx
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Mail, Lock  } from "lucide-react"
import {  NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast/headless"
import { MyField } from "../components/myfield"
import { MyButton } from "../components/mybutton"
import { useAuth } from "../hooks/useAuth"
const loginSchema = yup.object({
  email:    yup.string().email("E-mail inválido").required("Obrigatório"),
  password: yup.string().min(6, "Mínimo 6 caracteres").required("Obrigatório"),
}).required()

type LoginFormData = yup.InferType<typeof loginSchema>

export const LoginScreen = () => {
  
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
    })
    const { login } = useAuth()
    const navigate = useNavigate()

    async function onSubmit(data: LoginFormData) {
        try {
          await login(data)
          toast.success("Login realizado com sucesso!")  
          navigate( "/auth/") 
        } catch (error) {
          toast.error("Erro ao fazer login. Verifique suas credenciais.")
        }

    }

  return (
    <div className="min-h-screen flex font-sans bg-[#F8FAFC]">
      

      <div className="flex-1 flex items-center justify-center px-6 py-12 ">
        <div className="w-full max-w-100">
           <div className="p-5 bg-white shadow-2xl rounded-md">
              <div className="mb-8 space-y-1">
                <h2 className="text-slate-800 text-2xl font-bold tracking-tight">Bem-vindo de volta</h2>
                <p className="text-slate-400 text-sm">Entre com suas credenciais para acessar</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <MyField
                  label="E-mail"
                  type="email"
                  placeholder="seu email"
                  error={errors.email?.message}
                  icon={<Mail size={16} />}
                  {...register("email")}
                />
                <MyField
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  icon={<Lock size={16} />}
                  {...register("password")}
                />
                <div className="pt-2">
                  <MyButton type="submit" variant="primary" loading={isSubmitting} >
                    Entrar
                  </MyButton>
                </div>
              </form>
              <hr className="mt-5 opacity-30" />
              <NavLink
                to={`signup`}
                end
              >
                <span className="text-[13px] font-medium whitespace-nowrap">
                  Criar nova conta
                </span>
              </NavLink>

          </div>
        </div>
      </div>
    </div>
  )
}