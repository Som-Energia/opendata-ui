import React from 'react'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight as theme } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Yaml = (props) => {
  const { data } = props

  return (
    <SyntaxHighlighter language="yaml" style={theme}>
      {data}
    </SyntaxHighlighter>
  )
}

export default Yaml
