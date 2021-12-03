import React from 'react'
import { Link } from 'react-router-dom'
import "../NavBar/Navbar.css"

const Navbar = () => {
    return (
        <div clas="navbar">
    <ul className="nl">
      <li className="nli">
        <Link to= "/search"> <a href="">Search</a> </Link>
      </li>

      <li className="nli">
      <Link to= "/login"> <a href="">Login</a> </Link>
      </li>

      <li className="nli">
      <Link to= "/signup"> <a href="">Signup</a> </Link>
      </li>

      <li className="nli">
        <a href="https://phishermanextension.s3.us-west-1.amazonaws.com/phisherman-extension.zip">Extention</a>
      </li>

    </ul> </div>
    )
}

export default Navbar
