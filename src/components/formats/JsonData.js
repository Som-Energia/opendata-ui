import React from 'react'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsyaml from 'js-yaml'

const Json = (props) => {
  const { data } = props

  const dataObj = jsyaml.load(data)

  return (
    <SyntaxHighlighter language="yaml" style={theme}>
      { JSON.stringify(dataObj, null, 2) }
    </SyntaxHighlighter>
  )
}

export default Json
