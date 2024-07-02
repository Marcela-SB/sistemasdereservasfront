import { Container } from "@mui/material";
import React, { useState } from "react";
import DaysTable from "./DaysTable";
import ReservationDetailsDialog from "./ReservationDetailsDialog";
import { ReservationT } from "../types/ReservationT";

type Props = {};

function MainContainer({}: Props) {
    const [reserDIsOpen, setReserDIsOpen] = useState(false);
    const [reservationToDetail, setReservationToDetail] =
        useState<null | ReservationT>(null);

    return (
        <Container>
            <DaysTable
                setReserDIsOpen={setReserDIsOpen}
                setReservationToDetail={setReservationToDetail}
            />
            {reservationToDetail ? (
                <ReservationDetailsDialog
                    reservation={reservationToDetail}
                    isOpen={reserDIsOpen}
                    setIsOpen={setReserDIsOpen}
                />
            ) : null}
        </Container>
    );
}

export default MainContainer;
