export default {
  // User Collection
  users: [
    {
      // example user
      isPlaying: true || false,
      // might want to store these encrypted
      spotifyData: {
        accToken: "whateverTheTokenIs",
        refToken: "whateverTheTokenIs",
      },
      notifObj: {
        endpoint: "https://pushservice.com/clientinfo",
        expirationTime: null,
        keys: {
          p256dh: "BGyyVt9FFV…",
          auth: "R9sidzkcdf…",
        },
      },
      authData: {
        username: "TestUser",
        hashed_password: "3i245jeg...",
        email: "testuser@notgmail.com",
        friends: null,
      },
      currentPost: {
        songName: "TestSong",
      },
    },
  ],
};

