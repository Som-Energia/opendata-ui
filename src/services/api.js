import axios from 'axios'

export const requestOpenApi = async (url) => {
  console.log(url)
  return axios({
    method: 'GET',
    url: url,
  })
    .then(response => {
      console.log(response)
      return response?.data
    })
}
