import Modal from "@mui/material/Modal"
import { MyField } from "./common/myfield"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import CardActions from "@mui/material/CardActions"
import Button from "@mui/material/Button"
import { useEffect, useState } from "react"
import type { Contact } from "../@types/contacts"
import { useContact } from "../hooks/useContacts"
import toast from "react-hot-toast"


interface ModalAddProps {
    handleClose: () => void,
    isOpen: boolean,
    contact: Contact
}

export const ModalEditContact = (props: ModalAddProps) => {
    const [name, setName] = useState<string | null>(props.contact.name)
    const [phone, setPhone] = useState<string | null>(props.contact.phone)
    const [uid, setUid] = useState<string | undefined>(props.contact.uid)



    useEffect(() => {
        setName(props.contact.name)
        setPhone(props.contact.phone)
        setUid(props.contact.uid)
    }, [props.contact])

    const { updateContact } = useContact()

    const handleSubmit = async () => {
        if (!name || !phone || !uid) {
            toast.error('Preencha os campos')
            return
        }

        try {
            const newContact: Contact = {
                name: name,
                phone: phone,
                userUid: props.contact.userUid,
                uid: uid,
                createdAt: props.contact.createdAt
            }

            console.log(newContact);
            await updateContact(uid, newContact)
            toast.success('Contato Atualizado')
            props.handleClose()
        } catch (error) {
            console.log(error)
            toast.error("Erro ao criar contato")

        }

    }


    const handleChangeName = (event: any) => {
        setName(event?.target?.value || '')
    }

    const handleChangePhone = (event: any) => {
        setPhone(event?.target?.value || '')
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

                        <MyField
                            type="text"
                            value={phone}
                            onChange={handleChangePhone}
                            label="Telefone"
                            placeholder="Número de telefone"
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