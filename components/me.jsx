import { toast } from "react-toastify"

export default async function getUser(){
    try{
    const res = await fetch("http://localhost:5000/api/auth/me",{credentials:"include"})
    if(!res.ok){
        const errorData = await res.json()
        toast.error(errorData.error)
    }else{
        return res.json()
    }
    }
    catch(error){
        console.log(error)

    }
    
}