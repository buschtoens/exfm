/**
 * Module dependencies.
 */
var http = require("http")
  , qs = require("qs");

/**
 * Expose `Exfm` constructor.
 */
module.exports = Exfm;

/**
 * Initialize a new `Exfm` API with the given `clientId`,
 * `username` and `password`.
 *
 * @constructor
 * @param {String} clientId
 * @param {String} username
 * @param {String} password
 */
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

/**
 * Load a query provider into the specified `domain`.
 * 
 * @param  {String} domain
 * @param  {Function} provider
 * @api private
 */
Exfm.prototype._loadQueries = function(domain, provider) {
  this[domain] = provider.bind(this, this);
  for(var staticFn in provider) this[domain][staticFn] = provider[staticFn];
};

/**
 * Send a query to the exfm API server.
 * 
 * @param  {String}   method
 * @param  {String}   query
 * @param  {String}   resField
 * @param  {Object}   params
 * @param  {Function} cb
 * @return {null}     In the future this may return some kind of promise.
 */
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

  return null;
};

/**
 * Shorthand for a GET query.
 * (Reference: `Exfm.prototype.query`)
 * 
 * @param  {String}   query
 * @param  {String}   resField
 * @param  {Object}   params
 * @param  {Function} cb
 * @return {null}
 */
Exfm.prototype.get = function(query, resField, params, cb) {
  return this.query("get", query, resField, params, cb);
};


/**
 * Shorthand for a POST query.
 * (See `Exfm.prototype.query`)
 * 
 * @param  {String}   query
 * @param  {String}   resField
 * @param  {Object}   params
 * @param  {Function} cb
 * @return {null}
 */
Exfm.prototype.post = function(query, resField, params, cb) {
  return this.query("post", query, resField, params, cb);
};
