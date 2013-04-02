var request = require("request");

function find(type, arr, def) {
  for(var i = 0, len = arr.length; i < len; i++)
    if(arr[i] instanceof type) return arr[i];

  return def || null;
}

function pad(n) { return n < 10 ? '0' + n : n }
function toISODate(d) {
  return d.getUTCFullYear() + '-'
    + pad(d.getUTCMonth() + 1) + '-'
    + pad(d.getUTCDate());
}

module.exports = Song;

function Song(exfm, id, cb) {
  if(!(this instanceof Song)) return new Song(exfm, id, cb);
  
  if(typeof cb == "function")
    return exfm.get("song/" + id, "song", cb);

  this.exfm = exfm;
  this.id = id;
  this.queryDomain = "song/" + id + "/";
}

// Simple calls
Song.prototype.graph = function(cb) {
  return this.exfm.get(this.queryDomain + "graph", cb);
};

// Special calls
Song.prototype.stream = function(cb) {
  this.exfm.get("song/" + this.id, "song", function(err, song) {
    if(err) return cb(err);
    
    cb(null, request(song.url));
  });
};
Song.prototype.pipe = function(dest) {
  this.exfm.get("song/" + this.id, "song", function(err, song) {
    if(err) dest.emit("error", err);
    request(song.url).pipe(dest);
  });
};

// Authenticated calls
Song.prototype.love = function(username, password, cb) {
  return this.exfm.post(this.queryDomain + "love"
    , { username: username || this.exfm.username
      , password: password || this.exfm.password }
    , cb || username);
};
Song.prototype.unlove = function(username, password, params, cb) {
  var post = {
        username: username || this.exfm.username
      , password: password || this.exfm.password };

  if(typeof params == "object") {
    if(params.source) post.source = params.source;
    if(params.context) post.context = params.context;
  }

  return this.exfm.post(this.queryDomain + "unlove"
    , post
    , cb || params || username);
};

// Static
Song.search = function(query, cb) {
  return this.get("song/search/" + query, cb);
};
Song.trending = function(_tag, _date, _cb) {
  var tag = find(String, [_tag, _date, _cb])
    , date = find(Date, [_date, _tag, _cb])
    , cb = find(Function, [_cb, _tag, _date])
    , query = "trending/"

  if(tag) query += "tag/" + tag + "/";
  if(date) query += toISODate(date);

  return this.get(query, cb);
};
Song.explore = function(tags, _cb) {
  tags = typeof tags == "string" ? [tags] : tags;
  return this.get("explore/" + tags.join("*"), cb);
};
Song.albumsOfTheWeek = function(_cb) {
  return this.get("aotw", cb);
};