const musicImage = require('@/assets/music-player.svg')
const startUpImage = require('@/assets/start-up.svg')
const cameraImage = require('@/assets/video-camera.svg')

export default {
  currentRoute: null,
  currentView: null,
  web3: {
    address: null,
    coinbase: null,
    error: null,
    instance: null,
    isInjected: false,
    networkId: null
  },
  user: {
    balance: '0.00',
    coinbase: '',
    email: '',
    firstName: '',
    gravatar: '',
    hasCoinbase: false,
    hasWeb3InjectedBrowser: false,
    isConnectedToApprovedNetwork: false,
    isLoggedIn: false,
    lastName: ''
  },
  isDAppReady: false,
  isValidUserBut: '0',
  originalIsValidUserBut: '0',
  categories: [
    {
      id: 0,
      title: 'Music',
      image: musicImage,
      endDate: new Date().getTime() + 60000,
      projects: [
        {
          title: 'Amazing project',
          logoImage: 'https://99designs-start-attachments.imgix.net/alchemy-pictures/2016%2F02%2F22%2F04%2F24%2F31%2Fb7bd820a-ecc0-4170-8f4e-3db2e73b0f4a%2F550250_artsigma.png?auto=format&ch=Width%2CDPR&w=250&h=250',
          backgroundImage: 'ok',
          externalLink: 'https://mywebsite.com',
          description: 'An amazing description',
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
