import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "../components/Search/Search"
import Login from "../components/Login/login"
import Signup from "../components/Signup/signup"
import Navbar from "../components/NavBar/Navbar";

const RouterRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				
				<Route path="/" element={<Login />} />
				<Route path="/search" element={<Search />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
			</Routes>
		</BrowserRouter>
	);
};

export default RouterRoutes;