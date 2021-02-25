import { useState } from 'react'
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles'
import yaml from 'js-yaml'

import { useTranslation } from 'react-i18next'
import './i18n/i18n.js'

import { MuiPickersUtilsProvider } from '@material-ui/pickers'

import 'moment/locale/ca'
import MomentUtils from '@date-io/moment'

import AppBar from '@material-ui/core/AppBar'
import Paper from '@material-ui/core/Paper'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import TableContainer from '@material-ui/core/TableContainer'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import Alert from '@material-ui/lab/Alert'

import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import BubbleChart from '@material-ui/icons/BubbleChart'
import GetAppIcon from '@material-ui/icons/GetApp'

import Filters from 'components/Filters'
import Uri from 'components/Uri'

import Table from 'components/formats/TableData'
import Json from 'components/formats/JsonData'
import Yaml from 'components/formats/YamlData'

import { requestOpenApi } from './services/api'
import { urlFromOptions } from './services/utils'

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
    padding: theme.spacing(3),
    paddingTop: theme.spacing(10)
  },
  paper: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    boxShadow: 'none'
  },
  tablePaper: {
    marginBottom: theme.spacing(2),
    boxShadow: 'none'
  },
  paperTabs: {
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    display: 'flex',
    justifyContent: 'space-between'  
  },
  map: {
    width: '100%'
  },
  button: {
    marginRight: theme.spacing(2)
  }
}))

function App() {

  const classes = useStyles()
  const { t } = useTranslation()

  const initialValues = {
    responseType: 'data',
    metric: 'members',
  }

  const [format, setFormat] = useState(0)
  const [filterOptions, setFilterOptions] = useState(initialValues)
  const [sending, setSending] = useState()
  const [response, setResponse] = useState()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChange = (event, newValue) => {
    event.preventDefault()
    setFormat(newValue)
  }

  const handleChangeOptions = (options) => {
    setFilterOptions(options)
  }

  const handleSubmit = async () => {
    setSending(true)
    const url = urlFromOptions(filterOptions)
    await requestOpenApi(url)
      .then(response => {
        setResponse(response)
      })
      .catch(error => {
        console.log(error)
        setResponse(false)
      })
    setSending(false)
  }

  const handleClear = () => {
    setResponse()
  }

  const handleDownload = () => {
    console.log(`download data...`)
    if(response){
      const dataObj = yaml.load(response)
      console.log(dataObj)
    }
  }

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const ResponseWithFormat = ({response, format}) => {
    if (response === undefined) {
      return <></>
    }

    if (response === false) {
      return (
        <Alert severity="error">{ t('NO_DATA') }</Alert>
      )
    }

    if (response.substring?.(0,5) === 'blob:') {
      return (
        <img className={classes.map} alt={ t('RESULTING_MAP') } src={response} />
      )
    }

    switch (format) {
      case 0:
        return <TableContainer component={Paper} className={classes.tablePaper}>
          <Table data={response} />
        </TableContainer>
      case 2:
        return <Paper className={classes.paper}>
          <Json data={response} />
        </Paper>
      default:
        return <Paper className={classes.paper}>
          <Yaml data={response} />
        </Paper>
      }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={MomentUtils}>

        <div className={classes.root}>
          <AppBar position="fixed" elevation={0} color="inherit">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                <img className={classes.logo} alt="Cuca de Som Energia" src={cuca} />
                { t('OPEN_DATA_API') }
              </Typography>

              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                }}
              >
                <MenuItem onClick={ () => openInNewTab('https://opendata.somenergia.coop/docs') & handleClose() }>
                  <ListItemIcon>
                    <HelpOutlineIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">{ t('API_DOCUMENTATION') }</Typography>
                </MenuItem>
                <MenuItem onClick={ () => openInNewTab('https://opendata.somenergia.coop/ui/legacy/gapminder.html') & handleClose() }>
                  <ListItemIcon>
                    <BubbleChart />
                  </ListItemIcon>
                  Gapminder
                </MenuItem>
              </Menu>

            </Toolbar>
            {
            sending &&
              <LinearProgress variant="indeterminate" />
            }
          </AppBar>

          <div className={classes.container}>
            <Grid spacing={2} container>

              <Grid item xs={12}>
                <Alert severity="warning">{ t('ALPHA_DISCLAIMER') }</Alert>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper className={classes.paper}>
                  <Filters
                    onSubmit={handleSubmit}
                    onClear={handleClear}
                    onChangeOptions={handleChangeOptions}
                    initialValues={{...initialValues}}
                  />

                  <Uri options={filterOptions} />
                </Paper>

              </Grid>

              <Grid item xs={12} sm={8}>
                {
                  response && response.substring?.(0,5) !== 'blob:' &&
                    <Paper className={classes.paperTabs}>
                      <Tabs
                        value={format}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        left
                      >
                        <Tab label={ t('TABLE') } />
                        <Tab label={ t('YAML') } />
                        <Tab label={ t('JSON') } />
                      </Tabs>

                      {
                        <IconButton
                          size="small"
                          className={classes.button}
                          color="default"
                          onClick={handleDownload}
                        >                          
                          <GetAppIcon />
                        </IconButton>
                      }

                    </Paper>
                }
                <ResponseWithFormat
                  response={response}
                  format={format}
                />
              </Grid>
            </Grid>
          </div>

        </div>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  )
}

export default App
