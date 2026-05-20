import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import CardActions from "@mui/material/CardActions"
import { useNavigate } from "react-router-dom"
import { useConnections } from "../../hooks/useConnections"
import { useState } from "react"
import type { Connection } from "../../@types/conections"
import { ModalAddConnections } from "../../components/modalAddConnection"
import { ModalEditConnection } from "../../components/modalEditConnection"


export const Connections = () => {
    const navigate = useNavigate()
    const { connections } = useConnections()
    const [openEdit, setOpenEdit] = useState(false)
    const [openNew, setOpenNew] = useState(false)
    const [selected, setSelected] = useState<Connection>({
        userUid: '',
        createdAt: new Date(),
        name: '',
        uid: ''
    })
    
    const handleDetails = (uid: string) => {
        navigate("/auth/message/"+uid)
    }

    const handleOpen = (item: Connection) => {
        setSelected(item)
        setOpenEdit(true)
    }

    const handleOpenNew= ()=>{
        setOpenNew(true)
    }

    const handleClose = () => {
        setOpenEdit(false)
        setOpenNew(false)
    }

     

    return (
        <section className="w-full">
            <div className="flex justify-between py-4 items-end">
                <div className="flex flex-col">
                    <Typography variant="overline" sx={{ fontSize: 'large' }} color="text.secondary">
                        Dashboard
                    </Typography>
                    <Typography color="textDisabled" variant="overline">
                        Mostruário, criação e gerenciamento de conexões
                    </Typography>
                </div>

                <Button
                    variant="contained"
                    className="h-fit"
                    onClick={handleOpenNew} >Nova Conexão</Button>
            </div>

            <div className="flex flex-wrap gap-6 ">
                {connections.map(e => (
                    <Card key={e.uid}>
                        <CardContent sx={{ width: 300, backgroundColor: '#fff' }}>
                            <div className="flex flex-col">
                                <Typography variant="overline" sx={{ fontSize: 'large' }} color="text.secondary">
                                    {e.name}
                                </Typography>
                                <Typography color="textDisabled" variant="overline">
                                    {e.createdAt?.toLocaleDateString()}
                                </Typography>
                            </div>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={()=>{handleDetails(e.uid!)}}>Abrir</Button>
                            <Button variant="outlined" onClick={()=>{handleOpen(e)}} >editar</Button>
                        </CardActions>
                    </Card>
                ))}
            </div>

            <ModalAddConnections
                isOpen={openNew}
                handleClose={handleClose}
            />

            <ModalEditConnection 
                isOpen={openEdit}
                handleClose={handleClose}
                conection={selected}
            />
        </section>
    )
}