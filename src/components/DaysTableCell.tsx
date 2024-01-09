import { Tooltip, TableCell, Typography, styled } from "@mui/material";
import { ReservationT } from "../types/ReservationT";
import getUserById from "../utils/getUserById";
import { StateContext } from "../context/ReactContext";
import { useContext } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
}));

type Props = {
    schedule: ReservationT | null;
    index: number;
    span: number;
};

function DaysTableCell({ schedule, index, span = 1 }: Props) {
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
                >
                    <div
                        style={{
                            width: widthCellSize + "rem",
                            display: "flex",
                            justifyContent: "right",
                        }}
                    >
                        <Typography noWrap>{schedule?.name}</Typography>
                    </div>
                </StyledTableCell>
            ) : (
                <TableCell
                    padding="normal"
                    key={schedule?.id + index}
                    size="medium"
                    align="center"
                    sx={{
                        borderLeft: "1px solid rgba(81, 81, 81, 1);",
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
