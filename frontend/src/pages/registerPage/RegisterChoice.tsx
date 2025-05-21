import { Link } from "react-router-dom";
import "./register.scss";

const RegisterChoice: React.FC = () => {
    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Choose Registration</h2>
                <div className="choice-buttons">
                    <Link to="/register/donor">
                        <button type="button" className="choice-btn">Register as Donor</button>
                    </Link>
                    <Link to="/hospital/register">
                        <button type="button" className="choice-btn">Register as Hospital</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterChoice; 