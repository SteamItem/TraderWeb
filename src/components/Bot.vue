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
          <v-col cols="12" md="12">
            <v-textarea auto-grow rows="1" v-model="botParam.cookie" label="Cookie"></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-btn class="mx-2" dark color="teal" @click="save">Save</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>
<script>
  import axios from 'axios';
  export default {
    data: () => ({
      botParam: {
        id: 0,
        name: '',
        worker: false,
        code: '',
        cookie: ''
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
      async getBotParam() {
        var id = this.$route.params.id;
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/botParams/${id}`);
        this.botParam = response.data;
      },
      async save () {
        var id = this.$route.params.id;
        var response = await axios.put(`${process.env.VUE_APP_API_URL}/botParams/${id}`, {
          worker: this.botParam.worker,
          code: this.botParam.code,
          cookie: this.botParam.cookie
        });
        this.botParam = response.data;
      }
    },
  }
</script>
