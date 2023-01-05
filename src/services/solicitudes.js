import axios from 'axios'
import validateToken from './validateToken'

export default {
  async reintegro(role, pais) {
    let data = []
    const perPage = 10
    await axios.get(`/api/reintegrobyrol?perPage=${perPage}&IdRole=${role}&Pais=${pais}&option=1`).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
  async reintegroByBeneficiario(beneficiario, pais, page) {
    let data = []
    await axios.get(`/api/reintegrobybeneficiario?Pais=${pais}&beneficiario=${beneficiario}&page=${page}&option=3`).then(response => {
      data = response.data
    }).catch(error => {
      data = error
    })

    return data
  },
  async reintegroByFechas(Pais, inicio, fin, page) {
    let data = []
    await axios.get(`/api/reintegrobyfechas?Pais=${Pais}&fechaInicio=${inicio}&fechaFin=${fin}&page=${page}&option=4`).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
  async reintegroByStatus(status, pais) {
    let data = []
    await axios.get(`/api/reintegro?status=${status}&Pais=${pais}&option=2`).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
  async reintegroById(id, role, pais) {
    let data = []
    await axios.get(`/api/reintegro/${id}?IdRole=${role}&Pais=${pais}&option=5`).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
  async updateReintegro(IdSol, state) {
    let data = []
    await axios.put(`/api/reintegroStatus/${IdSol}`, { status: state }).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
  async reintegroPagination(perPage, page, role, pais) {
    let data = []
    await axios.get(`/api/reintegrobyrol?perPage=${perPage}&page=${page}&IdRole=${role}&Pais=${pais}&option=1`).then(res => {
      data = res.data
    }).catch(err => {
      if (err.response.data.mensaje === 'invalid') {
        validateToken.logout()
        this.$router.push({ name: 'pages-login' })
      }
    })

    return data
  },
  async reintegroPaginationStatus(perPage, statusCodeSol, role, Pais, page) {
    let data = []
    await axios.get(`/api/reintegro?perPage=${perPage}&status=${statusCodeSol}&IdRole=${role}&Pais=${Pais}&page=${page}&option=2`).then(res => {
      data = res.data
    })

    return data
  },
}
