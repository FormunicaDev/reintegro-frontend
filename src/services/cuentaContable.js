import axios from 'axios'

export default {
  async getRelacionCuentaUser(perPage) {
    let data = []
    await axios.get(`/api/cuentacontableuser?perPage=${perPage}`).then(res => {
      data = res.data.data
    })

    return data
  },
  async createRelacionCuentaUser(obj) {
    let data = []
    await axios.post('/api/cuentacontableuser', obj).then(res => {
      data = res.data
    })

    return data
  },
  async anularRelacionCuentaUser(Id) {
    let data = []
    await axios.delete(`/api/cuentacontableuser/${Id}`).then(res => {
      data = res.data
    })

    return data
  },
  async listarCuentasContables() {
    let data = []
    await axios.get('/api/cuentacontable').then(res => {
      data = res.data.data
    })

    return data
  },
  async activarRelacionCuentaUser(Id) {
    let data = []
    await axios.put(`/api/cuentacontableuser/${Id}`).then(res => {
      data = res.data
    })

    return data
  },
}
