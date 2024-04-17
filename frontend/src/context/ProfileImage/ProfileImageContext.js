import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import { getBackendUrl } from "../../config";

const ProfileImageContext = createContext();

const ProfileImageProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  const { user: loggedInUser } = useContext(AuthContext)

  useEffect(() => {
    setUser(loggedInUser);
  }, [loggedInUser]);

  useEffect(() => {
    if (user) {
      setProfileImage(user.profileImage ? `${getBackendUrl()}/public/${user.profileImage}` : null);      
    }
  }, [user]);

  const updateProfileImage = (newProfileImage) => {
    setProfileImage(newProfileImage);
  };

  return (
    <ProfileImageContext.Provider
      value={{ user, profileImage, updateProfileImage }}
    >
      {children}
    </ProfileImageContext.Provider>
  );
};

export { ProfileImageContext, ProfileImageProvider };
