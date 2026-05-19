import Button from "@mui/material/Button"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from '@mui/material/Paper';
import IconButton from "@mui/material/IconButton"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react"
import { ModalAddContact } from "../../components/modalAddContact"
import { ModalEditContact } from "../../components/modalEditContact"
import Typography from "@mui/material/Typography"
import type { Contact } from "../../@types/contacts"
import { useContact } from "../../hooks/useContacts"
import toast from "react-hot-toast"


export const Contacts = () => {
    const [openEdit, setOpenEdit] = useState(false)
    const [openNew, setOpenNew] = useState(false)
    const [selected, setSelected] = useState<Contact>({
        userUid: '',
        createdAt: new Date(),
        name: '',
        phone: '',
        uid: ''
    })

    const { contacts} = useContact()

    const handleOpen = (item: Contact) => {
        setSelected(item)
        setOpenEdit(true)
    }

    const {deleteContact} = useContact()

    const handleOpenNew= ()=>{
        setOpenNew(true)
    }

    const handleDelete = async (uid: string)=>{
        try {
            if(uid == ''){
                toast.error('Erro crítico, chame o técnico')
                return
            }
            await deleteContact(uid)
            toast.success('Contato deletado')
        } catch (error) {
            toast.error('Não foi possível deletar, tente novamente')
        }
    }

    const handleClose = () => {
        setOpenEdit(false)
        setOpenNew(false)
    }

    return (
        <section className="w-full">
            <div className="flex justify-between py-4 items-end">
                <div className="flex flex-col">
                    <Typography variant="overline" sx={{fontSize:'large'}} color="text.secondary">
                        Contatos
                    </Typography>
                    <Typography color="textDisabled" variant="overline">
                        Mostruário, criação e gerenciamento de contatos
                    </Typography>
                </div>
                <Button variant="contained" className="h-fit" 
                onClick={handleOpenNew}
                >Novo Contato</Button>
            </div>

            <div>

                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table"  >
                        <TableHead >
                            <TableRow>
                                <TableCell>Contato</TableCell>
                                <TableCell align="left">Telefone</TableCell>
                                <TableCell align="left">Criado em</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contacts.map((row) => (
                                <TableRow
                                    key={row.uid}
                                >
                                    <TableCell component="th" scope="row"> {row.name}</TableCell>
                                    <TableCell align="left">{row.phone}</TableCell>
                                    <TableCell align="left">{row.createdAt?.toLocaleDateString()}</TableCell>

                                    <TableCell align="right">
                                        <IconButton aria-label="Editar" color="primary"
                                            onClick={()=>handleOpen(row)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="delete" color="error"
                                            onClick={()=>handleDelete(row.uid || '')}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>

            <ModalAddContact 
                isOpen={openNew}
                handleClose={handleClose}
            />
           

           <ModalEditContact 
            handleClose={handleClose}
            isOpen={openEdit}
            contact={selected}
           />
        </section>
    )
}