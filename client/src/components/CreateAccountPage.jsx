import TopBanner from "./topBanner"
import { useState } from "react"
import { fetchUserByEmail } from "./api"
import {UsePhredditContext } from "./phredditContext"
import { createUser } from "./api"
const bcryptjs = require('bcryptjs')

const SignUpPage = () => {
    const {setUser, loadPage, users} = UsePhredditContext();
    const bcryptjs = require("bcryptjs")

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [password, setPassword] = useState("")
    const [passwordCheck, setPasswordCheck] = useState("")
    const [errorMessage, setErrorMessage] = useState("")


    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent the form from refreshing the page
        setErrorMessage(''); // Reset any previous error messages
    
        if (!email || !password || !displayName || !passwordCheck) {
          setErrorMessage('All fields are required!');
          return;
        }

        if(password != passwordCheck){
            setErrorMessage('Passwords Do Not Match')
            return;
        }

        // Check if email already exists
        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            setErrorMessage('Email already in use');
            return;
        }

        // Check if displayName already exists
        const displayNameExists = users.some(user => user.displayName === displayName);
        if (displayNameExists) {
            setErrorMessage('Display Name already in use');
            return;
        }

         // Password validation: should not contain first name, last name, display name, or email
         const passwordContainsInfo = [firstName, lastName, displayName, email].some(info => password.toLowerCase().includes(info.toLowerCase()));
         if (passwordContainsInfo) {
             setErrorMessage('Password should not contain your first name, last name, display name, or email.');
             return;
         }

        try {
            // Create the user object
            const hashedPassword = await bcryptjs.hash(password, 10); // Hash the password
            const newUser = {
                email,
                displayName,
                password: hashedPassword,
                firstName,
                lastName
            };
    
            // Call the createUser function to save the user
            const response = await createUser(newUser);
    
            if (response) {
                console.log('User created successfully:', response);
                setUser(response.data)
                loadPage('welcome')
                // Redirect to login or home page after successful signup
            }

        } catch (error) {
            console.error('Error creating user:', error);
            setErrorMessage('Error creating user. Please try again.');
        }

    }

    return (
        <>
        <TopBanner></TopBanner>
        <div className = "page-container">
        <div className="login-container">
        <h1>Create Account</h1>
        <form onSubmit={handleSignUp} className="login-form">
            

            <input
                id="firsrtName"
                name="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />

        <   input
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
            
            <input
                id="displayName"
                name="display"
                placeholder="Enter a Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
            />

            <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <input
                type="password"
                id="password2"
                name="password2"
                placeholder="Confirm Password"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                required
            />
            
            
            <button type="submit">Sign Up</button>
        </form>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
        </div>
        </>
    )
}

export default SignUpPage;