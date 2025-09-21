import { PublicNotices } from "./Components/publicNotices";
import { WelcometoSite } from "./Components/welocmetosite";
import "./dashboard.css";

export const Dashboard = () => {
    return(
        <>
        <WelcometoSite/>
        <PublicNotices/>
        </>
    );
}