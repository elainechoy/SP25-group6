import React, { useContext } from 'react';
import AppHeader from './HomePageComponents/AppHeader.js';
import ComponentList from './HomePageComponents/ComponentList.js'
import UserContext from './UserContext.js'
// import MapViewer from './MapViewer.js'

function Home() {
    const { user } = useContext(UserContext);

    if (!user) {
        return <p>Loading user data...</p>;
    }

    return(
        <div style={{ 
            background: "linear-gradient(to bottom right, #7c3aed, rgb(183, 124, 239), #7c3aed)",
            minHeight: '100vh' }}>
            
            <AppHeader user={user}/>

            <ComponentList />
            
        </div>
    )
}

export default Home;