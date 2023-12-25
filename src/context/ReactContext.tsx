import dayjs, { Dayjs } from 'dayjs';
import { ReactElement, createContext, useState } from 'react'

export type GlobalContent = {
    date: Dayjs
    setDate:(c: Dayjs) => void
}

export const StateContext = createContext<GlobalContent>({
    date: dayjs(),
    setDate:() => {}
});

type Props = {children : ReactElement}

function ReactContext({children}: Props) {

    const [date , setDate] = useState<Dayjs>(dayjs())

  return (
    <StateContext.Provider value={{date , setDate}}>{children}</StateContext.Provider>
  )
}

export default ReactContext