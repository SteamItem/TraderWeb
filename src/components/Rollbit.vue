<template>
  <v-card>
    <v-card-title>
      Rollbit History
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      sort-by="created_at"
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
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-checkbox v-model="item.fav" @change="itemFavChange(item.name, item.fav)"></v-checkbox>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import axios from 'axios';
  export default {
    data: () => ({
      botStatus: false,
      search: '',
      headers: [
        { text: 'Found Date', value: 'created_at' },
        { text: 'Item Name', value: 'name' },
        { text: 'Base Price', value: 'baseprice' },
        { text: 'Markup', value: 'markup' },
        { text: 'Price', value: 'price' },
        { text: 'Fav', value: 'actions', sortable: false },
      ],
      items: [],
    }),
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.findAll();
      },
      async findAll() {
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/rollbit`)
        this.items = response.data;
      },
      async itemFavChange(itemName, fav) {
        let postData = {name: itemName};
        console.log(postData);
        if(fav) {
          await axios.post(`${process.env.VUE_APP_API_URL}/rollbitFav/add`, postData);
        } else {
          await axios.post(`${process.env.VUE_APP_API_URL}/rollbitFav/remove`, postData);
        }
        await this.findAll();
      }
    },
  }
</script>
