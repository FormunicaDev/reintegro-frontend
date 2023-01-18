import axios from 'axios'

export default {
  async getTipopago(perPage) {
    let data = []
    await axios.get(`/api/tipopago?perPage=${perPage}`).then(response => {
      data = response.data
    })

    return data
  },
}
