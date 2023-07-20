import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {loginStart, loginSuccess,loginFailed} from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';

export const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try{
            const res = await axios.post('/auth/signin', {username, password})
            dispatch(loginSuccess(res.data));
            navigate('/');
        }catch(err){
            dispatch(loginFailed())
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        dispatch(loginStart())
        try{
            const res = await axios.post('/auth/signup', {username, email, password});
            dispatch(loginSuccess(res.data))
            navigate('/');
        }catch(err){
            dispatch(loginFailed());
        }
    }

  return (
    <form className="bg-gray-200 flex flex-col py-12 px-8 rounded-lg w-8/12 md:w-6/12 mx-auto gap-10">
      <h2 className="text-3xl font-bold text-center">Sign in to Twitter</h2>
      <input
        type="text"
        placeholder="username"
        className="text-xl py-2 rounded-full px-4"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        className="text-xl py-2 rounded-full px-4"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="text-xl py-2 rounded-full px-4 bg-blue-500 text-white"
        onClick={handleLogin}
      >
        Sign in
      </button>
      <p className="text-center text-xl">Don't have an account?</p>
      <input
        type="text"
        placeholder="username"
        className="text-xl py-2 rounded-full px-4"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="email"
        required
        className="text-xl py-2 rounded-full px-4"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        className="text-xl py-2 rounded-full px-4"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="text-xl py-2 rounded-full px-4 bg-blue-500 text-white"
        type="submit"
        onClick={handleSignUp}
      >
        Sign up
      </button>
    </form>
  );
}
