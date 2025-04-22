import React, { useEffect, useState, useContext } from 'react';
import AppHeader from './HomePageComponents/AppHeader';
import { Card, Avatar, Typography, Box } from '@mui/material';
import UserContext from './UserContext.js';
import { API_URL } from './config.js'

const Friends = () => {
  const [friendsData, setFriendsData] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Current user:', user);

        const token = localStorage.getItem("authToken");
        const capsuleRes = await fetch(`${API_URL}/api/get_all_capsules`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const userCapsules = await capsuleRes.json();
        console.log('User capsules:', userCapsules);

        const allFriends = {};

        for (const capsule of userCapsules) {
          const members = capsule.members;
          for (const email of members) {
            if (email === user.email) continue;
            if (!allFriends[email]) {
              allFriends[email] = { sharedCapsules: 0 };
            } else {
              allFriends[email].sharedCapsules++;
            }
          }
        }
        console.log(allFriends);

        const friendsInfo = await Promise.all(
          Object.keys(allFriends).map(async (email) => {
            const friendRes = await fetch(`${API_URL}/api/retrieve_user_by_email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            });

            if (!friendRes.ok) {
              console.error("Error fetching friend:", friendRes.statusText);
              return null;
            }

            const friendInfo = await friendRes.json();
            console.log("Friend info:", friendInfo);

            return {
              username: friendInfo.username,
              photo: `${API_URL}/api/profile-image/${friendInfo.profileImageId}`,
              sharedCapsules: allFriends[email].sharedCapsules,
            };
          })
        );

        // Remove any nulls caused by failed fetches
        setFriendsData(friendsInfo.filter(Boolean));

      } catch (err) {
        console.error('Error fetching friends:', err);
      }
    };

    if (user?.email) {
      fetchData();
    } else {
      console.warn('No user or no email — skipping fetchData');
    }
  }, [user]);

  if (!user || !user.email) {
    return <div>Loading user info...</div>;
  }


  return (
<>
<AppHeader user={user} />
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        //  justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '# ',
        background: "linear-gradient(to bottom right, #7c3aed, rgb(183, 124, 239), #7c3aed)",
        overflow: 'auto',
        pt: 0,
        px: 2,
        pb: 2,
        m: 0
      }}
    >
     

        <Box
          sx={{
            maxHeight: '80vh',
            overflowY: 'auto',
            borderRadius: 4,
            backgroundColor: 'white',
            boxShadow: 3,
            p: 10,
            width: 400,
            m: 12
          }}
        >

          <Typography
            variant="h4"
            sx={{
              color: '#753b9c',
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 3,
            }}
          >
            My Friends
          </Typography>

          {friendsData.length === 0 ? (
            <Typography textAlign="center">No friends found.</Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={3}>
              {friendsData.map((friend, idx) => (
                <Card
                  key={idx}
                  elevation={3}
                  sx={{
                    borderRadius: 4,
                    padding: 3,
                    backgroundColor: 'rgba(106, 20, 220, 0.7)',
                    color: 'white',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      alt={friend.username}
                      src={friend.photo}
                      sx={{
                        width: 60,
                        height: 60,
                        fontSize: 24,
                        bgcolor: 'white',
                        color: '#702b9d',
                      }}
                    >
                      {friend.username[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {friend.username}
                      </Typography>
                      <Typography variant="body2">
                        Shared Capsules: <strong>{friend.sharedCapsules}</strong>
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>
      </>
  );
};

export default Friends;
