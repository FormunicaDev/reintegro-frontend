<template>
  <v-card
    elevation="7"
    class="rounded-xl"
  >
    <v-card-title>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="dataReintegro"
      :search="search"
      sort-by="FechaRegistro"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:top>
        <v-snackbar
          v-model="snackbar"
          color="success"
          outlined
          rounded="pill"
        >
          {{ text }}

          <template v-slot:action="{ attrs }">
            <v-btn
              color="color"
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
        <div class="text-center">
          <v-overlay :value="overlay">
            <v-progress-circular
              indeterminate
              size="64"
            ></v-progress-circular>
          </v-overlay>
        </div>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Solicitudes de Reintegro</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <h4>Total de Registros: {{ totalRegistros }}</h4>
          <v-spacer></v-spacer>
          <v-autocomplete
            v-model="statusCodeSol"
            :items="dataStatus"
            outlined
            dense
            label="Estado"
            persistent-hint
            :item-text="concat"
            item-value="CodEstado"
            :prepend-icon="icons.mdiMagnify"
            clearable
            @input="filtrar()"
          >
          </v-autocomplete>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-icon
            size="45px"
            @click="getReintegro()"
          >
            {{ icons.mdiRefreshCircle }}
          </v-icon>
          <v-col cols="auto">
            <v-dialog
              v-model="dialog2"
              transition="dialog-top-transition"
              max-width="1500"
            >
              <template v-slot:default="dialog2">
                <v-card
                  elevation="7"
                  class="rounded-xl"
                >
                  <v-toolbar
                    color="primary"
                    dark
                  >
                    Detalles de la Solicitud
                  </v-toolbar>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col
                          cols="12"
                        >
                          <v-data-table
                            :headers="headersDetails"
                            :items="dataDetalleReintegro"
                            class="elevation-7 rounded-xl"
                            :loading="loadingData"
                            loading-text="Cargando... Por Favor espere"
                          >
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn
                      text
                      @click="dialog2.value = false"
                    >
                      Cerrar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          medium
          @click="getSolicitudDetalle(item)"
        >
          {{ icons.mdiClipboardList }}
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="getReintegro()"
        >
          No Existen Datos
        </v-btn>
      </template>
      <template v-slot:[`item.nameStatus`]="{item}">
        <v-chip
          small
          :color="getColor(item.nameStatus)"
          dark
          class="font-weight-medium"
        >
          {{ item.nameStatus }}
        </v-chip>
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="totalPagina"
          circle
          :total-visible="7"
          @input="pagination()"
        ></v-pagination>
      </div>
    </template>
  </v-card>
</template>

<script>
import {
  mdiDelete,
  mdiPencil,
  mdiRefreshCircle,
  mdiEyeCircle,
  mdiWidgets,
  mdiTable,
  mdiClipboardList,
  mdiClipboardListOutline,
  mdiPageLayoutHeader,
  mdiVuetify,
  mdiMagnify,
} from '@mdi/js'
import axios from 'axios'
import validateLogin from '@/services/validateLogin'
import validateToken from '@/services/validateToken'
import actions from '@/services/action'

export default {

  data: () => ({
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    menu: false,
    icons: {
      mdiPencil,
      mdiDelete,
      mdiRefreshCircle,
      mdiEyeCircle,
      mdiWidgets,
      mdiTable,
      mdiClipboardList,
      mdiClipboardListOutline,
      mdiPageLayoutHeader,
      mdiVuetify,
      mdiMagnify,
    },
    dialog: false,
    dialog2: false,
    dialogLoad: false,
    dialogDelete: false,
    snackbar: false,
    overlay: false,
    loadingData: false,
    loadingProrrateo: false,
    switch1: false,
    loadDelete: false,
    row: null,
    text: '',
    color: '',
    search: '',
    page: 1,
    totalPagina: 0,
    totalRegistros: 0,
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'IdSolicitud',
      },
      { text: 'Centro de Costo', value: 'CENTRO_COSTO' },
      { text: 'Fecha de Solicitud', value: 'FechaSolicitud' },
      { text: 'Monto', value: 'Monto' },
      { text: 'Estado', value: 'nameStatus' },
      { text: 'Tipo de Pago', value: 'Descripcion' },
      { text: 'Beneficiario', value: 'Beneficiario' },
      { text: 'Concepto', value: 'Concepto' },
      { text: 'Cuenta de Banco', value: 'CUENTA_BANCO' },
      { text: 'Usuario', value: 'USUARIO' },
      { text: '', value: 'actions', sortable: false },
    ],
    headersDetails: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'IdSolicitud',
      },
      { text: 'Centro de Costo', value: 'CENTRO_COSTO' },
      { text: 'Cuenta Contable', value: 'Cuenta_Contable' },
      { text: 'Linea', value: 'Linea' },
      { text: 'Concepto', value: 'Concepto' },
      { text: 'Fecha Factura', value: 'FechaFactura' },
      { text: 'Numero Factura', value: 'NumeroFactura' },
      { text: 'Establecimiento', value: 'NombreEstablecimiento_Persona' },
      { text: 'Monto', value: 'Monto' },
    ],
    headersConcepto: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'IdConcepto',
      },
      { text: 'Concepto', value: 'strDescripcionConcepto' },
      { text: 'Linea', value: 'IdLinea' },
      { text: 'Centro de Costo', value: 'strCeCo' },
      { text: 'Cuenta Contable', value: 'strCuentaContable' },
      { text: 'Descripcion C. Costo', value: 'strDescripcionCeco' },
      { text: 'Establecimiento', value: 'strEstablecimiento' },
      { text: '# Empleados', value: 'intEmpleados' },
      { text: 'Monto', value: 'decMontoPro' },
      { text: 'Fecha Factura', value: 'datFechaFactura' },
      { text: '', value: 'actionsEdit', sortable: false },
    ],
    dataReintegro: [],
    dataDetalleReintegro: [],
    dataStatus: [],
    editedIndex: -1,
    items: [],
    actions: [],
    idSolicitud: '',
    conceptoID: 0,
    perPage: 10,
    statusCodeSol: '',
    linea: 0,
    ceco: 0,
    permisos: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nueva Solicitud' : 'Actualizar Producto'
    },
    imagen() {
      return this.imagenMiniatura
    },
    currentTitle() {
      switch (this.step) {
        case 1: return 'Información de la Solicitud'
        case 2: return 'Detalles de la Solicitud'
        default: return 'Solicitud Creada'
      }
    },
  },

  created() {
    this.getPermisos()
    this.getReintegro()
    this.getStatus()
  },

  methods: {
    deleteItem(item) {
      this.idSolicitud = item.IdSolicitud
      this.linea = item.Linea
      this.ceco = item.CENTRO_COSTO
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.deleteLinea()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },
    obtenerImagen(e) {
      const file = e.target.files[0]
      this.reintegroItem.Image = file
      this.cargarImage(file)
    },
    cargarImage(file) {
      const reader = new FileReader()
      reader.onload = e => {
        this.imagenMiniatura = e.target.result
      }
      reader.readAsDataURL(file)
    },

    closeDelete() {
      this.dialogDelete = false
    },
    getReintegro() {
      this.overlay = true

      // const role = sessionStorage.getItem('roleRei')

      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknReiFormunica')}`
      axios.get(`/api/reintegro?perPage?${this.perPage}`).then(response => {
        if (response.data.data === null) {
          this.snackbar = true
          this.text = 'No existen registros en la base de datos'
          this.overlay = false
          this.totalPagina = 0
          this.totalRegistros = 0
          this.page = 1
        } else {
          this.dataReintegro = response.data.data
          this.overlay = false
          this.totalPagina = response.data.last_page
          this.totalRegistros = response.data.total
          this.page = response.data.current_page
        }
      }).catch(error => {
        console.log(error.message)
        this.snackbar = true
        this.text = `${error.message} - Revise su conexion`
        this.overlay = false
        if (error.response.data.mensaje === 'invalid') {
          validateToken.logout()
          this.$router.push({ name: 'pages-login' })
        }
      })
    },
    pagination() {
      const status = this.statusCodeSol

      if (status === '' || status === null) {
        this.getReintegroPagination()
      } else {
        this.getReintegroPaginationStatus()
      }
    },
    getReintegroPagination() {
      this.overlay = true
      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknReiFormunica')}`
      axios.get(`/api/reintegro?perPage=${this.perPage}&page=${this.page}`).then(response => {
        if (response.data.data === null) {
          this.snackbar = true
          this.text = 'No existen registros en la base de datos'
          this.overlay = false
          this.totalPagina = 0
          this.totalRegistros = 0
        } else {
          this.dataReintegro = response.data.data
          this.overlay = false
          this.totalPagina = response.data.last_page
          this.totalRegistros = response.data.total
        }
      }).catch(error => {
        this.snackbar = true
        this.text = `${error.message} - Revise su conexion`
        this.overlay = false
        if (error.response.data.mensaje === 'invalid') {
          validateToken.logout()
          this.$router.push({ name: 'pages-login' })
        }
      })
    },
    getReintegroPaginationStatus() {
      this.overlay = true
      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknReiFormunica')}`
      axios.get(`/api/reintegro?perPage=${this.perPage}&page=${this.page}&status=${this.statusCodeSol}`).then(response => {
        if (response.data.data === null) {
          this.snackbar = true
          this.text = 'No existen registros en la base de datos'
          this.overlay = false
          this.totalPagina = 0
          this.totalRegistros = 0
        } else {
          this.dataReintegro = response.data.data
          this.overlay = false
          this.totalPagina = response.data.last_page
          this.totalRegistros = response.data.total
        }
      }).catch(error => {
        this.snackbar = true
        this.text = `${error.message} - Revise su conexion`
        this.overlay = false
        if (error.response.data.mensaje === 'invalid') {
          validateToken.logout()
          this.$router.push({ name: 'pages-login' })
        }
      })
    },
    getSolicitudDetalle(item) {
      this.dialog2 = true
      this.loadingData = true
      this.dataDetalleReintegro = []
      this.statusCodeSol = item.nameStatus
      this.idSolicitud = item.IdSolicitud
      axios.get(`/api/reintegrodetalle/${item.IdSolicitud}`).then(response => {
        if (response.data === null) {
          this.snackbar = true
          this.text = 'No Existen Registros en la base de datos'
          this.dataDetalleReintegro = []
          this.loadingData = false
        } else {
          this.loadingData = false
          this.dataDetalleReintegro = response.data
        }
      }).catch(error => {
        this.snackbar = true
        this.text = error.data.mensaje
        this.dataDetalleReintegro = []
        this.loadingData = false
      })
    },
    comprobarLogin() {
      const acciones = actions.enumActions()
      // eslint-disable-next-line eqeqeq
      const access = this.permisos.find(element => element.IDACCION == acciones.VER_SOLICITUDES_DE_TODOS_LOS_USUARIOS)

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
    getStatus() {
      axios.get('/api/status').then(response => {
        this.dataStatus = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    concat(item) {
      return `${item.Descripcion} - ${item.CodEstado}`
    },
    filtrar() {
      const status = this.statusCodeSol
      console.log(status)
      if (status === '' || status === null) {
        this.getReintegro()
      } else {
        this.overlay = true
        axios.get(`/api/reintegro?status=${status}`).then(response => {
          this.dataReintegro = response.data.data
          this.page = response.data.current_page
          this.totalPagina = response.data.last_page
          this.totalRegistros = response.data.total
          this.overlay = false
        }).catch(error => {
          this.snackbar = true
          this.text = error
          this.overlay = false
        })
      }
    },
    getColor(estado) {
      if (estado === 'Pendiente') return '#0288d1'
      if (estado === 'Aprobado') return '#00838f'
      if (estado === 'Atendido') return '#9e9d24'
      if (estado === 'En Firma') return '#c56000'
      if (estado === 'Finalizado') return '#2e7d32'
      if (estado === 'Rechazado') return '#7f0000'

      return '#102027'
    },
  },
}
</script>
