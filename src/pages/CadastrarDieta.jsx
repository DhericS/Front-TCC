import FormDieta from "../components/FormDieta";
import SkeletonDefault from "../components/skeletons/SkeletonDefault";
import { useGetUser } from "../hooks/useGetUser";

const CadastrarDieta = () => {
    const { user } = useGetUser();

    return (
        <div className="w-full flex justify-center mt-4">
            {!user ? (
                <SkeletonDefault />
            ) : (
                <FormDieta  
                    personalId={user.id}
                    onSubmit={() => {}}
                />
            )}
        </div>
    );
}

export default CadastrarDieta;