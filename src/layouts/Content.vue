<!-- eslint-disable vue/valid-v-for -->
<template>
  <v-app>
    <vertical-nav-menu :is-drawer-open.sync="isDrawerOpen"></vertical-nav-menu>

    <v-app-bar
      app
      flat
      absolute
      color="transparent"
    >
      <div class="boxed-container w-full">
        <div class="d-flex align-center mx-6">
          <!-- Left Content -->
          <v-app-bar-nav-icon
            class="d-block d-lg-none me-2"
            @click="isDrawerOpen = !isDrawerOpen"
          ></v-app-bar-nav-icon>

          <v-spacer></v-spacer>

          <!-- Right Content -->
          <theme-switcher></theme-switcher>
          <v-menu
            v-if="alert"
            offset-y
            left
            nudge-bottom="14"
            min-width="230"
            content-class="user-profile-menu-content"
            max-height="200"
          >
            <template v-slot:activator="{on,attrs}">
              <v-badge
                :content="cantidad"
                :value="cantidad"
                color="success"
                overlap
              >
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="notification()"
                >
                  {{ icons.mdiBellOutline }}
                </v-icon>
              </v-badge>
            </template>
            <v-list shaped>
              <v-list-item-group class="scrollList">
                <template v-for="(item,i) in items">
                  <v-divider
                    v-if="!item"
                    :key="`divider-${i}`"
                    class="my-2"
                  >
                  </v-divider>
                  <v-list-item
                    v-else
                    :key="`item-${i}`"
                    link
                    :value="item"
                  >
                    <v-list-item-icon class="me-2">
                      <v-icon size="18">
                        {{ icons.mdiBellRing }}
                      </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        <small>{{ item.USUARIO }}</small>
                      </v-list-item-title>
                      <v-list-item-title>{{ item.Descripcion }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider
                    class="my-2"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
          </v-menu>
          <app-bar-user-menu></app-bar-user-menu>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <div class="app-content-container boxed-container pa-6">
        <slot></slot>
      </div>
    </v-main>

    <v-footer
      app
      inset
      color="transparent"
      absolute
      height="56"
      class="px-0"
    >
      <div class="boxed-container w-full">
        <div class="mx-6 d-flex justify-space-between">
          <span>
            &copy; 2022 <a
              class="text-decoration-none"
              target="_blank"
            >FORMUNICA S.A</a></span>
          <span class="d-sm-inline d-none">
            <a
              target="_blank"
              class="text--secondary text-decoration-none"
            >Formuladora Nicaraguense Hanon Talavera</a>
          </span>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios'
import { ref } from '@vue/composition-api'
import { mdiMagnify, mdiBellOutline, mdiBellRing } from '@mdi/js'
import VerticalNavMenu from './components/vertical-nav-menu/VerticalNavMenu.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import AppBarUserMenu from './components/AppBarUserMenu.vue'
import paisService from '@/services/country'

export default {
  components: {
    VerticalNavMenu,
    ThemeSwitcher,
    AppBarUserMenu,
  },
  setup() {
    const isDrawerOpen = ref(null)

    return {
      isDrawerOpen,
      insert: false,
      alert: true,
      Pais: [],
      dataCountry: [],

      // Icons
      icons: {
        mdiMagnify,
        mdiBellOutline,
        mdiBellRing,
      },
    }
  },
  data() {
    return {
      cantidad: 0,
      items: [],
      status: '',
    }
  },
  mounted() {
    this.getCountry()
    this.notification()
  },
  created() {
    this.getCountry()
    this.notification()
  },
  methods: {
    notification() {
      const role = sessionStorage.getItem('roleRei')
      this.status = this.getStatus(role)
      axios.get(`/api/reintegro?status=${this.status}&option=2&perPage=1000&Pais=${this.Pais}`).then(response => {
        this.items = response.data.data
        this.cantidad = this.items.length
      }).catch(error => {
        console.log(error)
      })
    },
    getStatus(role) {
      if (role === '1502') return '3'
      if (role === '1501') return '1'

      return '1'
    },
    async getCountry() {
      const data = await paisService.country()
      this.dataCountry = data
      this.Pais = []
      this.Pais.push(this.dataCountry[0].IdPais)
    },
  },
}
</script>

<style lang="scss" scoped>
.v-app-bar ::v-deep {
  .v-toolbar__content {
    padding: 0;

    .app-bar-search {
      .v-input__slot {
        padding-left: 18px;
      }
    }
  }
}

.boxed-container {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}
</style>
