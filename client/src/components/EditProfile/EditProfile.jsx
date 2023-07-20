import React from 'react'
import { useState } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from '../../firebase';
import { useEffect } from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeProfile, logout } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';

export const EditProfile = ({setOpen}) => {
    const [img, setImg] = useState(null);
    const [imgUploadProgress, setImgUploadProcess] = useState(0);
    const {currentUser} = useSelector((state) => state.user)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const uploadImg = (file) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImgUploadProcess(Math.round(progress))
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                break;
              case "storage/canceled":
                // User canceled the upload
                break;

              // ...

              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                break;
              default:
                break;
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
              console.log("File available at", downloadURL);
              try{
                const updateProfile = await axios.put(`/users/${currentUser._id}`, {
                    profilePicture: downloadURL,
                })
              }catch(error){
                console.log(error)
              }
              dispatch(changeProfile(downloadURL))
            });
          }
        );
    }

    useEffect(() => {
      img && uploadImg(img)
    }, [img])

    const handleDelete = async () => {
        const deleteProfile = await axios.delete(`/users/${currentUser._id}`);
        dispatch(logout());
        navigate('/signin')
    }
    

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-transparent flex items-center justify-center">
      <div className="w-[600px] h-[600px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4 relative">
        <button
          className="absolute top-3 right-3 cursor-pointer"
          onClick={() => setOpen(false)}
        >
          X
        </button>
        <h2 className="font-bold text-xl"> Edit Profile</h2>
        <p>Choose a new profile picture</p>
        {imgUploadProgress > 0 ? (
          "Uploading " + imgUploadProgress + "%"
        ) : (
          <input
            type="file"
            className="bg-transparent border border-slate-500 rounded p-2"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          ></input>
        )}
        <p>Delete Account</p>
        <button className="bg-red-500 text-white py-2 rounded-full" onClick={handleDelete}>
          Delete account
        </button>
      </div>
    </div>
  );
}
