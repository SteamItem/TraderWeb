<template>
  <v-card>
    <v-card-title>
      Rollbit History
    </v-card-title>
    <v-data-table
      :headers="historyHeaders"
      :items="historyItems"
      :search="historySearch"
      sort-by="listed_at"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
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
    </v-data-table>
  </v-card>
</template>

<script>
  import axios from 'axios';
  export default {
    data: () => ({
      historySearch: '',
      historyHeaders: [
        { text: 'List Date', value: 'listed_at' },
        { text: 'Gone Date', value: 'gone_at' },
        { text: 'Item Name', value: 'name' },
        { text: 'Base Price', value: 'baseprice' },
        { text: 'Markup', value: 'markup' },
        { text: 'Price', value: 'price' },
      ],
      historyItems: [],
    }),
    created () {
      this.findAll()
    },
    methods: {
      findAll() {
        this.historyFindAll();
      },
      async historyFindAll() {
        const token = await this.$auth.getTokenSilently();
        var response = await axios.get(`/api/rollbit`, { headers: { Authorization: `Bearer ${token}` }})
        this.historyItems = response.data;
      }
    },
  }
</script>
