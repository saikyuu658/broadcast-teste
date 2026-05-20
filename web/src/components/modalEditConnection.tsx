import Modal from "@mui/material/Modal"
import { MyField } from "./common/myfield"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import CardActions from "@mui/material/CardActions"
import Button from "@mui/material/Button"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import type { Connection } from "../@types/conections"
import { useConnections } from "../hooks/useConnections"


interface ModalAddProps {
    handleClose: () => void,
    isOpen: boolean,
    conection: Connection
}

export const ModalEditConnection = (props: ModalAddProps) => {
    const [name, setName] = useState<string | null>(props.conection.name)
    const [uid, setUid] = useState<string | undefined>(props.conection.uid)



    useEffect(() => {
        setName(props.conection.name)
        setUid(props.conection.uid)
    }, [props.conection])

    const {updateConnection} = useConnections()

    const handleSubmit = async () => {
        if (!name  || !uid) {
            toast.error('Preencha os campos')
            return
        }

        try {

            await updateConnection(uid, name)
            toast.success('Conexão Atualizado')
            props.handleClose()
        } catch (error) {
            toast.error("Erro ao criar contato")

        }

    }


    const handleChangeName = (event: any) => {
        setName(event?.target?.value || '')
    }


    return (
        <Modal
            className="z-50"
            open={props.isOpen}
            onClose={props.handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Card
                tabIndex={-1}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    py: 4
                }}
            >

                <CardContent sx={{ width: 450 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        Editar contato
                    </Typography>
                    <div className="gap-4 flex flex-col my-5">
                        <MyField
                            type="text"
                            value={name}
                            onChange={handleChangeName}
                            label="Nome"
                            placeholder="Nome do seu novo contato"
                        />
                    </div>
                </CardContent>
                <CardActions>
                    <Button variant="contained" onClick={handleSubmit}>Atualizar</Button>
                    <Button variant="outlined" onClick={props.handleClose}>Cancelar</Button>
                </CardActions>

            </Card>
        </Modal>
    )
}