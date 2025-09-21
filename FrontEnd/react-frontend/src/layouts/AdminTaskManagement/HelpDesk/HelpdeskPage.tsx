import { SupportNavBar } from "./Components/SupportNavBar";
import { Helpdesk } from "./Components/Helpdesk";
import './Components/supportnavbarstyle.css';

export const HelpdeskPage = () => {
    return(
       <>
        <SupportNavBar/>
        <Helpdesk/>
       </>
    );
}