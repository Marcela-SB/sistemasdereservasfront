import { RoomT } from "../types/RoomT";

export default function roomDynamicSort() {
    return function (a: RoomT, b: RoomT) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        const result =
            a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        return result ;
    };
}
