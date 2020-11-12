<template>
  <div class="chat-input">
    <input type="text" name="chatin" id="chatin" v-on:keyup.enter="submit" v-model="msg">
  </div>
</template>

<script>
import socket from '@/socket/socket.js';

export default {
  name: 'ChatInput',
  components: {

  },
  props: {
    uid: Number
  },
  data () {
    return {
      msg: ""
    }
  },
  methods: {
    submit() {
      if (this.msg != "") {
        socket.emit('chat message', {
          uid: this.uid,
          content: this.msg
        });
      }
      this.msg = ""
    }
  },
  mounted() {
    console.log('ChatInput');
    console.log(socket);
  }
}
</script>

<style scoped>
.chat-input {
    grid-area: ci;
    background-color: rgb(45,45,45);
}
#chatin {
  outline: none;
  width: calc(100% - 30px);
  font-size: 1em;
  margin: auto;
  margin-top: 0.5em;
  background-color: rgb(55,55,55);
  color: white;
  font-family: monospace;
  border-radius: 0.25em;
}
</style>
