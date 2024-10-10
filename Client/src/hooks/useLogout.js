import { axiosPrivate } from "@/api/axios";
import axios from "axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            const response = await axiosPrivate.get("/auth/logout");
        } catch (err) {
            console.error(err);
        }
    }
    return logout;
}


export default useLogout;