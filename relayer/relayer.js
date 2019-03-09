require('@babel/polyfill')
// import '@babel/polyfill'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import Web3 from 'web3'

const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
const web3 = new Web3(provider)

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())
// app.use(apiRoot, routes)

app.get('/subscribe', (req, res) => {
	console.log('TEST')
})

app.listen(9999)
console.log(`Express: Server listening on port ${9999}`)
