import { Tooltip, TableCell, Typography, styled } from "@mui/material";
import { ReservationT } from "../types/ReservationT";
import getUserById from "../utils/getUserById";
import { StateContext } from "../context/ReactContext";
import { useContext } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,

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

    const widthCellSize = 2 * span;

    return (
        <Tooltip title={tooltipTitle}>
            {schedule ? (
                <StyledTableCell
                    padding="normal"
                    key={schedule?.id + index}
                    size="medium"
                    align="center"
                    colSpan={span}
                    onClick={() => {
                        handleClick(schedule);
                    }}
                >
                    <div
                        style={{
                            width: widthCellSize + "rem",
                            display: "flex",
                            justifyContent: "right",
                        }}
                    >
                        <Typography noWrap color={"white"}>
                            {schedule?.name}
                        </Typography>
                    </div>
                </StyledTableCell>
            ) : (
                <TableCell
                    padding="normal"
                    key={schedule?.id + index}
                    size="medium"
                    align="center"
                    sx={{
                        borderLeft: "1px solid hsl(0, 0%, 60%);",
                        borderBottom: "1px solid hsl(0, 0%, 60%);",
                    }}
                    colSpan={span}
                >
                    <div
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: widthCellSize + "rem",
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
