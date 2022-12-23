import axios from 'axios'

export default {
  async country() {
    let data = []
    const user = sessionStorage.getItem('userRei')
    await axios.get(`/api/countrybyuser?user=${user}`).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
}
