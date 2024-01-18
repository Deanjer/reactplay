import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Login from './Login';
import './App.css';
import HomePage from './homepage'

function App() {

  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
