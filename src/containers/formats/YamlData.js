import React from 'react'

import jsyaml from 'js-yaml'

const Yaml = (props) => {
  const { data } = props

  return (
    <div>
      { jsyaml.dump(data) }
    </div>
  )
}

export default Yaml
