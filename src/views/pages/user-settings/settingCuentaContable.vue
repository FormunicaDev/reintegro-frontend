<template>
  <v-card
    elevation="7"
    class="rounded-xl"
  >
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        :append-icon="icons.mdiMagnify"
        label="Buscar"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="dataCuentasUser"
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
            <v-toolbar-title>Usuarios Cuenta Contable</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <h4>Total de Registros</h4>
            <v-spacer></v-spacer>
            <v-dialog
              v-model="dialog"
              max-width="750px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  size="45px"
                  @click="getRelacionCuentaUser()"
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
                <v-card-title>Asociar nueva cuenta contable a un usuario</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="4">
                        <v-autocomplete
                          v-model="cuentaUserData.Users"
                          outlined
                          :items="dataUser"
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
                          v-model="cuentaUserData.IdCuentaContable"
                          outlined
                          :items="dataCuentaContable"
                          item-text="Descripcion"
                          item-value="IdCuentaContable"
                          dense
                          label="Cuenta Contable"
                          clearable
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="4">
                        <v-btn
                          color="primary"
                          @click="postRelacionCuentaUser()"
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
          <v-dialog
            v-model="dialogDelete"
            max-width="600px"
          >
            <v-card class="rounded-xl">
              <v-card-title class="text-h5">
                {{ message }}
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
                  v-if="!btnUpdate"
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
                <v-btn
                  v-if="btnUpdate"
                  color="info"
                  @click="reactiveItemConfirm()"
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
        </template>
      </v-data-table>
      <template>
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="totalPagina"
            circle
            :total-visible="7"
            @input="getCuentaContablePagination()"
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
import cuentaContableService from '@/services/cuentaContable'
import validateLogin from '@/services/validateLogin'
import actions from '@/services/action'
import users from '@/services/users'

export default {
  data: () => ({
    Id: 0,
    dialogDelete: false,
    dialog: false,
    loadDelete: false,
    search: '',
    status: '',
    snackbar: '',
    text: '',
    icons: {
      mdiMagnify,
      mdiDelete,
      mdiReload,
      mdiRefreshCircle,
    },
    headers: [
      {
        text: 'ID',
        align: 'start',
        sortable: false,
        value: 'Id',
      },
      { text: 'Cuenta Contable', value: 'CuentaContable' },
      { text: 'Descripción', value: 'Descripcion' },
      { text: 'Usuario', value: 'Users' },
      { text: 'Estado', value: 'status' },
      { text: 'Fecha Registro', value: 'fechaCreacion' },
      { text: '', value: 'actions', sortable: false },
    ],
    dataCuentasUser: [],
    dataUser: [],
    dataCuentaContable: [],
    cuentaUserData: {
      IdCuentaContable: 0,
      Users: '',
      usuarioCreacion: '',
    },
    btnUpdate: false,
    message: '',
    page: 0,
    totalPagina: 0,
    totalRegistros: 0,
  }),
  created() {
    this.getRelacionCuentaUser()
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
    async getRelacionCuentaUser() {
      const data = await cuentaContableService.getRelacionCuentaUser(10)
      this.dataCuentasUser = data.data
      this.totalRegistros = data.total
      this.totalPagina = data.last_page
      this.page = data.current_page
    },
    async getCuentaContablePagination() {
      const data = await cuentaContableService.getRelacionCuentaUser(10, this.page)
      this.dataCuentasUser = data.data
      this.totalRegistros = data.total
      this.totalPagina = data.last_page
      this.page = data.current_page
    },
    async postRelacionCuentaUser() {
      if (this.validateData) {
        this.cuentaUserData.usuarioCreacion = sessionStorage.getItem('userRei')
        const result = await cuentaContableService.createRelacionCuentaUser(this.cuentaUserData)
        this.snackbar = true
        this.text = result.mensaje
        this.getRelacionCuentaUser()
      }
    },
    async deleteRelacionCuentaUser() {
      const result = await cuentaContableService.anularRelacionCuentaUser(this.Id)
      await this.getRelacionCuentaUser()
      this.snackbar = true
      this.text = result.mensaje
    },
    async getUsers() {
      this.dataUser = await users.listarUsuario()
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
      this.message = '¿Seguro que desea activar esta cuenta contable al usuario seleccionado?'
      this.btnUpdate = true
      this.dialogDelete = true
    },
    async reactiveRelacionCuentaUser() {
      const result = await cuentaContableService.activarRelacionCuentaUser(this.Id)
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
    async getCuentaContable() {
      this.dataCuentaContable = await cuentaContableService.listarCuentasContables(1000)
    },
    closeDelete() {
      this.dialogDelete = false
    },
    async nuevo() {
      await this.getUsers()
      await this.getCuentaContable()
    },
    validateData() {
      if (this.cuentaUserData.users === '') {
        this.snackbar = true
        this.text = 'Favor seleccione un usuario'

        return false
      } if (this.cuentaUserData.IdCuentaContable === 0) {
        this.snackbar = true
        this.text = 'Favor seleccionar una cuenta contable'

        return false
      }

      return true
    },
  },
}
</script>
