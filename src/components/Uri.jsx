import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { urlFromOptions } from '../services/utils'

const useStyles = makeStyles((theme) => ({
  uri: {
    padding: '8px 0 24px',
    display: 'flex',
    justifyContent: 'center',
    overflowWrap: 'anywhere',
    flexWrap: 'wrap',
    '& span': {
      whiteSpace: 'nowrap'
    }
  }
}))

const Uri = (props) => {
  const {options} = props
  const classes = useStyles()

  const [uri, setUri] = useState('')
  const [prevUri, setPrevUri] = useState('')

  useEffect(() => {
    setPrevUri(uri)
    setUri(urlFromOptions(options))
  }, [options])

  return (
    <div className={classes.uri}>
      { uri.split('/').map((part, index) => {
          const auxClass = !prevUri || prevUri.split('/').includes(part) ? '' : 'text-uri-in'
          return <span key={index} className={auxClass}>{ (index?'/':'') + part}</span>
        }
      )}
    </div>
  )
}

export default Uri
