<template>
  <v-card>
    <v-card-title>
      Duelbits - Bot List
    </v-card-title>
    <v-form>
      <v-container>
        <v-row>
          <v-btn class="mx-2" dark color="teal" @click="createBot">Create</v-btn>
        </v-row>
      </v-container>
    </v-form>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="name"
      class="elevation-1">
      <template v-slot:item.actions="{ item }">
        <v-btn color="blue" small @click="editBot(item._id)">Edit</v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
  import axios from 'axios';
  export default {
    data: () => ({
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Working', value: 'worker' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      items: [],
    }),
    created () {
      this.initialize()
    },
    methods: {
      initialize() {
        this.findAll();
      },
      async findAll() {
        const token = await this.$auth.getTokenSilently();
        var response = await axios.get(`/api/bot/duelbits`, { headers: { Authorization: `Bearer ${token}` }});
        this.items = response.data;
      },
      createBot() {
        this.$router.push({ path: `/DuelbitsBotEdit`});
      },
      editBot(botId) {
        this.$router.push({ path: `/DuelbitsBotEdit/${botId}`});
      }
    },
  }
</script>
