import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DashBoard from '../DashBoard'
import Custom from '../Custom'
import Store from '../Store'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Fab } from '@material-ui/core';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import SyncIcon from '@material-ui/icons/Sync';

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
}));

export default function App() {
  const classes = useStyles();
  const theme = useTheme();

  const [tabValue, setTabValue] = useState(0);
  const [apiKey, setApiKey] = useState(process.env.REACT_APP_API_KEY);
  const [elements, setElements] = useState([]);
  const [services, setServices] = useState([]);
  const [express, setExpress] = useState(process.env.REACT_APP_EXPRESS_ADDRESS);


  useEffect(() => {
    setServices(
      [
        {
          name: "Nextcloud",
          packageName: "DappNode-Package-nextcloud-linuxserver",
          description: "Easy install of Nextcloud on your Dappnode ! (Docker image provided by linuxserver.io)", 
          repo: "https://github.com/nathPay/DappNode-Package-nextcloud-linuxserver", 
          latestDnpCompatibility: "v0.1.0", 
          versionsList: ["v0.1.0", "v0.2.0", "v1.0.0"],
          selectedVersion: "v1.0.0",
          latestVersion:"v0.1.0",
        },
        {
          name: "Bitwarden",
          packageName: "DappNode-Package-bitwarden",
          description: "A simple way to store password safely.", 
          repo: "https://github.com/nathPay/DAppNodePackage-bitwarden", 
          latestDnpCompatibility: "v1.0.1", 
          versionsList: ["v0.1.0", "v0.2.0", "v1.0.0"],
          selectedVersion: "v1.0.0",
          latestVersion:"v1.0.0", 
        }
      ]
    )
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
  }, []);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setTabValue(index);
  };

  return (
    <div>
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
          <DashBoard elements={elements}/>
        </TabPanel>
        <TabPanel value={tabValue} index={1} classes={ classes.tabs } dir={theme.direction}>
          <Store services={services}/>
        </TabPanel>
        <TabPanel value={tabValue} index={2} classes={ classes.tabs } dir={theme.direction}>
          <Custom/>
        </TabPanel>
      </SwipeableViews>
      <Fab color="secondary" aria-label="sync" className={classes.fab}>
          <SyncIcon />
        </Fab>
    </div>
  );
}
