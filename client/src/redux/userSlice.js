import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    isLoading: false,
    error: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.currentUser = action.payload;
        },
        loginFailed: (state) => {
            state.isLoading = false;
            state.error = true;
        },
        logout: (state) => {
            return initialState;
        },
        changeProfile: (state, action) => {
            state.currentUser.profilePicture = action.payload;
        },
        following: (state, action) => {
            // If already following then unfollow
            if(state.currentUser.following.includes(action.payload)){
                state.currentUser.following.splice(state.currentUser.following.findIndex((followingId) => followingId === action.payload))
            }
            // If not already following then follow
            else{
                state.currentUser.following.push(action.payload);
            }
        }
    }
})

export const {
    loginStart,
    loginSuccess,
    loginFailed,
    logout,
    changeProfile,
    following
} = userSlice.actions;

export default userSlice.reducer;