# ![exfm for Node.js](http://i.imgur.com/qDY0wpO.png)
*exfm logo belongs to exfm. Node.js logo belongs to Node.js. This project is not an official exfm project and is not affliated with.*

Connect to the [ex.fm](http://ex.fm/) API, get information and stream music!

```javascript
exfm.user("silvinci").loved(cb);
exfm.song("8ugg").pipe(fs.createWriteStream("never.mp3"));
exfm.song.search("Never Gonna Give You Up");
```


## Installation
```
$ npm install exfm
```

## Usage
The exfm API makes use of chaining. Who doesn't like chaining?

### [exfm.user(username, cb)](http://ex.fm/api#profile)
Get a user's profile information.
```javascript
exfm.user("dan", function(err, user) {
  if(err) throw err;
  console.log(user.name); // "Dan Kantor"
});
```

#### [exfm.user(username).loved(cb)](http://ex.fm/api#loved)
Get a user's loved songs.
```javascript
exfm.user("dan").loved(function(err, songs) {
  if(err) throw err;
  console.log(songs); // [{ title: "Golden Light", ... }, ...]
});
```

#### [exfm.user(username).followers(cb)](http://ex.fm/api#followers)
Get a user's followers.
```javascript
exfm.user("dan").followers(function(err, users) {
  if(err) throw err;
  console.log(users); // [{ username: "silvinci", ... }, ...]
});
```

#### [exfm.user(username).following(cb)](http://ex.fm/api#following)
Get users a user is following.
```javascript
exfm.user("dan").following(function(err, users) {
  if(err) throw err;
  console.log(users); // [{ username: "majman" ... }, ...]
});
```

#### [exfm.user(username).followingIds(cb)](http://ex.fm/api#followingids)
Get the IDs of the users the user is following.
```javascript
exfm.user("dan").followingIds(function(err, ids) {
  if(err) throw err;
  console.log(ids); // ["majman", "chase", ...]
});
```

#### [exfm.user(username).followingSites(cb)](http://ex.fm/api#followedsites)
Get sites the user is following.
```javascript
exfm.user("dan").followingIds(function(err, sites) {
  if(err) throw err;
  console.log(sites); // [{ name: "Black Light Dinner Party" }, ...]
});
```

#### [exfm.user(username).loveFeed(cb)](http://ex.fm/api#feedlove)
Get a feed of songs loved by users the user is following.
```javascript
exfm.user("dan").loveFeed(function(err, songs) {
  if(err) throw err;
  console.log(songs); // [{ object: { title: "Where's The Time", ... }, ... }, ...]
});
```

#### [exfm.user(username).activiy(cb)](http://ex.fm/api#activity)
Get a feed of a user's activity, including loved songs, shared songs, and followed users.
```javascript
exfm.user("dan").activity(function(err, activities) {
  if(err) throw err;
  console.log(activities); // [{ object: { title: "Where's The Time", ... }, ... }, ...]
});
```

#### [exfm.user(username).activityLove(cb)](http://ex.fm/api#activitylove)
Get a feed of a user's loved songs.
```javascript
exfm.user("dan").activityLove(function(err, loves) {
  if(err) throw err;
  console.log(loves); // [{ object: { title: "Where's The Time", ... }, ... }, ...]
});
```

#### [exfm.user(username).notifications(cb)](http://ex.fm/api#notifications)
Get a feed of actions being perfomed on the user, such as loving of songs the user has loved (AKA relove) and following the user-
```javascript
exfm.user("dan").notifications(function(err, msgs) {
  if(err) throw err;
  console.log(msgs); // [...]
});
```
