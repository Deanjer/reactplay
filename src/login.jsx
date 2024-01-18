import './login.css';

import { Link } from "react-router-dom";

// export default function Homepage(){
//     return (
//         <div className="homrpage">
//            <Link to="login"><button>Login</button></Link>
//         </div>
//     );
// }

export default function Login() {
    return (
        <>
            <div className="container_fluid">
                <div className='header'>
                    <div className="logo">
                        <h1><span className="logo-1">React</span>
                            <span className="logo-2">Play</span></h1>
                    </div>
                </div>
            </div>
            <div className="container">

                <div className="login">

                    <div className='loginForm'>
                        <div>
                            <h1>Log in to <span className="logo-1">React</span>
                                <span className="logo-2">Play</span></h1>
                            <hr></hr>
                        </div>
                        <form>
                            <div className='accountLogin'>
                                <label>Email:</label><br></br>
                                <input type='email' placeholder='Email'></input><br></br>
                                <label>Password:</label><br></br>
                                <input type='password' placeholder='Password'></input><br></br>
                                <button type='submit'>Log in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}