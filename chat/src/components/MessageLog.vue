<template>
  <div class="message-log">
    <ol>
      <li v-for="msg in msg_log" v-bind:key="msg.timestamp">
        <small v-bind:class="{ mine: (uid == msg.uid) }">[ {{ usernames[msg.uid].name }} ]
          {{ (new Date(msg.timestamp)).toLocaleDateString() + " " + (new Date(msg.timestamp)).toLocaleTimeString() }}</small>
          <p v-bind:class="{ mine: (uid == msg.uid) }">{{ msg.content }}</p>
      </li>
    </ol>
  </div>
</template>

<script>
import socket from '@/socket/socket.js';
//v-bind:class="{ mine: (uid == msg.uid) }"
//v-bind:class="{ mine: (this.uid == msg.uid) }"
export default {
  name: 'MessageLog',
  components: {

  },
  props: {
    uid: Number,
  },
  data () {
    return {
      msg_log: [],
      usernames: Array
    }
  },
  methods: {
  },
  created() {
    socket.on('usernames', (msg) => {
      this.usernames = msg;
    });

    socket.on('chat message', (msg) => {
      this.msg_log.push(msg);
      setTimeout(() => {
        // Wait until vue has rendered new scroll height
        this.$el.scrollTop = this.$el.scrollHeight;
      }, 0)
    });

    socket.on('here chatlog', (msg) => {
      console.log(msg);
      this.msg_log = msg;
    });
    socket.emit('gimme chatlog');

  }
}
</script>

<style scoped>
.message-log {
    grid-area: ml;
    background-color: rgb(45,45,45);
    color: white;
    font-family: monospace;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse;
}
small {
  display: block;
  margin-top: 1em;
  margin-left: 1em;
  margin-right: 1em;
  text-align: left;
}
p {
  display: block;
  text-align: left;
  margin-left: 1em;
  margin-top: 0px;
  margin-right: 1em;
}
.mine {
  text-align: right;
  font-weight: bold;
}
ol {

}
</style>
