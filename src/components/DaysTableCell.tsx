import { Tooltip, TableCell, Typography, styled } from "@mui/material";
import { ReservationT } from "../types/ReservationT";
import getUserById from "../utils/getUserById";
import { StateContext } from "../context/ReactContext";
import { useContext, useEffect, useRef, useState } from "react";
import { Courses } from "../types/Courses";

const courseColors = {
    TEATRO: "#a4c2f4",
    ARTES: "#ffe599",
    DESING: "#b6d7a8",
    DANÇA: "#f4cccc",
    NOCOURSE: "#e4ecf7",
    POS: "#eecca7"
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderLeft: "1px solid hsl(0, 0%, 60%);",
    borderBottom: "1px solid hsl(0, 0%, 60%);",
}));

type Props = {
    schedule: ReservationT | null;
    index: number;
    span: number;
    handleClick: (r: ReservationT) => void;
};

function DaysTableCell({ schedule, index, handleClick, span = 1 }: Props) {
    const { userList } = useContext(StateContext);

    let tooltipTitle = null;
    if (schedule) {
        const reservedToUserName = getUserById(
            schedule.reservatedToId,
            userList
        )?.name;
        tooltipTitle = (
            <>
                <Typography variant="subtitle2">{schedule.name}</Typography>
                <Typography variant="subtitle2">
                    {reservedToUserName}
                </Typography>
            </>
        );
    }

    const parentElement = useRef(null);

    const [width, setWidth] = useState(0)

    useEffect(() => {
        console.log(parentElement.current?.offsetWidth)
        setWidth(parentElement.current?.offsetWidth)
    
    }, [])
    

    return (
        <Tooltip title={tooltipTitle}>
            {schedule ? (
                <StyledTableCell
                    padding="none"
                    key={schedule?.id + index}
                    
                    align="center"
                    colSpan={span}
                    onClick={() => {
                        handleClick(schedule);
                    }}
                    sx={{
                        backgroundColor: schedule.course
                            ? courseColors[schedule.course]
                            : courseColors[Courses.NOCOURSE],
                        maxWidth: width
                    }}
                    ref={parentElement}
                    
                >
                    <div
                        style={{
                            width: '100%',
                            display: "flex",
                            justifyContent: "right",
                        }}
                    >
                        <Typography noWrap sx={{ width: "100%", px: 1 }}>
                            {schedule?.name}
                        </Typography>
                    </div>
                </StyledTableCell>
            ) : (
                <TableCell
                    padding="none"
                    key={schedule?.id + index}
                    
                    align="center"
                    sx={{
                        borderLeft: "1px solid hsl(0, 0%, 60%);",
                        borderBottom: "1px solid hsl(0, 0%, 60%);",
                    }}
                    colSpan={span}
                    ref={parentElement}
                >
                    <div
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            //minWidth:width - 5
                        }}
                    >
                        <Typography noWrap>{schedule?.name}</Typography>
                    </div>
                </TableCell>
            )}
        </Tooltip>
    );
}

export default DaysTableCell;
