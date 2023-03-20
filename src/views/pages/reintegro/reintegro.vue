<template>
  <v-card
    elevation="7"
    class="rounded-xl"
  >
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
          color="info"
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
          <v-dialog
            v-model="dialog"
            max-width="1600px"
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
            <v-card class="rounded-xl">
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-card-text class="d-flex">
                  </v-card-text>
                  <v-card
                    class="mx-auto rounded-xl"
                    max-width="1600"
                    elevation="7"
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
                      max-width="1500"
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
                                    item-text="Descripcion"
                                    item-value="CentroCosto"
                                    :loading="loadCeCo"
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
                                  md="2"
                                >
                                  <v-autocomplete
                                    v-model="reintegroItem.Pais"
                                    label="País"
                                    outlined
                                    dense
                                    chips
                                    :items="dataCountry"
                                    item-text="Pais"
                                    item-value="IdPais"
                                    @input="getCentroCosto()"
                                  ></v-autocomplete>
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
                                  md="2"
                                  sm="2"
                                >
                                  <v-autocomplete
                                    v-model="reintegroItem.Banco"
                                    label="Banco"
                                    :items="bancos"
                                    item-text="Banco"
                                    item-value="IdBanco"
                                    outlined
                                    dense
                                    chips
                                  >
                                  </v-autocomplete>
                                </v-col>
                                <v-col
                                  cols="12"
                                  md="2"
                                  sm="2"
                                >
                                  <v-text-field
                                    v-model="reintegroItem.Concepto"
                                    label="Concepto *"
                                    outlined
                                    dense
                                    counter
                                    maxlength="60"
                                  >
                                  </v-text-field>
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
                                        label="Local"
                                        value="0"
                                      ></v-radio>
                                      <v-radio
                                        label="Dolar"
                                        value="1"
                                      ></v-radio>
                                    </v-radio-group>
                                  </v-container>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="8"
                                  md="6"
                                >
                                  <v-textarea
                                    v-model="reintegroItem.Comentarios"
                                    label="Comentarios"
                                    outlined
                                    auto-grow
                                    rows="1"
                                  >
                                  </v-textarea>
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
                                  md="2"
                                >
                                  <v-autocomplete
                                    v-model="conceptoID"
                                    :items="conceptoPago"
                                    outlined
                                    dense
                                    chips
                                    clearable
                                    small-chips
                                    label="Descripción"
                                    item-text="strDescripcion"
                                    item-value="IdConcepto"
                                    @input="getProrrateo()"
                                  ></v-autocomplete>
                                </v-col>
                                <v-col
                                  v-if="!switch1"
                                  cols="12"
                                  sm="6"
                                  md="2"
                                >
                                  <v-text-field
                                    v-model="itemsLinea.concepto"
                                    label="Descripción"
                                    outlined
                                    dense
                                    :disabled="boolViatico"
                                  >
                                  </v-text-field>
                                </v-col>
                                <v-col
                                  v-if="!switch1 & boolViatico"
                                  cols="12"
                                  md="5"
                                  sm="6"
                                >
                                  <v-radio-group
                                    v-model="itemsLinea.concepto"
                                    row
                                    @change="changeViatico()"
                                  >
                                    <v-radio
                                      label="Desayuno"
                                      value="Desayuno"
                                    ></v-radio>
                                    <v-radio
                                      label="Almuerzo"
                                      value="Almuerzo"
                                    ></v-radio>
                                    <v-radio
                                      label="Cena"
                                      value="Cena"
                                    ></v-radio>
                                    <v-radio
                                      label="Hospedaje"
                                      value="Hospedaje"
                                    ></v-radio>
                                    <v-radio
                                      label="Transporte"
                                      value="Transporte"
                                    ></v-radio>
                                  </v-radio-group>
                                </v-col>
                                <v-col
                                  v-if="!switch1 & boolViatico"
                                  cols="12"
                                  md="1"
                                  sm="6"
                                >
                                  <v-checkbox
                                    v-model="checkbox"
                                    @change="changeViatico()"
                                  >
                                    <template v-slot:label>
                                      <div>
                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <label v-on="on">
                                              ¿Factura?
                                            </label>
                                          </template>
                                          En caso de poseer factura marque esta casilla
                                        </v-tooltip>
                                      </div>
                                    </template>
                                  </v-checkbox>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="2"
                                >
                                  <v-autocomplete
                                    v-model="itemsLinea.cuentaContable"
                                    outlined
                                    dense
                                    label="Cuenta Contable"
                                    :items="dataCuentaContable"
                                    item-text="Descripcion"
                                    item-value="CuentaContable"
                                    @input="changeCuentaContable()"
                                  >
                                  </v-autocomplete>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="1"
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
                                  md="1"
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
                                  sm="4"
                                  md="2"
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
                                  md="1"
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
                                <v-col md="1">
                                  <v-btn-toggle v-model="toggle_exclusive">
                                    <v-btn
                                      v-if="!switch1"
                                      color="info"
                                      :disabled="switch1"
                                      @click="addLinea()"
                                    >
                                      Agregar
                                    </v-btn>
                                    <v-btn
                                      v-if="switch1"
                                      color="info"
                                      @click="editarAllLinea()"
                                    >
                                      Actualizar todas las lineas
                                    </v-btn>
                                    <v-btn
                                      v-if="enabledEdit"
                                      color="info"
                                      @click="editLinea()"
                                    >
                                      Actualizar
                                    </v-btn>
                                    <v-btn
                                      v-if="enabledEdit"
                                      color="error"
                                      @click="enabledEdit = false"
                                    >
                                      Cancelar
                                    </v-btn>
                                  </v-btn-toggle>
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
                                      <v-icon
                                        medium
                                        @click="removeLinea(item)"
                                      >
                                        {{ icons.mdiDelete }}
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
                            v-if="statusCodeSol === 'Pendiente'? true:false"
                            color="info"
                            outlined
                            @click="editLineasDetalles()"
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
                            :headers="headersDetails"
                            :items="dataDetalleReintegro"
                            class="elevation-7 rounded-xl"
                            :loading="loadingData"
                            loading-text="Cargando... Por Favor espere"
                          >
                            <template v-slot:[`item.actionsDetails`]="{ item }">
                              <v-icon
                                :disabled="statusCodeSol === 'Pendiente'? false:true"
                                @click="selectDetails(item)"
                              >
                                {{ icons.mdiPencil }}
                              </v-icon>
                              <v-icon
                                :disabled="statusCodeSol === 'Pendiente'? false:true"
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
                      :disabled="statusCodeSol === 'Pendiente'? false:true"
                      color="primary"
                      @click="putDetalleSolicitud()"
                    >
                      Guardar Cambios
                    </v-btn>
                    <v-btn
                      color="secondary"
                      @click="print()"
                    >
                      Imprimir
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
        <v-icon
          medium
          @click="printReintegro(item)"
        >
          {{ icons.mdiPrinter }}
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
  mdiPrinter,
} from '@mdi/js'
import axios from 'axios'
import validateLogin from '@/services/validateLogin'
import validateToken from '@/services/validateToken'
import actions from '@/services/action'
import cuentaContableService from '@/services/cuentaContable'
import centroCostoService from '@/services/centroCosto'
import banco from '@/services/banco'

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
      mdiPrinter,
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
    boolViatico: false,
    boolMonto: false,
    loadDelete: false,
    checkbox: false,
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
      { text: 'Actions', value: 'actionsDetails', sortable: false },
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
    dataCountry: [],
    dataCuentaContable: [],
    bancos: [],
    tipoPago: [],
    centroCosto: [],
    conceptoPago: [],
    editedIndex: -1,
    reintegroItem: {
      CENTRO_COSTO: '',
      FechaSolicitud: '',
      Monto: 0,
      EsDolar: 0,
      CodEstado: '1',
      TipoPago: 2,
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
      Pais: 0,
      Comentarios: '',
      Banco: '2',
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
    itemsDetail: {
      concepto: '',
      cuentaContable: '',
      numFactura: 0,
      monto: 0,
      establecimiento: '',
      fechaFactura: '',
      Linea: '',
      centroCosto: 0,
    },
    data: {
      items: [],
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
    statusCodeSol: '',
    linea: 0,
    ceco: 0,
    loadCeCo: false,
    montoSuma: 0,
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
    this.getReintegro()
    this.getPermisos()
    await this.getCountry()
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
    viewItem(item) {
      this.urlPhoto = item.Image
      this.dialog2 = true
    },
    getReintegro() {
      this.overlay = true

      const user = sessionStorage.getItem('userRei')

      // const role = sessionStorage.getItem('roleRei')

      axios.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem('tknReiFormunica')}`
      axios.get(`/api/reintegro?perPage=${this.perPage}&user=${user}&Pais=${this.reintegroItem.Pais}&option=1`).then(response => {
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
      const user = sessionStorage.getItem('userRei')
      axios.get(`/api/reintegro?perPage=${this.perPage}&page=${this.page}&user=${user}&option=1`).then(response => {
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
    async getCentroCosto() {
      await this.getBanco()
      this.loadCeCo = true
      const user = sessionStorage.getItem('userRei')
      const data = await centroCostoService.listarCentroCostoUser(user, undefined, 1000)
      this.centroCosto = data.data
      this.loadCeCo = false
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
      axios.get(`/api/prorrateo?concepto=${this.conceptoID}&monto=${this.reintegroItem.Monto}&pais=${this.reintegroItem.Pais}`).then(response => {
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
      const montoTotal = this.sumMontosLinea()
      this.reintegroItem.Monto = montoTotal
      console.log(this.reintegroItem.Monto)

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
      } else if (this.items.length === 0 || this.items === null) {
        this.snackbar = true
        this.text = 'Debe agregar al menos una linea en el detalle de su solicitud'
      } else {
        this.destructObject()

        // console.log(this.reintegroItem)
        // const user = sessionStorage.getItem('userRei')

        this.dialogLoad = true
        axios.post('/api/reintegro', this.reintegroItem).then(response => {
          this.snackbar = true
          this.text = `${response.data.mensaje}- Numero de Solicitud: ${response.data.Solicitud}`
          this.getReintegro()
          this.limpiarCampos()
          window.open(`http://10.10.0.16:82/api/printreintegro/${response.data.Solicitud}`, '_blank')

          // window.open(`http://10.10.0.35:8080/apiReintegro/public/pdf?IdSolicitud=${response.data.Solicitud}&Pais=${this.reintegroItem.Pais}&user=${user}`, '_blank')
          this.dialogLoad = false
          this.dialog = false
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
      const acciones = actions.enumActions()
      // eslint-disable-next-line eqeqeq
      const access = this.permisos.find(element => element.IDACCION == acciones.CAPTAR_SOLICITUD)

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
    async getCuentaContable() {
      const perPage = 100
      const page = 1
      const data = await cuentaContableService.getRelacionCuentaUser(perPage, page)
      this.dataCuentaContable = data.data
    },
    async nuevo() {
      await this.getCentroCosto()
      await this.getTipoPago()
      await this.getConceptoPago()
      await this.getCountry()
      await this.getCuentaContable()
      await this.getBanco()
    },
    stepNext() {
      if (this.reintegroItem.CENTRO_COSTO === '' || this.reintegroItem.tipoPago === 0 || this.reintegroItem.Monto === 0 || this.reintegroItem.Beneficiario === '' || this.reintegroItem.Concepto === '') {
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
    maxlinea() {
      // eslint-disable-next-line radix
      const linea = this.items.reduce((max, obj) => Math.max(max, parseInt(obj.IdLinea)), -Infinity)

      return linea
    },
    sumMontosLinea() {
      const totalMonto = this.items.reduce((acc, obj) => acc + parseFloat(obj.decMontoPro), 0)

      return totalMonto
    },
    addLinea() {
      const { Monto } = this.reintegroItem // monto que no debe exceder
      let linea = this.maxlinea()
      let nuevoMonto = 0
      // eslint-disable-next-line radix
      linea = parseInt(linea) > 0 ? linea + 1 : 1
      this.montoSuma += parseInt(this.itemsLinea.monto, 10)

      // console.log(this.montoSuma)
      /* if (this.montoSuma > Monto) {
        this.snackbar = true
        this.text = 'La suma de las lineas supera al monto establecido, se sumara el valor agregado'
        this.montoSuma -= parseInt(this.itemsLinea.monto, 10)
        this.reintegroItem.Monto += parseInt(this.itemsLinea.monto, 10)

        return
      } */
      const { numFactura, establecimiento } = this.itemsLinea
      if (numFactura === 0 || numFactura === '') {
        this.snackbar = true
        this.text = 'Favor ingrese un numero de factura'

        return
      } if (establecimiento === '') {
        this.snackbar = true
        this.text = 'Favor ingrese el nombre del establecimiento'

        return
      }
      nuevoMonto = parseInt(Monto, 10) + parseInt(this.itemsLinea.monto, 10)
      this.reintegroItem.Monto = nuevoMonto
      this.linea = linea
      this.itemsLinea.fechaFactura = this.date
      const data = {
        strDescripcionConcepto: this.itemsLinea.concepto,
        strCuentaContable: this.itemsLinea.cuentaContable,
        datFechaFactura: this.date,
        strEstablecimiento: this.itemsLinea.establecimiento,
        intTotalEmpleados: this.itemsLinea.numFactura,
        strCeCo: this.reintegroItem.CENTRO_COSTO,
        decMontoPro: this.itemsLinea.monto,
        IdLinea: this.linea,
      }
      this.items.push(data)
      this.snackbar = true
      this.text = 'Se agrego una nueva linea'
      console.log(this.reintegroItem)
    },

    destructObject() {
      const data = this.items.map(({
        strCeCo: CENTRO_COSTO,
        strDescripcionConcepto: Concepto,
        IdLinea: Linea,
        decMontoPro: Monto,
        // eslint-disable-next-line camelcase
        strCuentaContable: Cuenta_Contable,
        datFechaFactura: FechaFactura,
        intTotalEmpleados: NumeroFactura,
        // eslint-disable-next-line camelcase
        strEstablecimiento: NombreEstablecimiento_Persona,
        ...rest
      }) => ({
        CENTRO_COSTO,
        Concepto,
        Linea,
        Monto,
        Cuenta_Contable,
        FechaFactura,
        NumeroFactura,
        NombreEstablecimiento_Persona,
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
    selectDetails(item) {
      this.itemsDetail.concepto = item.Concepto
      this.itemsDetail.cuentaContable = item.Cuenta_Contable
      this.itemsDetail.numFactura = item.NumeroFactura
      this.itemsDetail.monto = item.Monto
      this.itemsDetail.establecimiento = item.NombreEstablecimiento_Persona
      this.itemsDetail.fechaFactura = item.FechaFactura
      this.itemsDetail.Linea = item.Linea
      this.itemsDetail.centroCosto = item.CENTRO_COSTO
      console.log(item)
    },
    editLineasDetalles() {
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
    },
    editLinea() {
      const update = this.items.findIndex((obj => obj.IdLinea === this.itemsLinea.Linea))
      this.items[update].strCuentaContable = this.itemsLinea.cuentaContable
      this.items[update].strEstablecimiento = this.itemsLinea.establecimiento
      this.items[update].datFechaFactura = this.date
      this.items[update].intTotalEmpleados = this.itemsLinea.numFactura

      this.limpiarDetalles()
      this.enabledEdit = false

      return true
    },
    editarAllLinea() {
      try {
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < this.items.length; index++) {
          this.items[index].strCuentaContable = this.itemsLinea.cuentaContable
          this.items[index].strEstablecimiento = this.itemsLinea.establecimiento
          this.items[index].datFechaFactura = this.date
          this.items[index].intTotalEmpleados = this.itemsLinea.numFactura
        }

        return true
      } catch (error) {
        console.log(error)

        return false
      }
    },
    limpiarDetalles() {
      this.itemsLinea.monto = 0
      this.itemsLinea.cuentaContable = ''
      this.itemsLinea.establecimiento = ''
      this.itemsLinea.Linea = ''
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
    removeLinea(index) {
      console.log('valor 1: ')
      console.log(index.IdLinea)
      console.log('Valor 2:')

      const indice = this.items.indexOf(index)
      const { decMontoPro } = this.items.find(e => e.IdLinea === index.IdLinea)
      this.montoSuma -= decMontoPro

      this.items.splice(indice, 1)
    },
    putDetalleSolicitud() {
      if (this.role === 1501 || this.role === 1500) {
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
      } else {
        this.snackbar = true
        this.text = 'No posee permisos para realizar esta acción'
      }
    },
    printReintegro(item) {
      const { IdSolicitud } = item

      // const user = sessionStorage.getItem('userRei')

      window.open(`http://10.10.0.16:82/api/printreintegro/${IdSolicitud}`, '_blank')

      // window.open(`http://127.0.0.1:8000/pdf?IdSolicitud=${IdSolicitud}&Pais=${this.reintegroItem.Pais}&user=${user}`, '_blank')

      // window.open(`http://10.10.0.35:8080/apiReintegro/public/pdf?IdSolicitud=${IdSolicitud}&Pais=${this.reintegroItem.Pais}&user=${user}`, '_blank')
    },
    print() {
      // const user = sessionStorage.getItem('userRei')
      const IdSolicitud = this.idSolicitud

      window.open(`http://10.10.0.16:82/api/printreintegro/${IdSolicitud}`, '_blank')

      // window.open(`http://127.0.0.1:8000/pdf?IdSolicitud=${IdSolicitud}&Pais=${this.reintegroItem.Pais}&user=${user}`, '_blank')

      // window.open(`http://10.10.0.35:8080/apiReintegro/public/pdf?IdSolicitud=${IdSolicitud}&Pais=${this.reintegroItem.Pais}&user=${user}`, '_blank')
    },
    getCountry() {
      const user = sessionStorage.getItem('userRei')
      axios.get(`/api/countrybyuser?user=${user}`).then(response => {
        this.dataCountry = response.data
        this.reintegroItem.Pais = this.dataCountry[0].IdPais
      }).catch(error => {
        console.log(error)
      })
    },
    async getBanco() {
      const data = await banco.obtenerBancoPais(this.reintegroItem.Pais)
      this.bancos = data
      this.reintegroItem.banco = '2'
    },
    changeCuentaContable() {
      this.boolMonto = true
      const { cuentaContable } = this.itemsLinea

      this.boolViatico = cuentaContable === '5-02-01-001-005'
    },
    changeViatico() {
      const { concepto } = this.itemsLinea
      this.itemsLinea.numFactura = this.checkbox === false ? 'n/a' : this.itemsLinea.numFactura
      if (concepto === 'Desayuno' && this.checkbox) this.itemsLinea.monto = 100
      if (concepto === 'Almuerzo' && this.checkbox) this.itemsLinea.monto = 150
      if (concepto === 'Cena' && this.checkbox) this.itemsLinea.monto = 120
      if (concepto === 'Desayuno' && !this.checkbox) this.itemsLinea.monto = 50
      if (concepto === 'Almuerzo' && !this.checkbox) this.itemsLinea.monto = 100
      if (concepto === 'Cena' && !this.checkbox) this.itemsLinea.monto = 80
      if (concepto === 'Hospedaje') this.itemsLinea.monto = 0
      if (concepto === 'Transporte') this.itemsLinea.monto = 0

      this.lockMonto()
    },
    lockMonto() {
      const { concepto } = this.itemsLinea
      if (concepto === 'Desayuno') this.boolMonto = true
      if (concepto === 'Almuerzo') this.boolMonto = true
      if (concepto === 'Cena') this.boolMonto = true
      if (concepto === 'Hospedaje') this.boolMonto = false
      if (concepto === 'Transporte') this.boolMonto = false
    },
  },
}
</script>
