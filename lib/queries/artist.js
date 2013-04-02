module.exports = Artist;

function Artist(exfm, artistname, cb) {
  if(!(this instanceof Artist)) return new Artist(exfm, artistname, cb);
  
  if(typeof cb == "function")
    return exfm.get("artist/" + artistname, "artist", cb);

  this.exfm = exfm;
  this.artistname = artistname;
  this.queryDomain = "artist/" + artistname + "/";
}