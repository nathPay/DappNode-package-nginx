import React from 'react';
import { useState, useEffect } from 'react';
import { InputBase, Button, CircularProgress, 
  Paper, ButtonGroup, FormControl, InputLabel,
  Select, MenuItem, TextField, Typography, Grid, IconButton, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import GitHubIcon from '@material-ui/icons/GitHub';

import GitHub from 'github-api';

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
}));

export default function DashBoard(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  var gh = new GitHub({token: "88dddbc8ad2a4bc7d01c4816df980eb4c64a7e5c"});
  // const [spacing, setSpacing] = React.useState(2);
  const [expanded, setExpanded] = useState(false);
  const [test, setTest] = useState("");

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(async () => {
    let repo = await gh.getRepo("nathPay", "DAppNodePackage-bitwarden");
    let content = await repo.getContents("master", "./releases.json");
    setTest(content);
  }, [])
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h2>DASHBOARD</h2>
            <br></br>
            {
              props.elements.map((el, index) => (
                <Accordion expanded={expanded === index} onChange={handleChangeAccordion(index)} >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={index + "-header"}
                  >
                    <FiberManualRecordIcon component={svgProps => (
                      <svg {...svgProps}>
                        {
                          el.nginxState === "disabled" ?
                          React.cloneElement(svgProps.children[0], { fill: 'red' }) :
                          el.currentVersion !== el.latestVersion ?
                          React.cloneElement(svgProps.children[0], { fill: 'orange' }) :
                          React.cloneElement(svgProps.children[0], { fill: 'green' })
                        }
                      </svg>
                    )}></FiberManualRecordIcon>
                    <Typography className={classes.heading}>{el.name + " | " + el.currentVersion}</Typography>

                  </AccordionSummary>
                  <Divider></Divider>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography>
                          {el.description}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>
                          {el.packageName + "  " + el.currentVersion}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography>
                          <IconButton href={el.repo}><GitHubIcon></GitHubIcon></IconButton>
                        </Typography>
                      </Grid>
                      <Grid item xs={3}></Grid>
                      <Grid item xs={3}>
                        { 
                        el.currentVersion !== el.latestVersion ? 
                        <Button variant="contained" color="primary">Update to { el.latestVersion }</Button> : 
                        <Button variant="contained" color="primary" disabled>Up to Date</Button>
                        }
                      </Grid>
                      <Grid item xs={3}>
                        { 
                        el.nginxState === "enabled" ? 
                        <Button variant="contained" color="primary">Enable</Button> :
                        <Button variant="contained" color="primary">Activate</Button>
                        }
                        
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))
            }
            
          </Paper>
      </Grid>
      {JSON.stringify(test)}
    </Grid>
  );
}