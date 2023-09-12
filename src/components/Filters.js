import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Select from '@material-ui/core/Select'
import Popover from '@material-ui/core/Popover'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete'
import ReactMarkdown from 'react-markdown'

import { DatePicker } from "@material-ui/pickers"

import ClearIcon from '@material-ui/icons/Clear'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import FilterListIcon from '@material-ui/icons/FilterList'
import LanguageIcon from '@material-ui/icons/Language'
import SearchIcon from '@material-ui/icons/Search'
import InfoIcon from '@material-ui/icons/Info'
import Uri from './Uri'

import { loadMetrics, loadGeoLevels, loadAllLocations, languages } from '../services/utils'


const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(3),
    width: '100%'
  },
  formControlHori: {
    marginBottom: theme.spacing(2),
    width: '100%',
    display: 'flex'
  },
  inputIcon: {
    color: '#757575'
  },
  button: {
    marginRight: theme.spacing(1),
    '&:hover': {
      boxShadow: 'none'
    },
    boxShadow: 'none'
  },
  popover: {
    pointerEvents: 'none',
    p: theme.spacing(3),
    padding: '2rem',
    maxWidth: 'min( 80%, 50rem )',
  },
  popoverContent: {
    padding: theme.spacing(3),
  },

}))

const defaultValues = {
  responseType: null,
  metric: null,
  relative: 'absolute',
  geoLevel: 'world',
  time: 'on',
  onDate: null,
  fromDate: null,
  toDate: null,
  geoFilters: [],
  lang: 'browser',
}

const Filters = (props) => {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const {
    initialValues = {},
    onChangeOptions = () => {},
    onSubmit = () => {},
    onClear = () => {}
  } = props

  const [apiMetrics, setApiMetrics] = useState([])
  const [apiGeoLevels, setGeoLevels] = useState([])
  const [allLocations, setAllLocations] = useState([])

  const [options , setOptions] = useState({...defaultValues, ...initialValues})

  const [metricPopOverAnchor, setMetricPopoverAnchor] = React.useState(null);
  const handleDescriptionClick = (event) => {
    setMetricPopoverAnchor((oldanchor) => oldanchor ? null : event.currentTarget)
  }
  const handleDescriptionHover = (event) => {
    setMetricPopoverAnchor(event.currentTarget);
  };
  const handleDescriptionLeave = () => {
    setMetricPopoverAnchor(null);
  };
  const isMetricPopoverOpen = Boolean(metricPopOverAnchor);

  useEffect(() => {
    const loadFilters = async () => {
      const metrics = await loadMetrics(i18n.language)
      const geoLevels = await loadGeoLevels(i18n.language)
      setApiMetrics(metrics)
      setGeoLevels(geoLevels)
    }
    loadFilters()
  }, [i18n.language])

  useEffect(() => {
    const loadFilters = async () => {
      const locations = await loadAllLocations(apiGeoLevels)
      setAllLocations(locations)
    }
    loadFilters()
  }, [apiGeoLevels])

  useEffect( () => {
    onChangeOptions(options)
  },
  [options, onChangeOptions])

  const handleClear = () => {
    setOptions({...defaultValues, ...initialValues})
    onClear()
  }
  const metric = apiMetrics?.find((m)=>m.id === options?.metric)

  return (
    <>
      <FormControl component="fieldset" className={classes.formControlHori}>
        <RadioGroup
          row
          aria-label="response-type"
          name="response-type"
          value={options?.responseType}
          onChange={ (event) => setOptions({ ...options, responseType: event.target.value}) }
        >
          <FormControlLabel value="data" control={<Radio color="primary" />} label={ t('DATA') } />
          <FormControlLabel value="map" control={<Radio color="primary" />} label={ t('MAP') } />
        </RadioGroup>
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="metric">{ t('METRIC') }</InputLabel>
        <Select
          labelId="metric"
          value={options?.metric}
          onChange={ (event) => setOptions({ ...options, metric: event.target.value}) }
          label={ t('METRIC') }
          fullWidth
        >
        {
          apiMetrics.map( metric => (
            <MenuItem key={metric?.id} value={ metric?.id }>
              { t(`${ metric.text }`) }
            </MenuItem>
          ))
        }
        </Select>
        <Button 
          aria-owns={isMetricPopoverOpen ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handleDescriptionHover}
          onClick={handleDescriptionClick}
          onMouseLeave={handleDescriptionLeave}
          startIcon={ <InfoIcon/> }
        >
          {t("METRIC_DESCRIPTION")}
          <Popover
            id="mouse-over-popover"
            className={classes.popover}
            classes={{
              paper: classes.paper,
            }}
            open={isMetricPopoverOpen}
            anchorEl={metricPopOverAnchor}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handleDescriptionLeave}
            disableRestoreFocus
          >
          <Box className={classes.popoverContent}>
            <Typography component={"div"} sx={{ p: 2, width: '50%' }}>
              <ReactMarkdown children={ 
                `### ${metric?.text}\n\n${metric?.description}`
              } />
            </Typography>
          </Box>
          </Popover>
        </Button>
      </FormControl>

      {
        options?.responseType === 'map' &&
        <FormControl variant="outlined" className={classes.formControl} disabled={ options.responseType !== 'map' }>
          <InputLabel id="relative">{ t('RELATIVE') }</InputLabel>
          <Select
            labelId="relative"
            value={options?.relative}
            onChange={ (event) => setOptions({ ...options, relative: event.target.value}) }
            label={ t('RELATIVE') }
            fullWidth
            displayEmpty
            required
          >
            <MenuItem value="absolute">{ t('ABSOLUTE') }</MenuItem>
            <MenuItem value="population">{ t('POPULATION') }</MenuItem>
          </Select>
        </FormControl>
      }

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="geo-level">{ t('GEO_LEVEL') }</InputLabel>
        <Select
          labelId="geo-level"
          value={options?.geoLevel}
          onChange={ (event) => setOptions({ ...options, geoLevel: event.target.value}) }
          label={ t('GEO_LEVEL') }
          fullWidth
        >
          {
            apiGeoLevels.map( level => (
              <MenuItem
                key={ level.id }
                value={ level.id }
                disabled={
                  (options?.responseType === 'map' && level.mapable === false) ||
                  (options?.responseType !== 'map' && level.detailed === false)
                }
              >
                { t(`${level.text}`) }
              </MenuItem>
            ))
          }
        </Select>
        <FormHelperText>
          { t('GEOLEVEL_HELP') }
        </FormHelperText>
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="axis-time">{ t('AXIS_TIME') }</InputLabel>
        <Select
          labelId="axis-time"
          value={options?.time}
          onChange={ (event) => setOptions({ ...options, time: event.target.value}) }
          label={ t('AXIS_TIME') }
          fullWidth
        >
          <MenuItem value="on">{ t('SINGLE_DATE') }</MenuItem>
          <MenuItem value="yearly">{ t('YEARLY') }</MenuItem>
          <MenuItem value="monthly">{ t('MONTHLY') }</MenuItem>
          <MenuItem value="weekly" disabled>{ t('WEEKLY') }</MenuItem>
        </Select>
      </FormControl>

      { options?.time === 'on' &&
        <FormControl fullWidth className={classes.formControl} variant="outlined">
          <DatePicker
            id="ondate"
            variant="inline"
            inputVariant="outlined"
            InputProps={{
              startAdornment: <InputAdornment position="start">
                <CalendarTodayIcon className={classes.inputIcon} />
              </InputAdornment>,
              endAdornment:  options?.onDate && <InputAdornment position="end">
                <IconButton onClick={ (event) => { event.stopPropagation(); setOptions({ ...options, onDate: null}) }  }>
                  <ClearIcon className={classes.inputIcon} />
                </IconButton>
              </InputAdornment>
            }}
            label={ t('ON_DATE') }
            format="DD/MM/YYYY"
            autoOk
            value={ options?.onDate}
            onChange={ (value) => { setOptions({ ...options, onDate: value}) }}
          />
        </FormControl>
      }
      {
        options?.time !== 'on' &&
        <>
          <FormControl fullWidth className={classes.formControl} variant="outlined">
            <DatePicker
              id="fromdate"
              variant="inline"
              inputVariant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <CalendarTodayIcon className={classes.inputIcon} />
                </InputAdornment>,
                endAdornment:  options?.fromDate && <InputAdornment position="end">
                  <IconButton onClick={ (event) => { event.stopPropagation(); setOptions({ ...options, fromDate: null}) }  }  >
                    <ClearIcon className={classes.inputIcon} />
                  </IconButton>
                </InputAdornment>
              }}
              label={ t('FROM_DATE') }
              format="DD/MM/YYYY"
              autoOk
              value={ options?.fromDate }
              onChange={ (value) => { setOptions({ ...options, fromDate: value}) }}
              maxDate={ options?.toDate ? options.toDate : false }
            />
          </FormControl>

          <FormControl fullWidth className={classes.formControl} variant="outlined">
            <DatePicker
              id="todate"
              variant="inline"
              inputVariant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <CalendarTodayIcon className={classes.inputIcon} />
                </InputAdornment>,
                endAdornment:  options?.toDate && <InputAdornment position="end">
                  <IconButton onClick={ (event) => { event.stopPropagation(); setOptions({ ...options, toDate: null}) }  }  >
                    <ClearIcon className={classes.inputIcon} />
                  </IconButton>
                </InputAdornment>
              }}
              label={ t('TO_DATE') }
              format="DD/MM/YYYY"
              autoOk
              value={ options?.toDate }
              onChange={ (value) => { setOptions({ ...options, toDate: value}) }}
              minDate={ options?.fromDate ? options.fromDate : false }
            />
          </FormControl>
        </>
      }
      {
        options?.responseType !== 'map' &&
        <FormControl fullWidth className={classes.formControl} variant="outlined">
          <Autocomplete
            multiple
            id="geo-filters-nou"
            options={ allLocations || [] }
            // TODO: Use API translated test for level text
            getOptionLabel={ (option) => `${option.text} (`+ t(`${option.level.id.toUpperCase()}`)+`)` }
            groupBy= {(option) => t(`${option.level.id.toUpperCase()}`) }
            // defaultValue={[]}
            filterSelectedOptions
            onChange={ (ev, value) => { setOptions({ ...options, geoFilters: value}) }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={ t('GEO_FILTERS') }
                InputProps={{
                  ...params.InputProps,
                  startAdornment:
                    <>
                      <InputAdornment position="start">
                        <FilterListIcon className={classes.inputIcon} />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                }}
              />
            )}
          />
        </FormControl>
      }
      {
        options?.responseType === 'map' &&
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="lang">{ t('LANGUAGE') }</InputLabel>
          <Select
            labelId="lang-label"
            value={options?.lang}
            placeholder = { t('BROWSER_LANGUAGE') }
            onChange={ (event, child) => {               
              setOptions({ ...options, lang: event.target.value, child: child})
            }}
            label={ t('LANGUAGE') }
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">
                <LanguageIcon className={classes.inputIcon} />
              </InputAdornment>
            }}
          >
            <MenuItem value="browser">{ t('BROWSER_LANGUAGE') }</MenuItem>
            {
              languages.map(({code, name}) => (
                <MenuItem value={code}>{ t(name) }</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      }

      <Uri options={options} />

      <Button
        variant="contained"
        className={classes.button}
        color="primary"
        onClick={onSubmit}
        startIcon={<SearchIcon />}
      >
        { t('SEARCH') }
      </Button>

      <Button
        variant="contained"
        className={classes.button}
        color="default"
        onClick={handleClear}
        startIcon={<ClearIcon />}
      >
        { t('CLEAR') }
      </Button>
    </>
  )
}

export default Filters
