import React, { useContext } from 'react';
import UserContext from './UserContext.js';

function Profile() {
    const { user } = useContext(UserContext);

    if (!user) {
        return <div>No user data available</div>;
    } else {
        return (
            
            <div>
                Welcome, {user.name}! email: {user.email} We will work on this page later 
                {user.friends} and {user.capsules}
            </div>
        )
    }
    
}

export default Profile;
