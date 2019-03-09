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

    <div class="box p-5 m-4">
      <h1 class="text-center">Fund my project</h1>
      <p class="text-center text-clear font-weight-500">First, lets select a category</p>
      <div class="d-flex align-items-center justify-content-center p-5">
        <div v-for="(category, i) in categories" width="226px" class="category d-flex flex-column align-items-center px-5 pt-5 pb-3 mx-3" :class="{active: i === selectedCategory}" @click="selectCategory(i)">
          <img :src="category.image" alt="" width="80px">
          <h4 class="text-center mt-4">{{ category.title }}</h4>
          <p class="text-center mt-4">Funding closes in <br/></p>
          <vac :end-time="category.endDate">
            <p
              class="text-center"
              slot="process"
              slot-scope="{ timeObj }">{{ `${ timeObj.d }days, ${timeObj.m}:${timeObj.s}` }}</p>
            <p slot="finish">Ended !</p>
          </vac>
        </div>
      </div>

      <div class="d-flex justify-content-center">
        <button class="form-btn">NEXT</button>
      </div>

      <div class="">
        <input type="text" v-model="newForm.title">
        <input type="text" v-model="newForm.description">
        <input type="text" v-model="newForm.image">
      </div>

      <div class="d-flex justify-content-center">
        <button class="form-btn grey mr-4">BACK</button>
        <button class="form-btn">NEXT</button>
      </div>
    </div>


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
import DB from '../../build/contracts/DB.json'

export default {
  name: 'Home',
  components: {
    HeaderTemplate,
    BodyTemplate,
    FooterTemplate
  },
  data() {
    return {
      selectedCategory: 1,
      newForm: {
        title: null,
        description: null,
        image: null
      },
      categories: [
        {
          id: 0,
          title: 'Music',
          image: musicImage,
          endDate: new Date().getTime() + 60000,
          projects: [
            {
              title: 'ok',
              logoImage: 'https://99designs-start-attachments.imgix.net/alchemy-pictures/2016%2F02%2F22%2F04%2F24%2F31%2Fb7bd820a-ecc0-4170-8f4e-3db2e73b0f4a%2F550250_artsigma.png?auto=format&ch=Width%2CDPR&w=250&h=250',
              backgroundImage: 'ok',
              externalLink: 'https://dedefeef.com',
              description: 'Loliliol fwe wefnwef wkenf;wei nw;goi ne fwe f',
              progress: 56
            }
          ]
        },
        {
          id: 1,
          title: 'Start-up',
          image: startUpImage,
          projects: []
        },
        {
          id: 2,
          title: 'Films',
          image: cameraImage,
          projects: []
        }
      ],
    }
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
      const DBContract = contract(DB)
      DBContract.setProvider(this.$store.state.web3.instance().currentProvider)
      DBContract.deployed().then(contractInstance => {
        console.log(contractInstance)
      })
    }
  }
}

import HeaderTemplate from './layout/HeaderTemplate'
import BodyTemplate from './layout/BodyTemplate'
import FooterTemplate from './layout/FooterTemplate'
</script>

<style scoped>
.form-btn {
  width: 226px;
  background: rgb(33,107,246);
  border: 0;
  border-radius: 4px;
  color: white;
  padding: 12px;
  font-weight: bold;
  font-size: 0.95rem;
}
.grey.form-btn {
  background: rgb(185, 185, 185);
  color: rgb(134, 134, 134);
}
  .tag {
    background: rgba(255, 0, 0, 0.22);
    color: red;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 4px;
  }
  #home {
    width: 100%;
  }
  .box {
    background: white;
    box-shadow: 1px 1px 30px rgba(0,0,0,0.05);
    border-radius: 4px;
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
  .category {
    border-radius: 4px;
    border: 1px solid rgb(230, 235, 237);
    cursor: pointer;
  }
  .category:hover {
    background-color: rgba(36, 161, 241, 0.07);
  }
  .category.active {
    border-color: rgb(0, 102, 255) !important;
  }
  .no-project {
    background: rgb(243, 246, 250);
    border-radius: 4px;
    color: rgb(21, 27, 68);
    font-weight: 500;
    align-self: stretch;
  }
</style>
