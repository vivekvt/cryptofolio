import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../config/firebase";
import { addAuth, deleteAuth } from "../redux/store";

export const useGetUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        dispatch(
          addAuth({
            email: auth?.currentUser?.email,
            uid: auth?.currentUser?.uid,
          })
        );
      } else {
        // User is signed out.
        dispatch(deleteAuth());
      }
    });
  }, []);
};
