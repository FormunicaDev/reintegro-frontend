import axios from 'axios'

export default {
  async listarUsuario() {
    let data = []

    await axios.get('/api/user').then(res => {
      data = res.data
    }).catch(err => {
      data = err
    })

    return data
  },
}
