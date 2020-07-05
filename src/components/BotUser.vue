<template>
  <v-card>
    <v-card-title>
      {{ pageTitle }}
    </v-card-title>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-switch
              v-model="botUser.worker"
              label="Working"
              color="green"
            ></v-switch>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="botUser.code" label="Code"></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="botUser.wishlist_id" :items="wishlists" label="Wishlist" item-text="name" item-value="_id"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field disabled v-model="botUser.steam_username" label="Steam UserName"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-btn class="mx-2" dark color="teal" :loading="saveLoading" @click="save">Save</v-btn>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn class="mx-2" dark color="teal" v-on="on">Sign In With Steam</v-btn>
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
      saveLoading: false,
      signInLoading: false,
      wishlists: [],
      botUser: {
        id: 0,
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
    watch: {
      '$route.params.id': function () {
        this.initialize()
      }
    },
    computed: {
      pageTitle () {
        return `${this.botUser.name} - Bot Manager`
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize() {
        this.getBotUser();
        this.getWishlists();
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.steamLogin = Object.assign({}, this.steamLoginDefault)
          this.signInLoading = false;
        }, 300)
      },
      async getBotUser() {
        var id = this.$route.params.id;
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/botUser/${id}`);
        this.botUser = response.data;
      },
      async getWishlists() {
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/wishlist/`);
        this.wishlists = response.data;
      },
      save () {
        let that = this;
        let id = that.$route.params.id;
        that.saveLoading = true;
        axios.put(`${process.env.VUE_APP_API_URL}/botUser/${id}`, {
          worker: that.botUser.worker,
          code: that.botUser.code,
          wishlist_id: that.botUser.wishlist_id
        }).then(() => {
          that.saveLoading = false;
          that.getBotUser();
        }).catch(() => {
          that.saveLoading = false;
        });
      },
      async signIn () {
        let that = this;
        let id = that.$route.params.id;
        that.signInLoading = true;
        axios.post(`${process.env.VUE_APP_API_URL}/botUser/login/${id}`, that.steamLogin).then(() => {
          that.signInLoading = false;
          that.close()
        }).catch(() => {
          that.signInLoading = false;
        })
      },
    },
  }
</script>
