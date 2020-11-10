import React from 'react';
// import { useState, useEffect } from 'react';
import { Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
  title: {
    textAlign: 'center',
    marginTop: 5,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    height: 800,
  },

}));

export default function Custom() {
//   const express = "https://api.13ecolo.com";
  // const express = "http://localhost:9000";
  const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();

  return (

    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
          </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>

          </Paper>
      </Grid>
    </Grid>

  );
}