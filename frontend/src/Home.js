import React, { useContext } from 'react';
import AppHeader from './HomePageComponents/AppHeader.js';
import ComponentList from './HomePageComponents/ComponentList.js'
import UserContext from './UserContext.js'
// import MapViewer from './MapViewer.js'

function Home() {
    const { user } = useContext(UserContext);
    // const [capsules, setCapsules] = React.useState([]);

    // React.useEffect(() => {
    //     const fetchCapsules = async () => {
    //         const token = localStorage.getItem("authToken");
    //         if (!token) {
    //             alert("User not authenticated");
    //             return;
    //         }
    //         try {
    //             const response = await fetch('http://localhost:5001/api/get_all_capsules', {
    //                 method: "GET",
    //                 headers: {
    //                  'Content-Type': 'application/json',
    //                   Authorization: `Bearer ${token}`, // Send token for authentication
    //                 },
    //             });
    //             if (!response.ok) {
    //                 const errorData = await response.json();
    //                 throw new Error(errorData.message || 'Network response was not ok');
    //             }
    //             const data = await response.json();
    //             setCapsules(data);

    //         } catch (error) {
    //             console.error("Error fetching capsules:", error);
    //         }
    //     };

    //     fetchCapsules();
    // }, []);

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
            {/* <MapViewer capsules={capsules}/> */}
        </div>
    )
}

export default Home;