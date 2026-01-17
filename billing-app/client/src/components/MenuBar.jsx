import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext.jsx';
import './Menubar.css';
import { assests } from "../assets/assets";

const MenuBar = () => {
    const { setAuthData, auth } = useContext(AppContext);
    const role = auth?.role;
    const navigate = useNavigate();

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setAuthData(null, null);
        navigate('/login');
    };

    if (!role) return null; // 👈 Prevent render if not logged in

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2">
            <a className="navbar-brand" href="/">
                <img src={assests.logo} alt="Logo" height="40" />
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse p-2" id="navbarNav">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/">
                            Dashboard
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/explore">
                            Explore
                        </NavLink>
                    </li>

                    

                    {role === 'ROLE_ADMIN' && (
                        <>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/manage-category">
                                    Manage Categories
                                </NavLink>
                            </li>
                            <li className="nav-item">
                        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/manage-items">
                            Manage Items
                        </NavLink>
                    </li>
                        </>
                    )}

                    <li className="nav-item">
                        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/orders">
                            Order History
                        </NavLink>
                    </li>
                </ul>

                {/* Right dropdown */}
                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img src={assests.profile} alt="Profile" width={32} height={32} />
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li><a className="dropdown-item" href="#">Setting</a></li>
                            <li>
                                {/* <a className="dropdown-item" href="#">Activity Log</a> */}
                                <NavLink className="dropdown-item" to="/activity">Activity Log</NavLink>
                            </li>
                            {role === 'ROLE_ADMIN' && (
                                <li>
                                    <NavLink className="dropdown-item" to="/manage-users">Manage Users</NavLink>
                                </li>
                            )}
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item" href="#" onClick={logOut}>Log Out</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default MenuBar;
