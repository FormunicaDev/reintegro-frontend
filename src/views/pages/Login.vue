<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card class="auth-card rounded-xl">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-7">
          <router-link
            to="/"
            class="d-flex align-center"
          >
            <v-img
              :src="require('@/assets/images/logos/logoformunica.png')"
              max-height="40px"
              max-width="40px"
              alt="logo"
              contain
              class="me-3 "
            ></v-img>

            <h2 class="text-2xl font-weight-semibold">
              Formunica-Reintegro
            </h2>
          </router-link>
        </v-card-title>

        <!-- title -->
        <v-card-text>
          <p class="text-2xl font-weight-semibold text--primary mb-2">
            ¡Bienvenido!
          </p>
          <p class="mb-2">
            Favor autenticarse con sus credenciales Formunica
          </p>
        </v-card-text>

        <!-- login form -->
        <v-card-text>
          <v-text-field
            v-model="userData.USUARIO"
            outlined
            label="Usuario"
            placeholder="user@formunica.com"
            hide-details
            class="mb-3"
            @keyup.enter="login"
          ></v-text-field>

          <v-text-field
            v-model="userData.PASSWORD"
            outlined
            :type="isPasswordVisible ? 'text' : 'password'"
            label="Contraseña"
            placeholder="············"
            :append-icon="isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline"
            hide-details
            @click:append="isPasswordVisible = !isPasswordVisible"
            @keyup.enter="login"
          ></v-text-field>
          <v-form>
            <v-btn
              block
              color="primary"
              :disabled="enabledBtn"
              class="mt-6"
              @click="login()"
            >
              Iniciar Sesión
            </v-btn>
          </v-form>
        </v-card-text>
        <v-dialog
          v-model="dialog"
          hide-overlay
          persistent
          width="300"
        >
          <v-card
            color="primary"
            dark
          >
            <v-card-text>
              Iniciando Sesión...
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- create new account  -->
        <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
          <span class="me-2">
            ¿Nuevo en la plataforma?
          </span>
          <span>
            <strong>Pongase en contacto con el area de IT</strong>
          </span>
        </v-card-text>

        <!-- divider -->
        <v-card-text class="d-flex align-center mt-2">
          <v-divider></v-divider>
          <span class="mx-5">o</span>
          <v-divider></v-divider>
        </v-card-text>

        <v-snackbar
          v-model="snackbar"
        >
          {{ text }}

          <template v-slot:action="{ attrs }">
            <v-btn
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
        <!-- social links -->
      </v-card>
    </div>

    <!-- background triangle shape  -->
    <img
      class="auth-mask-bg"
      height="173"
      :src="require(`@/assets/images/misc/mask-${$vuetify.theme.dark ? 'dark':'light'}.png`)"
    >

    <!-- tree -->
    <v-img
      class="auth-tree"
      width="247"
      height="185"
      src="@/assets/images/misc/tree-green.png"
    ></v-img>

    <!-- tree  -->
    <v-img
      class="auth-tree-3"
      width="377"
      height="289"
      src="@/assets/images/misc/tree-3-green.png"
    ></v-img>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'
import axios from 'axios'

export default {
  setup() {
    const isPasswordVisible = ref(false)

    return {
      isPasswordVisible,

      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
    }
  },
  data: () => ({
    email: '',
    name: '',
    userName: '',
    userData: {
      USUARIO: '',
      PASSWORD: '',
    },
    snackbar: false,
    text: '',
    enabledBtn: false,
    dialog: false,
  }),
  created() {
  },
  methods: {
    login() {
      if (this.userData.USUARIO === '') {
        this.snackbar = true
        this.text = 'Favor ingrese su usuario'
      } else if (this.userData.PASSWORD === '') {
        this.snackbar = true
        this.text = 'Favor ingrese su contraseña'
      } else {
        this.enabledBtn = true
        this.dialog = true
        axios.post('/api/login', this.userData).then(response => {
          if (response.data.StatusCode === 404) {
            this.snackbar = true
            this.text = response.data.mensaje
            this.enabledBtn = false
            this.dialog = false
          } else {
            sessionStorage.setItem('tknReiFormunica', response.data.token)
            sessionStorage.setItem('userRei', response.data.user)
            sessionStorage.setItem('roleRei', response.data.rol)
            sessionStorage.setItem('countryUser', response.data.country)
            axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.tknReiFormunica}`
            this.$router.push({ name: 'dashboard' })
            this.enabledBtn = false
            this.dialog = false
          }
        }).catch(error => {
          this.snackbar = true
          this.text = error.response.data.mensaje
          this.enabledBtn = false
          this.dialog = false
        })
      }
    },

  },
}
</script>

<style lang="scss">
@import '~@/plugins/vuetify/default-preset/preset/pages/auth.scss';
</style>
