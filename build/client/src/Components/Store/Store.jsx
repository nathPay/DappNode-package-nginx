import React from 'react';
import { useState, useEffect } from 'react';
import { Button, MenuItem, Paper, TextField, 
  Typography, Grid, IconButton, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GitHubIcon from '@material-ui/icons/GitHub';
import GitHub from 'github-api';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
  title: {
    textAlign: 'center',
    marginTop: 5,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    // height: 800,
  },
  textField: {
    width: "90%",
  }
}));

export default function Store(props) {
  const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();

  const [expanded, setExpanded] = useState(false);
  const [store, setStore] = useState([]);
  const [domainName, setDomainName] = useState("");
  const [port, setPort] = useState("");
  const [mail, setMail] = useState("");
  const [loading, setLoading] = useState(false);
  const [installLoading, setInstallLoading] = useState(false);
  const [versionSelector, setVersionSelector] = useState([]);
// await repo.getContents(repo.branch, "./nginx.j2", true)
  useEffect(() => {
    async function fetchingRepos() {
      setLoading(true);
      setStore([]);
      setVersionSelector([]);
      let tmpStore = [];
      let tmpVersionSelector = [];
      Promise.all(props.repoList.map(async (repo) => {
        let avatar = await repo.getContents(repo.branch, "./avatar-default.png");
        let dappnodePackage = await repo.getContents(repo.branch, "./dappnode_package.json", true);
        let versions = await repo.getContents(repo.branch, "./nginx/nginxVersions.json", true);
        console.log(versions.data);
        tmpStore.push({
          author: dappnodePackage.data.author,
          packageVersion: dappnodePackage.data.version,
          packageName: dappnodePackage.data.name,
          description: dappnodePackage.data.description,
          avatarLink: avatar.data.download_url,
          repo: repo.address,
          nginxVersions: versions.data,
        });
        tmpVersionSelector.push(0);
        
      })).then(() => {
        setVersionSelector(tmpVersionSelector);
        setStore(tmpStore);
      }).then(() => {
        setLoading(false);
      })
    }
    fetchingRepos();
  }, [])

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangeVersion = (index, version) => {
    props.services[index].selectedVersion = version;
  }

  function install(index) {
    let regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    let regexDomainName = /[.]/;
    let regexPort = /[0-9]{4,5}$/;
    if(regexMail.test(mail)) {
      if(regexDomainName.test(domainName)) {
        if(regexPort.test(port)) {
          enqueueSnackbar('Installing certificate for ' + store[index].packageName, {variant: "info"});
          setInstallLoading(true);
          let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              'branch': props.repoList[index].branch,
              'fullname': props.repoList[index].__fullname,
              mail,
              domainName,
              port,
              'version': store[index].nginxVersions[versionSelector[index]],
              packageName: store[index].packageName,
            })
          }
          fetch(props.express + '/nginx/install', requestOptions)
          .then(res => res.json())
          .then(res => {
            setInstallLoading(false);
            enqueueSnackbar(res.msg, {variant: res.type});
          })
        } else {
          enqueueSnackbar('Port is composed of 4 to 5 numbers.');
        }
      } else {
        enqueueSnackbar('The domain name is empty or do not contain "."');
      }
    } else {
      enqueueSnackbar('Invalid mail', {variant: "error"});
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <h2>STORE</h2>
          <br></br>
          {
            store.map((el, index) => (
              <Accordion id={"accordionStore-" + index} expanded={expanded === index} onChange={handleChangeAccordion(index)} >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id={index + "-header"}
                >
                <Typography className={classes.heading}><img width="32" src={el.avatarLink}></img>{" " + el.packageName + " | version: " + el.packageVersion}</Typography>

                </AccordionSummary>
                <Divider></Divider>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography>
                        {el.description}
                      </Typography>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography>
                          Latest Nginx version: {el.nginxVersions[0].version}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          Compatible version: {el.packageVersion}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                      <Divider></Divider>
                      <br></br>
                        <h4>Configuration</h4>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                      <TextField
                        className={classes.textField}
                        id="outlined-basic"
                        placeholder="something.com"
                        variant="outlined"
                        label="Domain name"
                        inputProps={{ 'aria-label': 'Domain name'}}
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                      />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          className={classes.textField}
                          id="outlined-basic"
                          placeholder="someone@example.com"
                          variant="outlined"
                          label="Mail address"
                          inputProps={{ 'aria-label': 'mail'}}
                          value={mail}
                          onChange={(e) => setMail(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          className={classes.textField}
                          id="outlined-basic"
                          placeholder="8080"
                          variant="outlined"
                          label="Port"
                          inputProps={{ 'aria-label': 'port'}}
                          value={port}
                          onChange={(e) => setPort(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          className={classes.textField}
                          id="outlined-basic"
                          variant="outlined"
                          label="Version"
                          inputProps={{ 'aria-label': 'version'}}
                          value={versionSelector[index]}
                          onChange={(e) => setVersionSelector(versionSelector.map((item, i) => (
                              i === index ? e.target.value : item
                            )))}
                          select
                        >
                          {
                            el.nginxVersions.map((item, index) => (
                              <MenuItem value={index}>{item.version + " (for " + item.compatibility + ")"} </MenuItem>
                            ))
                          }
                        </TextField>
                      </Grid>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        <IconButton href={el.repo}><GitHubIcon></GitHubIcon></IconButton>
                      </Typography>
                    </Grid>
                    <Grid item xs={3}/>
                    <Grid item xs={3}/>
                    <Grid item xs={3}>
                      <Button onClick={(e) => install(index)} variant="contained" color="primary">Install</Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          }
          {
            loading && <Typography variant="h3"><Skeleton/><Skeleton/><Skeleton/><Skeleton/></Typography>
          }
        </Paper>
    </Grid>
  </Grid>
  );
}