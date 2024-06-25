export default function daysTabledynamicSort() {
    return function (a: any, b: any) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        const result =
            a[0]["name"] < b[0]["name"] ? -1 : a[0]["name"] > b[0]["name"] ? 1 : 0;
        return result ;
    };
}
