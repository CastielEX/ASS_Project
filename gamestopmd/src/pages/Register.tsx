import { useForm, SubmitHandler } from "react-hook-form";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from 'axios';


type Inputs = {
  username: string | number,
  password: string | number,
  email: string | number
};

type User = {
  username: string | number;
  email: string | number;
};

const Register = () => {
  const { register, handleSubmit, formState: { errors }} = useForm({
    defaultValues: {
      username: "",
      password: "",
      email: ""
    }
  });

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });


  const [existingUsers, setExistingUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchExistingUsers();
  }, []);

  const fetchExistingUsers = () => {
    axios.get("http://localhost:4000/users")
      .then((response) => {
        setExistingUsers(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch existing users:', error);
      });
  };

  const onSubmit: SubmitHandler<Inputs> = async data => {

    const isUsernameTaken = existingUsers.some(user => user.username === data.username);
    const isEmailTaken = existingUsers.some(user => user.email === data.email);

    if (isUsernameTaken) {
      console.error('Username is already taken');
      return;
    }

    if (isEmailTaken) {
      console.error('Email is already registered');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/users', data);
      console.log('User registered successfully:', response.data);
      setFormData({
        username: "",
        password: "",
        email: ""
      });
      fetchExistingUsers();
    } catch (error) {
      console.error('Registration failed:', error);
    }


  
    
  };
    return (
      <form className="registerForm" onSubmit={handleSubmit(onSubmit)}>

      <label className="registerLabel">Username</label>
      <input className="registerInput" {...register("username", { required: true, minLength: 5 ,maxLength: 20, pattern: /^[A-Za-z0-9]+$/i }) } 
      placeholder="Enter your username"
      value={formData.username}
      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      {errors?.username && <p className="errorMessage">This field is required</p>} 
      {/* {errors?.username?.type === "pattern" && <p className="errorMessage">Please don't use special symbols</p>} */}
      <label className="registerLabel">Email</label>
      <input className="registerInput"
        {...register("email", { required: true, minLength: 5 ,maxLength: 20, pattern: /^[A-Za-z0-9@.]+$/i })}
        placeholder="Enter your email"
        value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      {errors?.email && <p className="errorMessage">This field is required</p>}
      <label className="registerLabel">Password</label>
      <input className="registerInput"
        {...register("password", { required: true, minLength: 5 ,maxLength: 20, pattern: /^[A-Za-z0-9]+$/i })}
        placeholder="Enter your password"
        value={formData.password}
        type="password"
      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {errors?.password && <p className="errorMessage">This field is required</p>}
      <button className="registerInput submitBtn" type="submit">SUBMIT</button>
    </form>
  
    );
  };

  
export default Register;
