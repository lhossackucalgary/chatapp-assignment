<template>
  <div class="users">
    <h2>Online</h2>
    <ul>
      <li v-for="user in users" v-bind:key="user.id">
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
  },
  mounted() {
    socket.on('online', (msg) => {
      this.users = msg;
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id === this.uid) {
          this.users[i].name += " (you)";
        }
      }
    });
  },
  watch:{
    uid(){
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id === this.uid) {
          this.users[i].name += " (you)";
        }
      }
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
