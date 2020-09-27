<template>
  <v-card>
    <v-card-title>
      Wishlist Manager
    </v-card-title>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="searchName" label="Name"></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="searchSite" :items="sites" attach chips label="Site" multiple></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="searchApp" :items="appItems" attach chips label="App" multiple></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-2" dark color="teal" v-on="on">Create</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-select v-model="editedItem.site_id" label="Site" :items="sites"></v-select>
                    </v-col>
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
        </v-row>
      </v-container>
    </v-form>
    <v-data-table
      :headers="headers"
      :items="searchItems"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn color="blue" small @click="editItem(item)">Edit</v-btn>
        <v-btn color="red" small @click="deleteItem(item)">Delete</v-btn>
      </template>
      <template v-slot:item.site_id="{ item }">
        <v-select v-model="item.site_id" :items="sites" disabled></v-select>
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
      searchName: null,
      searchSite: [1, 2, 3],
      searchApp: [730, 570],
      sites: [{
        text: "Empire",
        value: 1
      },{
        text: "Rollbit",
        value: 2
      },{
        text: "Duelbits",
        value: 3
      }],
      appItems: [{
        text: "CS:GO",
        value: 730
      },{
        text: "Dota",
        value: 570
      }],
      headers: [
        { text: 'Site', value: 'site_id' },
        { text: 'App', value: 'appid' },
        { text: 'Item Name', value: 'name' },
        { text: 'Max Price', value: 'max_price' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      items: [],
      searchItems: [],
      editedIndex: -1,
      editedItem: {
        site_id: 0,
        appid: 0,
        name: ''
      },
      defaultItem: {
        site_id: 0,
        appid: 0,
        name: ''
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
      searchName () {
        this.filterItems();
      },
      searchSite () {
        this.filterItems();
      },
      searchApp () {
        this.filterItems();
      }
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize() {
        this.findAll();
      },
      async findAll() {
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/wishlistItems`);
        this.items = response.data;
        this.filterItems();
      },
      filterItems() {
        var items = this.items;
        if (this.searchName) {
          items = items.filter(i => i.name.toLowerCase().includes(this.searchName.toLowerCase()));
        }
        if (this.searchSite) {
          items = items.filter(i => this.searchSite.includes(i.site_id));
        }
        if (this.searchApp) {
          items = items.filter(i => this.searchApp.includes(i.appid));
        }
        this.searchItems = items;
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
          site_id: this.editedItem.site_id,
          appid: this.editedItem.appid,
          name: this.editedItem.name,
          max_price: this.editedItem.max_price
        });
      },
      update() {
        return axios.put(`${process.env.VUE_APP_API_URL}/wishlistItems/${this.editedItem._id}`, {
          site_id: this.editedItem.site_id,
          appid: this.editedItem.appid,
          name: this.editedItem.name,
          max_price: this.editedItem.max_price
        });
      }
    },
  }
</script>
