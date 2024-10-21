import LoadingComponent from "@/components/loading"
import useAuth from "@/hooks/useAuth"
import useRefreshToken from "@/hooks/useRefreshToken"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"


const PersistentLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyRefrresfToken = async () => {
            setIsLoading(true);
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
                    ? <div className="w-full h-[100vh]">
                        <LoadingComponent text="Loading"/>
                    </div>
                    : <Outlet />
            }
        </>
    )
}
export default PersistentLogin