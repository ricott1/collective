<template>
  <div id="home">
    <HeaderTemplate
    />
    <!-- <BodyTemplate
      :current-view="currentView"
    /> -->

    <h1>My funded projects</h1>
    <p>Status: Funded / Closing in 5 hours</p>
    <p>My actual share</p>

    <div class="projects-container pb-4 pl-4 pt-4 m-4 d-flex flex-column align-items-stretch">
      <div v-for="subject in categories" class="mb-4">
        <div class="d-flex align-items-baseline">
          <h3 class="mb-4 mr-3">#{{ subject.title }}</h3>
          <vac :end-time="subject.endDate">
            <span
              slot="process"
              slot-scope="{ timeObj }">{{ `ends in ${ timeObj.d } days, ${timeObj.m} minutes ${timeObj.s} seconds` }}</span>
            <span slot="finish">Ended !</span>
          </vac>
        </div>


        <div v-for="project in subject.projects" :key="project" class="project p-4">
          <img :src="project.logoImage" alt="" width="50px" height="50px" class="project__image">
          <h5 class="mt-3 font-weight-bold mb-0">{{ project.title }}</h5>
          <p class="text-clear">{{project.externalLink}}</p>
          <p>{{ project.description}}</p>

          <div class="d-flex justify-content-between">
            <div class="tag">
              {{ project.progress }}% to minimum
            </div>
          </div>
        </div>

        <div v-if="!subject.projects || !subject.projects.length">
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
import ContinuousToken from '../../build/contracts/ContinuousToken.json'
import { mapState } from "vuex"

export default {
  name: 'Home',
  computed: {
    ...mapState({
      categories: state => state.categories
    })
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
    selectCategory(i) {
      this.selectedCategory = i;
    }
  },
  mounted() {
    if (this.$store.state.web3.instance) {
      const Contract = contract(ContinuousToken)
      Contract.setProvider(this.$store.state.web3.instance().currentProvider)
      Contract.deployed().then(contractInstance => {
        console.log(contractInstance)
      }).catch(err => {
        console.log(err)
      })
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
