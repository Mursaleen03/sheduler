'use client'

import { useUser } from "@clerk/nextjs"
import {BarLoader} from 'react-spinners'


const AppLayout = ({children}) => {
    const { isLoaded } = useUser()
  return (
    <>
    {!isLoaded && <BarLoader width={100} color="#4A90E2" /> }
    {children}
    </>
  )
}

export default AppLayout
