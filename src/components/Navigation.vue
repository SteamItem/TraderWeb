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

    <router-link to="/rollbit">
      <v-btn icon>
        <v-icon>mdi-history</v-icon>
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
  data() {
    return {
      items: [
        {
          id: 0,
          title: 'Hello World',
          page:'/HelloWorld'
        },
        {
          id: 1,
          title: 'Home',
          page:'/Home'
        },
        {
          id: 2,
          title: 'About',
          page:'/About'
        },
        {
          id: 3,
          title: 'Contact',
          page:'/Contact'
        }
      ]
    }
  },
  methods: {
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  },
}
</script>
