<template>
  <v-card class="rounded-xl">
    <v-card-title class="align-start">
      <span class="font-weight-semibold">Solicitudes Ingresadas</span>
      <v-spacer></v-spacer>
    </v-card-title>

    <v-card-subtitle class="mb-8 mt-n5">
      <span class="font-weight-semibold text--primary me-1">Total de solicitudes ingresadas: </span>
      <span>0</span>
    </v-card-subtitle>

    <v-card-text>
      <v-row>
        <v-col
          v-if="loading"
          cols="12"
          md="12"
        >
          <v-skeleton-loader
            class="mx-auto"
            max-width="500"
            max-height="300"
            type="list-item-avatar, divider, list-item-three-line, card-heading, image, actions"
          ></v-skeleton-loader>
        </v-col>

        <v-col
          v-for="data in statisticsData"
          :key="data.title"
          cols="6"
          md="3"
          class="d-flex align-center"
        >
          <v-avatar
            size="44"
            :color="colorStadistics(data.title)"
            rounded
            class="elevation-1"
          >
            <v-icon
              dark
              color="white"
              size="30"
            >
              {{ iconsStadistics(data.title) }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              {{ data.title }}
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ data.total }}
            </h3>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiAccountOutline, mdiCurrencyUsd, mdiClipboardClockOutline, mdiDotsVertical, mdiLabelOutline, mdiCodeNotEqualVariant, mdiDraw, mdiStickerCheckOutline, mdiCodeTagsCheck } from '@mdi/js'
import axios from 'axios'

export default {
  setup() {
    return {
      // icons

    }
  },
  data: () => ({
    loading: false,
    statisticsData: [],
    dataCountry: [],
    Pais: [],
    icons: {
      mdiDotsVertical,
      mdiClipboardClockOutline,
      mdiAccountOutline,
      mdiLabelOutline,
      mdiCurrencyUsd,
      mdiCodeNotEqualVariant,
      mdiDraw,
      mdiStickerCheckOutline,
      mdiCodeTagsCheck,
    },
  }),
  created() {
    this.getCountry()
    this.getEstadistica()
  },
  methods: {
    getEstadistica() {
      const role = sessionStorage.getItem('roleRei')
      const user = sessionStorage.getItem('userRei')
      this.loading = true
      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknReiFormunica')}`
      setTimeout(() => {
        if (role === '1500') {
          axios.get(`/api/estadistica?Pais=${this.Pais}`).then(response => {
            this.statisticsData = response.data
            this.loading = false
          }).catch(error => {
            console.log(error)
            this.loading = false
          })
        } else {
          axios.get(`/api/estadistica?user=${user}&Pais=${this.Pais}`).then(response => {
            this.statisticsData = response.data
            this.loading = false
          }).catch(error => {
            console.log(error)
            this.loading = false
          })
        }
      }, 1000)
    },
    iconsStadistics(data) {
      if (data === 'Pendiente') return mdiClipboardClockOutline
      if (data === 'Aprobado') return mdiCodeTagsCheck
      if (data === 'Atendido') return mdiLabelOutline
      if (data === 'Finalizado') return mdiStickerCheckOutline
      if (data === 'En Firma') return mdiDraw

      return mdiCodeNotEqualVariant
    },
    colorStadistics(data) {
      if (data === 'Pendiente') return '#2596be'
      if (data === 'Aprobado') return '#006666'
      if (data === 'Atendido') return '#96E637'
      if (data === 'En Firma') return '#FFB61F'
      if (data === 'Finalizado') return '#4B731B'

      return '#82937A'
    },
    getCountry() {
      this.loadCountry = true
      const user = sessionStorage.getItem('userRei')
      axios.get(`/api/countrybyuser?user=${user}`).then(response => {
        this.dataCountry = response.data
        this.Pais = []
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < this.dataCountry.length; index++) {
          this.Pais.push(this.dataCountry[index].IdPais)
        }
        this.loadCountry = false
      }).catch(error => {
        console.log(error)
        this.loadCountry = false
      })
    },
  },
}
</script>
