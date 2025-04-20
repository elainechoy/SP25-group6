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
            background: 'linear-gradient(to bottom right, #702b9d, #b991db, #702b9d)', 
            // background: 'linear-gradient(to bottom right, #b991db, #702b9d, #b991db)', 
            minHeight: '100vh' }}>
            <AppHeader user={user}/>

            <ComponentList />
        </div>
    )
}

export default Home;