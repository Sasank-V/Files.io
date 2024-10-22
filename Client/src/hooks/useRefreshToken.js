import axios from "@/api/axios";
import useAuth from "./useAuth";


const useRefreshToken = () => {
    const { auth,setAuth } = useAuth();
    if(Object.keys(auth).length == 0) return;
    const refresh = async () => {
        const response = await axios.get("/refresh", {
            withCredentials: true
        });

        setAuth(prev => {
            const newAuth = { ...prev, ...response.data };
            return newAuth;
        });

        return response.data.access_token;
    }

    return refresh;
};

export default useRefreshToken;