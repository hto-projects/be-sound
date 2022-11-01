var Spotify = require('spotify-web-api-js');
var s = new Spotify();
var spotifyApi = new SpotifyWebApi();

userName = '';
token = '';

spotifyApi.setAccessToken(token);
spotifyApi.getMyRecentlyPlayedTracks(usrName)
  .then(function(data) {
    console.log('User most recent songs', data);
  }, function(err) {
    console.error(err);
  });