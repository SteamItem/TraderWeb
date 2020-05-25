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
          <v-btn class="mx-2" dark color="teal" @click="updateAll" :loading="updateAllLoading">Uptate All Inventory</v-btn>
          <v-btn class="mx-2" dark color="teal" @click="updateSelected" :loading="updateSelectedLoading">Uptate Selected Details</v-btn>
          <v-btn class="mx-2" dark color="teal" @click="search" :loading="searchLoading">Search</v-btn>
        </v-row>
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
      searchRequest: {
        name: null,
        app_id: null,
        last_days: null,
        exterior: null,
        last_profit_from: null,
        last_profit_to: null,
        history_profit_from: null,
        history_profit_to: null
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
        { text: 'CSGO Average Price', value: 'csgoempire.avg_price' },
        { text: 'Rollbit Average Price', value: 'rollbit.avg_price' },
        { text: 'CSGO Count', value: 'csgoempire.count' },
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
    },
  }
</script>
