import axios from 'axios'

export default {
  async status() {
    const role = sessionStorage.getItem('roleRei')
    let data = []
    await axios.get(`/api/statusbyrole?IdRole=${role}`).then(response => {
      data = response.data
    }).catch(error => {
      data = error
    })

    return data
  },
}
