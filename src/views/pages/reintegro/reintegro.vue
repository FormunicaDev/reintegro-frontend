<template>
  <v-card>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
      ></v-text-field>
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
          <v-dialog
            v-model="dialog"
            max-width="1250px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                size="45px"
                @click="getReintegro()"
              >
                {{ icons.mdiRefreshCircle }}
              </v-icon>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                @click="nuevo()"
              >
                Nuevo
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-card-text class="d-flex">
                  </v-card-text>
                  <v-card
                    class="mx-auto"
                    max-width="1500"
                  >
                    <v-card-title class="text-h6 font-weight-regular justify-space-between">
                      <span>{{ currentTitle }}</span>
                      <v-avatar
                        color="primary lighten-2"
                        class="subheading white--text"
                        size="24"
                        v-text="step"
                      ></v-avatar>
                    </v-card-title>

                    <v-window
                      v-model="step"
                      max-width="1400"
                    >
                      <v-window-item :value="1">
                        <v-card-text>
                          <v-card flat>
                            <v-card-text>
                              <v-row>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="5"
                                >
                                  <v-autocomplete
                                    v-model="reintegroItem.CENTRO_COSTO"
                                    :items="centroCosto"
                                    outlined
                                    dense
                                    chips
                                    clearable
                                    small-chips
                                    label="Centro de Costo *"
                                    item-text="DESCRIPCION"
                                    item-value="CENTRO_COSTO"
                                  ></v-autocomplete>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="3"
                                >
                                  <v-autocomplete
                                    v-model="reintegroItem.TipoPago"
                                    :items="tipoPago"
                                    outlined
                                    dense
                                    chips
                                    clearable
                                    small-chips
                                    label="Tipo de Pago *"
                                    item-text="Descripcion"
                                    item-value="TipoPago"
                                  ></v-autocomplete>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="2"
                                >
                                  <v-text-field
                                    v-model="reintegroItem.Monto"
                                    label="Monto *"
                                    outlined
                                    dense
                                    type="number"
                                    min="1"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="4"
                                >
                                  <v-text-field
                                    v-model="reintegroItem.Beneficiario"
                                    label="Beneficiario *"
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
                                    v-model="reintegroItem.CUENTA_BANCO"
                                    label="Cuenta de Banco"
                                    outlined
                                    dense
                                    type="number"
                                    min="1"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="2"
                                >
                                  <v-text-field
                                    v-model="reintegroItem.NumCheque"
                                    label="Numero de Cheque"
                                    outlined
                                    dense
                                    type="number"
                                    min="1"
                                  ></v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="4"
                                >
                                  <v-container fluid>
                                    <v-radio-group
                                      v-model="reintegroItem.EsDolar"
                                      row
                                      label="Moneda *"
                                      default="0"
                                    >
                                      <v-radio
                                        label="Cordoba"
                                        value="0"
                                      ></v-radio>
                                      <v-radio
                                        label="Dolar"
                                        value="1"
                                      ></v-radio>
                                    </v-radio-group>
                                  </v-container>
                                </v-col>
                                <v-col cols="12">
                                  <v-alert
                                    border="left"
                                    :icon="icons.mdiVuetify"
                                    elevation="6"
                                    outlined
                                    type="info"
                                  >
                                    Los campos marcados con * son obligatorios.
                                  </v-alert>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-card-text>
                      </v-window-item>

                      <v-window-item :value="2">
                        <v-card-text>
                          <v-card flat>
                            <v-card-text>
                              <v-row>
                                <v-col>
                                  <v-switch
                                    v-model="switch1"
                                    inset
                                    color="info"
                                    :label="`¿Es prorrateo?: ${switch1 === true ? 'Si':'No'}`"
                                  ></v-switch>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  v-if="switch1"
                                  cols="12"
                                  sm="6"
                                  md="3"
                                >
                                  <v-autocomplete
                                    v-model="conceptoID"
                                    :items="conceptoPago"
                                    outlined
                                    dense
                                    chips
                                    clearable
                                    small-chips
                                    label="Concepto"
                                    item-text="strDescripcion"
                                    item-value="IdConcepto"
                                    @input="getProrrateo()"
                                  ></v-autocomplete>
                                </v-col>
                                <v-col
                                  v-if="!switch1"
                                  cols="12"
                                  sm="6"
                                  md="3"
                                >
                                  <v-text-field
                                    v-model="itemsLinea.concepto"
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
                                    v-model="itemsLinea.cuentaContable"
                                    v-mask="'#-##-##-###-###'"
                                    outlined
                                    dense
                                    label="Cuenta Contable"
                                    hide-details
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="2"
                                >
                                  <v-text-field
                                    v-model="itemsLinea.numFactura"
                                    outlined
                                    dense
                                    label="# Factura"
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="2"
                                >
                                  <v-text-field
                                    v-model="itemsLinea.monto"
                                    outlined
                                    dense
                                    label="Monto"
                                    type="number"
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="3"
                                >
                                  <v-text-field
                                    v-model="itemsLinea.establecimiento"
                                    outlined
                                    dense
                                    label="Establecimiento"
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="4"
                                >
                                  <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :return-value.sync="date"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="date"
                                        label="Fecha de la Factura"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        outlined
                                        dense
                                        v-bind="attrs"
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-model="date"
                                      no-title
                                      scrollable
                                    >
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        text
                                        color="primary"
                                        @click="menu = false"
                                      >
                                        Cancelar
                                      </v-btn>
                                      <v-btn
                                        text
                                        color="primary"
                                        @click="$refs.menu.save(date)"
                                      >
                                        OK
                                      </v-btn>
                                    </v-date-picker>
                                  </v-menu>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="3"
                                >
                                  <v-text-field
                                    v-model="itemsLinea.Linea"
                                    outlined
                                    dense
                                    label="Linea"
                                    disabled
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-col>
                                  <v-btn
                                    v-if="!enabledEdit"
                                    color="info"
                                    :disabled="switch1"
                                  >
                                    Agregar
                                  </v-btn>
                                  <v-btn
                                    v-if="enabledEdit"
                                    color="info"
                                    @click="editLinea()"
                                  >
                                    Actualizar
                                  </v-btn>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="12"
                                >
                                  <v-data-table
                                    :headers="headersConcepto"
                                    :items="items"
                                    class="elevation-1"
                                    :loading="loadingProrrateo"
                                    loading-text="Cargando... Por Favor espere"
                                  >
                                    <template v-slot:[`item.actionsEdit`]="{ item }">
                                      <v-icon
                                        medium
                                        @click="selectLinea(item)"
                                      >
                                        {{ icons.mdiPencil }}
                                      </v-icon>
                                    </template>
                                  </v-data-table>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-card-text>
                      </v-window-item>
                    </v-window>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-btn
                        :disabled="step === 1"
                        text
                        @click="step--"
                      >
                        Regresar
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        :disabled="step === 2"
                        color="secondary"
                        depressed
                        @click="stepNext()"
                      >
                        Siguiente
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="primary"
                  :disabled="!enabledBtn"
                  @click="postReintegro()"
                >
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="dialogDelete"
            max-width="600px"
          >
            <v-card>
              <v-card-title class="text-h5">
                ¿Seguro que desea anular/activar este elemento?
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
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-col cols="auto">
            <v-dialog
              v-model="dialog2"
              transition="dialog-top-transition"
              max-width="1200"
            >
              <template v-slot:default="dialog2">
                <v-card>
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
                            class="elevation-1"
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
            <v-dialog
              v-model="dialogLoad"
              hide-overlay
              persistent
              width="300"
            >
              <v-card
                color="primary"
                dark
              >
                <v-card-text>
                  Por Favor espere, guardando...
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
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
      <template v-slot:[`item.CodEstado`]="{item}">
        <v-chip
          small
          :color="getColor(item.CodEstado)"
          dark
          class="font-weight-medium"
        >
          {{ item.CodEstado }}
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
          @input="getReintegroPagination()"
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
} from '@mdi/js'
import axios from 'axios'
import validateLogin from '@/services/validateLogin'
import validateToken from '@/services/validateToken'

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
      { text: 'Estado', value: 'CodEstado' },
      { text: 'Tipo de Pago', value: 'Descripcion' },
      { text: 'Beneficiario', value: 'Beneficiario' },
      { text: 'Concepto', value: 'Concepto' },
      { text: 'Cuenta de Banco', value: 'CUENTA_BANCO' },
      { text: 'Cheque', value: 'NumCheque' },
      { text: 'Registro', value: 'FECHAREGISTRO' },
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
      { text: 'Actions', value: 'actions', sortable: false },
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
    tipoPago: [],
    centroCosto: [],
    conceptoPago: [],
    editedIndex: -1,
    reintegroItem: {
      CENTRO_COSTO: '',
      FechaSolicitud: '',
      Monto: 0,
      EsDolar: 0,
      CodEstado: 'INI',
      TipoPago: 0,
      Beneficiario: '',
      USUARIO: '',
      USUARIO1: '',
      Concepto: '',
      CUENTA_BANCO: 0,
      NumCheque: 0,
      FECHAREGISTRO: '',
      FECHAUPDATE: '',
      flgAsientoGEnerado: 0,
      Asiento: null,
      items: [],
    },
    items: [],
    itemsLinea: {
      concepto: '',
      cuentaContable: '',
      numFactura: 0,
      monto: 0,
      establecimiento: '',
      fechaFactura: '',
      Linea: '',
    },
    idSolicitud: '',
    conceptoID: 0,
    imagenMiniatura: '',
    urlPhoto: '',
    perPage: 10,
    tab: null,
    step: 1,
    enabledBtn: false,
    enabledEdit: false,
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
    this.getReintegro()
    this.comprobarLogin()
  },

  methods: {
    deleteItem(item) {
      this.idSolicitud = item.IdSolicitud
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.deleteProductoOrder()
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
    viewItem(item) {
      this.urlPhoto = item.Image
      this.dialog2 = true
    },
    getReintegro() {
      this.overlay = true

      /* const user = sessionStorage.getItem('userRei')
      const role = sessionStorage.getItem('roleRei') */

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
        console.log(error)
        this.snackbar = true
        this.text = error.response.data !== 'unauthorized' ? error.response.data.error : error.response.data
        this.overlay = false
        if (error.response.data.mensaje === 'invalid') {
          validateToken.logout()
          this.$router.push({ name: 'pages-login' })
        }
      })
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
        this.text = error.response.data.error
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
    getCentroCosto() {
      axios.get(`/api/centrocosto?perPage=${100}`).then(response => {
        this.centroCosto = response.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    getTipoPago() {
      axios.get(`/api/tipopago?perPage=${100}`).then(response => {
        this.tipoPago = response.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    getConceptoPago() {
      axios.get(`/api/concepto?perPage=${100}`).then(response => {
        this.conceptoPago = response.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    getProrrateo() {
      this.loadingProrrateo = true
      this.items = []
      axios.get(`/api/prorrateo?concepto=${this.conceptoID}&monto=${this.reintegroItem.Monto}`).then(response => {
        this.items = response.data
        this.loadingProrrateo = false
        // eslint-disable-next-line no-unneeded-ternary
        this.enabledBtn = this.items.length === 0 ? false : true
      }).catch(error => {
        console.log(error)
        this.loadingProrrateo = false
        this.items = []
      })
    },
    postReintegro() {
      this.reintegroItem.USUARIO = sessionStorage.getItem('userRei')
      this.reintegroItem.USUARIO1 = sessionStorage.getItem('userRei')
      if (this.reintegroItem.CENTRO_COSTO === '' || this.reintegroItem.CENTRO_COSTO === null) {
        this.snackbar = true
        this.text = 'Favor Seleccionar un centro de costo'
      } else if (this.reintegroItem.Monto === '' || this.reintegroItem.Monto === null) {
        this.snackbar = true
        this.text = 'Favor ingresar un monto'
      } else if (this.reintegroItem.TipoPago === '' || this.reintegroItem.TipoPago === null) {
        this.snackbar = true
        this.text = 'Favor seleccionar un Tipo de Pago'
      } else if (this.reintegroItem.Beneficiario === '' || this.reintegroItem.Beneficiario === null) {
        this.snackbar = true
        this.text = 'Favor ingresar un Beneficiario'
      } else {
        this.destructObject()

        // console.log(this.reintegroItem)

        this.dialogLoad = true
        axios.post('/api/reintegro', this.reintegroItem).then(response => {
          this.snackbar = true
          this.text = response.data.mensaje
          this.getReintegro()
          this.limpiarCampos()
          this.dialogLoad = false
        }).catch(error => {
          this.snackbar = true
          this.text = error
          this.dialogLoad = false
        })
      }
    },
    limpiarCampos() {
      this.reintegroItem.Sucursal = ''
      this.reintegroItem.NombreProducto = ''
      this.reintegroItem.Image = ''
      this.reintegroItem.Precio = ''
      this.reintegroItem.Presentacion = ''
      this.reintegroItem.Usuario = ''
      this.reintegroItem.DosisMZ = ''
      this.reintegroItem.CategoriaID = ''
      this.reintegroItem.ConcentracionProducto = ''
    },
    comprobarLogin() {
      if (!validateLogin.validateToken()) {
        this.$router.push('/')
      }
    },
    nuevo() {
      this.getCentroCosto()
      this.getTipoPago()
      this.getConceptoPago()
    },
    stepNext() {
      if (this.reintegroItem.CENTRO_COSTO === '' || this.reintegroItem.tipoPago === 0 || this.reintegroItem.Monto === 0 || this.reintegroItem.Beneficiario === '') {
        this.snackbar = true
        this.text = 'Favor complete todos los campos obligatorios'
        // eslint-disable-next-line no-unneeded-ternary
        this.enabledBtn = this.reintegroItem.items.length === 0 ? false : true

        // this.step += 1
      } else {
        this.enabledBtn = this.reintegroItem.items === [] ? 0 : 1
        this.step += 1
      }
    },
    addLinea() {
      this.itemsLinea.fechaFactura = this.date
      const data = {
        CENTRO_COSTO: this.itemsLinea.centroCosto,
        Cuenta_Contable: this.itemsLinea.cuentaContable,
        FechaFactura: this.date,
      }

      this.reintegroItem.items.push(data)
      console.log(this.reintegroItem)
    },

    destructObject() {
      const data = this.items.map(({
        strCeCo: CENTRO_COSTO,
        strDescripcionConcepto: Concepto,
        IdLinea: Linea,
        decMontoPro: Monto,
        ...rest
      }) => ({
        CENTRO_COSTO,
        Concepto,
        Linea,
        Monto,
        ...rest,
      }))
      this.reintegroItem.items = data
      console.log(this.reintegroItem)
    },
    selectLinea(item) {
      this.itemsLinea.concepto = item.strDescripcionConcepto
      this.itemsLinea.cuentaContable = item.strCuentaContable
      this.itemsLinea.monto = item.decMontoPro
      this.itemsLinea.establecimiento = item.strEstablecimiento
      this.itemsLinea.Linea = item.IdLinea
      this.enabledEdit = true
      console.log(item)
    },
    editLinea() {
      const update = this.items.findIndex((obj => obj.IdLinea === this.itemsLinea.Linea))
      this.items[update].strCuentaContable = this.itemsLinea.cuentaContable
      this.items[update].strEstablecimiento = this.itemsLinea.establecimiento
      this.items[update].datFechaFactura = this.date

      this.limpiarDetalles()
      this.enabledEdit = false
    },
    limpiarDetalles() {
      this.itemsLinea.monto = 0
      this.itemsLinea.cuentaContable = ''
      this.itemsLinea.establecimiento = ''
      this.itemsLinea.Linea = ''
    },
    getColor(estado) {
      if (estado === 'INI') return '#3498db'
      if (estado === 'FIN') return '#2ecc71'
      if (estado === 'CON') return '#34495e'
      if (estado === 'SAC') return '#f1c40f'
      if (estado === 'FIR') return '#9c88ff'
      if (estado === 'ATE') return '#16a085'
      if (estado === 'EMC') return '#005b9f'
      if (estado === 'ANU') return '#e74c3c'

      return '#102027'
    },
  },
}
</script>
