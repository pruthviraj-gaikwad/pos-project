import { assests } from "../../assets/assets";
import { allUsers, deleteUser } from '../../service/UserService.js';
import { useContext, useState } from "react";
import { toast } from 'react-hot-toast';
import "./UsersList.css";
import { AppContext } from "../../context/AppContext.jsx";

const UsersList = ({ users, setUsers }) => {
    const [searchText, setSearchText] = useState('');
    const {auth} = useContext(AppContext);
    const role = auth.role;
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleDeleteUser = async (userId) => {
        try {
            const response = await deleteUser(userId);
            setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId))
            if (response.status === 204) {
                setUsers(prev => prev.filter(user => user.userId !== userId)); // update local state
                toast.success("User Deleted Successfully..!!");
            } else {
                toast.error("Could not delete");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="users-container">
            <div className="row pe-2">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        id='keyword'
                        name='keyword'
                        className="form-control"
                        placeholder='Search Users...'
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                    />
                    <span className="input-group-text bg-warning">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
            </div>
            <div className="row g-3 pe-12">
                {Array.isArray(users) && filteredUsers.map((user) => (
                    <div className="col-12" key={user.userId}>
                        <div className="card p-3 bg-dark">
                            <div className="d-flex align-items-center">
                                <div style={{ marginRight: '15px' }}>
                                    {user.role === 'ROLE_ADMIN'
                                        ? <img src={assests.adminicon} alt="" className='user-image' />
                                        : <img src={assests.usericon} className='user-image' />}
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className='mb-1 text-white'>{user.name}</h5>
                                    <p className='mb-0 text-white'>{user.role == 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}</p>
                                    
                                </div>
                                {role === 'ROLE_ADMIN' && (
                                    <div>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.userId)}>
                                            <i className='bi bi-trash'></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersList;
