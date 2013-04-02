module.exports = Site;

function Site(exfm, sitename, cb) {
  if(!(this instanceof Site)) return new Site(exfm, sitename, cb);
  
  if(typeof cb == "function")
    return exfm.get("site/" + sitename, "site", cb);

  this.exfm = exfm;
  this.sitename = sitename;
  this.queryDomain = "site/" + sitename + "/";
}

// Construct simple calls
var simpleCalls = {
      "songs": null
    , "currentListeners": ["current-listeners", "info"]
    , "followers": [null, "users"]
    , "user": null
    };

Object.keys(simpleCalls).forEach(function(name) {
  var query = simpleCalls[name] && simpleCalls[name][1] || name
    , resField = simpleCalls[name] && simpleCalls[name][0] || name;

  Site.prototype[name] = function(cb) {
    return this.exfm.get(this.queryDomain + query, resField, cb);
  };
});

// Authenticated calls
Site.prototype.follow = function(username, password, cb) {
  return this.exfm.post(this.queryDomain + "follow"
    , { username: username || this.exfm.username
      , password: password || this.exfm.password }
    , cb || username);
};
Site.prototype.unfollow = function(username, password, cb) {
  return this.exfm.post(this.queryDomain + "unfollow"
    , { username: username || this.exfm.username
      , password: password || this.exfm.password }
    , cb || username);
};

// Static
Site.featured = function(cb) {
  return this.get("site/featured", cb);
};
Site.ofTheDay = function(cb) {
  return this.get("sotd", cb);
};