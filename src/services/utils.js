import yaml from 'js-yaml'
import { requestOpenApi } from './api'
export const uriBase = 'https://opendata.somenergia.coop/v0.2'

export const apiMetrics = []
export const apiGeoLevels = []
export const allLocations = []

const loadGeoLevels = () => {
  requestOpenApi(uriBase+'/discover/geolevel')
    .then(yamldata => {
      const data = yaml.load(yamldata)
      apiGeoLevels.length=0
      apiGeoLevels.push(...data.geolevels)
      // TODO: Update select box
      loadAllLocations()
    })
}

const loadMetrics = () => {
  requestOpenApi(uriBase+'/discover/metrics')
    .then(yamldata => {
      const data = yaml.load(yamldata)
      apiMetrics.length=0
      apiMetrics.push(...data.metrics)
      // TODO: Update select box
    })
}

const loadAllLocations = () => {
  allLocations.length=0;
  Promise.all(apiGeoLevels.map(geolevel => {
    if (geolevel.id === 'world') { return true; }
    if (geolevel.id === 'country') { return true; }
    return requestOpenApi(uriBase+`/discover/geolevel/${geolevel.id}`)
      .then(yamldata => {
        const data = yaml.load(yamldata)

        for (const [id, text] of Object.entries(data.options)) {
          allLocations.push({
            id,
            text,
            level: geolevel,
            filterText: `${text} (${geolevel.text})`,
            filterQuery: `${geolevel.id}=${id}`,
            key: id,
          })
        }
      })
    })
  ).then( data => {
    console.log("allLocations", allLocations)
    return data
  })
}

loadMetrics()
loadGeoLevels()

export const geoLevels = [
  'country', 'ccaa', 'state', 'city'
]

export const pluralGeoLevels = [
  'countries', 'ccaas', 'states', 'cities'
]

export const urlFromOptions = (options) => {
  const {
    responseType,
    metric,
    relative,
    geoLevel,
    time,
    onDate,
    fromDate,
    toDate,
    geoFilters,
    lang,
  } = options

  let url = `${uriBase}`

  if(responseType === 'map'){
    url += `/map`
  }

  if(metric !== undefined && metric ){
    url += `/${metric}`
  }

  if(responseType === 'map' && relative !== undefined && relative && relative !== 'absolute'){
    url += `/per/${relative}`
  }

  if(geoLevel !== undefined && geoLevel && geoLevel !== 'world'){
    url += `/by/${geoLevel}`
  }

  switch (time) {
    case 'monthly':
    case 'yearly':
    case 'weekly': {
      console.log("periodic")
      url += `/${time}`
      if (fromDate) {
        url += `/from/${fromDate.toISOString().substring(0, 8)}01`
      }
      if (toDate) {
        url += `/to/${toDate.toISOString().substring(0, 8)}01}`
      }
      break;
    }
    default: {
      if (onDate) {
        url += `/on/${onDate.toISOString().substring(0, 8)}01`
      }
    }
  }
  let queryParams = []

  if (responseType !== 'map') {
    if (geoFilters && geoFilters.length) {
      queryParams.push(...geoFilters.map(filter => filter.filterQuery))
    }
  }
  else {
    if (lang && lang !=='browser') {
      queryParams.push(`lang=${lang}`)
    }
  }

  if (queryParams.length) {
    url += '?' + queryParams.join('&')
  }

  return url
}
