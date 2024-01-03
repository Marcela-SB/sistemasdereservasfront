import {
    Autocomplete,
    Box,
    FormControlLabel,
    Grid,
    Switch,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import FullScreenTableDialog from "./FullScreenTableDialog";
import { ReservationT } from "../types/ReservationT";
import { RoomT } from "../types/RoomT";
import { StateContext } from "../context/ReactContext";
import { UserT } from "../types/UserT";
import { baseInternalSchedule } from "../types/tableSchedules";

type Props = {};

function FullScreenFormDialog({}: Props) {

    
    const {roomList, userList, reservationList, loggedUser} = React.useContext(StateContext);

    const [formName, setFormName] = useState("");

    const [formRoom, setFormRoom] = useState<RoomT | null>(null);

    const [formStartDay, setFormStartDay] = useState<Dayjs | null>(dayjs());

    const [formIsOneDay, setFormIsOneDay] = useState(true);

    const [formEndDay, setFormEndDay] = useState<Dayjs | null>(dayjs());

    const [formReservatedTo, setFormReservatedTo] = useState<UserT | null>(null);

    const [formSchedule, setFormSchedule] = useState<boolean[][]>(baseInternalSchedule)

    const onSubmit = () => {
        const formatedStart = formStartDay!.startOf("D").format('YYYY-MM-DDTHH:mm:ss') 
        let formatedEnd = formEndDay!.endOf("D").format('YYYY-MM-DDTHH:mm:ss')
        if(formIsOneDay){
            
            formatedEnd = formStartDay!.endOf("D").format('YYYY-MM-DDTHH:mm:ss') 
        }
         
        const header  = {
            name: formName,
            roomId: formRoom!.id,
            reservationStart: formatedStart,
            reservationEnd: formatedEnd,
            reservatedToId:formReservatedTo!.id,
            reservationResponsibleId: loggedUser.id,
            schedule: formSchedule
        }

        console.log(header)
    }

    return (
        <Box sx={{ padding: 2, flexGrow: 1 }}>
            <Grid container>
                <Grid xs={5} paddingX={1}>
                    <TextField
                        id="outlined-controlled"
                        label="Nome da reserva"
                        value={formName}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            setFormName(event.target.value);
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid xs={5} paddingX={1}>
                    <Autocomplete
                        value={formRoom}
                        onChange={(event: any, newValue: RoomT | null) => {
                            setFormRoom(newValue);
                        }}
                        id="controllable-states-demo"
                        options={roomList}
                        getOptionLabel={(room : RoomT) => {
                            let roomN = ""
                            if(room.roomNumber){
                                roomN = room.roomNumber
                            }
                            return `${room.name} ${roomN}`}}
                        sx={{ flexGrow: 1 }}
                        renderInput={(params) => (
                            <TextField {...params} label="Sala reservada" />
                        )}
                    />
                </Grid>

                <Grid xs={2} paddingX={1}>
                    <TextField
                        id="outlined-controlled"
                        label="Supervisor da reserva"
                        value={loggedUser.name}
                        disabled
                        fullWidth
                    />
                </Grid>
                <Grid xs={3} paddingX={1} paddingTop={1}>
                    <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                            label="Inicio da reserva"
                            value={formStartDay}
                            onChange={(newValue) => setFormStartDay(newValue)}
                            disablePast
                            sx={{ width: "100%" }}
                        />
                    </DemoContainer>
                </Grid>
                <Grid xs={1.5} paddingX={0} paddingTop={1}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formIsOneDay}
                                onChange={(event) => {
                                    setFormIsOneDay(event.target.checked);
                                }}
                                inputProps={{ "aria-label": "controlled" }}
                            />
                        }
                        labelPlacement="bottom"
                        label="Reserva unitária"
                        sx={{ width: "100%" }}
                    />
                </Grid>
                {formIsOneDay == true ? (
                    <Grid xs={3} paddingX={1} paddingTop={1}>
                        <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                                label="Inicio da reserva"
                                value={formEndDay}
                                disabled
                                sx={{ width: "100%" }}
                            />
                        </DemoContainer>
                    </Grid>
                ) : (
                    <Grid xs={3} paddingX={1} paddingTop={1}>
                        <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                                label="Inicio da reserva"
                                value={formEndDay}
                                onChange={(newValue) =>
                                    setFormEndDay(newValue)
                                }
                                disablePast
                                sx={{ width: "100%" }}
                            />
                        </DemoContainer>
                    </Grid>
                )}
                <Grid xs paddingX={1} paddingTop={2}>
                    <Autocomplete
                        value={formReservatedTo}
                        onChange={(event: any, newValue: UserT | null) => {
                            setFormReservatedTo(newValue);
                        }}
                        id="controllable-states-demo"
                        options={userList}
                        
                        getOptionLabel={(user : UserT) => {return user.name}}
                        sx={{ flexGrow: 1 }}
                        renderInput={(params) => (
                            <TextField {...params} label="Sala reservada para..." />
                        )}
                    />
                </Grid>
                <FullScreenTableDialog formSchedule={formSchedule} setFormSchedule={setFormSchedule}/>
            </Grid>
        </Box>
    );
}

export default FullScreenFormDialog;
