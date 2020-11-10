var express = require('express');
var router = express.Router();
var fsPromise = require('fs').promises;
var fs = require('fs');
var GitHub = require('github-api');
var exec = require('child_process').exec;
var nunjucks = require('nunjucks');
global.atob = require("atob");
global.Blob = require('node-blob');
var app = express();

nunjucks.configure({ autoescape: true });

const configDir = '../config.json';
const apiKey = process.env.REACT_APP_API_KEY;

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
     if (error) {
      console.warn(error);
     }
     resolve(stdout? stdout : error);
    });
  });
}

async function getStatus() {
  let nginxStatus = await execPromise("systemctl show -p SubState --value nginx.service");
  return nginxStatus;
}

router.get('/getStatus', function(req, res) {
  getStatus().then((status) => {
    res.send(JSON.stringify({status: status, code: 1}));
  }).catch(() => {
    res.send(JSON.stringify({status: null, code: 0}))
  })
})

router.get('/restart', function(req, res) {
  execPromise("systemctl restart nginx").then(() => {
    getStatus().then((status) => {
      res.send(JSON.stringify({status: status, code: 1}));
    }).catch(() => {
      res.send(JSON.stringify({status: null, code: 0}))
    })
  }).catch(() => {
    res.send(JSON.stringify({status: null, code: 0}))
  })
})

router.post('/disable', function(req, res) {
  execPromise("rm /etc/nginx/sites-enabled/" + req.body.packageName)
    .then(() => {
      res.send(JSON.stringify({type: "success", msg: "Service successfully disabled"}));
    }).catch(() => {
      res.send(JSON.stringify({type: "error", msg: "An error occurred..."}));
    })
})

router.post('/enable', function(req, res) {
  execPromise("ln -s /etc/nginx/sites-available/" + req.body.packageName + " /etc/nginx/sites-enabled/" + req.body.packageName)
  .then(() => {
    res.send(JSON.stringify({type: "success", msg: "Service successfully enabled"}));
  }).catch(() => {
    res.send(JSON.stringify({type: "error", msg: "An error occurred..."}));
  })
})

router.post('/remove', function(req, res) {

})



router.post('/install', async function(req, res) {
  // let nginxIsActive = await execPromise("systemctl is-active nginx");
  // console.log(nginxIsActive);
  // if(nginxIsActive === "active") {
  console.log("Starting");
  let certificateProm = await execPromise("letsencrypt certonly -n --nginx -m " + req.body.mail + " --agree-tos -d " + req.body.domainName)
  Promise.resolve(certificateProm).then(async (result) => {
    console.log(result);
    if(result.hasOwnProperty("code")) {
      res.send(JSON.stringify({type: "error", msg: "Error: Check Server logs for more information..."}));
    } else {
      let gh = new GitHub({token: apiKey});
      let repoName = req.body.fullname.split("/");
      try {
        let repo = await gh.getRepo(repoName[0], repoName[1]);        
        let nginxJ2 = await repo.getContents(req.body.branch, "nginx/" + req.body.version.version + "/nginx.j2");
        let test = atob(nginxJ2.data.content);
        let nginxJ2Ready = nunjucks.renderString(test, { DOMAIN_NAME: req.body.domainName, PROXY_PORT: req.body.port});
        fsPromise.writeFile("/etc/nginx/sites-available/" + req.body.packageName, nginxJ2Ready, (err) => {
          if(err) {
            res.send(JSON.stringify({type: "error", msg: err}));
          }
          console.log("file created");
        }).then(() => {
          if(fs.existsSync("/etc/nginx/sites-enabled/" + req.body.packageName)) {
            res.send(JSON.stringify({type: "success", msg: "Configuration loaded. Please restart nginx."}))
          } else {
            fsPromise.symlink("/etc/nginx/sites-available/" + req.body.packageName, "/etc/nginx/sites-enabled/" + req.body.packageName, (err) => {
              if(err) {
                res.send(JSON.stringify({type: "error", msg: err}));
              }
              console.log("link created");
            }).then(() => {
              res.send(JSON.stringify({type: "success", msg: "Configuration loaded. Please restart nginx."}))
            })
          }
        })
      } catch (e) {
        res.send(JSON.stringify({type: "error", msg: e}));
      }
    }
  })
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