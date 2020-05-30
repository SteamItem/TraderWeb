<template>
  <v-card>
    <v-card-title>
      Profit
    </v-card-title>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field v-model="searchRequest.name" label="Name"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select v-model="searchRequest.app_id" :items="appItems" attach label="App" clearable></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="searchRequest.last_days" type="number" label="Last Days"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select v-model="searchRequest.exterior" :items="exteriorItems" attach label="Exterior" clearable></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field v-model="searchRequest.last_profit_from" type="number" label="Last Profit From"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="searchRequest.last_profit_to" type="number" label="Last Profit To"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="searchRequest.history_profit_from" type="number" label="History Profit From"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="searchRequest.history_profit_to" type="number" label="History Profit To"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3">
            <v-switch v-model="searchRequest.ignore_zero_price" label="Ignore Zero Price" ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-btn class="mx-2" dark color="teal" @click="updateAll" :loading="updateAllLoading">Update All Inventory</v-btn>
          <v-btn class="mx-2" dark color="teal" @click="updateSelected" :loading="updateSelectedLoading">Update Selected Details</v-btn>
          <v-btn class="mx-2" dark color="teal" @click="search" :loading="searchLoading">Search</v-btn>
        </v-row>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">New Item</span>
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
      </v-container>
    </v-form>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="gridSearch"
      :loading="searchLoading"
      v-model="selected"
      item-key="id"
      show-select
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn color="blue" small @click="showWishlistPopup(item)">Wishlist</v-btn>
      </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-text-field
            v-model="gridSearch"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import axios from 'axios';
  export default {
    data: () => ({
      dialog: false,
      searchRequest: {
        name: null,
        app_id: 730,
        last_days: null,
        exterior: null,
        last_profit_from: null,
        last_profit_to: null,
        history_profit_from: null,
        history_profit_to: null,
        ignore_zero_price: true
      },
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
      selected: [],
      updateAllLoading: false,
      updateSelectedLoading: false,
      searchLoading: false,
      gridSearch: '',
      headers: [
        { text: 'Item Name', value: 'name' },
        { text: 'Last Profit', value: 'last_profit' },
        { text: 'History Profit', value: 'history_profit' },
        { text: 'CSGO Last Price', value: 'last_price' },
        { text: 'CSGO Average Price', value: 'csgoempire_avg_price' },
        { text: 'Rollbit Average Price', value: 'rollbit_avg_price' },
        { text: 'CSGO Count', value: 'csgoempire_count' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      items: [],
      appItems: [{
        text: "CSGO",
        value: 730
      },{
        text: "DOTA2",
        value: 570
      },{
        text: "RUST",
        value: 252490
      },{
        text: "H1Z1",
        value: 433850
      }],
      sites: [{
        text: "Empire",
        value: 1
      },{
        text: "Rollbit",
        value: 2
      }],
      exteriorItems: [{
        text: "Factory New",
        value: "Factory New"
      },{
        text: "Minimal Wear",
        value: "Minimal Wear"
      },{
        text: "Field-Tested",
        value: "Field-Tested"
      },{
        text: "Well-Worn",
        value: "Well-Worn"
      },{
        text: "Battle-Scarred",
        value: "Battle-Scarred"
      }]
    }),
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    methods: {
      search() {
        let that = this;
        that.searchLoading = true;
        axios.post(`${process.env.VUE_APP_API_URL}/pricEmpire/searchItems`, this.searchRequest).then(response => {
          that.searchLoading = false;
          that.items = response.data;
        }).catch(error => {
          that.searchLoading = false;
          console.log(error);
        });
      },
      updateAll() {
        let that = this;
        that.updateAllLoading = true;
        axios.get(`${process.env.VUE_APP_API_URL}/pricEmpire/refreshItems`).then(() => {
          that.updateAllLoading = false;
        }).catch(error => {
          that.updateAllLoading = false;
          console.log(error);
        });
      },
      updateSelected() {
        let that = this;
        let selectedIds = that.selected.map(s => s.id);
        that.updateSelectedLoading = true;
        axios.post(`${process.env.VUE_APP_API_URL}/pricEmpire/refreshItemDetails`, selectedIds).then(() => {
          that.updateSelectedLoading = false;
          that.selected = [];
        }).catch(error => {
          that.updateSelectedLoading = false;
          console.log(error);
        });
      },
      showWishlistPopup(item) {
        this.editedItem.name = item.name;
        this.editedItem.site_id = 0;
        this.editedItem.appid = item.app_id;
        this.dialog = true
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      insert () {
        return axios.post(`${process.env.VUE_APP_API_URL}/wishlistItems`, {
          site_id: this.editedItem.site_id,
          appid: this.editedItem.appid,
          name: this.editedItem.name,
          max_price: this.editedItem.max_price
        });
      },
      async save () {
        await this.insert();
        this.close()
      },
    },
  }
</script>
