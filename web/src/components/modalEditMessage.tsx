import Modal from "@mui/material/Modal"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import CardActions from "@mui/material/CardActions"
import Button from "@mui/material/Button"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import RadioGroup from "@mui/material/RadioGroup"
import Paper from "@mui/material/Paper"
import FormControlLabel from "@mui/material/FormControlLabel"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import TextField from "@mui/material/TextField"
import TextareaAutosize from "@mui/material/TextareaAutosize"
import Radio from "@mui/material/Radio"
import type { Message } from "../@types/message"
import { useMessage } from "../hooks/useMessage"

interface ModalEditProps {
    handleClose: () => void,
    isOpen: boolean,
    message: Message,
    contactUids: string[]
}

export const ModalEditMessage = (props: ModalEditProps) => {

    const [deliveryMethod, setDeliveryMethod] = useState<'now' | 'schedule'>('now')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [text, setText] = useState('')

    const disabled = useMemo(() => {
        return deliveryMethod == 'now'
    }, [deliveryMethod])
    useEffect(() => {

        if (props.message) {
            const temp = props.message.scheduleTime?.split('T')
            setDate(temp[0])
            setTime(temp[1])
            setText(props.message.message)
            setDeliveryMethod(props.message.status == 'SENDED' ? 'now' : 'schedule')
        }
    }, [props.message])

    const { updateMessage } = useMessage()

    const handleChangetext = (event: any) => {
        setText(event?.target?.value || '')
    }

    const handleSubmit = async () => {
        try {
            let scheduleTime: string | null = null
            if (deliveryMethod == 'schedule') {
                if (!date || !time) {
                    toast.error('Verifique a data e hora enviada')
                }
                scheduleTime = date + 'T' + time
            }

            if (!text) {
                toast.error('Verifique a data e hora enviada')
                return
            }
            let payload: any = {
                contactUids: props.contactUids,
                message: text,
                status: deliveryMethod == 'now' ? 'SENDED' : 'SCHEDULE'
            }
            if (scheduleTime) {
                payload.scheduleTime = scheduleTime
            }
            console.log(payload)

            await updateMessage(props.message.uid!, payload)
            toast.success('Enviado com sucesso')
            props.handleClose()
        } catch (error) {
            toast.error('Enviado com sucesso')
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
                    width: '80%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    py: 4,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
            >

                <CardContent className="w-full" sx={{}}>

                    <div className="flex flex-col">
                        <Typography variant="overline" sx={{ fontSize: 'large' }} color="text.secondary">
                            Mensagem
                        </Typography>
                    </div>
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex flex-2 flex-col gap-6 min-w-112.5">
                            <Card sx={{}}>
                                <CardContent sx={{ backgroundColor: '#fff' }}>
                                    <Typography variant="overline" color="text.secondary">
                                        Nova Mensagem
                                    </Typography>

                                    <TextareaAutosize
                                        disabled={disabled}
                                        onChange={handleChangetext}
                                        value={text}
                                        maxRows={15}
                                        minRows={15}
                                        aria-label="maximum height"
                                        placeholder="Escreva sua mensagem"
                                        className="w-full resize-none border-gray-500 "
                                    />



                                </CardContent>
                            </Card>
                        </div>
                        <Card sx={{ flex: 1, minWidth: 200 }}>
                            <CardContent sx={{ backgroundColor: '#fff', height: '100%' }}>

                                <Typography variant="overline" color="text.secondary">
                                    Método de entrega
                                </Typography>

                                <RadioGroup
                                    value={deliveryMethod}
                                    onChange={(e) => setDeliveryMethod(e.target.value as "now" | "schedule")}
                                    sx={{ mt: 1, gap: 1 }}
                                >
                                    {[
                                        { value: 'now', label: 'Enviar Agora', description: 'Envio imediato para os contatos' },
                                        { value: 'schedule', label: 'Agendar envio', description: 'Defina para um momento específico' },
                                    ].map((option) => (
                                        <Paper
                                            key={option.value}
                                            variant="outlined"
                                            sx={{
                                                px: 2,
                                                py: 1.5,
                                                cursor: 'pointer',
                                                borderColor: deliveryMethod === option.value ? 'primary.main' : 'divider',
                                                backgroundColor: 'white',
                                            }}
                                            onClick={() => setDeliveryMethod(option.value as "now" | "schedule")}
                                        >
                                            <FormControlLabel
                                                value={option.value}
                                                disabled={disabled}
                                                control={<Radio size="small" />}
                                                label={
                                                    <Box>
                                                        <Typography variant="body2" >{option.label}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{option.description}</Typography>
                                                    </Box>
                                                }
                                                sx={{ m: 0, width: '100%' }}
                                            />
                                        </Paper>
                                    ))}
                                </RadioGroup>

                                <Divider sx={{ my: 3 }} />

                                {/* DATE & TIME */}
                                <Typography variant="overline" color="text.secondary">
                                    DATA E HORA
                                </Typography>

                                <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <TextField
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        fullWidth
                                        size="small"
                                        disabled={deliveryMethod === 'now'}
                                        sx={{ backgroundColor: 'white', borderRadius: 1 }}
                                    />
                                    <TextField
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        fullWidth
                                        size="small"
                                        disabled={deliveryMethod === 'now'}
                                        sx={{ backgroundColor: 'white', borderRadius: 1 }}
                                    />
                                </Box>



                            </CardContent>
                        </Card>
                    </div>

                </CardContent>
                <CardActions>
                    <Button variant="contained" onClick={handleSubmit} disabled={disabled}>Salvar</Button>
                    <Button variant="outlined" onClick={props.handleClose}>Cancelar</Button>
                </CardActions>

            </Card>
        </Modal>
    )
}