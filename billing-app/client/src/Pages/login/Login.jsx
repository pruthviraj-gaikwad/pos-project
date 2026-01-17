import { toast } from "react-hot-toast";
import "./Login.css"
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { loginService, addUser } from "../../service/AuthService"; // ✅ ADD "addUser" TO THIS IMPORT
import { sendOtpToMailService, verifyOtpToMailService } from "../../service/emailOtpService";

const Login = () => {
    const { setAuthData, setUsers } = useContext(AppContext); // Assuming setUsers comes from context
    const [loading, setLoading] = useState(false)
    const [showPopUp, setShowPopUp] = useState(false);
    const [verifyDisable,setVerifyDisabled] =useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await loginService(data);
            console.log("Response:", response);
            console.log("Data:", response.data);

            if (response.status === 200) {
                setLoading(false);
                toast.success("Login Successful");
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                setAuthData(response.data.token, response.data.role);
                navigate("/");
            } else {
                toast.error("Failed to Login");
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Password/Login incorrect", {
                duration: 600,
            });
            setLoading(false);
        }
    };

    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [emailDisabled, setEmailDisabled] = useState(false);
    const [otpSenderDisable,setOtpSenderDisable] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: "ROLE_USER"
    });

    const onRegisterUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!userDetails.name || !userDetails.email || !userDetails.password) {
                toast.error("Please fill in all required fields.");
                setLoading(false);
                return;
            }
            if (!otpVerified) {
                toast.error("Please verify OTP before submitting.");
                setLoading(false);
                return;
            }

            console.log("Registering user:", userDetails);

            // ⭐ THIS IS THE ONLY LINE THAT NEEDED TO BE FIXED ⭐
            const response = await addUser(userDetails); // Use the imported addUser function

            if (response.status === 201) { // 201 Created is the typical success status for POST
                toast.success("User Added Successfully", {
                    duration: 700,
                });
                setShowPopUp(false); // Close the popup on success
                setLoading(false);
                setUserDetails({ // Clear the form
                    name: "",
                    email: "",
                    password: "",
                    phoneNumber: "",
                    role: "ROLE_USER"
                });
                // Note: The line below might cause an error if `setUsers` is not defined
                // If you have a user list, you can update it like this:
                // setUsers((prevUsers) => [...prevUsers, response.data]);
            }
        } catch (error) {
            console.error("Registration failed:", error);
            toast.error("Error Adding user", {
                duration: 700,
            });
            setLoading(false);
        }
    }

    // The rest of your JSX remains exactly the same...
    return (
        <div className="bg-ligh d-flex align-items-center justify-content-center login-background vh-100">
            <div className="card shadow-lg w-100" style={{ maxWidth: '480px' }}>
                <div className="card-body">
                    <div className="text-center">
                        <h1 className="card-title">Sign in</h1>
                        <p className="card-text text-muted">
                            Sign in below to access your account
                        </p>
                    </div>
                    <div className="mt-4">
                        <form action="" onSubmit={onSubmitHandler}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label text-muted">Email Address</label>
                                <input type="email" id="email" name="email" placeholder="yourname@example.com" className="form-control" onChange={(e) => setData({ ...data, email: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="current-password" className="form-label text-muted">Current Password</label>
                                <input type="password" id="password" placeholder="*********" className="form-control" onChange={(e) => setData({ ...data, password: e.target.value })} />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-dark btn-lg" disabled={loading}>{loading ? "Loading.." : "Sign in"}</button>
                            </div>
                            <div className="d-grid ">
                                <small onClick={() => setShowPopUp(true)} className="text-center my-4" style={{ cursor: 'pointer', color: 'blue' }}>Register user</small>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {showPopUp && (
                <div className="overlay">
                    <div className="card popup-card">
                        <div className="card-body">
                            <i
                                className="bi bi-x "
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    fontSize: "1.5rem",
                                    cursor: "pointer",
                                    color: "#dc3545"
                                }}
                                onClick={() => {
                                    setShowPopUp(false)
                                    setLoading(false)
                                }}
                            ></i>
                            <form onSubmit={onRegisterUser}>
                                {/* ... all your input fields for registration ... */}
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" name="name" id="name" className="form-control" placeholder="ganesh mane..." value={userDetails.name} onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                    <input type="tel" id="phoneNumber" name="phoneNumber" className="form-control" placeholder="Enter 10-digit number" value={userDetails.phoneNumber || ""} onChange={(e) => setUserDetails({ ...userDetails, phoneNumber: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Id</label>
                                    <input type="email" autoComplete="email" name="email" id="email" className="form-control" placeholder="Email id Here." value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} disabled={emailDisabled} />
                                </div>
                                <div className="mb-3">
                                    <button type="button" className="btn btn-outline-primary mb-2" onClick={async () => {
                                        try {
                                            setEmailDisabled(true);
                                            setOtpSenderDisable(true);
                                            const res = await sendOtpToMailService(userDetails.email)
                                            toast.success(res.data);                                            
                                        } catch (error) {
                                            setEmailDisabled(false);
                                            setOtpSenderDisable(false);
                                            toast.error("Failed to send OTP");
                                            console.log(error);
                                        }
                                    }} disabled={otpSenderDisable}>Send OTP</button>
                                    <div className="d-flex gap-2">
                                        <input type="text" placeholder="Enter OTP" className="form-control" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={verifyDisable}/>
                                        <button type="button" className="btn btn-outline-success" disabled={verifyDisable} onClick={async () => {
                                            try {
                                                setVerifyDisabled(true);
                                                const res = await verifyOtpToMailService(userDetails.email, otp);
                                                if (res.data === "OTP Verified ✅") {
                                                    toast.success("OTP Verified");
                                                    setOtpVerified(true);
                                                    setEmailDisabled(true); 
                                                } else {
                                                    setVerifyDisabled(false);
                                                    toast.error("Invalid OTP");
                                                }
                                            } catch (error) {
                                                setEmailDisabled(false);
                                                setVerifyDisabled(false);
                                                setOtpSenderDisable(false);
                                                toast.error("Error verifying OTP");
                                            }
                                        }}>Verify OTP</button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" id="passwd" name="passwd" className="form-control" placeholder="Password Here." value={userDetails.password} onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })} />
                                </div>
                                <button type="submit" className="btn btn-warning w-100" disabled={loading}>{loading ? "Loading..." : "Save"}</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;