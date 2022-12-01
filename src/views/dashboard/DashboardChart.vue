<template>
  <v-card class="rounded-xl">
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
            type="list-item-avatar, divider, list-item-three-line, card-heading, image, actions"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="6">
          <vue-apex-charts
            v-if="!loading"
            type="pie"
            :options="chartOptions"
            :series="series"
            width="100%"
          ></vue-apex-charts>
        </v-col>
        <v-col cols="6">
          <vue-apex-charts
            v-if="!loading"
            type="bar"
            :options="chartOptionsBar"
            :series="seriesBar"
            width="100%"
          ></vue-apex-charts>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'
import VueApexCharts from 'vue-apexcharts'
// eslint-disable-next-line object-curly-newline
import { mdiDotsVertical, mdiTrendingUp, mdiCurrencyUsd } from '@mdi/js'

export default {
  components: {
    VueApexCharts,
  },
  setup() {
    return {

      icons: {
        mdiDotsVertical,
        mdiTrendingUp,
        mdiCurrencyUsd,
      },
    }
  },
  data: () => ({
    loading: false,
    series: [],
    url: '',
    seriesBar: [{ data: [] }],
    chartOptions: {
      chart: {
        width: 350,
        type: 'pie',
      },
      labels: [],
      theme: {
        monochrome: {
          enabled: false,
        },
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      }],
    },
    chartOptionsBar: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
      },
    },

  }),
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      const role = sessionStorage.getItem('roleRei')
      const user = sessionStorage.getItem('userRei')

      if (role === '1500') {
        this.url = '/api/estadistica'
      } else {
        this.url = `/api/estadistica?user=${user}`
      }
      axios.get(this.url).then(response => {
        // this.series = response.data.map(element => parseInt(element.total, 10))
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < response.data.length; index++) {
          // eslint-disable-next-line radix
          this.series.push(parseInt(response.data[index].total))
          // eslint-disable-next-line radix
          this.seriesBar[0].data.push(parseInt(response.data[index].total))
          this.chartOptions.labels.push(response.data[index].title)
          this.chartOptionsBar.xaxis.categories.push(response.data[index].title)
        }

        // this.chartOptions.labels = response.data.map(element => String(element.title))
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
  },
}
</script>
