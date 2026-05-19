import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


type NavItem = {
  label: string;
  icon: React.ReactNode;
  id: string;
};

interface SidebarProps {
  navItems: NavItem[];
}




export const Sidebar = ( { navItems }: SidebarProps) => {
  const {logout} = useAuth()
  const navigate = useNavigate()
  const handleClick = ()=>{
    logout()
    navigate('/')
  }
  return (
    <aside className="flex flex-col w-70 h-screen bg-white border-r border-gray-100 font-sans select-none">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-gray-900 tracking-tight">
            Broadcast teste
          </span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
             
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {

          return (<NavLink
            key={item.id}
            to={`${item.id}`}
            end
            className={({ isActive }) =>
              [
                "flex items-center gap-2 px-3 h-10 rounded-xl transition-all duration-150",
                isActive
                  ? "bg-[#0785CB] text-white shadow-sm shadow-[#0785CB]/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
              ].join(" ")
            }
          >
            
            <span className="text-[13px] font-medium whitespace-nowrap">
              {item.label}
            </span>
          </NavLink>)
          
        })}

        <p
            onClick={handleClick}
            className={"flex items-center gap-2 px-3 h-10 rounded-xl transition-all duration-150 text-slate-500 hover:bg-slate-50 hover:text-slate-800"}
          >
            
            <span className="text-[13px] font-medium whitespace-nowrap">
              Sair
            </span>
          </p>
      </nav>
    </aside>
  );
}