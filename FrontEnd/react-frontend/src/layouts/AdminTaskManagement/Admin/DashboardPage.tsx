import { Link } from "react-router-dom";
import { AdminDashboard } from "./components/AdminDashboard/AdminDashboard";
import { AdminNavbar } from "./components/AdminNavbar";
import { SampleDashboard } from "./components/AdminDashboard/SampleDashboard";

export const DashboardPage = () => {
    return (
        <div style={{height:"100vh"}}>
            <AdminNavbar/>
            <AdminDashboard  />
            {/* <SampleDashboard/> */}
        </div>
    );
}