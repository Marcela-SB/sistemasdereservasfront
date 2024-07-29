import {KeyT} from "../types/KeyDeliveryT.ts";
import getRoomById from "./getRoomById.ts";
import {RoomT} from "../types/RoomT.ts";

export default function keyDynamicSort(roomList: RoomT[]) {
    return function (a: KeyT, b: KeyT) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        const roomA = getRoomById(a.roomId,roomList)
        const roomB = getRoomById(b.roomId,roomList)
        if(!roomA || !roomB) {
            return 0
        }
        const result =
            roomA.name < roomB.name ? -1 : roomA.name > roomB.name ? 1 : 0;
        return result ;
    };
}
