import FormTreino from "../components/FormTreino";
import SkeletonDefault from "../components/skeletons/SkeletonDefault";
import { useGetUser } from "../hooks/useGetUser";

const CadastrarTreinoPage = () => {
    const { user } = useGetUser();

    return (
        <div className="w-full flex justify-center mt-4">
            {!user ? (
                <SkeletonDefault />
            ) : (
                <FormTreino
                    userId={user.id}
                    onSubmit={() => {}}
                />
            )}
        </div>
    );
}

export default CadastrarTreinoPage;