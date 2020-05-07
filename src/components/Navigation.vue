<template>
  <v-app-bar
    app
    color="primary"
    dark
  >
    <v-toolbar-title headline>Trader Bot</v-toolbar-title>
    <v-spacer></v-spacer>

    <router-link to="/">
      <v-btn icon>
        <v-icon>mdi-cogs</v-icon>
      </v-btn>
    </router-link>

    <v-btn icon @click="logout">
      <v-icon>mdi-exit-run</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Navigation',
  methods: {
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  },
}
</script>
