import React from 'react'
import { LeftSideBar } from '../../components/LeftSideBar/LeftSideBar'
import { RightSideBar } from '../../components/RightSideBar/RightSideBar'
import {useSelector} from 'react-redux'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Tweet } from '../../components/Tweet/Tweet'
import { EditProfile } from '../../components/EditProfile/EditProfile'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { following } from '../../redux/userSlice'

export const Profile = () => {
  const {currentUser} = useSelector((state) => state.user)
  const [userTweets, setUserTweets] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [open, setOpen] = useState(false);
  const {id} = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try{
        const userTweets = await axios.get(`/tweets/user/all/${id}`)
        const userProfile = await axios.get(`/users/find/${id}`)

        setUserTweets(userTweets.data)
        setUserProfile(userProfile.data);
      }catch(err){
        console.log(err)
      }
    }
    fetchData();
  }, [currentUser, id])

  const handleFollow = async () => {
    if(!currentUser.following.includes(id)) {
      try{
        const follow = await axios.get(`/users/follow/${id}`, {
          id: currentUser._id
        });
        dispatch(following(id))
      }catch(error){
        console.log(error);
      }
    }else{
      try{
        const unfollow = await axios.put(`/users/unfollow/${id}`, {
          id: currentUser._id
        })
        dispatch(following(id))
      }catch(error){
        console.log(error);
      }
    }
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="px-6">
          <LeftSideBar />
        </div>
        <div className="col-span-2 border-x-2 border-t-slate-800 px-6">
          <div className="flex justify-between items-center">
            <img
              src={userProfile?.profilePicture}
              className="w-20 h-20 rounded-full"
              alt="profile picture"
            />
            {currentUser._id === id ? (
              <button
                className="px-4 y-2 bg-blue-500 rounded-full text-white"
                onClick={() => setOpen(true)}
              >
                Edit Profile
              </button>
            ) : currentUser.following.includes(id) ? (
              <button
                className="px-4 y-2 bg-blue-500 rounded-full text-white"
                onClick={handleFollow}
              >
                Following
              </button>
            ) : (
              <button
                className="px-4 y-2 bg-blue-500 rounded-full text-white"
                onClick={handleFollow}
              >
                Follow
              </button>
            )}
          </div>
          <div className="mt-6">
            {userTweets &&
              userTweets.map((tweet) => {
                return (
                  <div className="p-2" key={tweet._id}>
                    <Tweet tweet={tweet} setData={setUserTweets} />
                  </div>
                );
              })}
          </div>
        </div>
        <div className="px-6">
          <RightSideBar />
        </div>
      </div>
      {open && <EditProfile setOpen={setOpen} />}
    </>
  );
}
