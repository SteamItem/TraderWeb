<template>
  <v-card>
    <v-card-title>
      Wishlist Manager
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn color="blue" small @click="wishlistItems(item)">Detail</v-btn>
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
        var response = await axios.get(`${process.env.VUE_APP_API_URL}/wishlist`);
        this.items = response.data;
      },
      wishlistItems(item) {
        this.$router.push({ path: `/WishlistItem/${item._id}`});
      }
    },
  }
</script>
