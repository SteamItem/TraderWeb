<template>
  <v-card>
    <v-card-title>
      {{ pageTitle }}
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
        { text: 'Site', value: 'site_id' },
        { text: 'App', value: 'appid' },
        { text: 'Item Name', value: 'name' },
        { text: 'Max Price', value: 'max_price' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      items: [],
    }),
    watch: {
      '$route.params.id': function () {
        this.initialize()
      }
    },
    computed: {
      pageTitle () {
        var id = parseInt(this.$route.params.id);
        var botName;
        switch (id) {
          case 1:
            botName = "Empire - Instant";
            break;
          case 2:
            botName = "Empire - TradeLock Logger";
            break;
          case 3:
            botName = "Rollbit - CS:GO";
            break;
          case 4:
            botName = "Rollbit - CS:GO Logger";
            break;
          case 5:
            botName = "Duelbits - CS:GO";
            break;
          default: "";
        }
        return `${botName} - Bot List`
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize() {
        this.findAll();
      },
      async findAll() {
        var id = this.$route.params.id;
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/botList/${id}`);
        this.items = response.data;
      },
      createBot() {
        var id = this.$route.params.id;
        this.$router.push({ path: `/BotEdit/${id}`});
      },
      editBot (botId) {
        var id = this.$route.params.id;
        this.$router.push({ path: `/BotEdit/${id}/${botId}`});
      }
    },
  }
</script>
