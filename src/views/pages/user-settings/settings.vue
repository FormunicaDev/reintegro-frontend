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
            <v-toolbar-title>Usuarios</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <h4>Total de Registros</h4>
          </v-toolbar>
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
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiMagnify, mdiDelete, mdiReload } from '@mdi/js'
import cuentaContableService from '@/services/cuentaContable'

export default {
  data: () => ({
    Id: 0,
    dialogDelete: false,
    loadDelete: false,
    search: '',
    status: '',
    snackbar: '',
    text: '',
    icons: {
      mdiMagnify,
      mdiDelete,
      mdiReload,
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
    cuentaUserData: {
      IdCuentaContable: 0,
      Users: '',
      usuarioCreacion: '',
    },
  }),
  created() {
    this.getRelacionCuentaUser()
  },
  methods: {
    async getRelacionCuentaUser() {
      this.dataCuentasUser = await cuentaContableService.getRelacionCuentaUser()
    },
    async postRelacionCuentaUser() {
      const result = await cuentaContableService.createRelacionCuentaUser(this.cuentaUserData)
      this.snackbar = true
      this.text = result.mensaje
    },
    async deleteRelacionCuentaUser() {
      const result = await cuentaContableService.anularRelacionCuentaUser(this.Id)
      await this.getRelacionCuentaUser()
      this.snackbar = true
      this.text = result.mensaje
    },
    deleteItem(item) {
      this.Id = item.Id
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      this.loadDelete = true
      await this.deleteRelacionCuentaUser()
      this.dialogDelete = false
      this.loadDelete = false
    },
    closeDelete() {
      this.dialogDelete = false
    },
  },
}
</script>
