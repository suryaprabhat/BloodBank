import { Link } from "react-router-dom";
import "../registerPage/register.scss";

const LoginChoice: React.FC = () => {
    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Choose Login</h2>
                <div className="choice-buttons">
                    <Link to="/login/donor">
                        <button type="button" className="choice-btn">Login as Donor</button>
                    </Link>
                    <Link to="/hospital/login">
                        <button type="button" className="choice-btn">Login as Hospital</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginChoice; 