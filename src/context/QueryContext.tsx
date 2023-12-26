import { QueryClientProvider } from '@tanstack/react-query'
import React, { ReactElement } from 'react'
import { queryClient } from '../utils/queryClient'

type Props = {children : ReactElement}

function QueryContext({children}: Props) {
  return (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  )
}

export default QueryContext