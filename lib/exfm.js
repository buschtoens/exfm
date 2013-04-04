var http = require("http")
  , qs = require("qs");

module.exports = Exfm;

function Exfm(clientId, username, password) {
  if(!(this instanceof Exfm)) return new Exfm(clientId, username, password);

  this.clientId = clientId;
  this.username = username || null; 
  this.password = password || null;

  this.options = {
    hostname: "ex.fm",
    port: 80,
    path: "/api/v3",
    headers: { agent: "Node.js silvinci/exfm" }
  };

  this._loadQueries("user", require("./queries/user"));
  this._loadQueries("song", require("./queries/song"));
  this._loadQueries("site", require("./queries/site"));
  this._loadQueries("artist", require("./queries/artist"));
}

Exfm.prototype._loadQueries = function(domain, provider) {
  this[domain] = provider.bind(this, this);
  for(var staticFn in provider) this[domain][staticFn] = provider[staticFn];
};

Exfm.prototype.query = function(method, query, resField, params, cb) {
  cb = cb || params || function() {};
  params = typeof params == "object" ? params : {};
  params.client_id = this.clientId;

  var options = {
        hostname: this.options.hostname
      , port: this.options.port
      , method: method.toUpperCase()
      , path: this.options.path + "/" + query + "?" + qs.stringify(params)
      , headers: this.options.headers
      };

  http.request(options, function(res) {
    var body = "";
    res.setEncoding("utf8");
    res.on("data", function(chunk) {
      body += chunk;
    });
    res.on("error", cb);
    res.on("end", function() {
      cb(null, JSON.parse(body)[resField]);
    });
  }).end();
};

Exfm.prototype.get = function(query, resField, params, cb) {
  return this.query("get", query, resField, params, cb);
};
Exfm.prototype.post = function(query, resField, params, cb) {
  return this.query("post", query, resField, params, cb);
};
