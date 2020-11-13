<template>
  <div class="users">
    <h2>Online</h2>
    <ul>
      <li
        v-for="user in users"
        v-bind:key="user.id"
        v-bind:class="{ mine: (user.id == uid) }"
        v-bind:style="{color: user.color}"
      >
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import socket from '@/socket/socket.js';

export default {
  name: 'Users',
  components: {

  },
  props: {
    uid: Number
  },
  data () {
    return {
      users: []
    }
  },
  methods: {
    me_first() {
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id === this.uid) {
          let tmp = this.users[0];
          this.users[0] = this.users[i];
          this.users[i] = tmp;
        }
      }
    }
  },
  mounted() {
    socket.on('online', (msg) => {
      this.users = msg;
      this.me_first();
    });
  },
  watch:{
    uid(){
      this.me_first();
    }
  }
}
</script>

<style scoped>
.users {
    grid-area: u;
    background-color: rgb(55,55,55);
    color: white;
    font-family: monospace;
    overflow-y: auto;
}
h2 {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  text-decoration: underline;
}
.mine{
  font-weight: bold;
  font-style: italic;
}

@media (max-width: 600px) {
  h2 {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  ul li {
    display: inline;
  }
}
</style>
