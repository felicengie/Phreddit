import TopBanner from "./topBanner"
import {UsePhredditContext } from "./phredditContext"


const WelcomePage = () => {
    const {loadPage} = UsePhredditContext();

    const handleClick = async (e) => {
        loadPage(e)
    }

    return (
        <>
        <TopBanner></TopBanner>
        <div className = "page-container">
        <div className="login-container">
        <h1>Welcome!</h1>
        
        <button className = "welcome-button" onClick = {() => handleClick("home")}>Browse as Guest</button>
        <button className = "welcome-button" onClick = {() => handleClick("login")}>Login</button>
        <button className = "welcome-button" onClick = {() => handleClick("signup")}>Create Account</button>
        </div>
        </div>
        </>
    )
}

export default WelcomePage;