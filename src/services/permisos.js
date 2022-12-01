/* eslint-disable no-undef */
import axios from 'axios'

export default {
  data: () => ({
    user: '',
    role: '',
    dataPermisos: [],
  }),
  async obtenerPermisos() {
    this.user = sessionStorage.getItem('userRei')
    this.role = sessionStorage.getItem('roleRei')
    axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknReiFormunica')}`

    const res = await axios.get(`/api/permisos/${this.user}?role=${this.role}`).then(response => response.data)

    return res
  },
}
