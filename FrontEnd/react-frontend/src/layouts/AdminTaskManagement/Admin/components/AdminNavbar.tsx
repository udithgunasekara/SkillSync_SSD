import { NavLink, useLocation } from "react-router-dom";
import "./Adminnavbar.css";


export const AdminNavbar = () => {

    const isActiveLink = (pathname: string, link: any) => {
        return pathname === link || pathname.startsWith(link);
    };

    const location = useLocation();
    const pathname = location.pathname;
    return (
        <div className="below-navbar" style={{width:"100vw"}}>
            <nav className="navbar navbar-second below-navbar navbar-expand-lg navbar-dark bg-dark fixed-top" style={{height:"50px", position: "fixed", zIndex: 1002}}>

                <div className="container-fluid">


                    <a className="navbar-brand fw-bolder" >Admin</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    
                    <div className="collapse navbar-collapse text-center" id="navbarSupportedContent">
                        
                        <ul className="navbar-nav mx-auto" style={{paddingTop:0}}>
                            <li className="nav-item ">                                
                                    <NavLink to={"/admin"} className="nav-link" exact >Overview</NavLink>
                            </li>
                            
                            <li className="nav-item dropdown">
                                <a className={`nav-link dropdown-toggle ${isActiveLink(pathname, "/admin/newnotice") || isActiveLink(pathname, "/admin/editnotice") ? 'active' : ''}` } href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Public Notice
                                </a>
                                <ul className="dropdown-menu " aria-labelledby="navbarDropdown">
                                    <li><NavLink to={"/admin/newnotice"} className="dropdown-item" activeClassName="active-toggle" >New Notice</NavLink></li>
                                    <li><NavLink to={"/admin/editnotice"} className="dropdown-item " activeClassName="active-toggle">Edit Notice</NavLink></li>
                                   
                                </ul>
                            </li>
                            <li className="nav-item">
                            <NavLink to={"/admin/ticketrespond"} className="nav-link">Respond to ticket</NavLink>
                            </li>
                            <li className="nav-item">
                            <NavLink to={"/Applicant/Page"} className="nav-link">Applications</NavLink>
                            </li>
                            <li className="nav-item">
                            <NavLink to={"/exams"} className="nav-link">Manage Exams</NavLink>
                            </li>
                        </ul>
                        
                    </div>
                </div>
            </nav>
        </div>
    );
}