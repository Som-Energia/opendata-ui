import React from 'react'

import jsyaml from 'js-yaml'

const Json = (props) => {
  const { data } = props

  const dataObj = jsyaml.load(data)

  return (
    <div>
      { JSON.stringify(dataObj, null, 2) }
    </div>
  )
}

export default Json
