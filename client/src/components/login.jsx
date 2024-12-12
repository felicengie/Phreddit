import TopBanner from "./topBanner"
import { useState } from "react"
import { fetchUserByEmail } from "./api"
import {UsePhredditContext } from "./phredditContext"

const LoginPage = () => {
    const {setUser, loadPage} = UsePhredditContext();
    const bcryptjs = require("bcryptjs")
    const [userEmail, setUserEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the form from refreshing the page
        setErrorMessage(''); // Reset any previous error messages
    
        if (!userEmail || !password) {
          setErrorMessage('Both fields are required!');
          return;
        }

        try {
            // Fetch user data by email
            const fetchedUser = await fetchUserByEmail(userEmail);
      
            if (!fetchedUser) {
              setErrorMessage("User not found!");
              return;
            }
      
            // Compare the entered password with the stored hashed password
            const isPasswordValid = await bcryptjs.compare(password, fetchedUser.password);
      
            if (!isPasswordValid) {
              setErrorMessage("Invalid email or password!");
              return;
            }
      
            // If successful, set the user state and clear the form
            setUser(fetchedUser);
            setUserEmail("");
            setPassword("");
            setErrorMessage("");
            console.log("Login successful:", fetchedUser);
            loadPage("home")
      
            // Redirect or perform additional actions on successful login
          } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage("An error occurred during login. Please try again.");
          }
    }

    const onSignUp = () =>{
        loadPage("signup")
    }

    return (
        <>
        <TopBanner></TopBanner>
        <div className = "page-container">
        <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="login-form">
            
            <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
            />

            <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit">Login</button>
        </form>

        <div className="signup-link">
            <p>Don't have an account?</p>
            <a className="signup-button" onClick={onSignUp}>Sign Up</a>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
        </div>
        </>
    )
}

export default LoginPage;