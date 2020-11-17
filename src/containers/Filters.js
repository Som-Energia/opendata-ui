import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import MenuItem from '@material-ui/core/MenuItem'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Select from '@material-ui/core/Select'

import { DatePicker } from "@material-ui/pickers"

import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import FilterListIcon from '@material-ui/icons/FilterList'
import SearchIcon from '@material-ui/icons/Search'

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
  }
}))

const Filters = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  const [responseType, setResponseType] = useState('data')
  const [value, setValue] = useState(0)

  const handleResponseType = (event) => {
    setResponseType(event.target.value);
  }

  const handleChange = () => {

  }

  return (
    <>
      <FormControl component="fieldset" className={classes.formControlHori}>
        <FormLabel component="legend">{ t('RESPONSE_TYPE') }</FormLabel>
        <RadioGroup row aria-label="response-type" name="response-type" value={responseType} onChange={handleResponseType}>
          <FormControlLabel value="data" control={<Radio color="primary" />} label={ t('DATA') } />
          <FormControlLabel value="map" control={<Radio color="primary" />} label={ t('MAP') } />
        </RadioGroup>
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="metrica">{ t('METRICA') }</InputLabel>
        <Select
          labelId="metrica"
          value={value}
          onChange={handleChange}
          label={ t('METRICA') }
          fullWidth
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl} disabled={true}>
        <InputLabel id="relative">{ t('RELATIVE') }</InputLabel>
        <Select
          labelId="relative"
          value={value}
          onChange={handleChange}
          label={ t('RELATIVE') }
          fullWidth
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="geo-level">{ t('GEO_LEVEL') }</InputLabel>
        <Select
          labelId="geo-level"
          value={value}
          onChange={handleChange}
          label={ t('GEO_LEVEL') }
          fullWidth
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="axis-time">{ t('AXIS_TIME') }</InputLabel>
        <Select
          labelId="axis-time"
          value={value}
          onChange={handleChange}
          label={ t('AXIS_TIME') }
          fullWidth
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth className={classes.formControl} variant="outlined">
        <DatePicker
          id="date"
          variant="inline"
          inputVariant="outlined"
          startAdornment={<InputAdornment position="start"><CalendarTodayIcon className={classes.inputIcon} /></InputAdornment>}
          label={ t('TO_DATE') }
          format="DD/MM/YYYY"
          autoOk
          value=""
          onChange=""
        />
      </FormControl>

      <FormControl fullWidth className={classes.formControl} variant="outlined">
        <InputLabel htmlFor="geo-filters">{ t('GEO_FILTERS') }</InputLabel>
        <OutlinedInput
          id="geo-filters"
          value=""
          onChange=""
          startAdornment={<InputAdornment position="start"><FilterListIcon className={classes.inputIcon} /></InputAdornment>}
          label={ t('GEO_FILTERS') }
        />
      </FormControl>

      <Button
        variant="contained"
        fullWidth
        color="primary"
        startIcon={<SearchIcon />}
      >
        { t('SEARCH') }
      </Button>
    </>
  )
}

export default Filters
