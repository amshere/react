import { Navigate } from 'react-router-dom'

export default function Logout(){
    window.localStorage.removeItem('username')
    return(
        <Navigate to="/" />
    )
}