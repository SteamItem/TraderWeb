<template>
  <v-card>
    <v-card-title>
      {{ pageTitle }}
    </v-card-title>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-switch
              v-model="botParam.worker"
              label="Working"
              color="green"
            ></v-switch>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="botParam.code" label="Code"></v-text-field>
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
      botParam: {
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
        return `${this.botParam.name} - Bot Manager`
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize() {
        this.getBotParam();
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.steamLogin = Object.assign({}, this.steamLoginDefault)
          this.signInLoading = false;
        }, 300)
      },
      async getBotParam() {
        var id = this.$route.params.id;
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/botParams/${id}`);
        this.botParam = response.data;
      },
      save () {
        let that = this;
        let id = that.$route.params.id;
        that.saveLoading = true;
        axios.put(`${process.env.VUE_APP_API_URL}/botParams/${id}`, {
          worker: that.botParam.worker,
          code: that.botParam.code
        }).then(() => {
          that.saveLoading = false;
          that.getBotParam();
        }).catch(() => {
          that.saveLoading = false;
        });
      },
      async signIn () {
        let that = this;
        let id = that.$route.params.id;
        that.signInLoading = true;
        axios.post(`${process.env.VUE_APP_API_URL}/botParams/login/${id}`, that.steamLogin).then(() => {
          that.signInLoading = false;
          that.close()
        }).catch(() => {
          that.signInLoading = false;
        })
      },
    },
  }
</script>
