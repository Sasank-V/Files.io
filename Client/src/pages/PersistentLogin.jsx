import useAuth from "@/hooks/useAuth"
import useRefreshToken from "@/hooks/useRefreshToken"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"


const PersistentLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyRefrresfToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false)
            }
        }

        !auth.access_token ? verifyRefrresfToken() : setIsLoading(false)

    }, []);

    return (
        <>
            {
                isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}
export default PersistentLogin