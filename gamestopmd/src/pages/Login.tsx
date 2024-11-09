import { useForm, SubmitHandler } from "react-hook-form";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

type Inputs = {
  email: string | number,
  password: string | number,
};

type User = {
  username: string | number;
  email: string | number;
};

type DecodedToken = {
  email: string;
  role: "admin" | "user";
};

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const [loginError, setLoginError] = useState("");
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [existingUsers, setExistingUsers] = useState<User[]>([]);
  const navigate = useNavigate(); // Define navigate using useNavigate

  useEffect(() => {
    fetchExistingUsers();
  }, []);

  const fetchExistingUsers = () => {
    axios.get("http://localhost:3001/users")
      .then((response) => {
        setExistingUsers(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch existing users:', error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token) as DecodedToken;
      setUser(decodedToken);
    }
  }, []);


  // console.log("users", existingUsers)

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // Make a POST request to your server for login
      const response = await axios.post('http://localhost:4000/login', data);
      const { token } = response.data;
       // Store the token in local storage
    localStorage.setItem('token', token);
    console.log(token)

    // Decode the token to get user information if needed
    
    const decodedToken = jwtDecode<DecodedToken>(token);
    console.log("Decoded token:", decodedToken);

      // If login is successful, store user information in state
      // setUser(response.data.user);

      setUser(decodedToken);
      navigate("/Account"); 
      window.location.reload();
      console.log("login succes", response.data)

      // Reset the form after successful login
      // resetForm();
      
      // Clear any previous login error messages
      setLoginError("");
    } catch (error) {
      console.error('Login failed:', error);

      // Handle login failure by displaying an error message
      setLoginError("Invalid email or password");
    }
  };

  function logoutUser() {
    setUser(null)
    localStorage.removeItem('token');
  }

  return (
    <div>
      {!user && (
        <div>
          <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
      <label className="loginLabel">Email</label>
      <input
        className="loginInput"
        {...register("email", { required: true, minLength: 5, maxLength: 20, pattern: /^[A-Za-z0-9@.]+$/i })}
        placeholder="Enter your email"
      />
      {errors?.email && <p className="errorMessage">This field is required</p>}
      {/* {errors?.username?.type === "pattern" && <p className="errorMessage">Please don't use special symbols</p>} */}
      
      <label className="loginLabel">Password</label>
      <input
        className="loginInput"
        type="password"
        {...register("password", { required: true, minLength: 5, maxLength: 20 })}
        placeholder="Enter your password"
      />
      {errors?.password && <p className="errorMessage">This field is required</p>}
      
      <button className="loginInput submitBtn" type="submit">LOGIN</button>
    </form>
    <div className="erroMessageCentered">{loginError && <p className="errorMessage">{loginError}</p>}</div>
        </div>
      )}
    
    {user && (
        <div className="loginForm">
          <p className="loginLabel">Welcome, {user.email}!</p>
          <button className="loginInput submitBtn" onClick={() => logoutUser()}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Login;
