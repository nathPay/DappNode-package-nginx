var express = require('express');
var router = express.Router();
var fs = require('fs');
var fsPromise = require('fs').promises;
var path = require('path');
var async = require('async');
var app = express();

router.get('/add', function(req, res, next) {
  let tmp;
  fsPromise.readFile('mail.json', 'utf8', (err) => {
    if(err) throw err;
  }).then(data => JSON.parse(data))
  .then(data => {
    tmp = data;
  })
  .then(() => {
    tmp.push(req.query.email)

    fsPromise.writeFile('mail.json', JSON.stringify(tmp), (err) => {
      if(err) {
        res.send(JSON.stringify({type: "error", msg: err}));
      }
    }).then(() => {
      res.send(JSON.stringify({type: "success", msg: "Tout est bon :)"}));
    })
  })
});

router.get('/download', function(req, res) {
  let tmp;
  let kit1;
  let kit2;
  let kit3;
  let kit4;
  let kit5;
  // var numKit = parseInt(req.query.kit.charAt(0));

  fsPromise.readFile('counter.json', 'utf8', (err) => {
    if(err) throw err;
  }).then(data => JSON.parse(data))
  .then(data => {
    tmp = data;
    kit1 = data[0];
    kit2 = data[1];
    kit3 = data[2];
    kit4 = data[3];
    kit5 = data[4];
  })
  .then(() => {
    switch (parseInt(req.query.kit.charAt(0))) {
      case 1:
        tmp[0] = kit1 + 1;
        tmp[1] = kit2;
        tmp[2] = kit3;
        tmp[3] = kit4;
        tmp[4] = kit5;
        break;
      case 2:
        tmp[0] = kit1;
        tmp[1] = kit2 + 1;
        tmp[2] = kit3;
        tmp[3] = kit4;
        tmp[4] = kit5;
        break;
      case 3:
        tmp[0] = kit1;
        tmp[1] = kit2;
        tmp[2] = kit3 + 1;
        tmp[3] = kit4;
        tmp[4] = kit5;
        break;
      case 4:
        tmp[0] = kit1;
        tmp[1] = kit2;
        tmp[2] = kit3;
        tmp[3] = kit4 + 1;
        tmp[4] = kit5;
        break;
      case 5:
        tmp[0] = kit1;
        tmp[1] = kit2;
        tmp[2] = kit3;
        tmp[3] = kit4;
        tmp[4] = kit5 + 1;
        break;
      default:
        break;
    }
  })
  .then(() => {
    fsPromise.writeFile('counter.json', JSON.stringify(tmp), (err) => {
      if(err) throw err;
    })
  })
  const file = 'public/kits/' + req.query.kit;
  res.download(file);
});

router.get('/idea', function(req, res, next) {
  let tmp;
  fsPromise.readFile('idea.json', 'utf8', (err) => {
    if(err) throw err;
  }).then(data => JSON.parse(data))
  .then(data => {
    tmp = data;
  })
  .then(() => {
    tmp.push(req.query.idea)

    fsPromise.writeFile('idea.json', JSON.stringify(tmp), (err) => {
      if(err) {
        res.send(JSON.stringify({type: "error", msg: err}));
      }
    }).then(() => {
      res.send(JSON.stringify({type: "success", msg: "Merci pour ton idée!"}));
    })
  })
});

module.exports = router;