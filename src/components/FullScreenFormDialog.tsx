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

type Props = {};

function FullScreenFormDialog({}: Props) {
    const [formName, setFormName] = useState("");

    const [formRoom, setFormRoom] = useState<string | null>("");

    const [formStartDay, setFormStartDay] = useState<Dayjs | null>(dayjs());

    const [formIsOneDay, setFormIsOneDay] = useState(true);

    const [formStartEnd, setFormStartEnd] = useState<Dayjs | null>(dayjs());

    const [formReservatedTo, setFormReservatedTo] = useState<string | null>("");

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
                        onChange={(event: any, newValue: string | null) => {
                            setFormRoom(newValue);
                        }}
                        id="controllable-states-demo"
                        options={[""]}
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
                        value="Supervisor logado"
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
                                value={formStartEnd}
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
                                value={formStartEnd}
                                onChange={(newValue) =>
                                    setFormStartEnd(newValue)
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
                        onChange={(event: any, newValue: string | null) => {
                            setFormReservatedTo(newValue);
                        }}
                        id="controllable-states-demo"
                        options={[""]}
                        sx={{ flexGrow: 1 }}
                        renderInput={(params) => (
                            <TextField {...params} label="Sala reservada para..." />
                        )}
                    />
                </Grid>
                <FullScreenTableDialog />
            </Grid>
        </Box>
    );
}

export default FullScreenFormDialog;
