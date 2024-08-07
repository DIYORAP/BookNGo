import React, { useState } from 'react'
import OAuth from '../components/OAuth';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData,setFromData]=useState({});
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false);
  const navigate =useNavigate();

    const handleChange =(e)=>{
      setFromData({
        ...formData,
        [e.target.id]:e.target.value,
      });
    };

    const handleSubmit=async(e)=>{
      e.preventDefault();
      try {
        setLoading(true);
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          setLoading(false);
          setError(data.message);
          return;
        }
        setLoading(false);
        setError(null);
        navigate('/sign-in'); 
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    }

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className='text-3xl text-left font-semibold my-7'>Create an account</h1>
      <form className="gap-4 flex-col flex" onSubmit={handleSubmit} >
      <input
          type='text'
          placeholder='username'
          className='border p-2 rounded-lg '
          id='username'
           onChange={handleChange}
        />
          <input 
          type='email'
          placeholder='email'
          className='border p-2 rounded-lg'
          id='email'
           onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-2 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button className="bg-blue-700 text-white p-2 mt-3 rounded-md hover:opacity-95 disabled:opacity-80"> Continu</button>
        <OAuth/>
      </form>

    <div className='flex gap-2 mt-5'>
      <p>Have an account?</p>
    <Link to={'/sign-in'}>
    
    <span className='text-blue-700'> Sign in</span></Link>
    </div>
    </div>
  )
}
