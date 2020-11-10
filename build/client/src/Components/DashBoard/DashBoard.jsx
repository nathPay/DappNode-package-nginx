import React from 'react';
import { useState, useEffect } from 'react';
import { Button, CircularProgress, Paper, Typography, 
  Grid, IconButton, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import GitHubIcon from '@material-ui/icons/GitHub';

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
  // const [spacing, setSpacing] = React.useState(2);
  const [expanded, setExpanded] = useState(false);
  const [changeStatusLoading, setChangeStatusLoading] = useState(false);
  

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function disableService(packageName) {
    setChangeStatusLoading(true);
    let requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageName
      })
    }
    fetch(props.express + '/nginx/disable', requestOptions)
    .then(res => res.json())
    .then(res => {
      setChangeStatusLoading(false);
      enqueueSnackbar(res.msg, {variant: res.type});
    })
  }

  function enableService(packageName) {
    setChangeStatusLoading(true);
    let requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageName
      })
    }
    fetch(props.express + '/nginx/enable', requestOptions)
    .then(res => res.json())
    .then(res => {
      setChangeStatusLoading(false);
      enqueueSnackbar(res.msg, {variant: res.type});
    })
  }
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h3">DASHBOARD</Typography>
            {
              props.elements.map((el, index) => (
                <Accordion id={"accordionDashBoard-" + index} expanded={expanded === index} onChange={handleChangeAccordion(index)} >
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
                        <Button onClick={() => disableService(el.packageName)} variant="contained" color="primary">Disable</Button> :
                        <Button onClick={() => enableService(el.packageName)} variant="contained" color="primary">Enable</Button>
                        }
                        
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))
            }
            
          </Paper>
      </Grid>
    </Grid>
  );
}