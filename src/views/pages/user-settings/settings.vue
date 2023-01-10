<template>
  <v-card
    id="account-setting-card"
    elevation="7"
    class="rounded-xl"
  >
    <!-- tabs -->
    <v-tabs
      v-model="tab"
      show-arrows
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab.icon"
      >
        <v-icon
          size="20"
          class="me-3"
        >
          {{ tab.icon }}
        </v-icon>
        <span>{{ tab.title }}</span>
      </v-tab>
    </v-tabs>

    <!-- tabs item -->
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <setting-cuenta-contable></setting-cuenta-contable>
      </v-tab-item>

      <v-tab-item>
        <setting-centro-costo></setting-centro-costo>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import {
  mdiMagnify, mdiDelete, mdiReload, mdiRefreshCircle, mdiSetCenter, mdiAccountCashOutline,
} from '@mdi/js'
import { ref } from '@vue/composition-api'
import validateLogin from '@/services/validateLogin'
import actions from '@/services/action'
import settingCuentaContable from './settingCuentaContable.vue'
import settingCentroCosto from './settingCentroCosto.vue'

export default {
  components: {
    settingCuentaContable,
    settingCentroCosto,
  },
  setup() {
    const tab = ref('')

    const tabs = [
      { title: 'Cuenta Contable', icon: mdiAccountCashOutline },
      { title: 'Centro de Costo', icon: mdiSetCenter },
    ]

    return {
      tabs,
      tab,
    }
  },
  data: () => ({
    icons: {
      mdiMagnify,
      mdiDelete,
      mdiReload,
      mdiRefreshCircle,
    },
  }),
  created() {
  },
  methods: {
    comprobarLogin() {
      const acciones = actions.enumActions()
      // eslint-disable-next-line eqeqeq
      const access = this.permisos.find(element => element.IDACCION == acciones.VISUALIZAR_SOLICITUDES)

      if (access === 0 || access === null || access === undefined) {
        this.$router.push('/dashboard')
      }

      if (!validateLogin.validateToken()) {
        this.$router.push('/')
      }
    },
  },
}
</script>
