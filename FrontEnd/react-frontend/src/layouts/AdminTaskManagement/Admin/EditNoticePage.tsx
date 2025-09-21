import { AdminDashboard } from "./components/AdminDashboard/AdminDashboard";
import { AdminNavbar } from "./components/AdminNavbar";
import { AdminSideBar } from "./components/AdminSideBar";
import { EditNotice } from "./components/EditNotice";

export const EditNoticePage = () => {
    return (
        <div >
            <AdminNavbar />
            <EditNotice />
        </div>
    );
}