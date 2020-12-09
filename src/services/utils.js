export const uriBase = 'https://opendata.somenergia.coop/v0.2'

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
  } = options

  let url = `${uriBase}`

  if(responseType === 'map'){
    url += `/map`
  }

  if(metric !== undefined && metric ){
    url += `/${metric}`
  }

  if(responseType === 'map' && relative !== undefined && relative ){
    url += `/per/${relative}`
  }

  if(geoLevel !== undefined && geoLevel ){
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

  return url
}
