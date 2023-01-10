import axios from 'axios'

export default {
  activarRelacionCentroUser() {

  },
  anularRelacionCentroUser() {

  },
  async listarCentroCostos() {
    let data = []

    await axios.get('/api/centrocostorei').then(res => {
      data = res.data
    })

    return data
  },
  async listarCentroCostoUser() {
    let data = []
    await axios.get('/api/centrocostouser').then(res => {
      data = res.data
    })

    return data
  },
  async listarCentroCostoUserPagination(perPage, page) {
    let data = []
    await axios.get(`/api/centrocostouser?perPage=${perPage}&page=${page}`).then(res => {
      data = res.data
    })

    return data
  },
  async createCentroCostoUser(obj) {
    let data = []
    await axios.post('/api/centrocostouser', obj).then(res => {
      data = res.data
    })

    return data
  },
}
