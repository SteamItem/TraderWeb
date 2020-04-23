<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <span class="headline">Trader Bot</span>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        text
        @click="logout"
      >
        <span class="mr-2">Log Out</span>
        <v-icon>mdi-exit-run</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <Main/>
    </v-content>
  </v-app>
</template>

<script>
import Main from './components/Main';

export default {
  name: 'App',
  components: {
    Main
  },
  methods: {
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  },

  data: () => ({
    //
  }),
};
</script>
