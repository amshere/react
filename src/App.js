import { useEffect, useState } from 'react';

import './App.css';
import { Helmet } from 'react-helmet'
import 'bootstrap/dist/css/bootstrap.min.css';
import Quotes from './Components/Quotes';
import User from './Components/User';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Header from './Components/Header';
import LogIn from './Components/Login';
import Signup from './Components/Signup';
import Dashboard from './Components/Dashboard';
import Logout from './Components/Logout';

function App() {

  const [loggedUser, setloggeduser] = useState(window.localStorage.getItem('username'))

  console.log(loggedUser)

  return (
    <Router>
    <div className="App">
      <Helmet>
        <title>PublishQuotes</title>
      </Helmet>

      <Header loggedUser={loggedUser} />

      <main>

      <Routes>
          <Route path="/" element={<Quotes />} />
          <Route path="/user/:user" element={<User loggedUser={loggedUser} />} />
          <Route path="/login" element={loggedUser ? <Navigate to="/dashboard" /> : <LogIn />} />
          <Route path="/signup" element={loggedUser ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/dashboard" element={!loggedUser ? <Navigate to="/login" /> : <Dashboard loggedUser={loggedUser} />} />
          <Route path="/logout" element={<Logout />} />
      </Routes>
        
      </main>
    </div>
    </Router>
  );
}

export default App;
