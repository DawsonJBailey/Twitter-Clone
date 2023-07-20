import React from 'react'
import logo from '../../public/twitter-logo.png'
import SearchIcon from '@mui/icons-material/Search'
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {useSelector} from 'react-redux'

export const Navbar = () => {
    const {currentUser} = useSelector((state) => state.user)
    const [header, setHeader] = useState('Home');
    const location = useLocation().pathname;

    
    useEffect(() => {
      if (location.includes("profile")) {
        setHeader(`${currentUser.username}`);
        return;
      }
      if (location.includes("explore")) {
        setHeader("Explore");
      }
      else {
        setHeader("Home");
      }
    }, [location])
    
  return (
    <div className="grid grid-col-1 md:grid-cols-4 my-5 justify-center">
      <div className="mx-auto md:mx-0">
        <img src={logo} alt="twitter logo" width={"40px"} className="ml-8"></img>
      </div>
      <div className="col-span-2 md:border-x-2 md:border-slate-22 md:px-6 my-6 md:my-0">
        <div className="flex justify-between items-center">
            <h2 className='font-bold text-2xl'>{header}</h2>
            <StarBorderPurple500Icon />
        </div>
      </div>
      <div className="px-0 md:px-6 mx-auto">
        <SearchIcon className="absolute m-2"/>
        <input type="text" className="bg-blue-100 rounded-full py-2 px-8"></input>
      </div>
    </div>
  );
}
