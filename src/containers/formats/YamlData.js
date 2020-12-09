import React from 'react'

import jsyaml from 'js-yaml'

const Yaml = (props) => {
  const { data } = props

  return (
    <pre>
{ data }
    </pre>
  )
}

export default Yaml
