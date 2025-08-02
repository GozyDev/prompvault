    import { toast } from "react-toastify"

    export default async function getUser(){
        try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,{credentials:"include"})
        if(!res.ok){
            const errorData = await res.json()
        }else{
            return res.json()
        }
        }
        catch(error){
            console.log(error)
        }
        
    }