import { RoomT } from "../types/RoomT";

export default function getRoomById(roomId: string, roomList: RoomT[]) {
    return roomList.find((room: RoomT) => room.id === roomId);
}
