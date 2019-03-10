<template>
  <div id="home">
    <HeaderTemplate
    />
    <!-- <BodyTemplate
      :current-view="currentView"
    /> -->

    <div class="projects-container pb-4 pl-4 pt-4 m-4 d-flex flex-column align-items-stretch"  style="overflow: hidden;">
      <div v-for="subject in categories" class="mb-4" style="overflow: hidden;">
        <div class="d-flex align-items-baseline">
          <h3 class="mb-4 mr-3">#{{ subject.title }}</h3>
          <vac :end-time="subject.endDate">
            <span
              slot="process"
              slot-scope="{ timeObj }">{{ `ends in ${ timeObj.d } days, ${timeObj.m} minutes ${timeObj.s} seconds` }}</span>
            <span slot="finish">Ended !</span>
          </vac>
        </div>


        <div v-for="project in projects" v-if="project.field == subject.id" :key="project" class="project p-4 mx-2">
          <img :src="project.logoImage || 'https://99designs-start-attachments.imgix.net/alchemy-pictures/2016%2F02%2F22%2F04%2F24%2F31%2Fb7bd820a-ecc0-4170-8f4e-3db2e73b0f4a%2F550250_artsigma.png?auto=format&ch=Width%2CDPR&w=250&h=250'" alt="" width="50px" height="50px" class="project__image">
          <h5 class="mt-3 font-weight-bold mb-0">{{ project.title || 'Amazing project' }}</h5>
          <p class="text-clear">{{project.externalLink || 'https://mywebsite.com' }}</p>
          <p>{{ project.description || 'An amazing description'}}</p>

          <div class="d-flex justify-content-between">
            <div class="tag">
              {{ project.progress || 20 }}% to minimum
            </div>

            <button type="button" name="button" @click="fundProject(project)">Fund</button>
          </div>
        </div>

        <div v-if="!projects.filter(el => el.field == subject.id).length">
          <div class="no-project py-4 text-center mr-4">No projects yet</div>
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
import FundingToken from '../../build/contracts/FundingToken.json'
import { mapState } from "vuex"

export default {
  name: 'Home',
  computed: {
    ...mapState({
      categories: state => state.categories,
      isDAppReady: state => state.isDAppReady,
    })
  },
  data () {
    return {
      projects: []
    }
  },
  components: {
    HeaderTemplate,
    BodyTemplate,
    FooterTemplate
  },
  props: {
    currentView: {
      type: Object,
      default: null
    }
  },
  methods: {
    fundProject(project) {
      // if (this.$store.state.web3.instance) {
      //   const web3 = this.$store.state.web3.instance()
      //   const fundingContract = new web3.eth.Contract(FundingToken.abi, "0x958733cd16f2efda8444dec02e8fde6e345c0580")
      //
      //   web3.eth.getAccounts().then(accounts => {
      //     fundingContract.methods.fundedProjects()
      //     console.log(fundingContract)
      //     // fundingContract.methods.getFundedProjectCount(accounts[0]).call().then(amount => {
      //     //   this.tokensAmount = amount;
      //     // })
      //   })
      // }
      // console.log(project)
      // // projectList[index]
      //
      // if (this.$store.state.web3.instance) {
      //   const web3 = this.$store.state.web3.instance()
      //   const Contract = contract(FundingToken)
      //
      //   Contract.setProvider(this.$store.state.web3.instance().currentProvider)
      //   Contract.deployed().then(contractInstance => {
      //     web3.eth.getAccounts((error, accounts) => {
      //       console.log(contractInstance);
      //       const projectAddress = contractInstance.projectList[index]
      //       fundByAddress(projectAddress)
      //     });
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // }
    },
    getProjects() {
      if (this.$store.state.web3.instance) {
        const web3 = this.$store.state.web3.instance()
        const fundingContract = new web3.eth.Contract(FundingToken.abi, "0x958733cd16f2efda8444dec02e8fde6e345c0580")

        fundingContract.methods.getProjectCount().call().then(count => {
          for (var i = 0; i < count; i++) {
            fundingContract.methods.getProjectByIndex(i).call().then(ret => {
              this.projects.push({...ret, i })
            })
          }
        })
      }
    },
    loadState() {
      this.getProjects()
    }
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
    box-shadow: 1px 1px 30px rgba(0,0,0,0.05);
    border-radius: 4px;
    overflow: hidden;
  }
  .project {
    border: 1px solid rgb(230, 235, 237);
    border-radius: 4px;
    float: left;
    width: 25%;
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
