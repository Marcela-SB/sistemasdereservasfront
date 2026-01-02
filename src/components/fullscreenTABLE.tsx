import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { tableSchedule } from "../types/tableSchedules";
import { Autocomplete, Checkbox, Chip, TextField, Tooltip } from "@mui/material";
import { weekDays } from "../types/weekDays";
import { StateContext } from "../context/ReactContext";
import { RoomT } from "../types/RoomT";
import { CheckBoxOutlineBlankOutlined, CheckBoxOutlined } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

type Props = {
    formSchedule: boolean[][];
    setFormSchedule: (b: boolean[][]) => void;
    roomList: RoomT[];        // Adicionado
    formRoom: RoomT[];        // Adicionado
    setFormRoom: (r: RoomT[]) => void; // Adicionado
};

export default function FullScreenTableDialog({
    formSchedule,
    setFormSchedule,
    roomList,
    formRoom,
    setFormRoom
}: Props) {
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        wIndex: number,
        hIndex: number
    ) => {
        const holder = formSchedule;
        holder[wIndex][hIndex] = event.target.checked;
        setFormSchedule([...holder]);
    };

    if(formSchedule.length <= 6){
        // O novo array que você quer adicionar no início
        const novoHorario = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

        // Criamos um novo array começando com 'novoHorario' e depois
        // "espalhando" todos os itens do 'formSchedule' original
        const novoFormSchedule = [novoHorario, ...formSchedule];

        console.log(novoFormSchedule);
        
        // Atualizamos o estado com o novo array
        setFormSchedule(novoFormSchedule);
    }

    return (
        <TableContainer component={Paper} sx={{ marginX: "auto" }}>
            <Table sx={{ minWidth: 650, border: '0.5px lightgrey solid' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell 
                            sx={{ 
                                minWidth: 250, 
                                //backgroundColor: 'grey.100'
                            }}
                        >
                            <Autocomplete
                                multiple
                                id="room-select-header"
                                options={roomList}
                                value={formRoom}
                                onChange={(_event, values) => setFormRoom(values)}
                                limitTags={1}
                                getOptionLabel={(room: RoomT) => 
                                    `${room.name} ${room.roomNumber || ""}`
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Salas reservadas"
                                        variant="filled"
                                        size="small"
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((room, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        if (index > 0 && index < value.length - 1) return null;
                                        if (index === value.length - 1 && value.length > 1) {
                                             return <Chip key="more" label={`+${value.length - 1}`} size="small" />;
                                        }
                                        return (
                                            <Chip
                                                key={key}
                                                variant="outlined"
                                                label={room.name}
                                                size="small"
                                                {...tagProps}
                                            />
                                        );
                                    })
                                }
                                renderOption={(props, room, { selected }) => {
                                    const { key, ...optionProps } = props;
                                    return (
                                        <li key={key} {...optionProps}>
                                            <Checkbox
                                                icon={
                                                    <CheckBoxOutlineBlankOutlined fontSize="small" />
                                                }
                                                checkedIcon={
                                                    <CheckBoxOutlined fontSize="small" />
                                                }
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {room.name} {room.roomNumber || ""}
                                        </li>
                                    );
                                }}
                            />
                        </TableCell>
                        {tableSchedule.map((schedule) => {
                            return (
                                <Tooltip
                                    title={
                                        schedule.startTime +
                                        "-" +
                                        schedule.endTime
                                    }
                                    key={
                                        schedule.startTime +
                                        "-" +
                                        schedule.endTime
                                    }
                                >
                                    <TableCell
                                        key={
                                            "row" +
                                            schedule.shift +
                                            schedule.hourly
                                        }
                                        size="small"
                                        align="center"
                                    >
                                        {schedule.shift + schedule.hourly}
                                    </TableCell>
                                </Tooltip>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {weekDays.map((wd, weekIndex) => (
                        <TableRow key={wd.name}>
                            <TableCell align="center">{wd.name}</TableCell>

                            {tableSchedule.map((schedule, hourIndex) => {
                               
                                return (
                                    <Tooltip
                                        title={""}
                                        key={weekIndex + hourIndex}
                                    >
                                        <TableCell
                                            padding="checkbox"
                                            key={
                                                "row" +
                                                schedule.shift +
                                                schedule.hourly
                                            }
                                            size="medium"
                                            align="center"
                                        >
                                            {formSchedule[weekIndex][
                                                hourIndex
                                            ] ? (
                                                <Checkbox
                                                    sx={{
                                                        "& .MuiSvgIcon-root": {
                                                            fontSize: 26,
                                                        },
                                                    }}
                                                    checked={
                                                        formSchedule[weekIndex][
                                                            hourIndex
                                                        ]
                                                    }
                                                    onChange={(e) => {
                                                        handleChange(
                                                            e,
                                                            weekIndex,
                                                            hourIndex
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <Checkbox
                                                    sx={{
                                                        "& .MuiSvgIcon-root": {
                                                            fontSize: 26,
                                                        },
                                                    }}
                                                    checked={
                                                        formSchedule[weekIndex][
                                                            hourIndex
                                                        ]
                                                    }
                                                    onChange={(e) => {
                                                        handleChange(
                                                            e,
                                                            weekIndex,
                                                            hourIndex
                                                        );
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                    </Tooltip>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
