import { Link } from "react-router-dom";

export default function Homepage(){
    return (
        <div className="homrpage">
           <Link to="login"><button>Login</button></Link>
        </div>
    );
}