import { UserT } from "../types/UserT";

export default function userDynamicSort() {
    return function (a: UserT, b: UserT) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        const result =
            a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        return result ;
    };
}
