<template>
  <div id="home">
    <HeaderTemplate
      @log-user-in="logUserIn"
      @log-user-out="logUserOut"
    />
    <!-- <BodyTemplate
      :current-view="currentView"
    /> -->

    <h1>My funded projects</h1>
    <p>Status: Funded / Closing in 5 hours</p>
    <p>My actual share</p>

    <h1>Create my project</h1>

    <div class="projects-container pb-4 pl-4 pt-4 m-4">
      <div class="d-flex align-items-baseline">
        <h3 class="mb-4 mr-3">#music</h3>
        <vac :end-time="subject.endDate">
          <span
            slot="process"
            slot-scope="{ timeObj }">{{ `ends in ${ timeObj.d } days, ${timeObj.m} minutes ${timeObj.s} seconds` }}</span>
          <span slot="finish">Done!</span>
        </vac>
      </div>


      <div v-for="project in projects" :key="project" class="project p-4">
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
    HeaderTemplate,
    BodyTemplate,
    FooterTemplate
  },
  data() {
    return {
      subject: {
        endDate: new Date().getTime() + 60000
      },
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
    }
  },
  props: {
    currentView: {
      type: Object,
      default: null
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

import HeaderTemplate from './layout/HeaderTemplate'
import BodyTemplate from './layout/BodyTemplate'
import FooterTemplate from './layout/FooterTemplate'
</script>

<style scoped>
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
  h4 {
    font-size: 1.1rem;
    background: white;
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
  }
  .project__image {
    object-fit: cover;
    border-radius: 4px;
  }
</style>
