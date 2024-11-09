import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import unknown_user from "../img/unknown_user.jpg";

type DecodedToken = {
  email: string;
  role: "admin" | "user";
};

const Account = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loginTime, setLoginTime] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setUser(decodedToken);

      // Get the login time from localStorage if available
      const savedLoginTime = localStorage.getItem('loginTime');
      if (savedLoginTime) {
        setLoginTime(savedLoginTime);
      } else {
        // Set the current time if no login time is found
        const currentTime = new Date().toLocaleString();
        setLoginTime(currentTime);
        localStorage.setItem('loginTime', currentTime); // Store the login time
      }
    }
  }, []);

  return (
    <div className="accountContainer">
      {user ? (
        <div className="mainContainer">
          <img className="unknown_user" src={unknown_user} alt="logo" />
          <h1>Welcome, {user.email}!</h1>
          <p>Your role: {user.role}</p>
          <p>Logged in at: {loginTime}</p>
        </div>
      ) : (
        <h1>Please log in to access your account.</h1>
      )}
    </div>
  );
};

export default Account;
