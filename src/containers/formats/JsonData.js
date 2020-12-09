import React from 'react'

import jsyaml from 'js-yaml'

const Json = (props) => {
  const { data } = props

  const dataObj = jsyaml.load(data)

  return (
    <pre>
      { JSON.stringify(dataObj, null, 2) }
    </pre>
  )
}

export default Json
