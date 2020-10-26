<template>
  <v-card>
    <v-card-title>
      {{ pageTitle }}
    </v-card-title>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field v-model="bot.name" label="Name"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-switch
              v-model="bot.worker"
              label="Working"
              color="green"
              :disabled="isAdd"
            ></v-switch>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="bot.code" label="Code" :disabled="isAdd"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-btn class="mx-2" dark color="teal" :loading="saveLoading" @click="save">Save</v-btn>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-2" dark color="teal" v-on="on" :disabled="isAdd">Sign In With Steam</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Sign In With Steam</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="steamLogin.username" label="Username"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="steamLogin.password" label="Password"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="steamLogin.twoFactorCode" label="Two Factor Code"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" :loading="signInLoading" @click="signIn">Sign In</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>
<script>
  import axios from 'axios';
  export default {
    data: () => ({
      dialog: false,
      isAdd: true,
      saveLoading: false,
      signInLoading: false,
      bot: {
        name: '',
        worker: false,
        code: ''
      },
      steamLogin: {
        username: '',
        password: '',
        twoFactorCode: ''
      },
      steamLoginDefault: {
        username: '',
        password: '',
        twoFactorCode: ''
      },
    }),
    computed: {
      pageTitle () {
        var id = this.$route.params.id;
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
          default:
            throw new Error("Invalid bot name");
        }
        return `${botName} - Bot Edit`
      },
    },
    created () {
      var botId = this.$route.params.botId;
      this.isAdd = !botId;
      this.initialize()
    },
    methods: {
      initialize() {
        this.getBot();
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.steamLogin = Object.assign({}, this.steamLoginDefault)
          this.signInLoading = false;
        }, 300)
      },
      async getBot() {
        var botId = this.$route.params.botId;
        const token = await this.$auth.getTokenSilently();
        var response = await axios.get(`/api/bot/${botId}`, { headers: { Authorization: `Bearer ${token}` }});
        this.bot = response.data;
      },
      async save () {
        if (this.isAdd) {
          await this.insert();
        } else {
          await this.update();
        }
      },
      async insert() {
        let type = this.$route.params.id;
        const token = await this.$auth.getTokenSilently();
        const result = await axios.post(`/api/bot`, {
          type: type,
          name: this.bot.name
        }, { headers: { Authorization: `Bearer ${token}` }});
        const botId = result._id;
        this.$router.push({ path: `/BotEdit/${type}/${botId}`});
      },
      async update() {
        let type = this.$route.params.id;
        let botId = this.$route.params.botId;
        const token = await this.$auth.getTokenSilently();
        return axios.put(`/api/bot/${botId}`, {
          type: type,
          name: this.bot.name,
          worker: this.bot.worker,
          code: this.bot.code
        }, { headers: { Authorization: `Bearer ${token}` }});
      },
      async delete() {
        let botId = this.$route.params.botId;
        const confirmed = await confirm('Are you sure you want to delete this bot?');
        if (confirmed) {
          const token = await this.$auth.getTokenSilently();
          await axios.delete(`/api/bot/${botId}`, { headers: { Authorization: `Bearer ${token}` }});
        }
      },
      async signIn () {
        let that = this;
        let botId = that.$route.params.botId;
        that.signInLoading = true;
        const token = await this.$auth.getTokenSilently();
        axios.post(`/api/bot/login/${botId}`, that.steamLogin, { headers: { Authorization: `Bearer ${token}` }}).then(() => {
          that.signInLoading = false;
          that.close()
        }).catch(() => {
          that.signInLoading = false;
        })
      },
    },
  }
</script>
