import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializableUser } from "../types/SerializableUser";

interface UserState {
  email: string | null;
  subscription: string | null;
  isGoogleLoggedIn: boolean;
  isGuestLoggedIn: boolean;
  userExists: boolean;
  user: SerializableUser | null;
}

const initialState: UserState = {
  email: null,
  subscription: null,
  isGoogleLoggedIn: false, // new state for Google login
  isGuestLoggedIn: false, // new state for Guest login
  userExists: false,
  user: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      setUser: (state, action: PayloadAction<SerializableUser>) => {
        state.user = action.payload; // Update the user state with the SerializableUser payload
        state.email = action.payload.email; // Update email from the SerializableUser payload
        state.subscription = action.payload.subscription; // Update subscription from the SerializableUser payload
      },
      signOutUser: (state) => {
        state.email = null;
        state.subscription = null;
        state.isGoogleLoggedIn = false; // reset Google login state
        state.isGuestLoggedIn = false; // reset Guest login state
        state.user = null;
      },
      googleUser: (state, action: PayloadAction<SerializableUser>) => {
        state.isGoogleLoggedIn = true;
        state.isGuestLoggedIn = false;
        state.user = action.payload; // Update the user state with the SerializableUser payload
        state.subscription = action.payload.subscription; // Update subscription from the SerializableUser payload
      },
      guestUser: (state, action: PayloadAction<SerializableUser>) => {
        state.isGuestLoggedIn = true;
        state.isGoogleLoggedIn = false;
        state.user = action.payload; // Update the user state with the SerializableUser payload
        state.subscription = action.payload.subscription; // Update subscription from the SerializableUser payload
      },
    },
  });
  
  export const { setUser, signOutUser, googleUser, guestUser } =
    userSlice.actions;
  
  export default userSlice.reducer;