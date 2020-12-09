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
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Select from '@material-ui/core/Select'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { DatePicker } from "@material-ui/pickers"

import ClearIcon from '@material-ui/icons/Clear'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import FilterListIcon from '@material-ui/icons/FilterList'
import SearchIcon from '@material-ui/icons/Search'

import { apiGeoLevels, allLocations } from '../services/utils'

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
  }
}))

const defaultValues = {
  responseType: null,
  metric: null,
  relative: null,
  geoLevel: null,
  time: 'on',
  onDate: null,
  fromDate: null,
  toDate: null,
  geoFilters: []
}

const Filters = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const {
    initialValues = {},
    onChangeOptions = () => {},
    onSubmit = () => {},
    onClear = () => {}
  } = props

  const [options , setOptions] = useState({...defaultValues, ...initialValues})

  useEffect( () => {
    onChangeOptions(options)
  },
  [options])

  const handleClear = () => {
    setOptions({...defaultValues, ...initialValues})
    onClear()
  }

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
          label={ t('METRICA') }
          fullWidth
        >
          <MenuItem value="members">{ t('MEMBERS') }</MenuItem>
          <MenuItem value="contracts">{ t('CONTRACTS') }</MenuItem>
        </Select>
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
          >
            <MenuItem value="">{ t('ABSOLUTE') }</MenuItem>
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
                value={level.id}
                disabled={
                  (options?.responseType === 'map' && level.mapable === false) ||
                  (options?.responseType !== 'map' && level.detailed === false)
                }
              >{ t(`${level.id.toUpperCase()}`) }</MenuItem>
              // TODO: when API had all translations use level.text instead uppercased id
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
            clearable
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
              minDate={ options?.toDate ? options.toDate : false }
            />
          </FormControl>
        </>
      }

      <FormControl fullWidth className={classes.formControl} variant="outlined">
        <Autocomplete
          multiple
          id="geo-filters-nou"
          options={ allLocations || [] }
          // TODO: Use API translated test for level text
          getOptionLabel={ (option) => `${option.text} (`+ t(`${option.level.id.toUpperCase()}`)+`)` }
          groupBy= {(option) => t(`${option.level.id.toUpperCase()}`) }
          defaultValue={[]}
          filterSelectedOptions
          onChange={ (ev, value) => { setOptions({ ...options, geoFilters: value}) }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={ t('GEO_FILTERS') }
            />
          )}
        />
      </FormControl>

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
