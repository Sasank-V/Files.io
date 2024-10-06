import { axiosPrivate } from "@/api/axios";
import axios from "axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            const response = await fetch("http://localhost:8080/api/auth/logout", { method: 'GET', credentials: 'include' });
        } catch (err) {
            console.error(err);
        }
    }
    return logout;
}




export const lg = async () => {
    console.log("sdf")
    const { setAuth } = useAuth();
    setAuth({});
    try {
        const response = await fetch("http://localhost:8080/api/auth/logout", { method: 'GET', credentials: 'include' });
    } catch (err) {
        console.error(err);
    }
}


export default useLogout;