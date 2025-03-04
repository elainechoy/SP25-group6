import React, { useContext } from 'react';
import AppHeader from './HomePageComponents/AppHeader.js';
import ComponentList from './HomePageComponents/ComponentList.js'
import UserContext from './UserContext.js'

function Home() {
    const { user } = useContext(UserContext);

    if (!user) {
        return <p>Loading user data...</p>;
    }

    return(
        <div style={{ backgroundColor: "#fbf2ff", minHeight: '100vh' }}>
            <AppHeader user={user}/>
            <ComponentList />
        </div>
    )
}

export default Home;