var Exfm = require("./")
  , fs = require("fs");

var exfm = new Exfm();

exfm.song("v96cg").pipe(fs.createWriteStream("test.mp3"));