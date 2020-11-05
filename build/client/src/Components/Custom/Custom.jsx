import React from 'react';
import { useState, useEffect } from 'react';
import { InputBase, Button, CircularProgress, 
  Paper, ButtonGroup, FormControl, InputLabel,
  Select, MenuItem, TextField, Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
  // form: {
  //   margin: "auto",
  // },
  // container: {
  //   padding: theme.spacing(2),
  // },
  // content: {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   margin: 'auto',
  //   marginBottom: 30,
  //   width: '100%',
  // },
  title: {
    textAlign: 'center',
    marginTop: 5,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    height: 800,
  },
  // boite: {
  //   width: '100%'
  // },
  // insidePaper: {
  //   margin: 'auto',
  // },
  // paperEmail: {
  //   paddingLeft: "20%",
  //   paddingRight: "20%",
  // },
  // kitDownload: {
  //   margin: theme.spacing(1),
  //   minWidth: 120,
  // },
  // downloadButton: {
  //   paddingLeft: "10%",
  //   paddingRight: "10%",
  // }
}));

export default function Custom() {
//   const express = "https://api.13ecolo.com";
  const express = "http://localhost:9000";
  const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
  const MAX_KIT = 5;

  const [email, setEmail] = useState("");
  const [numKit, setNumKit] = useState(MAX_KIT);
  const [kitType, setKitType] = useState(1);
  const [waitEmailSend, setWaitEmailSend] = useState(false);
  const [waitDownload, setWaitDownload] = useState(false);
  const [waitBoite, setWaitBoite] = useState(false);
  const [idea, setIdea] = useState("");
  const [spacing, setSpacing] = React.useState(2);

  const _setNumKit = (event) => {
    setNumKit(event.target.value);
  }
  const _setKitType = (event) => {
    setKitType(event.target.value);
  }

  function addEmail() {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(regex.test(email)) {
      setWaitEmailSend(true);
      fetch(express + '/mail/add?email=' + email)
      .then(res => res.json())
      .then(res => {
        setWaitEmailSend(false);
        enqueueSnackbar(res.msg, {variant: res.type});
      })
    } else {
      enqueueSnackbar('Ça ne ressemble pas à un email...', {variant: "error"});
    }
  }

  function downloadKit() {
    enqueueSnackbar('Téléchargement en cours...', {variant: "info"});
    setWaitDownload(true);
    if(kitType == 1) {
      fetch(express + '/mail/download?kit=' + numKit + ".pdf")
      .then(res => res.blob())
      .then(res => {
        let url = window.URL.createObjectURL(res);
        let a = document.createElement('a');
        a.href = url;
        a.download = "kitEcolo"+numKit+".pdf";
        a.click();
      })
      .then(() => {
        setWaitDownload(false);
      });
    } else {
      fetch(express + '/mail/download?kit=' + numKit + "impr.pdf")
      .then(res => res.blob())
      .then(res => {
        let url = window.URL.createObjectURL(res);
        let a = document.createElement('a');
        a.href = url;
        a.download = "kitEcolo"+numKit+"-impr.pdf";
        a.click();
      })
      .then(() => {
        setWaitDownload(false);
      });
    }
  }

  function sendIdea() {
    if(idea === "") {
      enqueueSnackbar("C'est vide ici non ?", {variant: "error"});
    } else {
      setWaitBoite(true);
      fetch(express + '/mail/idea?idea=' + idea)
        .then(res => res.json())
        .then( res => {
          setWaitBoite(false)
          enqueueSnackbar(res.msg, {variant: res.type});
        })
    }
  }

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

    // <Box className={classes.content}>
    //   <div>
        // <Box className={classes.title}>
        //   <h2>Hello !</h2>
        // </Box>
    //     <Box className={classes.box1}>
    //       <Paper variant="outlined" className={classes.container}>
    //         <div className={classes.insidePaper}>
    //           <h3>Présentation du kit :</h3>
    //           <p>
    //           Un <b>KIT ECOLO</b> pour occuper tes enfants pendant le confinement de manière écolo et amusante ça te dit ?
    //           <br></br>
    //             Tu y trouveras des activités artistiques, des recettes, des bricolages et bien plus encore, à faire à partir de pas grand-chose et sans rien acheter !
    //             <br></br>
    //             Si tu veux directement recevoir les prochains par mail tu peux laisser ton adresse e-mail juste en dessous !
    //           </p>
    //           <p>
    //           Si tu as des questions n'hésite pas à nous écrire à <a href="mailto:team@13ecolo.com">team@13ecolo.com</a>.
    //           </p>
    //           <p>
    //           Tu peux partager ces kits autour de toi par mail ou sur les réseaux en utilisant le <b>#13ecolo</b>
    //           <br></br>
    //           À très vite !
    //           </p>
    //           <p>
    //           <b>La team 13écolo !</b>
    //           </p>
    //         </div>
    //       </Paper>
    //     </Box>
    //     <Box className={classes.box2}>
    //       <Paper variant="outlined" className={classes.container}>
    //         <div className={classes.insidePaper}>
    //           <h3>Les Kits :</h3>
    //           <br></br>
    //           <h5>Télécharge ton kit écolo ici :</h5>
    //           <FormControl variant="outlined" className={classes.kitDownload}>
    //             <InputLabel id="demo-simple-select-outlined-label">Numéro</InputLabel>
    //             <Select
    //               labelId="demo-simple-select-outlined-label"
    //               id="demo-simple-select-outlined"
    //               value={numKit}
    //               variant="outlined"
    //               onChange={_setNumKit}
    //               label="Numero"
    //             >
    //               <MenuItem value={1}>1er Kit : Le zéro-déchet</MenuItem>
    //               <MenuItem value={2}>2eme Kit : Les légumes</MenuItem>
    //               <MenuItem value={3}>3eme Kit : Les oiseaux</MenuItem>
    //               <MenuItem value={4}>4eme Kit : L'eau</MenuItem>
    //               <MenuItem value={5}>5eme Kit : Les petites bêtes</MenuItem>
    //             </Select>
    //           </FormControl>
    //           <FormControl variant="outlined" className={classes.kitDownload}>
    //             <InputLabel id="demo-simple-select-outlined-label">Type</InputLabel>
    //             <Select
    //               labelId="demo-simple-select-outlined-label"
    //               id="demo-simple-select-outlined"
    //               value={kitType}
    //               variant="outlined"
    //               onChange={_setKitType}
    //               label="Type"
    //             >
    //               <MenuItem value={1}>Version numérique</MenuItem>
    //               <MenuItem value={2}>Version imprimable</MenuItem>
    //             </Select>
    //           </FormControl>
              
    //           <br></br>
    //           {!waitDownload ? <Button  color="primary" variant="contained" onClick={(e) => downloadKit()}>Télécharger</Button> : <Button disabled aria-label="addEmail"><CircularProgress size={25}/></Button>}

    //           {/* <Button  color="primary" variant="contained" onClick={(e) => downloadKit()}>Télécharger</Button> */}
    //           <br></br>
    //           <br></br>
    //           <h5>Laisse-nous ton email pour être averti.e de la sortie des prochains kits :</h5>

    //           <TextField
    //             id="email"
    //             label="Email"
    //             placeholder="exemple@quelque.chose"
    //             margin="normal"
    //             variant="outlined"
    //             margin="dense"
    //             value={email}
    //             onChange={(e) => setEmail(e.currentTarget.value)}
    //           />
    //           <br></br>
    //           {!waitEmailSend ? <Button variant="contained" color="primary" onClick={() => addEmail()} aria-label="addEmail">Envoyer</Button> : <Button disabled aria-label="addEmail"><CircularProgress size={25}/></Button>}

    //         </div>

    //       </Paper>
    //     </Box>
    //     {/* <Box className={classes.box3}>
    //       <Paper variant="outlined" className={classes.container}>
    //         <h3>Quel thème aimerais-tu que l'on explore pour un prochain kit ?</h3>
    //         <br></br>
    //         <h5>Écris-nous tes idées :</h5>
    //         <TextField
    //           id="outlined-multiline-static"
    //           className={classes.boite}
    //           label="Boite à idées"
    //           multiline
    //           rows={6}
    //           variant="outlined"
    //           value={idea}
    //           onChange={(e) => setIdea(e.currentTarget.value)}
    //         />
    //         <br></br>
    //         <br></br>
    //         {!waitBoite ? <Button variant="contained" color="primary" onClick={() => sendIdea()} aria-label="sendIdea">Envoyer</Button> : <Button disabled aria-label="sendIdea"><CircularProgress size={25}/></Button>}
    //       </Paper>
    //     </Box> */}
    //   </div>
    // </Box>
  );
}