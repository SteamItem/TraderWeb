<template>
  <v-card>
    <v-card-title>
      Manage Bot
    </v-card-title>
    <v-switch v-model="botStatus" color="green" class="mx-2" :label="`Bot Status`"></v-switch>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn class="mx-2" fab dark color="indigo" small @click="findAll">
            <v-icon dark>mdi-refresh</v-icon>
          </v-btn>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-2" fab dark color="teal" small v-on="on">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-select v-model="editedItem.appid" label="App" :items="appItems"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="editedItem.max_price" label="Max Price"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field v-model="editedItem.name" label="Item name"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn color="blue" small @click="editItem(item)">Edit</v-btn>
        <v-btn color="red" small @click="deleteItem(item)">Delete</v-btn>
      </template>
      <template v-slot:item.appid="{ item }">
        <v-select v-model="item.appid" :items="appItems" disabled></v-select>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import axios from 'axios';
  export default {
    data: () => ({
      dialog: false,
      botStatus: false,
      search: '',
      appItems: [{
        text: "CS:GO",
        value: 730
      }],
      headers: [
        { text: 'App', value: 'appid' },
        { text: 'Item Name', value: 'name' },
        { text: 'Max Price', value: 'max_price' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        appid: 0,
        name: '',
        max_price: 0,
      },
      defaultItem: {
        appid: 0,
        name: '',
        max_price: 0
      },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      botStatus(newValue) {
        if (newValue === true) {
          this.startBot();
        } else {
          this.stopBot();
        }
      }
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.findAll();
        this.getBotStatus();
      },
      async findAll() {
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/wishlistItems`)
        this.items = response.data;
      },
      async getBotStatus() {
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/params/botStatus`)
        this.botStatus = response.data.value;
      },
      async startBot() {
        await axios.get(`${process.env.VUE_APP_API_URL}/params/botStatus/start`)
        await this.getBotStatus();
      },
      async stopBot() {
        await axios.get(`${process.env.VUE_APP_API_URL}/params/botStatus/stop`)
        await this.getBotStatus();
      },
      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      async deleteItem (item) {
        const confirmed = await confirm('Are you sure you want to delete this item?');
        if (confirmed) {
          await axios.delete(`${process.env.VUE_APP_API_URL}/wishlistItems/${item._id}`);
          await this.findAll();
        }
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      async save () {
        if (this.editedIndex > -1) {
          await this.update();
        } else {
          await this.insert();
        }
        await this.findAll();
        this.close()
      },
      insert () {
        return axios.post(`${process.env.VUE_APP_API_URL}/wishlistItems`, {
          appid: this.editedItem.appid,
          name: this.editedItem.name,
          max_price: this.editedItem.max_price
        });
      },
      update() {
        return axios.put(`${process.env.VUE_APP_API_URL}/wishlistItems/${this.editedItem._id}`, {
          appid: this.editedItem.appid,
          name: this.editedItem.name,
          max_price: this.editedItem.max_price
        });
      }
    },
  }
</script>
