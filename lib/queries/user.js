/**
 * Pad integer `n` to two digits.
 * 
 * @param  {Number} n
 * @return {String}
 */
function pad(n) { return n < 10 ? '0' + n : n }

/**
 * Convert the Date `d` to an ISO 8601 compliant String.
 * 
 * @param  {Date} d
 * @return {String} Somethinf like 2012-12-21
 */
function toISODate(d) {
  return d.getUTCFullYear() + '-'
    + pad(d.getUTCMonth() + 1) + '-'
    + pad(d.getUTCDate());
}

/**
 * Expose `User` query provider.
 */
module.exports = User;

/**
 * Initialize a new `User` query provider with a reference to the Exfm instance,
 * the specified `username`.
 * 
 * If the optional `cb` is specified this will automatically request the
 * user's profile and call the callback with the result. In this case no query
 * provider is initialized.
 * 
 * @constructor
 * @param {Exfm}     exfm
 * @param {String}   username
 * @param {Function} cb
 */
function User(exfm, username, cb) {
  if(!(this instanceof User)) return new User(exfm, username, cb);
  
  if(typeof cb == "function")
    return exfm.get("user/" + username, "user", cb);

  this.exfm = exfm;
  this.username = username;
  this.queryDomain = "user/" + username + "/";
}

/**
 * Construct the simple calls that take no arguments.
 */
var simpleCalls = {
      "loved": ["songs"]
    , "followers": null
    , "following": null
    , "followingIds": ["following_ids", "following_ids"]
    , "followingSites": ["sites/following", "sites"]
    , "followingLoves": ["feed/love", "activities"]
    , "feedLove": ["feed/love", "activities"]
    , "activity": [null, "activities"]
    , "activityLove": ["activity/love", "activities"]
    , "notifications": [null, "sites"]
    };

Object.keys(simpleCalls).forEach(function(name) {
  var query = simpleCalls[name] && simpleCalls[name][1] || name
    , resField = simpleCalls[name] && simpleCalls[name][0] || name;

  User.prototype[name] = function(cb) {
    return this.exfm.get(this.queryDomain + query, resField, cb);
  };
});

/**
 * Complex Calls, that take arguments.
 */

/**
 * Get the songs that are currently trending among the users
 * being followed by the specified user
 * 
 * If a `date` is specified this will get the songs that were
 * trending on that date.
 * 
 * @param  {Date}   date
 * @param  {Function} cb
 */
User.prototype.trending = function(date, cb) {
  var isoDate = date instanceof Date ? "/" + toISODate(date) : "";
  return this.exfm.get(this.queryDomain + "trending" + isoDate, cb || date);
};

/**
 * Calls, that need user authentification.
 *
 * The optional arguments `username` and `password`
 * take precedence over the username and password,
 * that may have been specified for the Exfm instance.
 */

User.prototype.follow = function(username, password, cb) {
  return this.exfm.post(this.queryDomain + "follow"
    , { username: username || this.exfm.username
      , password: password || this.exfm.password }
    , cb || username);
};
User.prototype.unfollow = function(username, password, cb) {
  return this.exfm.post(this.queryDomain + "unfollow"
    , { username: username || this.exfm.username
      , password: password || this.exfm.password }
    , cb || username);
};

/**
 * Static calls
 */

/**
 * Search a user by username or email address.
 * 
 * @param  {String}   username
 * @param  {Function} cb
 */
User.search = function(username, cb) {
  return this.get("user/search/" + username, cb);
};

/**
 * Shortcut to get the logged in user's profile.
 * This is essentially the same as calling `Exfm.user(username, cb)`.
 * 
 * Optionally takes `username` and `password`.
 * (Reference: Calls, that need user authentification)
 * 
 * @param  {String}   username
 * @param  {String}   password
 * @param  {Function} cb
 */
User.me = function(username, password, cb) {
  return this.get("me"
    , { username: username || this.username
      , password: password || this.password }
    , cb || username);
};

/**
 * Shortcut to get the logged in user's feed.
 * 
 * Optionally takes `username` and `password`.
 * (Reference: Calls, that need user authentification)
 * 
 * @param  {String}   username
 * @param  {String}   password
 * @param  {Function} cb
 */
User.myFeed = function(username, password, cb) {
  return this.get("me/feed"
    , { username: username || this.username
      , password: password || this.password }
    , cb || username);
};