import React from 'react'
import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Tweet } from '../Tweet/Tweet'

export const TimelineTweet = () => {
    const [timeline, setTimeline] = useState(null);
    const {currentUser} = useSelector((state) => state.user)
    useEffect(() => {
      const fetchData = async () => {
        try{
            const timelineTweets = await axios.get(`/tweets/timeline/${currentUser._id}`);
            setTimeline(timelineTweets.data);
        }catch(err){
            console.log('error', err);
        }
      }
      fetchData();
    }, [currentUser._id])
    
console.log(timeline);
  return (
    <div className='mt-6'>{timeline && timeline.map((tweet) => {
        return(
            <div key={tweet._id} className='p-2'>
                <Tweet tweet={tweet} setData={setTimeline} />
            </div>
        )
    })}</div>
  )
}
