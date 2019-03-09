<template>
  <div class="top-bar d-flex align-items-center px-4">
    <h3>Projects</h3>
    <div v-if="web3.coinbase" class="">
      <div>My account</div>
      <div>{{ web3.coinbase }}</div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapState } from "vuex"

export default {
  name: 'HeaderTemplate',
  data: function () {
    return {
      user: this.$store.state.user
    }
  },
  computed: {
    ...mapState({
      web3: state => state.web3
    })
  },
  methods: {
    logUserIn (evt = null) {
      if (evt) evt.target.disabled = true
      this.$emit('log-user-in', evt)
    },
    logUserOut (evt = null) {
      if (evt) evt.target.disabled = true
      this.$emit('log-user-out', evt)
    },

  }
}
</script>

<style scoped>
  .top-bar {
    background: white;
    width: 100%;
    border-bottom: 1px solid rgb(241,243,244);
    height: 64px;
  }
  h3 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: bolder;
  }
</style>
