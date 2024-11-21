import axios from 'axios'
import i18n from 'i18n/i18n'

export const requestOpenApi = async (url) => {
  if (url.includes('/map/') ) {
    return requestOpenApiImage(url)
  }
  return axios({
    method: 'GET',
    url: url,
    headers: {
      'accept-language': i18n.language
    },
  })
  .then(response => {
    return response?.data
  })
}

const requestOpenApiImage = (url) => {
  return axios({
    method: 'GET',
    url: url,
    responseType: 'blob',
    headers: {
      'accept-language': i18n.language
    },
  })
  .then(response => {
    return URL.createObjectURL(response.data)
  })
}
