import { Box, Container } from "@mui/material";
import React, { useState } from "react";
import DaysTable from "./DaysTable";
import ReservationDetailsDialog from "./ReservationDetailsDialog";
import { ReservationT } from "../types/ReservationT";
import FullScreenActionDialog from "./FullScreenActionDialog";

type Props = {};

function MainContainer({}: Props) {
    const [reserDIsOpen, setReserDIsOpen] = useState(false);
    const [reservationToDetail, setReservationToDetail] =
        useState<null | ReservationT>(null);

    const [reservationDIsOpen, setReservationDIsOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] =
        useState<ReservationT | null>(null);

    return (
        <Box p={0}>
            <DaysTable
                setReserDIsOpen={setReserDIsOpen}
                setReservationToDetail={setReservationToDetail}
            />
            {reservationToDetail ? (
                <ReservationDetailsDialog
                    reservation={reservationToDetail}
                    setEditIsOpen={setReservationDIsOpen}
                    setReservationToEdit={setSelectedReservation}
                    isOpen={reserDIsOpen}
                    setIsOpen={setReserDIsOpen}
                />
            ) : null}

            <FullScreenActionDialog
                isOpen={reservationDIsOpen}
                setIsOpen={setReservationDIsOpen}
                text="deart"
                selectedReservation={selectedReservation}
                setSelectedReservation={setSelectedReservation}
            />
        </Box>
    );
}

export default MainContainer;
