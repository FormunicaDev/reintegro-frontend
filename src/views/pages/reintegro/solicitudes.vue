<template>
  <v-card
    elevation="7"
    class="rounded-xl"
  >
    <v-expansion-panels focusable>
      <v-expansion-panel>
        <v-expansion-panel-header>Filtros</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container>
            <v-row>
              <v-col cols="7">
                <v-card
                  elevation="7"
                  class="rounded-xl"
                >
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <v-container fluid>
                          <v-radio-group
                            v-model="typeSearch"
                            row
                            label="Filtrar por:"
                            :default="0"
                          >
                            <v-radio
                              label="Estado"
                              :value="1"
                            ></v-radio>
                            <v-radio
                              label="ID Solicitud"
                              :value="2"
                            ></v-radio>
                            <v-radio
                              label="Beneficiario"
                              :value="3"
                            ></v-radio>
                            <v-radio
                              label="Rango de Fechas"
                              :value="4"
                            ></v-radio>
                          </v-radio-group>
                        </v-container>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="5">
                <v-card
                  elevation="7"
                  class="rounded-xl"
                >
                  <v-card-text>
                    <v-row>
                      <v-container>
                        <v-row>
                          <v-col
                            v-if="typeSearch === 1?true:false"
                            cols="8"
                          >
                            <v-autocomplete
                              v-if="typeSearch === 1?true:false"
                              v-model="statusCodeSol"
                              :items="dataStatus"
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
                          </v-col>
                          <v-col
                            v-if="typeSearch === 2? true:false"
                            cols="8"
                          >
                            <v-text-field
                              v-if="typeSearch === 2? true:false"
                              v-model="idSolicitud"
                              dense
                              label="Numero de Solicitud"
                              :prepend-icon="icons.mdiMagnify"
                              clearable
                              @keyup.enter="getReintegroById()"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col
                            v-if="typeSearch === 3? true:false"
                            cols="8"
                          >
                            <v-text-field
                              v-if="typeSearch === 3? true:false"
                              v-model="beneficiario"
                              dense
                              label="Beneficiario"
                              :prepend-icon="icons.mdiMagnify"
                              clearable
                              @keyup.enter="getReintegroByBeneficiario()"
                            >
                            </v-text-field>
                          </v-col>
                          <v-col
                            v-if="typeSearch === 4?true:false"
                            cols="9"
                          >
                            <v-row v-if="typeSearch === 4?true:false">
                              <v-col cols="6">
                                <v-menu
                                  v-model="menu2"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="datePicker"
                                      label="Fecha Inicio"
                                      :prepend-icon="icons.mdiCalendar"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="datePicker"
                                    @input="menu2 = false"
                                  ></v-date-picker>
                                </v-menu>
                              </v-col>
                              <v-col cols="6">
                                <v-menu
                                  v-model="menu1"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="datePicker2"
                                      label="Fecha Final"
                                      :prepend-icon="icons.mdiCalendar"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="datePicker2"
                                    @input="menu1 = false"
                                  ></v-date-picker>
                                </v-menu>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="2">
                            <v-btn
                              v-if="typeSearch !== 0?true:false"
                              color="primary"
                              outlined
                              dense
                              @click="filtrar()"
                            >
                              <v-icon>{{ icons.mdiMagnify }}</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-title>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-row>
      <v-col cols="4"></v-col>
      <v-col
        cols="4"
        align-self="center"
      >
        <v-alert
          v-model="alert"
          border="top"
          dense
          dismissible
          outlined
          type="info"
        >
          Asiento: {{ asiento }}
        </v-alert>
      </v-col>
    </v-row>
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
          color="primary"
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
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-col
            cols="12"
            sm="6"
            md="4"
          >
          </v-col>
          <v-autocomplete
            v-model="Pais"
            dense
            :items="dataCountry"
            item-text="Pais"
            item-value="IdPais"
            label="País"
            chips
            :loading="loadCountry"
            small-chips
            multiple
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
                      <v-row v-if="statusCodeSol === 'Pendiente' || statusCodeSol === 'Aprobado' || statusCodeSol === 'Atendido'? true:false">
                        <v-col
                          cols="12"
                          sm="6"
                          md="2"
                        >
                          <v-text-field
                            v-model="itemsDetail.centroCosto"
                            v-mask="'##-##-##'"
                            label="Centro de Costo"
                            outlined
                            dense
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="2"
                        >
                          <v-text-field
                            v-model="itemsDetail.cuentaContable"
                            v-mask="'#-##-##-###-###'"
                            label="Cuenta Contable"
                            outlined
                            dense
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="1"
                        >
                          <v-text-field
                            v-model="itemsDetail.Linea"
                            label="Linea"
                            outlined
                            dense
                            disabled
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="3"
                        >
                          <v-text-field
                            v-model="itemsDetail.concepto"
                            label="Concepto"
                            outlined
                            dense
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="3"
                        >
                          <v-text-field
                            v-model="itemsDetail.establecimiento"
                            label="Establecimiento"
                            outlined
                            dense
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="2"
                        >
                          <v-text-field
                            v-model="itemsDetail.numFactura"
                            label="# Factura"
                            outlined
                            dense
                          >
                          </v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          md="6"
                          sm="2"
                        >
                          <v-btn
                            v-if="statusCodeSol === 'Pendiente' || statusCodeSol === 'Aprobado' || statusCodeSol === 'Atendido'? true:false"
                            color="info"
                            outlined
                            @click="editLineasDetalles()"
                          >
                            Actualizar Linea
                          </v-btn>
                        </v-col>
                      </v-row>
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
                            <template v-slot:[`item.actionsDetails`]="{ item }">
                              <v-icon
                                v-if="statusCodeSol === 'Pendiente' || statusCodeSol === 'Aprobado' || statusCodeSol === 'Atendido'? true:false"
                                @click="selectDetails(item)"
                              >
                                {{ icons.mdiPencil }}
                              </v-icon>
                              <v-icon
                                v-if="statusCodeSol === 'Pendiente' || statusCodeSol === 'Aprobado' || statusCodeSol === 'Atendido'? true:false"
                                @click="deleteItem(item)"
                              >
                                {{ icons.mdiDelete }}
                              </v-icon>
                            </template>
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
                    <v-btn
                      v-if="role === 1501? true:false"
                      :disabled="statusCodeSol === 'Pendiente' || statusCodeSol === 'Aprobado' || statusCodeSol === 'Atendido'? false:true"
                      color="primary"
                      @click="putDetalleSolicitud()"
                    >
                      Guardar Cambios
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
            <v-dialog
              v-model="dialogStatus"
              max-width="700px"
            >
              <v-card
                elevation="7"
                class="rounded-xl"
              >
                <v-card-title>Cambiar solicitud numero {{ idSolicitud }} al estado {{ itemStatus.Descripcion }}</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn
                    text
                    @click="dialogStatus = false"
                  >
                    Cerrar
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="putStatusSolicitud()"
                  >
                    Ok
                    <v-progress-circular
                      v-if="loadChangeStatus"
                      indeterminate
                      color="white"
                    ></v-progress-circular>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="dialogDelete"
              max-width="600px"
            >
              <v-card class="rounded-xl">
                <v-card-title class="text-h5">
                  ¿Seguro que desea eliminar este elemento?
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="closeDelete"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="error"
                    @click="deleteItemConfirm()"
                  >
                    OK
                    <v-spacer v-if="loadDelete"></v-spacer>
                    <v-progress-circular
                      v-if="loadDelete"
                      indeterminate
                      color="white"
                    ></v-progress-circular>
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-row>
          <v-col>
            <v-icon
              medium
              @click="getSolicitudDetalle(item)"
            >
              {{ icons.mdiClipboardList }}
            </v-icon>
            <v-menu
              offset-y
              class="rounded-xl"
            >
              <template v-slot:activator="{ attrs, on }">
                <v-icon
                  medium
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ icons.mdiSwapVertical }}
                </v-icon>
              </template>

              <v-list>
                <v-list-item
                  v-for="items in dataStatus"
                  :key="items.CodEstado"
                  link
                  @click="changeStatus(item, items)"
                >
                  <v-list-item-title v-text="items.Descripcion"></v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
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
  mdiFormatListText,
  mdiSwapVertical,
  mdiCalendar,
} from '@mdi/js'
import axios from 'axios'
import solicitudService from '@/services/solicitudes'
import state from '@/services/status'
import paisService from '@/services/country'
import validateLogin from '@/services/validateLogin'
import validateToken from '@/services/validateToken'
import actions from '@/services/action'

export default {

  data: () => ({
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    datePicker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    datePicker2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
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
      mdiFormatListText,
      mdiSwapVertical,
      mdiCalendar,
    },
    dialog: false,
    dialog2: false,
    dialogLoad: false,
    dialogDelete: false,
    dialogStatus: false,
    snackbar: false,
    overlay: false,
    loadingData: false,
    loadingProrrateo: false,
    loadChangeStatus: false,
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
      { text: 'Asiento', value: 'Asiento' },
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
      { text: '', value: 'actionsDetails' },
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
    dataStatusByPermiso: [],
    editedIndex: -1,
    items: [],
    actions: [],
    idSolicitud: '',
    conceptoID: 0,
    perPage: 10,
    statusCodeSol: '',
    role: 0,
    linea: 0,
    ceco: 0,
    permisos: [],
    dataCountry: [],
    itemStatus: '',
    status: '',
    typeSearch: false,
    itemsDetail: {
      centroCosto: '',
      cuentaContable: '',
      Linea: '',
      concepto: '',
      establecimiento: '',
      numFactura: '',
    },
    asiento: '',
    beneficiario: '',
    alert: false,
    loadCountry: false,
    Pais: [],
    menu1: false,
    menu2: false,
    modal: false,
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

  async created() {
    await this.getCountry()
    await this.getPermisos()
    await this.getReintegro()
    await this.getStatus()
  },

  methods: {
    deleteItem(item) {
      if (this.role === 1501 || this.role === 1500) {
        this.idSolicitud = item.IdSolicitud
        this.linea = item.Linea
        this.ceco = item.CENTRO_COSTO
        this.dialogDelete = true
      } else {
        this.snackbar = true
        this.text = 'No posee los permisos para realizar esta acción'
      }
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
    async getReintegro() {
      this.overlay = true
      await this.getStatus()
      await this.getCountry()

      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknReiFormunica')}`
      setTimeout(async () => {
        const data = await solicitudService.reintegro(this.role, this.Pais)
        if (data.data === null) {
          this.snackbar = true
          this.overlay = false
          this.totalPagina = 0
          this.totalRegistros = 0
          this.page = 1
        } else {
          this.dataReintegro = data.data
          this.overlay = false
          this.totalPagina = data.last_page
          this.totalRegistros = data.total
          this.page = data.current_page
        }
      }, 1000)
    },
    pagination() {
      const status = this.statusCodeSol

      if (status === '' || status === null) {
        this.getReintegroPagination()
      } else {
        const item = { nameStatus: status }
        this.getReintegroPaginationStatus(item)
      }
    },
    getReintegroPagination() {
      this.overlay = true
      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknReiFormunica')}`
      axios.get(`/api/reintegrobyrol?perPage=${this.perPage}&page=${this.page}&IdRole=${this.role}&Pais=${this.Pais}`).then(response => {
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
    getReintegroPaginationStatus(item) {
      this.overlay = true
      this.statusCodeSol = item.nameStatus
      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknReiFormunica')}`
      axios.get(`/api/reintegrobyrol?perPage=${this.perPage}&page=${this.page}&status=${this.statusCodeSol}&IdRole=${this.role}&Pais=${this.Pais}`).then(response => {
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
    async getReintegroById() {
      if (this.idSolicitud === '') {
        this.snackbar = true
        this.text = 'Favor ingrese un numero de solicitud'
      } else {
        this.overlay = true

        const data = await solicitudService.reintegroById(this.idSolicitud, this.role, this.Pais)

        this.totalPagina = data.last_page
        this.totalRegistros = data.total
        this.page = data.current_page
        this.dataReintegro = data.data
        this.overlay = false
      }
    },
    async getReintegroByBeneficiario() {
      if (this.beneficiario === '') {
        this.snackbar = true
        this.text = 'Favor ingrese el nombre del beneficiario'
      } else {
        this.overlay = true
        const data = await solicitudService.reintegroByBeneficiario(this.beneficiario, this.Pais)

        this.totalPagina = data.last_page
        this.totalRegistros = data.total
        this.page = data.current_page
        this.dataReintegro = data.data
        this.overlay = false
      }
    },
    async getReintegroByFechas() {
      if (this.datePicker === '') {
        this.snackbar = true
        this.text = 'Favor seleccionar una fecha de inicio'
      } else if (this.datePicker2 === '') {
        this.snackbar = true
        this.text = 'Favor seleccionar una fecha de inicio'
      } else {
        this.overlay = true
        const data = await solicitudService.reintegroByFechas(this.Pais, this.datePicker, this.datePicker2)

        this.totalPagina = data.last_page
        this.totalRegistros = data.total
        this.page = data.current_page
        this.dataReintegro = data.data
        this.overlay = false
      }
    },
    getSolicitudDetalle(item) {
      this.limpiarDetalles()
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
      const access = this.permisos.find(element => element.IDACCION == acciones.VISUALIZAR_SOLICITUDES)

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
      this.role = role
      await axios.get(`/api/permisos/${user}?role=${role}`).then(response => {
        this.permisos = response.data.data
        this.comprobarLogin()
      }).catch(error => {
        console.log(error)
      })
    },
    async getStatus() {
      this.dataStatus = await state.status()
    },
    concat(item) {
      return `${item.Descripcion} - ${item.CodEstado}`
    },
    async filtrar() {
      console.log(this.typeSearch)
      this.overlay = true
      const status = this.statusCodeSol
      let data
      switch (this.typeSearch) {
        case '0':
          await this.getReintegro()
          break
        case 1:
          data = await solicitudService.reintegroByStatus(status, this.Pais)
          break
        case 2:
          data = await solicitudService.reintegroById(this.idSolicitud, this.role, this.Pais)
          break
        case 3:
          data = await solicitudService.reintegroByBeneficiario(this.beneficiario, this.Pais)
          break
        case 4:
          data = await solicitudService.reintegroByFechas(this.Pais, this.datePicker, this.datePicker2)
          break
        default:
          this.overlay = false
          break
      }

      this.page = data.current_page
      this.dataReintegro = data.data
      this.totalPagina = data.last_page
      this.totalRegistros = data.total
      this.overlay = false
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
    changeStatus(item, status) {
      this.dialogStatus = true
      this.itemStatus = status // `${status} ${item.IdSolicitud}`
      this.idSolicitud = item.IdSolicitud
      this.status = status.CodEstado
    },
    async putStatusSolicitud() {
      this.loadChangeStatus = true
      const data = await solicitudService.updateReintegro(this.idSolicitud, this.status)

      this.snackbar = true
      // eslint-disable-next-line no-multi-assign, no-param-reassign
      this.asiento = data.asiento === 'undefined' || data.asiento == null ? '' : data.asiento[0].asiento
      this.text = `${data.mensaje}`
      this.dialogStatus = false
      this.loadChangeStatus = false
      this.pagination()
      this.showAlert()

      /* axios.put(`/api/reintegroStatus/${this.idSolicitud}`, { status: this.status }).then(response => {
        this.snackbar = true
        // eslint-disable-next-line no-multi-assign, no-param-reassign
        this.asiento = response.data.asiento === 'undefined' || response.data.asiento == null ? '' : response.data.asiento[0].asiento
        this.text = `${response.data.mensaje}`
        this.dialogStatus = false
        this.loadChangeStatus = false
        this.pagination()
        this.showAlert()
      }).catch(error => {
        this.snackbar = true
        console.log(error)
        this.loadChangeStatus = false
      }) */
    },
    showAlert() {
      if (this.status === '7' || this.status === 'CON') {
        this.alert = true
        setTimeout(() => {
          this.alert = false
        }, 5000)
      }
    },
    selectDetails(item) {
      if (this.role === 1501 || this.role === 1500) {
        this.itemsDetail.concepto = item.Concepto
        this.itemsDetail.cuentaContable = item.Cuenta_Contable
        this.itemsDetail.numFactura = item.NumeroFactura
        this.itemsDetail.monto = item.Monto
        this.itemsDetail.establecimiento = item.NombreEstablecimiento_Persona
        this.itemsDetail.fechaFactura = item.FechaFactura
        this.itemsDetail.Linea = item.Linea
        this.itemsDetail.centroCosto = item.CENTRO_COSTO
      } else {
        this.snackbar = true
        this.text = 'No posee los permisos para realizar esta acción'
      }
    },
    editLineasDetalles() {
      if (this.role === 1501 || this.role === 1500) {
        if (this.itemsDetail.Linea !== '') {
          const index = this.dataDetalleReintegro.findIndex((obj => obj.Linea === this.itemsDetail.Linea))
          this.dataDetalleReintegro[index].CENTRO_COSTO = this.itemsDetail.centroCosto
          this.dataDetalleReintegro[index].Cuenta_Contable = this.itemsDetail.cuentaContable
          this.dataDetalleReintegro[index].Concepto = this.itemsDetail.concepto
          this.dataDetalleReintegro[index].NombreEstablecimiento_Persona = this.itemsDetail.establecimiento
          this.dataDetalleReintegro[index].NumeroFactura = this.itemsDetail.numFactura
        } else {
        // eslint-disable-next-line no-plusplus
          for (let index = 0; index < this.dataDetalleReintegro.length; index++) {
            this.dataDetalleReintegro[index].CENTRO_COSTO = this.itemsDetail.centroCosto
            this.dataDetalleReintegro[index].Cuenta_Contable = this.itemsDetail.cuentaContable
            this.dataDetalleReintegro[index].Concepto = this.itemsDetail.concepto
            this.dataDetalleReintegro[index].NombreEstablecimiento_Persona = this.itemsDetail.establecimiento
            this.dataDetalleReintegro[index].NumeroFactura = this.itemsDetail.numFactura
          }
        }
      } else {
        this.snackbar = true
        this.text = 'No posee los permisos para realizar esta acción'
      }
    },
    deleteLinea() {
      this.loadDelete = true
      axios.delete(`/api/reintegro/${this.idSolicitud}?Linea=${this.linea}&centroCosto=${this.ceco}`).then(response => {
        this.snackbar = true
        this.text = `${response.data.mensaje} Linea: ${response.data.Linea} Solicitud: ${response.data.Solicitud}`
        const item = { IdSolicitud: this.idSolicitud, nameStatus: 1 }
        this.getSolicitudDetalle(item)
        this.closeDelete()
        this.loadDelete = false
      }).catch(error => {
        this.snackbar = true
        this.text = error
        this.loadDelete = false
      })
    },
    putDetalleSolicitud() {
      this.dialogLoad = true
      this.data.items = this.dataDetalleReintegro
      axios.put(`/api/reintegro/${this.idSolicitud}`, this.data).then(response => {
        this.snackbar = true
        this.text = response.data.mensaje
        this.dialogLoad = false
      }).catch(error => {
        this.snackbar = true
        this.text = error.data.mensaje
        this.dialogLoad = false
      })
    },
    limpiarDetalles() {
      this.itemsDetail.numFactura = ''
      this.itemsDetail.establecimiento = ''
      this.itemsDetail.concepto = ''
      this.itemsDetail.Linea = ''
      this.itemsDetail.cuentaContable = ''
    },
    async getCountry() {
      this.loadCountry = true
      const data = await paisService.country()
      this.dataCountry = data
      this.Pais = []
      this.Pais.push(this.dataCountry[0].IdPais)
      this.loadCountry = false
    },
  },
}
</script>
