function pad(n) { return n < 10 ? '0' + n : n }
function toISODate(d) {
  return d.getUTCFullYear() + '-'
    + pad(d.getUTCMonth() + 1) + '-'
    + pad(d.getUTCDate());
}

module.exports = User;

function User(exfm, username, cb) {
  if(!(this instanceof User)) return new User(exfm, username, cb);
  
  if(typeof cb == "function")
    return exfm.get("user/" + username, "user", cb);

  this.exfm = exfm;
  this.username = username;
  this.queryDomain = "user/" + username + "/";
}

// Construct simple calls
var simpleCalls = {
      "loved": ["songs"]
    , "followers": null
    , "following": null
    , "followingIds": ["following_ids", "following_ids"]
    , "followingSites": ["sites/following", "sites"]
    , "followingLoves": ["feed/love", "activities"]
    , "activity": [null, "activities"]
    , "activityLove": ["feed/love", "activities"]
    , "notifications": [null, "sites"]
    };

Object.keys(simpleCalls).forEach(function(name) {
  var query = simpleCalls[name] && simpleCalls[name][1] || name
    , resField = simpleCalls[name] && simpleCalls[name][0] || name;

  User.prototype[name] = function(cb) {
    return this.exfm.get(this.queryDomain + query, resField, cb);
  };
});

// Complex calls
User.prototype.trending = function(date, cb) {
  var isoDate = date instanceof Date ? "/" + toISODate(date) : "";
  return this.get(this.queryDomain + "trending" + isoDate, cb || date);
};

// Authenticated calls
User.prototype.follow = function(username, password, cb) {
  return this.post(this.queryDomain + "follow"
    , { username: username || this.exfm.username
      , password: password || this.exfm.password }
    , cb || username);
};
User.prototype.unfollow = function(username, password, cb) {
  return this.post(this.queryDomain + "unfollow"
    , { username: username || this.exfm.username
      , password: password || this.exfm.password }
    , cb || username);
};

// Static
User.search = function(username, cb) {
  return this.get("user/search/" + username, cb);
};
User.me = function(username, password, cb) {
  return this.get("me"
    , { username: username || this.username
      , password: password || this.password }
    , cb || username);
};
User.myFeed = function(username, password, cb) {
  return this.get("me"
    , { username: username || this.username
      , password: password || this.password }
    , cb || username);
};