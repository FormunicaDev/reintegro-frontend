<template>
  <v-navigation-drawer
    :value="isDrawerOpen"
    app
    floating
    width="260"
    class="app-navigation-menu"
    :right="$vuetify.rtl"
    @input="val => $emit('update:is-drawer-open', val)"
  >
    <!-- Navigation Header -->
    <div class="vertical-nav-header d-flex items-center ps-6 pe-5 pt-5 pb-2">
      <router-link
        to="/"
        class="d-flex align-center text-decoration-none"
      >
        <v-img
          :src="require($vuetify.theme.dark? '@/assets/images/logos/formunica.png':'@/assets/images/logos/formunica2.png')"
          max-height="50px"
          max-width="200px"
          alt="logo"
          contain
          eager
          class="app-logo me-3"
        ></v-img>
        <v-slide-x-transition>
        </v-slide-x-transition>
      </router-link>
    </div>

    <!-- Navigation Items -->
    <v-list
      expand
      shaped
      class="vertical-nav-menu-items pr-5"
    >
      <nav-menu-link
        title="Inicio"
        :to="{ name: 'dashboard' }"
        :icon="icons.mdiHomeOutline"
      ></nav-menu-link>
      <nav-menu-link
        title="Cuenta"
        :to="{ name: 'pages-account-settings'}"
        :icon="icons.mdiAccountCogOutline"
      ></nav-menu-link>
      <nav-menu-section-title title="COMPROMETIDOS CON TU COSECHA"></nav-menu-section-title>
      <nav-menu-link
        title="Reintegro"
        :to="{ name: 'reintegro' }"
        :icon="icons.mdiCashRefund"
      ></nav-menu-link>
      <nav-menu-link
        v-if="accessProp"
        title="Solicitudes"
        :to="{ name: 'solicitudes' }"
        :icon="icons.mdiCashCheck"
      ></nav-menu-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiHomeOutline,
  mdiAlphaTBoxOutline,
  mdiEyeOutline,
  mdiCreditCardOutline,
  mdiTable,
  mdiFileOutline,
  mdiFormSelect,
  mdiAccountCogOutline,
  mdiCashRefund,
  mdiCashCheck,
} from '@mdi/js'
import axios from 'axios'
import NavMenuSectionTitle from './components/NavMenuSectionTitle.vue'
import NavMenuLink from './components/NavMenuLink.vue'
import actions from '@/services/action'

export default {
  components: {
    NavMenuSectionTitle,
    NavMenuLink,
  },
  props: {
    isDrawerOpen: {
      type: Boolean,
      default: null,
    },
    accessProp: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {
      icons: {
        mdiHomeOutline,
        mdiAlphaTBoxOutline,
        mdiEyeOutline,
        mdiCreditCardOutline,
        mdiTable,
        mdiFileOutline,
        mdiFormSelect,
        mdiAccountCogOutline,
        mdiCashRefund,
        mdiCashCheck,
      },
      access: {
        solicitudes: false,
        reintegro: false,
      },
      permisos: [],
    }
  },
  mounted() {
    this.getPermisos()
  },
  created() {
    this.getPermisos()
  },
  methods: {
    validarPermisos() {
      const acciones = actions.enumActions()
      // eslint-disable-next-line eqeqeq
      const res = this.permisos.find(element => element.IDACCION == acciones.VISUALIZAR_SOLICITUDES)
      const usuario = res.USUARIO
      if (usuario !== '') {
        this.access.solicitudes = true
      }
    },
    async getPermisos() {
      const user = sessionStorage.getItem('userRei')
      const role = sessionStorage.getItem('roleRei')
      await axios.get(`/api/permisos/${user}?role=${role}`).then(response => {
        this.permisos = response.data.data
        this.validarPermisos()
      }).catch(error => {
        console.log(error)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.3px;
}

// ? Adjust this `translateX` value to keep logo in center when vertical nav menu is collapsed (Value depends on your logo)
.app-logo {
  transition: all 0.18s ease-in-out;
  .v-navigation-drawer--mini-variant & {
    transform: translateX(-4px);
  }
}

@include theme(app-navigation-menu) using ($material) {
  background-color: map-deep-get($material, 'background');
}

.app-navigation-menu {
  .v-list-item {
    &.vertical-nav-menu-link {
      ::v-deep .v-list-item__icon {
        .v-icon {
          transition: none !important;
        }
      }
    }
  }
}

// You can remove below style
// Upgrade Banner
.app-navigation-menu {
  .upgrade-banner {
    position: absolute;
    bottom: 13px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
