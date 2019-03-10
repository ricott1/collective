<template>
  <div id="home">
    <HeaderTemplate />
    <!-- <BodyTemplate
      :current-view="currentView"
    /> -->

    <div class="projects-container pb-4 pl-4 pt-4 m-4 d-flex flex-column align-items-stretch">
      <h1>Dashboard</h1>
      <p>I have {{ tokensAmount }} tokens</p>
      <p>My actual share</p>
      <div v-for="project in projects" :key="project" class="project p-4">
        <img :src="project.logoImage" alt="" width="50px" height="50px" class="project__image" />
        <h5 class="mt-3 font-weight-bold mb-0">{{ project.title }}</h5>
        <p class="text-clear">{{ project.externalLink }}</p>
        <p>{{ project.description }}</p>

        <div class="d-flex justify-content-between">
          <div class="tag">{{ project.progress }}% to minimum</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const musicImage = require('@/assets/music-player.svg')
const startUpImage = require('@/assets/start-up.svg')
const cameraImage = require('@/assets/video-camera.svg')

import contract from 'truffle-contract'
import ContinuousToken from '../../build/contracts/ContinuousToken.json'
import FundingToken from '../../build/contracts/FundingToken.json'
import Subscription from '../../build/contracts/Subscription.json'
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'Home',
  computed: {
    ...mapState({
      categories: state => state.categories,
      isDAppReady: state => state.isDAppReady,
    }),
  },
  data() {
    return {
      projects: [],
      tokensAmount: 0
    }
  },
  components: {
    HeaderTemplate,
    BodyTemplate,
    FooterTemplate,
  },
  props: {
    currentView: {
      type: Object,
      default: null,
    },
  },
  methods: {
    selectCategory(i) {
      this.selectedCategory = i
    },
    createSubscription() {
      if (this.$store.state.web3.instance) {
        // const web3 = this.$store.state.web3.instance()
        // const contract = contract(Subscription)
        // const parts = [
        //   fromAddress,
        //   toAddress,
        //   tokenAddress,
        //   web3.utils.toTwosComplement(tokenAmount),
        //   web3.utils.toTwosComplement(periodSeconds),
        //   web3.utils.toTwosComplement(gasPrice),
        //   web3.utils.toTwosComplement(0), // nonce
        // ]
        // const subscriptionHash = await contract.methods.getSubscriptionHash(...parts).call()
      }
    },
    getUserTokens() {
      if (this.$store.state.web3.instance) {

      }
    },
    getFundedProjects() {
      if (this.$store.state.web3.instance) {
        const web3 = this.$store.state.web3.instance()
        const Contract = contract(FundingToken)

        Contract.setProvider(this.$store.state.web3.instance().currentProvider)
        Contract.deployed()
          .then(contractInstance => {
            web3.eth.getAccounts((error, accounts) => {
              contractInstance
                .getFundedProjectCount({ from: accounts[0] })
                .then(count => {
                  for (var i = 0; i < count.toNumber(); i++) {
                    console.log(i)
                    contractInstance
                      .getFundedProjectByIndex(i)
                      .then(ret => {
                        console.log(ret)
                        this.projects.push(ret)
                        // TODO Push project id
                      })
                      .catch(err => console.log(err))
                  }
                })
                .catch(err => console.log(err))
            })
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    loadState() {
      this.getFundedProjects()
      this.getUserTokens()
    },
  },
  mounted() {
    this.loadState()
  },
  watch: {
    isDAppReady() {
      this.loadState()
    }
  }
}

import HeaderTemplate from './layout/HeaderTemplate'
import BodyTemplate from './layout/BodyTemplate'
import FooterTemplate from './layout/FooterTemplate'
</script>

<style scoped>
#home {
  width: 100%;
}
h4 {
  font-size: 1.1rem;
  border-radius: 4px;
}
.projects-container {
  background: white;
  box-shadow: 1px 1px 30px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
}
.project {
  border: 1px solid rgb(230, 235, 237);
  border-radius: 4px;
  float: left;
  max-width: 30%;
}
.project__image {
  object-fit: cover;
  border-radius: 4px;
}
.no-project {
  background: rgb(243, 246, 250);
  border-radius: 4px;
  color: rgb(21, 27, 68);
  font-weight: 500;
  align-self: stretch;
}
</style>
