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
        if (this.msg.startsWith('/')) {
          if (/^\/name \b([a-zA-Z0-9_]{1,20})$/.test(this.msg)) {
            let new_name = this.msg.split(' ')[1];
            console.log(`new name: ${new_name}`)
            socket.emit('change uname', new_name);
          } else if (/^\/color \b([0-9A-Fa-f]{6})$/.test(this.msg)) {
            let new_color = this.msg.split(' ')[1];
            console.log(`new color: ${new_color}`)
            socket.emit('change color', new_color);
          } else {
            alert("Malformed command!");
          }
        } else {
          this.msg.replaceAll(':)', '\u{1F601}');
          this.msg.replaceAll(':(', '\u{1F61E}');
          this.msg.replaceAll(':o', '\u{1F632}');
          socket.emit('chat message', {
            uid: this.uid,
            content: this.msg
          });
        }
      }
      this.msg = ""
    }
  },
  mounted() {
    socket.on('command failed', (msg) => {
      alert(`Command Failed! ${msg.reason}`);
    });
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
