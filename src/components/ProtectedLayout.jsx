import { Outlet, useNavigate } from "react-router-dom"
import { useGetUser } from "../hooks/useGetUser"
import { toast } from "sonner";
import SkeletonParagraphs from "./skeletons/SkeletonParagraphs";

const ProtectedLayout = () => {
    const { user, loading } = useGetUser();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="w-full flex justify-center mt-6">
                <SkeletonParagraphs />
            </div>
        );
    }

    if (!user) {
        navigate('/login', { replace: true });
        toast.error("Você precisa estar logado para acessar esta página.");
        return; 
    }

    return (
        <>
            <Outlet />
        </>
    )
}

export default ProtectedLayout;