<template>
  <v-card>
    <v-card-title>
      CSGO Empire - Bot Edit
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
          <v-btn class="mx-2" dark color="teal" :loading="saveLoading" @click="saveBot">Save</v-btn>
          <v-btn class="mx-2" dark color="red" :disabled="isAdd" @click="deleteBot">Delete</v-btn>
          <v-dialog v-model="steamDialog" max-width="500px">
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
                <v-btn color="blue darken-1" text @click="steamClose">Cancel</v-btn>
                <v-btn color="blue darken-1" :loading="signInLoading" @click="signIn">Sign In</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </v-form>
    <v-card :disabled="isAdd">
      <v-card-title>
        Wishlist Items
      </v-card-title>
      <v-dialog v-model="wishlistDialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn class="mx-2" dark color="teal" v-on="on">Create</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Wishlist Editor</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field v-model="wishlistItem.name" label="Item name"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field v-model="wishlistItem.max_price" type="number" label="Max Price"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="wishlistClose">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveWishlistItem">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table
        :headers="wishlistItemHeaders"
        :items="wishlistItems"
        :disabled="isAdd"
        sort-by="name"
        class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-btn color="blue" small @click="editWishlistItem(item)">Edit</v-btn>
          <v-btn color="red" small @click="deleteWishlistItem(item)">Delete</v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-card>
</template>
<script>
  import axios from 'axios';
  export default {
    data: () => ({
      token: '',
      steamDialog: false,
      wishlistDialog: false,
      isAdd: true,
      saveLoading: false,
      signInLoading: false,
      wishlistItemHeaders: [
        { text: 'Item Name', value: 'name' },
        { text: 'Max Price', value: 'max_price' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      wishlistItems: [],
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
      wishlistItem: {
        name: ''
      },
      wishlistItemDefault: {
        name: ''
      },
    }),
    watch: {
      steamDialog (val) {
        val || this.steamClose();
      },
      wishlistDialog (val) {
        val || this.wishlistClose();
      },
    },
    created () {
      var botId = this.$route.params.botId;
      this.isAdd = !botId;
      this.initialize();
    },
    methods: {
      async initialize() {
        this.token = await this.$auth.getTokenSilently();
        if (!this.isAdd) {
          await this.getBot();
          await this.findWishlistItems();
        }
      },
      steamClose () {
        this.steamDialog = false
        setTimeout(() => {
          this.steamLogin = Object.assign({}, this.steamLoginDefault)
          this.signInLoading = false;
        }, 300)
      },
      wishlistClose () {
        this.wishlistDialog = false
        setTimeout(() => {
          this.wishlistItem = Object.assign({}, this.defaultItem);
        }, 300)
      },
      async getBot() {
        var botId = this.$route.params.botId;
        var result = await axios.get(`/api/bot/csgoEmpire/${botId}`, { headers: { Authorization: `Bearer ${this.token}` }});
        this.bot = result.data;
      },
      async saveBot () {
        if (this.isAdd) {
          await this.createBot();
        } else {
          await this.updateBot();
        }
      },
      async createBot() {
        const result = await axios.post(`/api/bot/csgoEmpire`, { name: this.bot.name }, { headers: { Authorization: `Bearer ${this.token}` }});
        const botId = result.data._id;
        this.$router.push({ path: `/CsGoEmpireBotEdit/${botId}`});
        this.bot = result.data;
        this.isAdd = false;
      },
      async updateBot() {
        let botId = this.$route.params.botId;
        return axios.put(`/api/bot/csgoEmpire/${botId}`, {
          name: this.bot.name,
          worker: this.bot.worker,
          code: this.bot.code
        }, { headers: { Authorization: `Bearer ${this.token}` }});
      },
      async deleteBot() {
        let botId = this.$route.params.botId;
        const confirmed = await confirm('Are you sure you want to delete this bot?');
        if (confirmed) {
          await axios.delete(`/api/bot/csgoEmpire/${botId}`, { headers: { Authorization: `Bearer ${this.token}` }});
          this.$router.push({ path: `/CsGoEmpireBots`});
        }
      },
      async findWishlistItems() {
        var botId = this.$route.params.botId;
        var response = await axios.get(`/api/wishlistItems/csgoEmpire/${botId}`, { headers: { Authorization: `Bearer ${this.token}` }});
        this.wishlistItems = response.data;
      },
      editWishlistItem (item) {
        this.wishlistItem = Object.assign({}, item)
        this.wishlistDialog = true
      },
      async saveWishlistItem () {
        if (this.wishlistItem._id) {
          await this.updateWishlistItem();
        } else {
          await this.createWishlistItem();
        }
        await this.findWishlistItems();
        this.wishlistClose()
      },
      async createWishlistItem () {
        var botId = this.$route.params.botId;
        return await axios.post(`/api/wishlistItems/csgoEmpire/${botId}`, {
          name: this.wishlistItem.name,
          max_price: this.wishlistItem.max_price
        }, { headers: { Authorization: `Bearer ${this.token}` }});
      },
      async updateWishlistItem() {
        var botId = this.$route.params.botId;
        return await axios.put(`/api/wishlistItems/csgoEmpire/${botId}/${this.wishlistItem._id}`, {
          name: this.wishlistItem.name,
          max_price: this.wishlistItem.max_price
        }, { headers: { Authorization: `Bearer ${this.token}` }});
      },
      async deleteWishlistItem (item) {
        var botId = this.$route.params.botId;
        const confirmed = await confirm('Are you sure you want to delete this item?');
        if (confirmed) {
          await axios.delete(`/api/wishlistItems/csgoEmpire/${botId}/${item._id}`, { headers: { Authorization: `Bearer ${this.token}` }});
          await this.findWishlistItems();
        }
      },
      async signIn () {
        let that = this;
        let botId = that.$route.params.botId;
        that.signInLoading = true;
        axios.post(`/api/bot/csgoEmpire/login/${botId}`, that.steamLogin, { headers: { Authorization: `Bearer ${this.token}` }}).then(() => {
          that.signInLoading = false;
          that.steamClose();
        }).catch(() => {
          that.signInLoading = false;
        })
      },
    },
  }
</script>
