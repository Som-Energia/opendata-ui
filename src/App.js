import { useEffect } from 'react'
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles'

import { useTranslation } from 'react-i18next'

import { MuiPickersUtilsProvider } from '@material-ui/pickers'

import 'moment/locale/ca'
import MomentUtils from '@date-io/moment'

import AppBar from '@material-ui/core/AppBar'
import Paper from '@material-ui/core/Paper'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import './i18n/i18n.js'

import Filters from 'containers/Filters'

import './App.css'
import cuca from 'images/cuca.svg'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#96b633'
    },
    secondary: {
      main: '#a1a1a1'
    },
    backgroundColor: '#fafafa',
    contrastThreshold: 2,
    tonalOffset: 0.2
  },
  typography: {
    htmlFontSize: 16
  },
  text: {
    primary: '#4d4d4d'
  }
})

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    background: '#f2f2f2',
    minHeight: '100vh'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    color: '#4d4d4d'
  },
  logo: {
    maxHeight: '36px',
    marginBottom: '4px',
    marginRight: theme.spacing(2),
  },
  container: {
    width: '100%',
    padding: theme.spacing(3)
  },
  paper: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3)
  },
  paperTabs: {
    marginBottom: theme.spacing(2)
  }
}))

function App() {

  const classes = useStyles()
  const { t } = useTranslation()

  const value = 0
  const handleChange = () => {}

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={MomentUtils}>

        <div className={classes.root}>

          <AppBar position="static" elevation={1} color="white">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                <img className={classes.logo} alt="Cuca de Som Energia" src={cuca} />
                API Dades Obertes
              </Typography>
            </Toolbar>
          </AppBar>

          <div className={classes.container}>
            <Grid spacing={2} container>

              <Grid item xs={12} sm={4}>
                <Paper className={classes.paper}>
                  <Filters />
                </Paper>
              </Grid>

              <Grid item xs={12} sm={8}>
              <Paper className={classes.paperTabs}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                  >
                    <Tab label={ t('TABLE') } />
                    <Tab label={ t('YAML') } />
                    <Tab label={ t('JSON') } />
                  </Tabs>
                </Paper>

                <Paper className={classes.paper}>
                  <Typography variant="h6">
                    Resultats
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </div>

        </div>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default App;
