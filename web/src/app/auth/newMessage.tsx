import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { MyField } from "../../components/common/myfield"
import Chip from "@mui/material/Chip"
import { useEffect, useMemo, useState } from "react"
import Autocomplete from "@mui/material/Autocomplete"
import Typography from "@mui/material/Typography"
import type { Contact } from "../../@types/contacts"
import { useContact } from "../../hooks/useContacts"
import { useNavigate, useParams } from 'react-router-dom';
import { useConnections } from "../../hooks/useConnections"
import { useMessage } from "../../hooks/useMessage"
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import ScheduleIcon from '@mui/icons-material/Schedule';
import SendIcon from '@mui/icons-material/Send';
import toast from "react-hot-toast"
import { formatDate } from "../../util/formateDate"
import IconButton from "@mui/material/IconButton"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Message } from "../../@types/message"
import { ModalAddMessage } from "../../components/modalAddMessage"
import Paper from "@mui/material/Paper"
import { ModalEditMessage } from "../../components/modalEditMessage"
import VisibilityIcon from '@mui/icons-material/Visibility';

export const NewMessage = () => {

    const [selected, setSelected] = useState<Contact[]>([])
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [openNew, setOpenNew] = useState(false)

    const { connectionId } = useParams();
    const { connections } = useConnections(connectionId)
    const { messages, createMessage, deleteMessage } = useMessage(connectionId)
    const { contacts, linkConnection, unLinkConnection } = useContact()
    const [inputKey, setInputKey] = useState(0)

    const contatsConnected = contacts.filter(contact =>
        contact.conectionsUids?.includes(connectionId || '')
    );

    const contactsFree = useMemo(() => {
        return contacts.filter(contact => {
            const isLinkedToConnection = contact.conectionsUids?.includes(connectionId || '');
            const isAlreadySelected = selected.some(selectedContact => selectedContact.uid === contact.uid);
            return !isLinkedToConnection && !isAlreadySelected;
        });
    }, [contacts, selected, connectionId]);

    useEffect(() => {
        setSelected(contatsConnected)
    }, [contacts])

    
    const handleDeleteMessage = async(uid: string)=>{
        try {
            await deleteMessage(uid)
            toast.success('Deletado com sucesso')
        } catch (error) {
            toast.error('Erro ao deletar')
        }
    }   

    const handleClose = () => {
        setOpenEdit(false)
        setOpenNew(false)
    }

    const handleOpenNew = () => {
        setOpenNew(true)
    }

    const handleOpen = (item: Message) => {
        setSelectedMessage(item)
        setOpenEdit(true)
    }

    const handleDelete = async (uid: string) => {
        const temp = selected.filter(e => e.uid !== uid)
        if (!uid || !connectionId) return
        await unLinkConnection(uid, connectionId)
        setSelected(temp)
    }

    const handleSelect = async (event: any, value: any) => {
        if (value) {
            const temp = contacts.find(e => e.uid == value.uid)
            if (!temp || !temp.uid || !connectionId) return
            await linkConnection(temp.uid, connectionId)
            setSelected(selected.concat(temp))
            setInputKey(prev => prev + 1) // força reset
        }
    }

    const handleSendMensagem = async (text: string, scheduleTime: string | null, deliveryMethod: 'now' | 'schedule') => {
        try {

            const uids: string[] = selected
                .map(e => e.uid)
                .filter((uid): uid is string => !!uid);
            await createMessage(text, scheduleTime, uids)
            handleClose()
            toast.success(deliveryMethod == 'now' ? 'Mensagem enviada' : 'Mensagem salva')
        } catch (error) {
            toast.error('Erro ao enviar menssagem')
        }
    }





    return (
        <section className="w-full flex flex-col gap-6">
            <div className="flex justify-between py-4 items-end">
                <div className="flex flex-col">
                    <Typography variant="overline" sx={{ fontSize: 'large' }} color="text.secondary">
                        {connections[0]?.name || 'no name'}
                    </Typography>
                    <Typography color="textDisabled" variant="overline">
                        Comunique com sua rede de proficionai eficientemente
                    </Typography>
                </div>
            </div>

            <div>
                <div className="flex flex-col">
                    <Typography variant="overline" sx={{ fontSize: 'large' }} color="text.secondary">
                        Contatos da conexão
                    </Typography>
                </div>
                <Card sx={{ flex: 1 }}>
                    <CardContent sx={{ backgroundColor: '#fff' }}>
                        <Typography variant="overline" color="text.secondary">
                            Selecione os contatos
                        </Typography>
                        <Autocomplete
                            key={inputKey}
                            disablePortal
                            onChange={handleSelect}
                            options={contactsFree}
                            getOptionKey={(option) => option.uid || ''}
                            getOptionLabel={(option) => option.name}
                            sx={{ width: 300 }}
                            renderInput={(params) => <MyField label="Buscar" {...params} />}
                        />

                        <div className=" flex gap-1.5 my-5">
                            {selected.map(e => (
                                <Chip
                                    key={e.uid}
                                    label={e.name}
                                    onDelete={() => handleDelete(e.uid!)}
                                />
                            ))}
                        </div>

                    </CardContent>
                </Card>
            </div>
            <div>

                <div className="flex justify-between pt-4 pb-1 items-end">
                    <div className="flex flex-col">
                        <Typography variant="overline" sx={{ fontSize: 'large' }} color="text.secondary">
                            Mensagem
                        </Typography>
                    </div>
                    <Button variant="contained" className="h-fit"
                        onClick={handleOpenNew}
                    >Nova Mensagem</Button>
                </div>


                <Card sx={{}}>
                    <CardContent sx={{ backgroundColor: '#fff' }}>
                        <Typography variant="overline" color="text.secondary">
                            historico de mensagens
                        </Typography>


                        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table"  >
                                <TableHead >
                                    <TableRow>
                                        <TableCell>Preview mensagem</TableCell>
                                        <TableCell align="left">status</TableCell>
                                        <TableCell align="left">Data</TableCell>
                                        <TableCell align="left">Ação</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {messages.map((row) => (
                                        <TableRow
                                            key={row.uid}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Typography
                                                    variant="overline"
                                                    noWrap
                                                    sx={{
                                                        display: 'block',
                                                        maxWidth: 150,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {row.message}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left">
                                                {
                                                    row.status == 'SCHEDULE' ?
                                                        <Chip icon={<ScheduleIcon />} label="AGENDADO" color="secondary" />
                                                        : <Chip icon={<SendIcon />} label="ENVIADO" color="primary" />
                                                }
                                            </TableCell>

                                            <TableCell align="left"> {formatDate(row.scheduleTime)}</TableCell>
                                            <TableCell align="left">

                                                {
                                                    row.status != 'SENDED' ?
                                                        <IconButton aria-label="Editar" color="primary"
                                                            onClick={() => handleOpen(row)}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    : <IconButton aria-label="Editar" color="primary"
                                                            onClick={() => handleOpen(row)}
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                }
                                                <IconButton aria-label="delete" color="error"
                                                    onClick={() => handleDeleteMessage(row.uid || '')}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </CardContent>
                </Card>

            </div>
            <ModalAddMessage
                handleClose={handleClose}
                handlecreate={handleSendMensagem}
                isOpen={openNew}
            />

            <ModalEditMessage
                handleClose={handleClose}
                contactUids={ 
                    selected.reduce((acc: string[], e) => {
                        if (e.uid) acc.push(e.uid);
                        return acc;
                    }, [])
                }
                message={selectedMessage!}
                isOpen={openEdit}
            />
        </section>
    )
}