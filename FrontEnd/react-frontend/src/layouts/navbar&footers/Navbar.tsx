import { Session } from "inspector";
import { useContext } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import FreelancerContext from "../UserVerificationManagement/Context/Context";

// const userrole = sessionStorage.getItem('role') 
// const userrole = "freelancer"; //change this to change user

export const Navbar = () => {
    const history = useHistory();
    const username = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
    // const role2 = 'admin'

    const {setFreelancerCon,setFreelancerEmail} : any= useContext(FreelancerContext);

    const handleProfileClick = () => {
        if (role === 'freelancer') {
            history.push(`/freelancers/${username}`);
        } else {
            history.push(`/clients/${username}`);
        }
    }

    const handleLogout = () => {
        // Clear the authentication token from local storage
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('email');

        //Context Null
        setFreelancerCon(null);
        setFreelancerEmail(null);

        

        history.push('/HomePage');
    };


    return (
        <nav className='navbar navbar-top navbar-expand-lg navbar-dark main-color fixed-top' style={{ padding: "0", position: "fixed", zIndex: "1008" }}>
            <div className='container-fluid'>
                {/* <span className='navbar-brand'><h4>Project</h4></span> */}

                <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
                    aria-controls='navbarNavDropdown' aria-expanded='false' aria-label='Toggle navigation'>
                    <span className='navbar-toggler-icon'></span>
                </button>

                <div className='collapse navbar-collapse justify-content-between' id='navbarNavDropdown'>
                    <ul className='navbar-nav' style={{paddingTop:0}}>

                         {(role !== 'client' && role !== 'freelancer' && role !== 'admin') && (
                            <NavLink className='nav-link' to={'/User/Registration'}>Sign Up</NavLink>
                        )}  


                        <li className='nav-item ' id="dash" >
                            <NavLink className='nav-link' to={'/dashboard'}>Dashboard</NavLink>
                        </li>
                        <li className='nav-item' id="jobs">
                            <NavLink className='nav-link' to={'/searchjobs'}>Jobs</NavLink> 
                        </li>
                        <li className='nav-item' id="gigs">
                            <NavLink className='nav-link' to={'/FreelancerMain'}> Gigs</NavLink>
                        </li>
                        <li className='nav-item' id="cources">
                            <a className='nav-link' href='#'> Courses</a>
                        </li>
                        {role === 'admin' && (
                            <li className='nav-item' id="admin">
                                <NavLink className='nav-link' to={'/admin'}>Admin</NavLink>
                            </li>
                        )}
                        {/* <li className='nav-item' id="admin">
                            <NavLink className='nav-link' to={'/admin'}>Admin</NavLink>
                        </li> */}

                        
                    </ul>
                    <ul className='navbar-nav ms-auto' style={{paddingTop:0}}>
                        <li className="nav-item dropdown ">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png"
                                    width="30"
                                    height="30"
                                    alt="User Profile" />
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown" style={{ position: "absolute", zIndex: 1005 }}>
                                <li><a className="dropdown-item " onClick={handleProfileClick}>Profile</a></li>
                                <li><NavLink className="dropdown-item" activeClassName="active-toggle" to={'/details'}>Billing and Information</NavLink></li>
                                <li><NavLink className="dropdown-item" activeClassName="active-toggle" to={'/payment'}>Transaction History</NavLink></li>
                                <li><NavLink className="dropdown-item" activeClassName="active-toggle" to={'/support'}>Help Desk</NavLink></li>
                                <li><NavLink className="dropdown-item" activeClassName="active-toggle" to={'/support'} onClick={handleLogout}>LogOut</NavLink></li>
                                {/* Add more dropdown items here if needed */}
                            </ul>
                        </li>


                    </ul>
                </div>
            </div>

        </nav>
    )
}