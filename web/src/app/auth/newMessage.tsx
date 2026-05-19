import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { MyField } from "../../components/common/myfield"
import Chip from "@mui/material/Chip"
import { useEffect, useState } from "react"
import Autocomplete from "@mui/material/Autocomplete"
import Typography from "@mui/material/Typography"
import TextareaAutosize from "@mui/material/TextareaAutosize"
import RadioGroup from "@mui/material/RadioGroup"
import Paper from "@mui/material/Paper"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Divider from "@mui/material/Divider"
import type { Contact } from "../../@types/contacts"
import { useContact } from "../../hooks/useContacts"

export const NewMessage = () => {

    const [selected, setSelected] = useState<Contact[]>([])
    const [deliveryMethod, setDeliveryMethod] = useState<'now' | 'schedule'>('now')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    const {contacts} = useContact()

    const handleDelete = (uid: string) => {
        const temp = selected.filter(e => e.uid !== uid)
        setSelected(temp)
    }

    const handleSelect = (event: any, value: any) => {
        if (value) {
            const temp = contacts.find(e => e.uid == value.uid)
            if (!temp) return
            setSelected(selected.concat(temp))
        }
    }


    return (
        <section className="w-full flex flex-col gap-6">
            <div className="flex justify-between py-4 items-end">
                <div className="flex flex-col">
                    <Typography variant="overline" sx={{ fontSize: 'large' }} color="text.secondary">
                        Nova Conexão
                    </Typography>
                    <Typography color="textDisabled" variant="overline">
                        Comunique com sua rede de proficionai eficientemente
                    </Typography>
                </div>
                <Button variant="contained" className="h-fit" >Salvar</Button>
            </div>

            <div className="flex flex-wrap gap-6">
                <Card sx={{ flex: 1 }}>
                    <CardContent sx={{ backgroundColor: '#fff' }}>
                        <Typography variant="overline" color="text.secondary">
                            Informações da conexão
                        </Typography>
                        <div className="w-[300px]">
                            <MyField
                            
                            label="Nome da conexão"
                            type="email"
                            placeholder="Digite o nome da nova conexão"
                        />
                        </div>
                    </CardContent>
                </Card>

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
                            disablePortal
                            onChange={handleSelect}
                            options={contacts}
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
                <div className="flex flex-col">
                    <Typography variant="overline" sx={{ fontSize: 'large' }} color="text.secondary">
                        Mensagem
                    </Typography>
                </div>
                <div className="flex gap-6 flex-wrap">

                    <div className="flex flex-2 flex-col gap-6">
                        <Card sx={{}}>
                            <CardContent sx={{ backgroundColor: '#fff' }}>
                                <Typography variant="overline" color="text.secondary">
                                    Nova Mensagem
                                </Typography>

                                <TextareaAutosize
                                    maxRows={15}
                                    minRows={15}
                                    aria-label="maximum height"
                                    placeholder="Escreva sua mensagem"
                                    defaultValue=""
                                    className="w-full resize-none border-gray-500 border-1"
                                />



                            </CardContent>
                        </Card>
                    </div>
                    <Card sx={{ flex: 1 }}>
                        <CardContent sx={{ backgroundColor: '#fff', height: '100%' }}>

                            <Typography variant="overline" color="text.secondary">
                                Delivery Method
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
                                Date & Time
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

                            <Button variant="contained" className="h-fit" >Enviar mensagem</Button>


                        </CardContent>
                    </Card>
                </div>
            </div>

            <div >
                <Card sx={{}}>
                    <CardContent sx={{ backgroundColor: '#fff' }}>
                        <Typography variant="overline" color="text.secondary">
                            historico de mensagens
                        </Typography>


                        <div className=" flex gap-1.5 my-5">
                        </div>

                    </CardContent>
                </Card>
            </div>
        </section>
    )
}