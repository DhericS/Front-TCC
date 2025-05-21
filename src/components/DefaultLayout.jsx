import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import Rodape from "./Rodape";

const DefaultLayout = () => {
    return (
        <>
            <Menu />
                <main className="flex-grow">
                    <Outlet />
                </main>
            <Rodape />
        </>
    );
}


export default DefaultLayout;