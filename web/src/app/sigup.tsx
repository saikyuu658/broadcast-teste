import { User2,  } from "lucide-react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Mail, Lock } from "lucide-react"
import {  NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { MyField } from "../components/myfield"
import { MyButton } from "../components/mybutton"
import { useAuth } from "../hooks/useAuth"
const signupSchema = yup.object({
  email:    yup.string().email("E-mail inválido").required("Obrigatório"),
  password: yup.string().min(6, "Mínimo 6 caracteres").required("Obrigatório"),
  name: yup.string().min(6, "Mínimo 6 caracteres").required("Obrigatório"),
}).required()

type SignupFormData = yup.InferType<typeof signupSchema>


export const SignupScree = () => {
  
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
        resolver: yupResolver(signupSchema),
    })
    const { signup } = useAuth()
    
    const navigate = useNavigate()

    async function onSubmit(data: SignupFormData) {
        try {
          await signup(data)
          toast.success("Conta criada com sucesso realizado com sucesso!")  
        } catch (error) {
            console.log(error)
          toast.error("Erro ao criar conta. tente novamente mais tarde.")
        }
    }

  return (
    <div className="min-h-screen flex font-sans bg-[#F8FAFC]">
      

      <div className="flex-1 flex items-center justify-center px-6 py-12 ">
        <div className="w-full max-w-100">
           <div className="p-5 bg-white shadow-2xl rounded-md">
              <div className="mb-8 space-y-1">
                <h2 className="text-slate-800 text-2xl font-bold tracking-tight">Bem-vindo</h2>
                <p className="text-slate-400 text-sm">Entre com suas informações para criar sua conta</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <MyField
                  label="E-mail"
                  type="email"
                  placeholder="Seu Email"
                  error={errors.email?.message}
                  icon={<Mail size={16} />}
                  {...register("email")}
                />

                <MyField
                  label="Nome"
                  type="text"
                  placeholder="Seu nome"
                  error={errors.name?.message}
                  icon={<User2 size={16} />}
                  {...register("name")}
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
                    Criar conta
                  </MyButton>
                </div>
              </form>

               <hr className="mt-5 opacity-30" />
                <NavLink
                    to={`/`}
                    end
                >
                    <span className="text-[13px] font-medium whitespace-nowrap">
                    Fazer login em conta existente
                    </span>
                </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}