import "./homepage.css";

export default function HomePage() {
  return (
    <div className="main-container">
      <div className="left-container">
        <div className="logo">
          <h1>
            <span className="logo-1">React</span>
            <span className="logo-2">Play</span>
          </h1>
        </div>
      </div>
      <div className="center-container">
        <div className="center-top">
          <div className="center-top-left">
            <input className="search" type="text" placeholder="Search" />
          </div>
          <div className="center-top-right">
            <ul>
              <li>Acount</li>
            </ul>
          </div>
        </div>
        {/* <hr className='center-top-underline'/> */}
      </div>
      <div className="right-container"></div>
    </div>
  );
}
