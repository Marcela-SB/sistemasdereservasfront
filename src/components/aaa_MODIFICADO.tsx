import * as React from "react";
import { useState, useContext } from "react";
import {
    Button, Dialog, AppBar, Toolbar, Typography, Slide, Box, Grid, 
    IconButton, Stack, TextField, FormControl, InputLabel, Select, 
    MenuItem, Switch, Autocomplete, Paper,
    FormControlLabel
} from "@mui/material";
import { Close, Delete } from "@mui/icons-material";
import { TransitionProps } from "@mui/material/transitions";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

// Seus componentes e contextos originais
import { StateContext } from "../context/ReactContext";
import { Courses } from "../types/Courses";
import { baseInternalSchedule } from "../types/tableSchedules";
import FullScreenTableDialog from "./FullScreenTableDialog";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenActionDialog({ isOpen, setIsOpen, text, selectedReservation }: any) {
    const { roomList, activeUsersList, loggedUser } = useContext(StateContext);

    // Estados do Formulário
    const [formName, setFormName] = useState("");
    const [formSlots, setFormSlots] = useState<number | null>(null);
    const [formCourse, setFormCourse] = useState<Courses>(Courses.NOCOURSE);
    const [formStartDay, setFormStartDay] = useState<Dayjs | null>(dayjs());
    const [formEndDay, setFormEndDay] = useState<Dayjs | null>(dayjs());
    const [formIsOneDay, setFormIsOneDay] = useState(true);
    const [formReservatedTo, setFormReservatedTo] = useState(null);
    const [formComment, setFormComment] = useState("");

    // Estado das Seções de Sala-Horário
    const [sections, setSections] = useState([{ rooms: [], schedule: baseInternalSchedule }]);

    const addSection = () => setSections([...sections, { rooms: [], schedule: baseInternalSchedule }]);
    const removeSection = (index: number) => setSections(sections.filter((_, i) => i !== index));
    const updateSection = (index: number, field: string, value: any) => {
        const newSections = [...sections] as any;
        newSections[index][field] = value;
        setSections(newSections);
    };

    const handleClose = () => setIsOpen(false);

    return (
        <Dialog fullScreen open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar 
            sx={{ position: "relative", backgroundColor: '#004a89' }}>
                <Toolbar>
                    <Typography sx={{ ml: 2, flex: 1, fontWeight: 'bold' }} variant="h6">DEART</Typography>
                    <Button color="success" variant="contained" sx={{ fontWeight: 'bold' }}>SALVAR</Button>
                    <IconButton color="inherit" onClick={handleClose} sx={{ ml: 2 }}><Close /></IconButton>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 4, minHeight: '100vh' }}>
                <Grid container spacing={2}>
                    
                    {/* --- CAMPOS SUPERIORES (Mantendo proporções originais) --- */}
                    <Grid item xs={12} md={3}>
                        <TextField label="Nome da reserva" fullWidth sx={{ bgcolor: 'white' }} />
                    </Grid>
                    <Grid item xs={12} md={1.5}>
                        <TextField label="Vagas" fullWidth sx={{ bgcolor: 'white' }} />
                    </Grid>
                    <Grid item xs={12} md={3.5}>
                        <FormControl fullWidth sx={{ bgcolor: 'white' }}>
                            <InputLabel>Curso</InputLabel>
                            <Select label="Curso" value={formCourse}>
                                <MenuItem value={Courses.NOCOURSE}>
                                    Sem curso relacionado
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField label="Supervisor" fullWidth disabled sx={{ bgcolor: 'white' }} />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <DatePicker label="Início da reserva" sx={{ width: '100%', bgcolor: 'white' }} />
                    </Grid>
                    <Grid item xs={12} md={1.5} sx={{ textAlign: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formIsOneDay}
                                    onChange={(event) => {
                                        setFormIsOneDay(
                                            event.target.checked
                                        );
                                    }}
                                    inputProps={{
                                        "aria-label": "controlled",
                                    }}
                                />
                            }
                            labelPlacement="top"
                            label="Reserva unitária"
                            sx={{ width: "100%", marginX: 0 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3.5}>
                        <DatePicker 
                            label="Final da reserva" 
                            sx={{ width: '100%', bgcolor: 'white' }} 
                            disabled={formIsOneDay} 
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Autocomplete options={[]} renderInput={(params) => 
                            <TextField 
                                {...params} 
                                label="Sala reservada para..." 
                                sx={{ bgcolor: 'white' }} 
                            />
                        } />
                    </Grid>

                    {/* --- MUDANÇA 1: OBSERVAÇÕES LOGO ABAIXO --- */}
                    <Grid item xs={12}>
                        <TextField 
                            label="Observações" 
                            multiline 
                            rows={3} 
                            fullWidth 
                            value={formComment}
                            onChange={(e) => setFormComment(e.target.value)}
                            sx={{ bgcolor: 'white', mt: 1 }} 
                        />
                    </Grid>

                    {/* --- MUDANÇA 2: TABELAS CENTRALIZADAS --- */}
                    <Grid 
                        item 
                        xs={12} 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            mt: 3 
                        }}
                    >
                        <Stack spacing={4} sx={{ width: '100%', maxWidth: '1200px' }}>
                            {sections.map((section, index) => (
                                <Box key={index} sx={{ position: 'relative', width: '100%' }}>
                                    
                                    {/* LIXEIRA LATERAL (Conforme Frame 10) */}
                                    {index > 0 && (
                                        <Button 
                                            onClick={() => removeSection(index)}
                                            variant="contained"
                                            sx={{ 
                                                position: 'absolute', 
                                                left: -65,
                                                top: '50%', 
                                                transform: 'translateY(-50%)',
                                                bgcolor: '#d32f2f', 
                                                color: 'white',
                                                minWidth: 0,
                                                width: 45,
                                                height: 45,
                                                borderRadius: '8px',
                                                padding: 0,
                                                '&:hover': { bgcolor: '#b71c1c' },
                                                boxShadow: 3
                                            }}
                                        >
                                            <Delete />
                                        </Button>
                                    )}

                                    <Paper elevation={1} sx={{ overflow: 'hidden', borderRadius: '4px' }}>
                                        <FullScreenTableDialog
                                            formSchedule={section.schedule}
                                            setFormSchedule={(val) => updateSection(index, 'schedule', val)}
                                            roomList={roomList}
                                            formRoom={section.rooms}
                                            setFormRoom={(val) => updateSection(index, 'rooms', val)}
                                        />
                                    </Paper>
                                </Box>
                            ))}

                            {/* BOTÃO ADICIONAR (Centralizado abaixo das tabelas) */}
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button 
                                    variant="contained" 
                                    onClick={addSection}
                                    sx={{ bgcolor: '#004a89', px: 4, py: 1, fontWeight: 'bold' }}
                                >
                                    Adicionar nova sala-horário
                                </Button>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Dialog>
    );
}