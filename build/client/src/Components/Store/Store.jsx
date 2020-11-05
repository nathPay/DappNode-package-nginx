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

export default function Store(props) {
  const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();

  const [expanded, setExpanded] = useState(false);
  const [domainName, setDomainName] = useState("");
  const [mail, setMail] = useState("");
  const [port, setPort] = useState("");

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangeVersion = (index, version) => {
    props.services[index].selectedVersion = version;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <h2>STORE</h2>
          <br></br>
          {
            props.services.map((el, index) => (
              <Accordion expanded={expanded === index} onChange={handleChangeAccordion(index)} >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id={index + "-header"}
                >
                <Typography className={classes.heading}>{el.name + " | " + el.latestVersion}</Typography>

                </AccordionSummary>
                <Divider></Divider>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography>
                        {el.description}
                      </Typography>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                      <Divider></Divider>
                      <br></br>
                        <h4>Configuration</h4>
                      </Grid>
                      <Grid item xs={12} sm={4}>
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
                      <Grid item xs={12} sm={4}>
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
                      <Grid item xs={12} sm={4}>
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
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        <IconButton href={el.repo}><GitHubIcon></GitHubIcon></IconButton>
                      </Typography>
                    </Grid>
                    <Grid item xs={3}/>
                    <Grid item xs={3}/>
                    <Grid item xs={3}>
                      {/* <ButtonGroup>
                      <TextField
                        className={classes.textField}
                        id="outlined-basic"
                        variant="outlined"
                        label="Version list"
                        inputProps={{ 'aria-label': ''}}
                        value={el.selectedVersion}
                        onChange={(e) => handleChangeVersion(index, e.target.value)}
                        select
                      >
                        {
                          el.versionsList.map((version) => (
                            <MenuItem value={version}>{version}</MenuItem>
                          ))
                        }
                      </TextField> */}
                      <Button variant="contained" color="primary">Install</Button>
                      {/* </ButtonGroup> */}
                      
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