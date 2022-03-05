import React, {useEffect} from 'react';
import './App.css';
import HomeScreen from "./screens/HomeScreen";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import {auth} from "./firebase";

function App() {
  const user = null

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      if (userAuth) {
        //  Logged in
        console.log(userAuth)
      } else {
        //  Logged out
      }
    });

    return unsubscribe;
  }, [])

  return (
    <div className="app">
      <Router>
        {!user ? (
          <LoginScreen />
        ) : (
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            {/*<Route path="/text" element={<h1>whats up</h1>} />*/}
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
