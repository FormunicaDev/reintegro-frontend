<template>
  <v-card
    elevation="7"
    class="rounded-xl"
  >
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        :append-icon="icons.mdiMagnify"
        label="Buscar"
        single-line
        hide-details=""
      >
      </v-text-field>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="dataCentroUser"
        class="elevation-3"
        hide-default-footer
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            v-if="item.status === 'Inactivo'? true:false"
            @click="reactiveItem(item)"
          >
            {{ icons.mdiReload }}
          </v-icon>
          <v-icon
            v-if="item.status === 'Activo' ? true:false"
            @click="deleteItem(item)"
          >
            {{ icons.mdiDelete }}
          </v-icon>
        </template>
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
          <v-toolbar flat>
            <v-toolbar-title>Usuarios - Centro de Costo</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <h4>Total de Registros: </h4> {{ totalRegistros }}
            <v-spacer></v-spacer>
            <v-dialog
              v-model="dialog"
              max-width="750px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  size="45px"
                  @click="getCentroCostoUser()"
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
              <v-card
                class="rounded-xl"
              >
                <v-card-title>Asociar nuevo centro de costo a un usuario</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="4">
                        <v-autocomplete
                          v-model="centroUserData.Users"
                          outlined
                          :items="dataUsers"
                          item-text="USUARIO"
                          item-value="USUARIO"
                          dense
                          label="Usuario"
                          clearable
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="4">
                        <v-autocomplete
                          v-model="centroUserData.IdCentroCosto"
                          outlined
                          :items="dataCentroCosto"
                          item-text="Descripcion"
                          item-value="IdCentroCosto"
                          dense
                          label="Centro de Costo"
                          clearable
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="4">
                        <v-btn
                          color="primary"
                          @click="postRelacionCentroUser()"
                        >
                          Agregar
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
      </v-data-table>
      <template>
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="totalPagina"
            circle
            :total-visible="7"
            @input="getCentroCostoPagination()"
          ></v-pagination>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  mdiMagnify, mdiDelete, mdiReload, mdiRefreshCircle,
} from '@mdi/js'
import centroCostoService from '@/services/centroCosto'
import users from '@/services/users'

export default {
  data: () => ({
    icons: {
      mdiMagnify,
      mdiDelete,
      mdiRefreshCircle,
      mdiReload,
    },
    snackbar: false,
    dialog: false,
    headers: [
      { text: 'Centro de Costo', value: 'CentroCosto' },
      { text: 'Descreipción', value: 'Descripcion' },
      { text: 'Usuario', value: 'Users' },
      { text: 'Estado', value: 'status' },
      { text: 'Fecha Registro', value: 'fechaCreacion' },
      { text: '', value: 'actions', sortable: false },
    ],
    search: '',
    text: '',
    totalRegistros: 0,
    page: 0,
    totalPagina: 0,
    perPage: 10,
    dataCentroUser: [],
    dataCentroCosto: [],
    dataUsers: [],
    centroUserData: {
      users: '',
      IdCentroCosto: 0,
      usuarioCreacion: '',
    },
  }),
  created() {
    this.getCentroCostoUser()
  },
  methods: {
    async getCentroCostoUser() {
      const user = sessionStorage.getItem('userRei')
      const role = sessionStorage.getItem('roleRei')
      const data = await centroCostoService.listarCentroCostoUser(user, role, 10)
      this.dataCentroUser = data.data
      this.totalRegistros = data.total
      this.totalPagina = data.last_page
      this.page = data.current_page
    },
    async deleteRelacionCuentaUser() {
      const result = await centroCostoService.anularRelacionCentroUser(this.Id)
      await this.getRelacionCuentaUser()
      this.snackbar = true
      this.text = result.mensaje
    },
    deleteItem(item) {
      this.Id = item.Id
      this.message = '¿Seguro que desea eliminar este elemento?'
      this.btnUpdate = false
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      this.loadDelete = true
      await this.deleteRelacionCuentaUser()
      this.dialogDelete = false
      this.loadDelete = false
    },
    reactiveItem(item) {
      this.Id = item.Id
      this.message = '¿Seguro que desea activar este centro de costo al usuario seleccionado?'
      this.btnUpdate = true
      this.dialogDelete = true
    },
    async reactiveRelacionCuentaUser() {
      const result = await centroCostoService.activarRelacionCentroUser(this.Id)
      await this.getRelacionCuentaUser()
      this.snackbar = true
      this.text = result.mensaje
    },
    async reactiveItemConfirm() {
      this.loadDelete = true
      await this.reactiveRelacionCuentaUser()
      this.dialogDelete = false
      this.loadDelete = false
    },
    async nuevo() {
      await this.getUsers()
      await this.getCentroCosto()
    },
    async getUsers() {
      this.dataUsers = await users.listarUsuario()
    },
    async getCentroCosto() {
      const country = sessionStorage.getItem('countryUser')
      this.dataCentroCosto = await centroCostoService.listarCentroCostos(country)
    },
    async postRelacionCentroUser() {
      if (this.validateData) {
        this.centroUserData.usuarioCreacion = sessionStorage.getItem('userRei')
        const result = await centroCostoService.createCentroCostoUser(this.centroUserData)
        this.snackbar = true
        this.text = result.mensaje
        await this.getCentroCostoUser()
      }
    },
    async getCentroCostoPagination() {
      const user = sessionStorage.getItem('userRei')
      const role = sessionStorage.getItem('roleRei')
      const data = await centroCostoService.listarCentroCostoUserPagination(this.perPage, this.page, user, role)
      this.dataCentroUser = data.data
      this.page = data.current_page
      this.totalPagina = data.last_page
      this.totalRegistros = data.total
    },
    validateData() {
      if (this.centroUserData.users === '') {
        this.snackbar = true
        this.text = 'Favor seleccione un usuario'

        return false
      } if (this.centroUserData.IdCuentaContable === 0) {
        this.snackbar = true
        this.text = 'Favor seleccionar un centro de costo'

        return false
      }

      return true
    },
  },
}

</script>
