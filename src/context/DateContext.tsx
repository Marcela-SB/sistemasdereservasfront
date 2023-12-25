import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ReactElement } from 'react'

import 'dayjs/locale/pt-br';

type Props = {children : ReactElement}

function DateContext({children}: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br" >
      {children}
    </LocalizationProvider>
  )
}

export default DateContext