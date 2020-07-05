<template>
  <v-card>
    <v-card-title>
      {{ pageTitle }}
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="botUsers"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn color="blue" small @click="botUser(item)">Detail</v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
  import axios from 'axios';
  export default {
    data: () => ({
      bot: null,
      botUsers: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }),
    watch: {
      '$route.params.id': function () {
        this.initialize()
      }
    },
    computed: {
      pageTitle () {
        if (this.bot) {
          return `${this.bot.name} - Bot Manager`;
        } else {
          return `Bot Manager`;
        }
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize() {
        this.getBot();
        this.getBotUsers();
      },
      async getBot() {
        var id = this.$route.params.id;
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/bot/${id}`);
        this.bot = response.data;
      },
      async getBotUsers() {
        var id = this.$route.params.id;
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/botUser/all/${id}`);
        this.botUsers = response.data;
      },
      botUser(item) {
        this.$router.push({ path: `/BotUser/${item._id}`});
      }
    },
  }
</script>
