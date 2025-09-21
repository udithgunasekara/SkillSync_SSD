export const Footer = () => {
    return (
        <div className='main-color mt-5'>
            <footer className='container d-flex flex-wrap 
                justify-content-between align-items-center py-4 main-color'>
                <p className='col-md-4 mb-0 text-white'>© SkillSync Freelancing Marketplace</p>
                <ul className='nav navbar-dark col-md-4 justify-content-end'>
                    <li className='nav-item'>
                        <a href='#' className='nav-link px-3 text-white'>
                            Help Desk
                        </a>
                    </li>
                    <li className='nav-item'>
                        <a href='#' className='nav-link px-3 text-white'>
                            Dashboard
                        </a>
                    </li>
                </ul>
            </footer>
        </div>
    );
}