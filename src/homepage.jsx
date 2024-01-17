import './homepage.css'

export default function HomePage(){
    return(
        <div className="main-container">
            <div className="left-container">
                
            </div>
            <div className="center-container">
                <div className="center-top">
                    <div className="center-top-left">
                        <input className='search' type="text"  placeholder='Search'/>
                    </div>
                    <div className="center-top-right">
                        <ul>
                            <li>Acount</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="right-container">

            </div>

        </div>
    );
}