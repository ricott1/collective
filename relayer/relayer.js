require('@babel/polyfill')
// import '@babel/polyfill'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser'
import Web3 from 'web3'
import SubscriptionBuild from '../build/contracts/Subscription.json'

var PrivateKeyProvider = require('truffle-privatekey-provider')
var providerUrl = 'http://104.248.242.122:8003'
var privateKey = '828146b3a9105a3e8db44247105ef4e16ee0f15146a7884fc9859e7f03f93ecd'
const provider = new PrivateKeyProvider(privateKey, providerUrl)
const web3 = new Web3(provider)
web3.eth.getAccounts().then(address => {
	web3.eth.defaultAccount = address[0]
	console.log(`Web3: Using defaultAccount ${web3.eth.defaultAccount}`)
})

// const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
// const web3 = new Web3(provider)
// console.log(`Web3: Using version ${web3.version}`)

// const PRIVATE_KEY = '54e4ac80822a6f3010789ef31ac7eae17e1efd4c3c6ba45f5912361f53af065a'
// const account = web3.eth.accounts.privateKeyToAccount(`0x${PRIVATE_KEY}`)
// web3.eth.accounts.wallet.add(account)
// web3.eth.defaultAccount = account.address

console.log(`Web3: Using version ${web3.eth.defaultAccount}`)

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())
// app.use(apiRoot, routes)

// in-memory subscription db
let subscriptions = {}

app.post('/subscription', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	console.log('POST /subscription', req.body)
	// let subscriptionHash = req.body.subscriptionHash
	// let sig = req.body.sig
	// let subscriptionContract = req.body.subscriptionContract
	// let parts = req.body.parts
	// // let communityId = req.body.communityId
	// let _id = req.body._id
	// let fromAddress = parts[0]
	// let toAddress = parts[1]
	// let tokenAddress = parts[2]
	// let tokenAmount = parts[3]
	// let periodSeconds = parts[4]
	// let gasPrice = parts[5]
	// let nonce = parts[6]
	let subscription = {
		fromAddress: req.body.fromAddress,
		toAddress: req.body.toAddress,
		tokenAddress: req.body.tokenAddress,
		tokenAmount: req.body.tokenAmount,
		periodSeconds: 120,
		gasPrice: 0,
		nonce: 0,
		subscriptionHash: req.body.subscriptionHash,
		contractAddress: req.body.toAddress,
		signature: req.body.signature,
	}

	let account = web3.eth.accounts.recover(subscription.subscriptionHash, subscription.signature)
	// check if sig was signed by fromAddress
	if (account.toLowerCase() === fromAddress.toLowerCase()) {
		console.log('Correct sig... save subscription')
		if (!Object.keys(subscriptions).includes(subscription.subscriptionHash)) {
			try {
				console.log('Subscription not present, adding it')

				res.send({ message: 'Subscription created successfully' })

				subscriptions[subscription.subscriptionHash] = subscription
				doSubscription(subscription)
			} catch (error) {
				console.error(error)
			}
		} else {
			res.status(400).send({ message: 'Subscription already present.' })
		}
	}
})

const doSubscription = async subscription => {
	try {
		console.log('Execute subscription for:', subscription.subscriptionHash)
		let parts = [fromAddress, toAddress, tokenAddress, tokenAmount, periodSeconds, gasPrice, nonce]

		let contract = new web3.eth.Contract(SubscriptionBuild.abi, subscription.contractAddress)
		// let contract = new web3.eth.Contract(Fundabit.abi, subscription.contractAddress)

		let doubleCheckHash = await contract.methods.getSubscriptionHash(...parts).call()
		console.log('Double check subscriptionHash:', doubleCheckHash === subscription.subscriptionHash)
		let doubleCheckSigner = await contract.methods
			.getSubscriptionSigner(doubleCheckHash, subscription.signature)
			.call()
		console.log('Double check subscription signer:', doubleCheckSigner === subscription.fromAddress)
		let subscriptionArgs = parts.concat([subscription.signature])

		let block = await web3.eth.getBlock('latest')
		console.log('Block timestamp:', new Date(block.timestamp * 1000).toLocaleString())
		let active = await contract.methods
			.isSubscriptionActive(subscription.subscriptionHash, 10)
			.call()
		console.log('Is subscription still active?', active)
		let ready = await contract.methods.isSubscriptionReady(...subscriptionArgs).call()
		console.log('Is subscription ready?', ready)

		if (ready) {
			// let gas = 6721975 //req.body.gas
			let estimateGas = await contract.methods
				.executeSubscription(...subscriptionArgs)
				.estimateGas({ from: web3.eth.defaultAccount })
			let gasPrice = web3.eth.gasPrice ? web3.eth.gasPrice : 1000000000
			let txparams = {
				from: web3.eth.defaultAccount,
				gas: Math.round(estimateGas * 1.2),
				gasPrice: gasPrice,
				value: subscription.tokenAmount,
			}

			console.log('Execute subscription', estimateGas, txparams, parts)

			let receipt = await contract.methods
				.executeSubscription(...parts, subscription.signature)
				.send(txparams)

			if (receipt.status) {
				console.log('SUCCESS', receipt.status)
			}
		}
	} catch (error) {
		console.error(error)
	}
}

// Check subscription every minute
setInterval(async () => {
	console.log('Subscription checker: Loop through all subscriptions')
	try {
		Object.keys(subscriptions).map(key => {
			let subscription = subscriptions[key]
			doSubscription(subscription)
		})
	} catch (error) {
		console.error(error)
	}
}, 30000)

app.listen(9999)
console.log(`Express: Server listening on port ${9999}`)
