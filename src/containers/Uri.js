import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { urlFromOptions } from '../services/utils'

const useStyles = makeStyles((theme) => ({
  uri: {
    display: 'flex',
    justifyContent: 'center',
  }
}))

const Uri = (props) => {
  const {options} = props
  const classes = useStyles()

  const [uri, setUri] = useState('')

  useEffect(() => {
    setUri(urlFromOptions(options))
  }, [options])

  return (
    <div className={classes.uri}>
      { uri }
    </div>
  )
}

export default Uri
