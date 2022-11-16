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
      <dashboard-statistics-card></dashboard-statistics-card>
    </v-col>
  </v-row>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import validateLogin from '@/services/validateLogin'

// demos
import DashboardUser from './DashboardUser.vue'

export default {
  components: {
    DashboardUser,
  },
  setup() {
    return {
    }
  },
  created() {
    this.comprobarLogin()
  },
  methods: {
    comprobarLogin() {
      if (!validateLogin.validateToken()) {
        this.$router.push('/')
      }
    },
  },
}
</script>
