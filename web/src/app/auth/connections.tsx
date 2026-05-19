import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import CardActions from "@mui/material/CardActions"
import { useNavigate } from "react-router-dom"
import { useConnections } from "../../hooks/useConnections"


export const Connections = () => {
    const navigate = useNavigate()
    const { conexoes } = useConnections()
    const handleNewConnection = () => {
        navigate("/auth/message")
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
                    onClick={handleNewConnection} >Nova Conexão</Button>
            </div>

            <div className="flex flex-wrap gap-6 ">
                {conexoes.map(e => (
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
                            <Button variant="contained" >Abrir</Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
        </section>
    )
}