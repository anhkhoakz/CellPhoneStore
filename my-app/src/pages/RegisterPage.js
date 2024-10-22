import { Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import googleLogo from "../assets/image/google-logo.png";

const RegisterPage = () => {

    return (
        <div className="login-page">
            <h2>Register</h2>
            <button className="google-login" >
                <img
                    src={googleLogo}
                    alt="Google Logo"
                    className="google-logo"
                />
                Google
            </button>
            <div className="divider">or</div>
            <RegisterForm />
            <div className="register-link">
                <p>
                    Already have an account?{" "}
                    <Link to="/login">Sign in now</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
