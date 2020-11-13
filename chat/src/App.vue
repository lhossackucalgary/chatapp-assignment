<template>
  <div id="app">
    <nav>
      <h1>Chat App</h1>
    </nav>
    <div class="spacer"></div>
    <Users v-bind:uid="uid"></Users>
    <MessageLog v-bind:uid="uid" v-bind:usernames="usernames"></MessageLog>
    <ChatInput v-bind:uid="uid"></ChatInput>
  </div>
</template>

<script>
import socket from '@/socket/socket.js';

import Users from '@/components/Users.vue';
import MessageLog from '@/components/MessageLog.vue';
import ChatInput from '@/components/ChatInput.vue';

export default {
  name: 'App',
  data: function() {
    return {
      uid: null,
      uname: "",
      usernames: []
    }
  },
  components: {
      Users,
      MessageLog,
      ChatInput
  },
  created() {

    socket.on('new uid', (msg) => {
      this.uid = msg.uid;
      this.uname = msg.username;
      window.localStorage.setItem('uid', this.uid);
      window.localStorage.setItem('uname', this.uname);
    });

    if(!localStorage.getItem('uid')) {
      socket.emit('new uid');
    } else {
      this.uid = Number(localStorage.getItem('uid'));
      socket.emit('post uid', this.uid);
    }
  }
}
</script>

<style>
* {
   margin: 0;
   padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  height: 100vh;
  display: grid;
  grid-template:
            "n n n" 2em
            "ml ml u" calc(100vh - 4em)
            "ci ci u" 2em / 1fr 1fr 1fr;
  font-size: 1.5em;
}
nav {
  grid-area: n;
  background-color: rgb(30,30,30);
}
nav h1 {
  font-size: 2em;
  font-family: monospace;
}

@media (max-width: 600px) {
  #app {
    grid-template:
              "n n" 1.5em
              "u u" 4em
              "s s" 0.5em
              "ml ml" calc(100vh - 8em)
              "ci ci" 2em / 1fr 1fr;
  }
  .spacer {
    grid-area: s;
    background-color: rgb(45,45,45);
  }
  nav h1 {
    font-size: 1.5em;
  }
}

@media (min-width: 960px) {
  #app {
    grid-template:
    ". n n n ." 2em
    ". ml ml u ." calc(100vh - 4em)
    ". ci ci u ." 2em / 1fr 320px 320px 320px 1fr;
    background-color: black;
  }

}
</style>
