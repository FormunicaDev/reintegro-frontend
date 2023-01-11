import axios from 'axios'

export default {
  activarRelacionCentroUser() {

  },
  anularRelacionCentroUser() {

  },
  async centroCosto(perPage, pais) {
    let data = []
    axios.get(`/api/centrocosto?perPage=${perPage}&pais=${pais}`).then(res => {
      data = res.data
    })

    return data
  },
  async listarCentroCostos(country) {
    let data = []

    await axios.get(`/api/centrocostorei?Pais=${country}`).then(res => {
      data = res.data
    })

    return data
  },
  async listarCentroCostoUser(user) {
    let data = []
    await axios.get(`/api/centrocostouser?user=${user}`).then(res => {
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
