import React from 'react';
import AppHeader from './HomePageComponents/AppHeader.js';
import ComponentList from './HomePageComponents/ComponentList.js'

function Home() {
    return(
        <div style={{ backgroundColor: "#702b9d", minHeight: '100vh' }}>
            <AppHeader />
            <ComponentList />
        </div>
    )
}

export default Home;