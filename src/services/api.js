import axios from 'axios'

export const requestOpenApi = async (url) => {
  console.log(url)
  if (url.includes('/map/') ) {
    return requestOpenApiImage(url)
  }
  return axios({
    method: 'GET',
    url: url,
  })
  .then(response => {
    console.log(response)
    return response?.data
  })
}

const requestOpenApiImage = (url) => {
  return axios({
    method: 'GET',
    url: url,
    responseType: 'blob',
  })
  .then(response => {
    return URL.createObjectURL(response.data)
  })
  .catch(error => {
    console.log("Error downloading image", error)
    return error
  })

}
