import React from 'react'

import { useTranslation } from 'react-i18next'
import yaml from 'js-yaml'
import moment from 'moment'

import { makeStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import AddIcon from '@material-ui/icons/Add'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

import { geoLevels, pluralGeoLevels } from '../../services/utils'

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  },
  inputIcon: {
    color: '#757575'
  }
}))

const TableData = (props) => {
  const { data } = props

  const { t } = useTranslation()
  const classes = useStyles()

  const dataObj = yaml.load(data)

  const renderRows = (data, level, code, index) => {
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
            data.values.map((value) => (
              <TableCell align="right">
                { value }
              </TableCell>
            ))
        }
      </TableRow>
      {
        children &&
          Object.keys(children).map((code, index) => (
            renderRows(children[code], level + 1, code, index)
          ))
      }
    </>
  }

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
      {
        renderRows(dataObj, 0, 0, 0)
      }
    </Table>
  )
}

export default TableData
