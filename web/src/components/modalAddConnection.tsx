import Modal from "@mui/material/Modal"
import { MyField } from "./common/myfield"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import CardActions from "@mui/material/CardActions"
import Button from "@mui/material/Button"
import { useState } from "react"
import toast from "react-hot-toast"
import { useConnections } from "../hooks/useConnections"


interface ModalAddProps {
    handleClose: () => void,
    isOpen: boolean,
}

export const ModalAddConnections = (props: ModalAddProps) => {

    const { createConnection } = useConnections()
    const [name, setName] = useState<string | null>('')

    const handleChangeName = (event: any) => {
        setName(event?.target?.value || '')
    }


    const handleSubmit =async () => {
        if (!name ) {
            toast.error("preencha as informações")
            return
        }
        try {
            await createConnection(name)
            toast.success('Contato criado')
            props.handleClose()
            setName('')
        } catch (error) {
            toast.error("Erro ao criar contato")

        }
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
                    py: 4,
                }}
            >

                <CardContent sx={{ width: 450 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        Adicionar nova conexão
                    </Typography>
                    <div className="gap-4 flex flex-col my-5">
                        <MyField
                            type="text"
                            label="Nome"
                            value={name}
                            onChange={handleChangeName}
                            placeholder="Nome do seu novo contato"
                        />

                    </div>
                </CardContent>
                <CardActions>
                    <Button variant="contained" onClick={handleSubmit}>Criar</Button>
                    <Button variant="outlined" onClick={props.handleClose}>Cancelar</Button>
                </CardActions>

            </Card>
        </Modal>
    )
}