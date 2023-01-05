import axios from 'axios'

export default {
  async obtenerBancos() {
    let data = []

    await axios.get('/api/banco').then(res => {
      data = res.data
    })

    return data
  },
  async obtenerBancoPais(Pais) {
    let data = []

    await axios.get(`/api/banco?Pais=${Pais}`).then(res => {
      data = res.data
    })

    return data
  },

}
