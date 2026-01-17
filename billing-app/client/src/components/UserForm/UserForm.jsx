import { useState } from "react";
import { addUser } from "../../service/UserService";
import toast from "react-hot-toast";
import UsersList from "../UsersList/UsersList";
import { optService, verifyOtp } from "../../service/OtpService";
const UserForm = ({ setUsers }) => {
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);

    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber : "",
        role: "ROLE_USER"
    });
    const [loading, setLoading] = useState(false);
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            if (!userDetails.name) {
                toast.error("Enter username.", {
                    duration: 700,
                })
            }
            if (!userDetails.email) {
                toast.error("Enter Email.", {
                    duration: 700,
                })
            }
            if (!otpVerified) {
                toast.error("Please verify OTP before submitting.");
                setLoading(false);
                return;
            }

            if (!userDetails.password) {
                toast.error("Enter Password");
            }
            console.log(userDetails);
            const response = await addUser(userDetails);
            setUsers((prevUsers) => [...prevUsers, response.data]);
            console.log(response.status);
            if (response.status === 201) {
                // {<UsersList/>}
                toast.success("User Added Successfully", {
                    duration: 700,
                })
                setLoading(false);
                setUserDetails({
                    name: "",
                    email: "",
                    password: "",
                    phoneNumber : "",
                    role: "ROLE_USER"
                })
            }
        } catch (error) {
            toast.error("Error Adding user", {
                duration: 700,
            })
        }
    }
    return (
        <div className="mx-2 mt-2">
            <div className="row">
                <div className="card col-md-12 form-container">
                    <div className="card-body">
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" name="name" id="name" className="form-control" placeholder="ganesh mane..." value={userDetails.name} onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Id</label>
                                <input type="email" autoComplete="email" name="email" id="email" className="form-control" placeholder="Email id Here." value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    className="form-control"
                                    placeholder="Enter 10-digit number"
                                    value={userDetails.phoneNumber || ""}
                                    onChange={(e) =>
                                        setUserDetails({ ...userDetails, phoneNumber: e.target.value })
                                    }
                                />
                            </div>
                            <div className="mb-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary mb-2"
                                    onClick={async () => {
                                        try {
                                            const res = await optService(userDetails.phoneNumber)
                                            // if(res.status === 200){}
                                            toast.success("OTP Sent!");
                                        } catch (error) {
                                            toast.error("Failed to send OTP");
                                        }
                                    }}
                                >
                                    Send OTP
                                </button>

                                <div className="d-flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        className="form-control"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-success"
                                        onClick={async () => {
                                            try {
                                                const res = await verifyOtp(
                                                    userDetails.phoneNumber,
                                                    otp,
                                                );
                                                if (res.data.success) {
                                                    toast.success("OTP Verified");
                                                    setOtpVerified(true);
                                                } else {
                                                    toast.error("Invalid OTP");
                                                }
                                            } catch (error) {
                                                toast.error("Error verifying OTP");
                                            }
                                        }}
                                    >
                                        Verify OTP
                                    </button>
                                </div>
                            </div>


                            {/* <div className="mb-3">
                                <label htmlFor="contact number" className="form-label">Contact Number</label>
                                <input type="number"  name="contactNumber" id="contactNumber" className="form-control" placeholder="Contact Number Here."/>
                            </div> */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    id="passwd"
                                    name="passwd"
                                    className="form-control"
                                    placeholder="Password Here."
                                    // autoComplete="current-password" 
                                    value={userDetails.password}
                                    onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-warning w-100" disabled={loading}>{loading ? "Loading..." : "Save"}</button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserForm;