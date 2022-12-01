<template>
  <v-row>
    <v-col
      cols="12"
      md="4"
    >
      <dashboard-user></dashboard-user>
    </v-col>
    <v-col
      cols="12"
      md="8"
    >
      <dashboard-solicitudes></dashboard-solicitudes>
    </v-col>
    <v-col
      cols="12"
      md="12"
    >
      <dashboard-chart-vue></dashboard-chart-vue>
    </v-col>
  </v-row>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import axios from 'axios'
import validateLogin from '@/services/validateLogin'
import actions from '@/services/action'

// components
import DashboardUser from './DashboardUser.vue'
import DashboardSolicitudes from './DashboardSolicitudes.vue'
import DashboardChartVue from './DashboardChart.vue'

export default {
  components: {
    DashboardUser,
    DashboardSolicitudes,
    DashboardChartVue,
  },
  setup() {
    return {
    }
  },
  created() {
    this.getPermisos()
  },
  methods: {
    comprobarLogin() {
      const acciones = actions.enumActions()
      // eslint-disable-next-line eqeqeq
      const access = this.permisos.find(element => element.IDACCION == acciones.ACCESO_AL_SISTEMA)

      if (access === 0 || access === null || access === undefined) {
        this.$router.push('/dashboard')
      }

      if (!validateLogin.validateToken()) {
        this.$router.push('/')
      }
    },
    async getPermisos() {
      const user = sessionStorage.getItem('userRei')
      const role = sessionStorage.getItem('roleRei')
      await axios.get(`/api/permisos/${user}?role=${role}`).then(response => {
        this.permisos = response.data.data
        this.comprobarLogin()
      }).catch(error => {
        console.log(error)
      })
    },
  },
}
</script>
