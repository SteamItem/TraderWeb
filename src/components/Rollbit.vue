<template>
  <v-card>
    <v-card-title>
      Rollbit
    </v-card-title>
    <v-data-table
      :headers="historyHeaders"
      :items="historyItems"
      :search="historySearch"
      sort-by="created_at"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Rollbit History</v-toolbar-title>
          <v-text-field
            v-model="historySearch"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn class="mx-2" fab dark color="indigo" small @click="historyFindAll">
            <v-icon dark>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-checkbox v-model="item.fav" @change="historyItemFavChange(item.name, item.fav)"></v-checkbox>
      </template>
    </v-data-table>
    <v-data-table
      :headers="favHeaders"
      :items="favItems"
      :search="favSearch"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Rollbit Fav</v-toolbar-title>
          <v-text-field
            v-model="favSearch"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn class="mx-2" fab dark color="indigo" small @click="favFindAll">
            <v-icon dark>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import axios from 'axios';
  export default {
    data: () => ({
      historySearch: '',
      historyHeaders: [
        { text: 'Found Date', value: 'created_at' },
        { text: 'Item Name', value: 'name' },
        { text: 'Base Price', value: 'baseprice' },
        { text: 'Markup', value: 'markup' },
        { text: 'Price', value: 'price' },
        { text: 'Fav', value: 'actions', sortable: false },
      ],
      favHeaders: [
        { text: 'Item Name', value: 'name' },
      ],
      historyItems: [],
      favItems: [],
    }),
    created () {
      this.findAll()
    },
    methods: {
      findAll() {
        this.historyFindAll();
        this.favFindAll();
      },
      async historyFindAll() {
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/rollbit`)
        this.historyItems = response.data;
      },
      async favFindAll() {
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/rollbitFav`)
        this.favItems = response.data;
      },
      async historyItemFavChange(itemName, fav) {
        let postData = {name: itemName};
        if(fav) {
          await axios.post(`${process.env.VUE_APP_API_URL}/rollbitFav/add`, postData);
        } else {
          await axios.post(`${process.env.VUE_APP_API_URL}/rollbitFav/remove`, postData);
        }
        this.findAll();
      }
    },
  }
</script>
