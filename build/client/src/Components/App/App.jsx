import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import {Typography, LinearProgress, Fab, Popover,
        Card, CardContent, CardActions, Button,
        CircularProgress } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DashBoard from '../DashBoard'
import Custom from '../Custom'
import Store from '../Store'
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import GitHub from 'github-api';
import SyncIcon from '@material-ui/icons/Sync';
import { useSnackbar } from 'notistack';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    margin: 15,
  },
  tabs: {
    outline: "none",
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  card: {
    height: 250,
    width: 250,
  }
}));

export default function App() {
  const classes = useStyles();
  const theme = useTheme();
	const { enqueueSnackbar } = useSnackbar();

  const [tabValue, setTabValue] = useState(0);
  const [gh] = useState(new GitHub({token: process.env.REACT_APP_API_KEY}));
  const [elements, setElements] = useState([]);
  const [express, setExpress] = useState('http://192.168.0.14:9000');
  const [repoList, setRepoList] = useState([]);
  const [userStore, setUserStore] = useState("nathPay")
  const [repoStore, setRepoStore] = useState("nginx-store-dappnode")
  const [branchStore, setBranchStore] = useState("main")
  const [loading, setLoading] = useState(false);
  const [restartLoading, setRestartLoading] = useState(false);
  const [nginxStatus, setNginxStatus] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'status-fab' : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  
  useEffect(() => {
    async function fetchingStore() {
      setLoading(true);
      let repo = await gh.getRepo(userStore, repoStore);
      let content = await repo.getContents(branchStore, "./repoList.json", true);
      // if(content.data.encode === null) {
      content.data.forEach( async (el, index) => {
        let packageRepo = await gh.getRepo(el.user, el.repo);
        packageRepo["branch"] = el.branch;
        packageRepo["address"] = "https://github.com/" + packageRepo.__fullname;
        repoList.push(packageRepo);
      })
    }
    getNginxStatus();
    
    setElements(
      [
        {
          name: "Nextcloud",
          packageName: "DappNode-Package-nextcloud-linuxserver",
          description: "Easy install of Nextcloud on your Dappnode ! (Docker image provided by linuxserver.io)", 
          repo: "https://github.com/nathPay/DappNode-Package-nextcloud-linuxserver", 
          currentDnpCompatibility: "v0.1.0", 
          latestDnpCompatibility: "v0.1.0", 
          currentVersion: "v0.1.0", 
          latestVersion:"v0.1.0", 
          nginxState:"enabled",
          domainName: "drive.nthome.xyz"
        },
        {
          name: "Bitwarden",
          packageName: "DappNode-Package-bitwarden",
          description: "A simple way to store password safely.", 
          repo: "https://github.com/nathPay/DAppNodePackage-bitwarden", 
          currentDnpCompatibility: "v1.0.1", 
          latestDnpCompatibility: "v1.0.1", 
          currentVersion: "v1.0.0", 
          latestVersion:"v2.0.0", 
          nginxState:"enabled",
          domainName: "bitwarden.nthome.xyz"
        }
      ]);
      fetchingStore().then(() => {
        setLoading(false);
      });
  }, []);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setTabValue(index);
  };

  function restartNginx() {
    setRestartLoading(true);
    fetch(express + '/nginx/restart')
      .then(res => res.json())
      .then(res => {
        if(res.code) {
          setNginxStatus(res.status)
        } else {
          enqueueSnackbar('Error fetching server', {variant: "error"});
        }
        setRestartLoading(false);
      });
  }

  function getNginxStatus() {
    setRestartLoading(true);
    fetch(express + '/nginx/getStatus')
      .then(res => res.json())
      .then(res => {
        if(res.code) {
          setNginxStatus(res.status);
        } else {
          enqueueSnackbar('Error fetching server', {variant: "error"});
        }
        setRestartLoading(false);
      });
  }

  return (
    <div>
      {
        loading === true && <LinearProgress/>
      }
      <AppBar position="static" color="primary">
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          centered
        >
          <Tab label="DashBoard" {...a11yProps(0)}/>
          <Tab label="Store" {...a11yProps(1)}/>
          <Tab label="Custom config" {...a11yProps(2)}/>
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tabValue}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={tabValue} index={0} classes={ classes.tabs } dir={theme.direction}>
          <DashBoard elements={elements} gh={gh} repoList={repoList}/>
        </TabPanel>
        <TabPanel value={tabValue} index={1} classes={ classes.tabs } dir={theme.direction}>
          <Store gh={gh} repoList={repoList} express={express}/>
        </TabPanel>
        <TabPanel value={tabValue} index={2} classes={ classes.tabs } dir={theme.direction}>
          <Custom/>
        </TabPanel>
      </SwipeableViews>
      <Fab onClick={() => restartNginx()} variant="extended" color="secondary" aria-label="sync" className={classes.fab} id={id}>
        Nginx status: { restartLoading ? <CircularProgress color="default" size={30}/> : nginxStatus}
        <SyncIcon></SyncIcon>
      </Fab>
      {/* <Popover 
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Card className={classes.card}>
          <CardContent>
            
          </CardContent>
          <CardActions>
            <Button onClick={() => restartNginx()}>Restart Nginx</Button>
          </CardActions>
        </Card>
      </Popover> */}
    </div>
  );
}
