<template>
  <div id="app" class="d-flex">
    <div class="left-bar d-flex flex-column align-items-center p-3">
      <img src="@/assets/logo.svg" width="100%" alt="">

      <div class="nav-menu d-flex flex-column align-items-center justify-content-center">
        <router-link to="/">
          <div class="mb-3 p-1" :class="{ activated: path == '/'}">
            <img src="@/assets/home.svg" width="100%" alt="">
          </div>
        </router-link>
        <router-link to="/projects">
          <div class=" p-1" :class="{ activated: path == '/projects'}">
            <img src="@/assets/menu.svg" width="100%" alt="">
          </div>
        </router-link>
      </div>
    </div>

    <router-view
      class="router-view"
      :is-d-app-ready="isDAppReady"
      :current-view="currentView"
      :is-valid-user-but="isValidUserBut"
      @log-user-in="logUserIn"
      @log-user-out="logUserOut"
    />
  </div>
</template>

<script>
import Portis from '@portis/web3';
import Web3 from 'web3';
import { mapState } from "vuex";

export default {
  name: 'App',
  computed: {
    ...mapState({path: state => state.currentRoute.path})
  },
  props: {
    isDAppReady: {
      type: Boolean,
      default: false
    },
    currentView: {
      type: Object,
      default: null
    },
    isValidUserBut: {
      type: String,
      default: '0'
    }
  },
  created() {
    if (!this.$store.state.user.hasWeb3InjectedBrowser) {
      // por_portis-container
    }
  },
  methods: {
    logUserIn (evt) {
      this.$emit('log-user-in', evt)
    },
    logUserOut (evt) {
      this.$emit('log-user-out', evt)
    }
  }
}

</script>

<style>
.activated {
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
}
.nav-menu {
  flex: 1;
}
.text-clear {
  color: rgb(164, 164, 164);
}
.left-bar {
  background: rgb(33,107,246);
  width: 64px;
  align-self: stretch;
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}
  html {
    background: rgb(248, 249, 251);
  }

  body {
    margin: 0;
    width: 100%;
    background: none !important;
  }

  * {
    box-sizing: border-box;
  }

  textarea {
    resize: none;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    /*max-width: 960px;*/
    min-width: 1020px;
    margin: auto;
    height: 100vh;
    padding-left: 64px;
  }
  .router-view {
    flex: 1;
  }
</style>
