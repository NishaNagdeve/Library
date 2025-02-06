import React, { useState } from 'react'
import library from '../Images/library.jpg'
import '../Styles/Login.css';
import book from '../Images/book.webp';
import axios from 'axios';
import { redirect, useNavigate } from 'react-router-dom';


export default function Login() {
   
   const[name,setName]=useState('');
   const[id,setId]=useState('');
   const [flag,setFlag]=useState(0);
    
   const api="https://library-1-a4gx.onrender.com";
  const handleInput=(e)=>
    {
        const{name,value}=e.target;
        if(name==="name")
        {
           setName(e.target.value);
           console.log(e.target.value);

        }
        if(name==="id")
        {
          setId(e.target.value);
          console.log(e.target.value);
        }
        
    }
    const navigate=useNavigate();
    const handleLogin=async()=>
    {
        const loginData={name,password: id };
        console.log(typeof(id));
        try
        {
          console.log("hello");
          console.log(loginData);
          const res=await axios.post(`${api}/login`,loginData);
          navigate('/home');
          console.log("bye");
        if (res.status===200) {
          alert("Login successful");
          navigate("/home");
        } else {
          console.log('Login failed');
        }
      }
      catch (error) {
        if (error.response && error.response.status === 401) {
          alert('Invalid credentials. Please try again.');
        } else {
          console.error('Unexpected error:', error);
          alert('An unexpected error occurred.');
        }
      } 
    }
  return (
    <>
    <div className='main'>
       <img src={library} className='lib'></img>
        <div className='input'>
          <img src={book} className='book'></img>
          <h1 className='text'>LIBRARY<br></br> MANAGEMENT SYSTEM</h1>
          <label>Username:</label><input type='text' name='name' onChange={(e)=>handleInput(e)}></input><br></br><br></br>
          <label>Password:</label><input type='text' name='id' onChange={(e)=>handleInput(e)}></input><br></br><br></br>
         <button className='btn' onClick={handleLogin}>Login</button>
        </div>
       </div>
    </>
  )
}
