const Subscription = artifacts.require('Subscription')
const FundingToken = artifacts.require('FundingToken')
const TestToken = artifacts.require('TestToken')

contract('FundingToken subscription tests', async accounts => {
    const owner = accounts[0]
    const relay = accounts[8]
    const proxy = accounts[9]

    it('...test subscription in return for FundingTokens', async () => {
        // let testTokenInstance = await TestToken.deployed()

        let fromAddress = accounts[3]
        let toAddress = accounts[4]

        let fundingTokenInstance = await FundingToken.deployed()
        console.log('FundingToken', fundingTokenInstance.address)
        let ttContract = new web3.eth.Contract(TestToken.abi)
        // let ttGasEstimate = await web3.eth.estimateGas({ data: TestToken.bytecode })
        let ttContractInstance = await ttContract
            .deploy({
                arguments: [fromAddress],
                data: TestToken.bytecode,
            })
            .send({ from: owner, gas: 844444400 }) //Math.round(ttGasEstimate * 1.2) })
            .then(async ttInstance => {
                console.log('TestToken', ttInstance.options.address) // instance with the new contract address
                let ttBalance = await ttInstance.methods.balanceOf(fromAddress).call()

                assert.equal(ttBalance, 1000000000000000000000, 'Initial supply.')
                let ftBalance = await fundingTokenInstance.balanceOf(fromAddress)
                assert.equal(ftBalance.toNumber(), 0, 'Initial supply to zero.')

                let tokenAmount = 1000000000000000000
                let contractArgs = [
                    fundingTokenInstance.address,
                    ttInstance.options.address,
                    `${tokenAmount}`,
                    '120',
                    '0',
                    '0',
                ]

                let gasEstimate = await web3.eth.estimateGas({ data: Subscription.bytecode })
                let contract = new web3.eth.Contract(Subscription.abi)
                let subContract = await contract
                    .deploy({
                        arguments: contractArgs,
                        data: Subscription.bytecode,
                    })
                    .send({ from: owner, gas: Math.round(gasEstimate * 1.2) })
                    .then(async subContractInstance => {
                        console.log('Subscription', subContractInstance.options.address) // instance with the new contract address

                        const parts = [
                            fromAddress,
                            contractArgs[0],
                            contractArgs[1],
                            contractArgs[2],
                            contractArgs[3],
                            contractArgs[4],
                            0,
                        ]

                        // Get subscription hash from input parts
                        const subscriptionHash = await subContractInstance.methods
                            .getSubscriptionHash(...parts)
                            .call()
                        console.log('Subscription hash', subscriptionHash)
                        // sign the subscription hash
                        let signature = await web3.eth.sign('' + subscriptionHash, '' + fromAddress)
                        console.log('Signature', signature)
                        // recover signer from signature
                        let signer = await subContractInstance.methods
                            .getSubscriptionSigner(subscriptionHash, signature)
                            .call()
                        assert.equal(signer, fromAddress, 'Signer should be identical.')

                        // check initial ERC20 allowance and balance
                        let allowance = await ttInstance.methods
                            .allowance(fromAddress, subContractInstance.options.address)
                            .call()
                        assert.equal(allowance, 0, 'Allowed amount should be 0.')
                        // increase allowance
                        await ttInstance.methods
                            .approve(subContractInstance.options.address, `${tokenAmount * 4}`)
                            .send({
                                from: fromAddress,
                            })

                        // check increased allowance
                        allowance = await ttInstance.methods
                            .allowance(fromAddress, subContractInstance.options.address)
                            .call()
                        assert.equal(
                            allowance,
                            `${tokenAmount * 4}`,
                            'Allowed amount should be identical.'
                        )

                        let subscriptionArgs = parts.concat([signature])
                        // subscription should be ready, because of satisfying balance and allowance
                        let isReady = await subContractInstance.methods
                            .isSubscriptionReady(...subscriptionArgs)
                            .call()
                        assert.isTrue(isReady, 'Subscription should be ready')
                        // subscription should still not be active yet
                        let isActive = await subContractInstance.methods
                            .isSubscriptionActive(subscriptionHash, 10)
                            .call()
                        assert.isFalse(isActive, 'Subscription should not be active yet')

                        let ftBalance1 = await fundingTokenInstance.balanceOf(fromAddress)
                        let proxyBalance1 = await ttInstance.methods
                            .balanceOf(fundingTokenInstance.address)
                            .call()
                        // execute subscription
                        await subContractInstance.methods
                            .executeSubscription(...subscriptionArgs)
                            .send({ from: proxy, gas: 844444400, value: tokenAmount })
                        // call mintFor directly
                        // await fundingTokenInstance.mintFor(fromAddress, {
                        //     from: fromAddress,
                        //     value: tokenAmount,
                        // })
                        let ftBalance2 = await fundingTokenInstance.balanceOf(fromAddress)
                        assert.isTrue(
                            ftBalance2.toNumber() > ftBalance1.toNumber(),
                            'Initial supply to zero.'
                        )

                        let proxyBalance2 = await ttInstance.methods
                            .balanceOf(fundingTokenInstance.address)
                            .call()
                        assert.equal(
                            proxyBalance1,
                            proxyBalance2 - tokenAmount,
                            'Amounts should be increased.'
                        )

                        isActive = await subContractInstance.methods
                            .isSubscriptionActive(subscriptionHash, 10)
                            .call()
                        assert.isTrue(isActive, 'Subscription should now be active')
                        isReady = await subContractInstance.methods
                            .isSubscriptionReady(...subscriptionArgs)
                            .call()
                        assert.isFalse(isReady, 'Subscription should not be ready again')

                        // try to execute it anyway --> it should trow an error
                        try {
                            await subContractInstance.methods
                                .executeSubscription(...subscriptionArgs)
                                .send({ from: proxy, gas: 844444400, value: tokenAmount })
                            assert.fail('Should throw error.')
                        } catch (error) {
                            const revertFound = error.message.search('revert') >= 0
                            assert.isTrue(revertFound, `Expected "revert", got ${error} instead`)
                        }
                    })
            })
    })
})
