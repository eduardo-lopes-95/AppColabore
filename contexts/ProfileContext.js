import { createContext, useState } from 'react';

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100');

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileProvider, ProfileContext };