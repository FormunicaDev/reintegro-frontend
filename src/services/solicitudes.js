import axios from 'axios'

export default {
  async reintegroByBeneficiario(beneficiario, pais) {
    let data = []
    await axios.get(`/api/reintegrobybeneficiario?Pais=${pais}&beneficiario=${beneficiario}`).then(response => {
      data = response.data
    }).catch(error => {
      data = error
    })

    return data
  },
  async reintegroByFechas(Pais, inicio, fin) {
    let data = []
    await axios.get(`/api/reintegrobyfechas?Pais=${Pais}&fechaInicio=${inicio}&fechaFin=${fin}`).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
  async reintegroByStatus(status, pais) {
    let data = []
    await axios.get(`/api/reintegro?status=${status}&Pais=${pais}`).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
  async reintegroById(id, role, pais) {
    let data = []
    await axios.get(`/api/reintegro/${id}?IdRole=${role}&Pais=${pais}`).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
}
