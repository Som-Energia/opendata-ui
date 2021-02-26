import React from 'react'

import { useTranslation } from 'react-i18next'
import yaml from 'js-yaml'
import moment from 'moment'

import { makeStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import ArrowRightIcon from '@material-ui/icons/ArrowRight'

import { geoLevels, pluralGeoLevels } from '../../services/utils'
import { TableBody } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  },
  inputIcon: {
    color: '#757575'
  }
}))

const Rows = ({data, level = 0, code = 0}) => {
  const { t } = useTranslation()
  const classes = useStyles()

  if (data === undefined) return <></>

  const children = pluralGeoLevels[level] && data[pluralGeoLevels[level]]
  const name = data.name || t('GLOBAL')
  const ident = pluralGeoLevels.length - (level -1)

  return <>
    <TableRow hover>
      <TableCell colSpan={level + 1}></TableCell>
      <TableCell>
        <ArrowRightIcon className={classes.inputIcon} />
      </TableCell>
      <TableCell colSpan={ident}>
        { code }
      </TableCell>
      <TableCell>
        { name }
      </TableCell>
      {
        data?.values &&
          data.values.map((value, index) => (
            <TableCell key={index} align="right">
              { value }
            </TableCell>
          ))
      }
    </TableRow>
    {
      children &&
        Object.keys(children).map(code => (
          <Rows key={code} data={children[code]} level={level +1} code={code} />
        ))
    }
  </>
}

const TableData = (props) => {
  const { data } = props
  const { t } = useTranslation()
  const classes = useStyles()

  const dataObj = yaml.load(data)

  return (
    <Table className={classes.table} size="small" aria-label="response table">
      <TableHead>
        <TableRow>
          <TableCell colSpan={geoLevels.length + 3} align="center">{ t('CODE') }</TableCell>
          <TableCell>{ t('NAME') }</TableCell>
          {
            dataObj?.dates &&
              dataObj.dates.map((date) => (
                <TableCell align="right">{moment(date).format('DD/MM/YYYY')}</TableCell>
              ))
          }
        </TableRow>
      </TableHead>
      <TableBody>
        <Rows data={dataObj} />
      </TableBody>      
    </Table>
  )
}

export default TableData
