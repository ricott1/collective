let encodeCall = require('../node_modules/zos-lib').encodeCall
const Subscription = artifacts.require('Subscription')

contract('Fundabit subscription tests', async accounts => {
  const owner = accounts[0]
  const relay = accounts[8]
  const proxy = accounts[9]

  it('...isSubscriptionReady wrong signer', async () => {
    // let testTokenInstance = await TestToken.deployed()

    // initialize TestToken
    let data = encodeCall('initialize', ['address'], [accounts[0]])
    await testTokenInstance.sendTransaction({ data, from: accounts[0] })

    let fromAddress = accounts[3]
    let toAddress = accounts[4]

    let contractArgs = [
      toAddress,
      testTokenInstance.address,
      1000000000000000000,
      5,
      100000000000000000,
      0,
    ]

    // let gas = await web3.eth.estimateGas({ data: Subscription.bytecode })
    let gas = 6721975
    let gasPrice = 2000000000

    return Subscription.new(...contractArgs, {
      from: contractArgs[0],
      data: Subscription.bytecode,
      gas: gas,
      gasPrice: gasPrice,
      // arguments: contractArgs,
    }).then(async contract => {
      let subscriptionContract = contract.address

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
      const subscriptionHash = await contract.getSubscriptionHash(...parts)
      // sign the subscription hash
      let signature = await web3.eth.sign('' + accounts[5], '' + subscriptionHash)

      let subscriptionArgs = parts.concat([signature])

      // calculate approve amount
      let approveAmount = (contractArgs[2] + contractArgs[4]) * 12
      // increase allowance
      await testTokenInstance.approve(subscriptionContract, approveAmount, { from: fromAddress })
      // increase balance
      await testTokenInstance.transfer(fromAddress, approveAmount, { from: accounts[0] })

      // subscription should not be ready because of wrong signer
      let isReady = await contract.isSubscriptionReady(...subscriptionArgs)
      assert.isFalse(isReady, 'Subscription should not be ready')

      // update signature with correct signer now
      signature = await web3.eth.sign('' + fromAddress, '' + subscriptionHash)
      // update subscriptionArgs
      subscriptionArgs = parts.concat([signature])
      // check isReady
      isReady = await contract.isSubscriptionReady(...subscriptionArgs)
      assert.isTrue(isReady, 'Subscription should be ready')
      console.log('End of test reached')
    })
  })

  it('...isSubscriptionReady signer is author', async () => {
    // let testTokenInstance = await TestToken.deployed()

    return TestToken.new({
      from: accounts[0],
      data: TestToken.bytecode,
      gas: 6721975,
      gasPrice: 2000000000,
      // arguments: contractArgs,
    }).then(async testTokenInstance => {
      // initialize TestToken
      let data = encodeCall('initialize', ['address'], [accounts[0]])
      await testTokenInstance.sendTransaction({ data, from: accounts[0] })

      let fromAddress = accounts[3]
      let toAddress = accounts[3]

      let contractArgs = [
        toAddress,
        testTokenInstance.address,
        1000000000000000000,
        5,
        100000000000000000,
        0,
      ]

      // let gas = await web3.eth.estimateGas({ data: Subscription.bytecode })
      let gas = 6721975
      let gasPrice = 2000000000

      return Subscription.new(...contractArgs, {
        from: contractArgs[0],
        data: Subscription.bytecode,
        gas: gas,
        gasPrice: gasPrice,
        // arguments: contractArgs,
      }).then(async contract => {
        let subscriptionContract = contract.address

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
        const subscriptionHash = await contract.getSubscriptionHash(...parts)
        // sign the subscription hash
        let signature = await web3.eth.sign('' + fromAddress, '' + subscriptionHash)

        let subscriptionArgs = parts.concat([signature])

        // calculate approve amount
        let approveAmount = (contractArgs[2] + contractArgs[4]) * 12
        // increase allowance
        await testTokenInstance.approve(subscriptionContract, approveAmount, { from: fromAddress })
        // increase balance
        await testTokenInstance.transfer(fromAddress, approveAmount, { from: accounts[0] })

        // subscription should not be ready because of author == signer
        let isReady = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isFalse(isReady, 'Subscription should not be ready')

        console.log('End of test reached')
      })
    })
  })

  it('...isSubscriptionReady nextValidTimestamp not passed', async () => {
    // let testTokenInstance = await TestToken.deployed()

    return TestToken.new({
      from: accounts[0],
      data: TestToken.bytecode,
      gas: 6721975,
      gasPrice: 2000000000,
      // arguments: contractArgs,
    }).then(async testTokenInstance => {
      // initialize TestToken
      let data = encodeCall('initialize', ['address'], [accounts[0]])
      await testTokenInstance.sendTransaction({ data, from: accounts[0] })

      let fromAddress = accounts[3]
      let toAddress = accounts[4]

      let contractArgs = [
        toAddress,
        testTokenInstance.address,
        1000000000000000000,
        5,
        100000000000000000,
        0,
      ]

      // let gas = await web3.eth.estimateGas({ data: Subscription.bytecode })
      let gas = 6721975
      let gasPrice = 2000000000

      return Subscription.new(...contractArgs, {
        from: contractArgs[0],
        data: Subscription.bytecode,
        gas: gas,
        gasPrice: gasPrice,
        // arguments: contractArgs,
      }).then(async contract => {
        let subscriptionContract = contract.address

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
        const subscriptionHash = await contract.getSubscriptionHash(...parts)
        // sign the subscription hash
        let signature = await web3.eth.sign('' + fromAddress, '' + subscriptionHash)

        let subscriptionArgs = parts.concat([signature])

        // calculate approve amount
        let approveAmount = (contractArgs[2] + contractArgs[4]) * 12
        // increase allowance
        await testTokenInstance.approve(subscriptionContract, approveAmount, { from: fromAddress })
        // increase balance
        await testTokenInstance.transfer(fromAddress, approveAmount, { from: accounts[0] })

        // check isReady
        let isReady = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isTrue(isReady, 'Subscription should be ready')

        // execute subscription
        await contract.executeSubscription(...subscriptionArgs, { from: proxy })
        // wait for a new retry of executeSubscription
        await new Promise(resolve => setTimeout(resolve, (contractArgs[3] - 1) * 1000))
        isReady = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isFalse(isReady, 'Subscription should not be ready')
        // wait for a new retry of executeSubscription
        await new Promise(resolve => setTimeout(resolve, 1 * 1000))
        // check isReady
        isReady = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isTrue(isReady, 'Subscription should not be ready')

        console.log('End of test reached')
      })
    })
  })

  it('...execute subscription', async () => {
    // let testTokenInstance = await TestToken.deployed()
    return TestToken.new({
      from: accounts[0],
      data: TestToken.bytecode,
      gas: 6721975,
      gasPrice: 2000000000,
      // arguments: contractArgs,
    }).then(async testTokenInstance => {
      // initialize TestToken
      let data = encodeCall('initialize', ['address'], [accounts[0]])
      await testTokenInstance.sendTransaction({ data, from: accounts[0] })

      let fromAddress = accounts[2]
      let toAddress = accounts[1]

      let contractArgs = [
        toAddress,
        testTokenInstance.address,
        1000000000000000000,
        5,
        100000000000000000,
        0,
      ]

      // let gas = await web3.eth.estimateGas({ data: Subscription.bytecode })
      let gas = 6721975
      let gasPrice = 2000000000

      return Subscription.new(...contractArgs, {
        from: contractArgs[0],
        data: Subscription.bytecode,
        gas: gas,
        gasPrice: gasPrice,
        // arguments: contractArgs,
      }).then(async contract => {
        let subscriptionContract = contract.address
        let author = await contract.author()
        let toAddress = await contract.toAddress()
        let tokenAddress = await contract.tokenAddress()
        let tokenAmount = await contract.tokenAmount()
        let periodSeconds = await contract.periodSeconds()
        let gasPrice = await contract.gasPrice()

        assert.equal(author, contractArgs[0], 'Author should be set correctly.')
        assert.equal(toAddress, contractArgs[0], 'To address should be set correctly.')
        assert.equal(tokenAddress, contractArgs[1], 'Token address should be set correctly.')
        assert.equal(
          tokenAmount.toNumber(),
          contractArgs[2],
          'Token amount should be set correctly.'
        )
        assert.equal(
          periodSeconds.toNumber(),
          contractArgs[3],
          'Period seconds should be set correctly.'
        )
        assert.equal(gasPrice.toNumber(), contractArgs[4], 'Gas price should be set correctly.')

        let fundabitInstance = await Fundabit.deployed()
        await fundabitInstance.createCommunity(
          contractArgs[0],
          'ipfsHash#1',
          subscriptionContract,
          {
            from: proxy,
          }
        )

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
        const subscriptionHash = await contract.getSubscriptionHash(...parts)
        // const hash = soliditySha3('0x19', '0', subscriptionContract, ...parts)
        // assert.equal(subscriptionHash, hash, 'Subscription hashes should be identical.')

        // sign the subscription hash
        let signature = await web3.eth.sign('' + fromAddress, '' + subscriptionHash)

        // recover signer from signature
        let signer = await contract.getSubscriptionSigner(subscriptionHash, signature)
        assert.equal(signer, fromAddress, 'Signer should be identical.')

        let subscriptionArgs = parts.concat([signature])

        // check initial ERC20 allowance and balance
        let allowance = await testTokenInstance.allowance(fromAddress, subscriptionContract)
        assert.equal(allowance.toNumber(), 0, 'Allowed amount should be 0.')
        let balance = await testTokenInstance.balanceOf(fromAddress)
        assert.equal(balance.toNumber(), 0, 'User should have 0 balance yet.')

        // subscription should not be ready because of 0 ballance and 0 allowance
        let isReady = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isFalse(isReady, 'Subscription should not be ready')
        // subscription should not be active yet
        let isActive = await contract.isSubscriptionActive(subscriptionHash, 10)
        assert.isFalse(isActive, 'Subscription should not be active')

        // calculate approve amount
        let approveAmount = (tokenAmount.toNumber() + gasPrice.toNumber()) * 12

        // increase allowance
        await testTokenInstance.approve(subscriptionContract, approveAmount, { from: accounts[2] })

        // check increased allowance
        allowance = await testTokenInstance.allowance(fromAddress, subscriptionContract)
        assert.equal(allowance.toNumber(), approveAmount, 'Allowed amount should be identical.')

        // subscription should not be ready because of 0 ballance, but satisfying allowance
        isReady = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isFalse(isReady, 'Subscription should not be ready yet')
        // subscription should still not be active yet
        let isActive2 = await contract.isSubscriptionActive(subscriptionHash, 10)
        assert.isFalse(isActive2, 'Subscription should not be active yet')

        // check remaining balance of TestToken
        let TTbalance = await testTokenInstance.balanceOf(accounts[0])
        assert.isTrue(
          TTbalance.toNumber() > approveAmount,
          'TestToken should have enough remaining token supply'
        )

        // increase balance
        await testTokenInstance.transfer(fromAddress, approveAmount, { from: accounts[0] })

        // check increased balance
        balance = await testTokenInstance.balanceOf(fromAddress)
        assert.equal(balance.toNumber(), approveAmount, 'User should have now sufficient balance.')

        // subscription should now be ready, because of satisfying balance and allowance
        let isReady2 = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isTrue(isReady2, 'Subscription should now be ready')
        // subscription should still not be active yet
        let isActive3 = await contract.isSubscriptionActive(subscriptionHash, 10)
        assert.isFalse(isActive3, 'Subscription should not be active yet')

        // check balance of subscription's author and subscription executer (proxy server)
        let balancePublisher = await testTokenInstance.balanceOf(toAddress)
        assert.equal(balancePublisher.toNumber(), 0, 'User should have 0 balance yet.')
        let balanceExecuter = await testTokenInstance.balanceOf(proxy)
        assert.equal(balanceExecuter.toNumber(), 0, 'User should have 0 balance yet.')

        // execute subscription
        await contract.executeSubscription(...subscriptionArgs, { from: proxy })

        // subscription should now be active
        let isActive4 = await contract.isSubscriptionActive(subscriptionHash, 10)
        assert.isTrue(isActive4, 'Subscription should be active')

        // subscription's author and subscription executer should have got the tokenAmount and gasPrice
        balancePublisher = await testTokenInstance.balanceOf(toAddress)
        assert.equal(
          balancePublisher.toNumber(),
          tokenAmount.toNumber(),
          'User should have now a increased balance.'
        )
        balanceExecuter = await testTokenInstance.balanceOf(proxy)
        assert.equal(
          balanceExecuter.toNumber(),
          gasPrice.toNumber(),
          'Subscription executer should have now a increased balance.'
        )

        // subscription should not be ready yet
        let isReady3 = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isFalse(isReady3, 'Subscription should not be ready')

        // try to execute it anyway --> it should trow an error
        try {
          await contract.executeSubscription(...subscriptionArgs, { from: proxy })
          assert.fail('Should throw error.')
        } catch (error) {
          const revertFound = error.message.search('revert') >= 0
          assert.isTrue(revertFound, `Expected "revert", got ${error} instead`)
        }

        // wait for a new retry of executeSubscription
        await new Promise(resolve => setTimeout(resolve, contractArgs[3] * 1000))
        // retry after waiting
        await contract.executeSubscription(...subscriptionArgs, { from: proxy })

        // subscription's author and subscription executer should have got twice now the tokenAmount and gasPrice
        balancePublisher = await testTokenInstance.balanceOf(toAddress)
        assert.equal(
          balancePublisher.toNumber(),
          tokenAmount.toNumber() * 2,
          'User should have now a increased balance.'
        )
        balanceExecuter = await testTokenInstance.balanceOf(proxy)
        assert.equal(
          balanceExecuter.toNumber(),
          gasPrice.toNumber() * 2,
          'Subscription executer should have now a increased balance.'
        )

        console.log('End of test reached')
      })
    })
  })

  it('...cancel subscription', async () => {
    // let testTokenInstance = await TestToken.deployed()
    return TestToken.new({
      from: accounts[0],
      data: TestToken.bytecode,
      gas: 6721975,
      gasPrice: 2000000000,
      // arguments: contractArgs,
    }).then(async testTokenInstance => {
      // initialize TestToken
      let data = encodeCall('initialize', ['address'], [accounts[0]])
      await testTokenInstance.sendTransaction({ data, from: accounts[0] })

      let fromAddress = accounts[2]
      let toAddress = accounts[1]

      let contractArgs = [
        toAddress,
        testTokenInstance.address,
        1000000000000000000,
        3,
        100000000000000000,
        0,
      ]

      // let gas = await web3.eth.estimateGas({ data: Subscription.bytecode })
      let gas = 6721975
      let gasPrice = 2000000000

      return Subscription.new(...contractArgs, {
        from: contractArgs[0],
        data: Subscription.bytecode,
        gas: gas,
        gasPrice: gasPrice,
        // arguments: contractArgs,
      }).then(async contract => {
        let subscriptionContract = contract.address
        let author = await contract.author()
        let toAddress = await contract.toAddress()
        let tokenAddress = await contract.tokenAddress()
        let tokenAmount = await contract.tokenAmount()
        let periodSeconds = await contract.periodSeconds()
        let gasPrice = await contract.gasPrice()

        assert.equal(author, contractArgs[0], 'Author should be set correctly.')
        assert.equal(toAddress, contractArgs[0], 'To address should be set correctly.')
        assert.equal(tokenAddress, contractArgs[1], 'Token address should be set correctly.')
        assert.equal(
          tokenAmount.toNumber(),
          contractArgs[2],
          'Token amount should be set correctly.'
        )
        assert.equal(
          periodSeconds.toNumber(),
          contractArgs[3],
          'Period seconds should be set correctly.'
        )
        assert.equal(gasPrice.toNumber(), contractArgs[4], 'Gas price should be set correctly.')

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
        const subscriptionHash = await contract.getSubscriptionHash(...parts)
        // const hash = soliditySha3('0x19', '0', subscriptionContract, ...parts)
        // assert.equal(subscriptionHash, hash, 'Subscription hashes should be identical.')

        // sign the subscription hash
        let signature = await web3.eth.sign('' + fromAddress, '' + subscriptionHash)

        // recover signer from signature
        let signer = await contract.getSubscriptionSigner(subscriptionHash, signature)
        assert.equal(signer, fromAddress, 'Signer should be identical.')

        let subscriptionArgs = parts.concat([signature])

        // calculate approve amount
        let approveAmount = (tokenAmount.toNumber() + gasPrice.toNumber()) * 12
        // increase allowance
        await testTokenInstance.approve(subscriptionContract, approveAmount, { from: fromAddress })
        // increase balance
        await testTokenInstance.transfer(fromAddress, approveAmount, { from: accounts[0] })

        // execute subscription
        await contract.executeSubscription(...subscriptionArgs, { from: proxy })
        // wait that periodSecond passes
        await new Promise(resolve => setTimeout(resolve, contractArgs[3] * 1000))

        // subscription should be ready now
        let isReady = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isTrue(isReady, 'Subscription should be now ready')
        // subscription should be active
        let isActive = await contract.isSubscriptionActive(subscriptionHash, 10)
        assert.isTrue(isActive, 'Subscription should be active')
        // subscription should not be cancelled
        let isCancelled = await contract.isSubscriptionCancelled(subscriptionHash)
        assert.isFalse(isCancelled, 'Subscription should not be cancelled')

        // cancel subscription
        await contract.cancelSubscription(...subscriptionArgs, { from: fromAddress })

        // subscription should not be ready anymore
        let isReady2 = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isFalse(isReady2, 'Subscription should not be ready')
        // subscription should not be active now
        let isActive2 = await contract.isSubscriptionActive(subscriptionHash, 10)
        assert.isFalse(isActive2, 'Subscription should not be active')

        // subscription should be cancelled
        let isCancelled2 = await contract.isSubscriptionCancelled(subscriptionHash)
        assert.isTrue(isCancelled2, 'Subscription should be cancelled')

        // try to execute it anyway --> it should trow an error
        try {
          await contract.executeSubscription(...subscriptionArgs, { from: proxy })
          assert.fail('Should throw error.')
        } catch (error) {
          const revertFound = error.message.search('revert') >= 0
          assert.isTrue(revertFound, `Expected "revert", got ${error} instead`)
        }

        console.log('End of test reached')
      })
    })
  })

  it('...reset subscription', async () => {
    // let testTokenInstance = await TestToken.deployed()
    return TestToken.new({
      from: accounts[0],
      data: TestToken.bytecode,
      gas: 6721975,
      gasPrice: 2000000000,
      // arguments: contractArgs,
    }).then(async testTokenInstance => {
      // initialize TestToken
      let data = encodeCall('initialize', ['address'], [accounts[0]])
      await testTokenInstance.sendTransaction({ data, from: accounts[0] })

      let fromAddress = accounts[2]
      let toAddress = accounts[1]

      let contractArgs = [
        toAddress,
        testTokenInstance.address,
        1000000000000000000,
        3,
        100000000000000000,
        0,
      ]

      // let gas = await web3.eth.estimateGas({ data: Subscription.bytecode })
      let gas = 6721975
      let gasPrice = 2000000000

      return Subscription.new(...contractArgs, {
        from: contractArgs[0],
        data: Subscription.bytecode,
        gas: gas,
        gasPrice: gasPrice,
        // arguments: contractArgs,
      }).then(async contract => {
        let subscriptionContract = contract.address
        let author = await contract.author()
        let toAddress = await contract.toAddress()
        let tokenAddress = await contract.tokenAddress()
        let tokenAmount = await contract.tokenAmount()
        let periodSeconds = await contract.periodSeconds()
        let gasPrice = await contract.gasPrice()

        assert.equal(author, contractArgs[0], 'Author should be set correctly.')
        assert.equal(toAddress, contractArgs[0], 'To address should be set correctly.')
        assert.equal(tokenAddress, contractArgs[1], 'Token address should be set correctly.')
        assert.equal(
          tokenAmount.toNumber(),
          contractArgs[2],
          'Token amount should be set correctly.'
        )
        assert.equal(
          periodSeconds.toNumber(),
          contractArgs[3],
          'Period seconds should be set correctly.'
        )
        assert.equal(gasPrice.toNumber(), contractArgs[4], 'Gas price should be set correctly.')

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
        const subscriptionHash = await contract.getSubscriptionHash(...parts)
        // const hash = soliditySha3('0x19', '0', subscriptionContract, ...parts)
        // assert.equal(subscriptionHash, hash, 'Subscription hashes should be identical.')

        // sign the subscription hash
        let signature = await web3.eth.sign('' + fromAddress, '' + subscriptionHash)

        // recover signer from signature
        let signer = await contract.getSubscriptionSigner(subscriptionHash, signature)
        assert.equal(signer, fromAddress, 'Signer should be identical.')

        let subscriptionArgs = parts.concat([signature])

        // calculate approve amount
        let approveAmount = (tokenAmount.toNumber() + gasPrice.toNumber()) * 12
        // increase allowance
        await testTokenInstance.approve(subscriptionContract, approveAmount, { from: fromAddress })
        // increase balance
        await testTokenInstance.transfer(fromAddress, approveAmount, { from: accounts[0] })

        // execute subscription
        await contract.executeSubscription(...subscriptionArgs, { from: proxy })
        // wait that periodSecond passes
        await new Promise(resolve => setTimeout(resolve, contractArgs[3] * 1000))

        // subscription should be ready now
        let isReady = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isTrue(isReady, 'Subscription should be now ready')

        // cancel subscription
        await contract.cancelSubscription(...subscriptionArgs, { from: fromAddress })

        // subscription should not be ready anymore
        let isReady2 = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isFalse(isReady2, 'Subscription should not be ready')
        // subscription should be cancelled
        let isCancelled = await contract.isSubscriptionCancelled(subscriptionHash)
        assert.isTrue(isCancelled, 'Subscription should be cancelled')
        // subscription should not be active now
        let isActive = await contract.isSubscriptionActive(subscriptionHash, 10)
        assert.isFalse(isActive, 'Subscription should not be active')

        // try to execute it anyway --> it should trow an error
        try {
          await contract.executeSubscription(...subscriptionArgs, { from: proxy })
          assert.fail('Should throw error.')
        } catch (error) {
          const revertFound = error.message.search('revert') >= 0
          assert.isTrue(revertFound, `Expected "revert", got ${error} instead`)
        }

        // reset subscription
        await contract.resetSubscription(...subscriptionArgs, { from: fromAddress })

        // subscription should not be ready anymore
        let isReady3 = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isTrue(isReady3, 'Subscription should not be ready')
        // subscription should not be cancelled
        let isCancelled2 = await contract.isSubscriptionCancelled(subscriptionHash)
        assert.isFalse(isCancelled2, 'Subscription should not be cancelled')
        // subscription should not be active yet
        let isActive2 = await contract.isSubscriptionActive(subscriptionHash, 10)
        assert.isFalse(isActive2, 'Subscription should not be active')

        // execute subscription
        await contract.executeSubscription(...subscriptionArgs, { from: proxy })

        // subscription should now be active
        let isActive3 = await contract.isSubscriptionActive(subscriptionHash, 10)
        assert.isTrue(isActive3, 'Subscription should now be active')

        // subscription's author and subscription executer should have got twice now the tokenAmount and gasPrice
        let balancePublisher = await testTokenInstance.balanceOf(toAddress)
        assert.equal(
          balancePublisher.toNumber(),
          contractArgs[2] * 2,
          'User should have now a increased balance.'
        )
        let balanceExecuter = await testTokenInstance.balanceOf(proxy)
        assert.equal(
          balanceExecuter.toNumber(),
          contractArgs[4] * 2,
          'Subscription executer should have now a increased balance.'
        )

        console.log('End of test reached')
      })
    })
  })

  it('...reset subscription multiple times', async () => {
    // let testTokenInstance = await TestToken.deployed()
    return TestToken.new({
      from: accounts[0],
      data: TestToken.bytecode,
      gas: 6721975,
      gasPrice: 2000000000,
      // arguments: contractArgs,
    }).then(async testTokenInstance => {
      // initialize TestToken
      let data = encodeCall('initialize', ['address'], [accounts[0]])
      await testTokenInstance.sendTransaction({ data, from: accounts[0] })

      let fromAddress = accounts[2]
      let toAddress = accounts[1]

      let contractArgs = [
        toAddress,
        testTokenInstance.address,
        1000000000000000000,
        3,
        100000000000000000,
        0,
      ]

      // let gas = await web3.eth.estimateGas({ data: Subscription.bytecode })
      let gas = 6721975
      let gasPrice = 2000000000

      return Subscription.new(...contractArgs, {
        from: contractArgs[0],
        data: Subscription.bytecode,
        gas: gas,
        gasPrice: gasPrice,
        // arguments: contractArgs,
      }).then(async contract => {
        let subscriptionContract = contract.address
        let author = await contract.author()
        let toAddress = await contract.toAddress()
        let tokenAddress = await contract.tokenAddress()
        let tokenAmount = await contract.tokenAmount()
        let periodSeconds = await contract.periodSeconds()
        let gasPrice = await contract.gasPrice()

        assert.equal(author, contractArgs[0], 'Author should be set correctly.')
        assert.equal(toAddress, contractArgs[0], 'To address should be set correctly.')
        assert.equal(tokenAddress, contractArgs[1], 'Token address should be set correctly.')
        assert.equal(
          tokenAmount.toNumber(),
          contractArgs[2],
          'Token amount should be set correctly.'
        )
        assert.equal(
          periodSeconds.toNumber(),
          contractArgs[3],
          'Period seconds should be set correctly.'
        )
        assert.equal(gasPrice.toNumber(), contractArgs[4], 'Gas price should be set correctly.')

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
        const subscriptionHash = await contract.getSubscriptionHash(...parts)
        // const hash = soliditySha3('0x19', '0', subscriptionContract, ...parts)
        // assert.equal(subscriptionHash, hash, 'Subscription hashes should be identical.')

        // sign the subscription hash
        let signature = await web3.eth.sign('' + fromAddress, '' + subscriptionHash)

        // recover signer from signature
        let signer = await contract.getSubscriptionSigner(subscriptionHash, signature)
        assert.equal(signer, fromAddress, 'Signer should be identical.')

        let subscriptionArgs = parts.concat([signature])

        // calculate approve amount
        let approveAmount = (tokenAmount.toNumber() + gasPrice.toNumber()) * 12
        // increase allowance
        await testTokenInstance.approve(subscriptionContract, approveAmount, { from: fromAddress })
        // increase balance
        await testTokenInstance.transfer(fromAddress, approveAmount, { from: accounts[0] })

        // execute subscription
        await contract.executeSubscription(...subscriptionArgs, { from: proxy })
        // wait that periodSecond passes
        await new Promise(resolve => setTimeout(resolve, contractArgs[3] * 1000))

        // subscription should be ready now
        let isReady = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isTrue(isReady, 'Subscription should be now ready')

        // cancel subscription
        await contract.cancelSubscription(...subscriptionArgs, { from: fromAddress })

        // subscription should not be ready anymore
        let isReady2 = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isFalse(isReady2, 'Subscription should not be ready')
        // subscription should be cancelled
        let isCancelled = await contract.isSubscriptionCancelled(subscriptionHash)
        assert.isTrue(isCancelled, 'Subscription should be cancelled')

        // reset subscription
        await contract.resetSubscription(...subscriptionArgs, { from: fromAddress })

        // subscription should not be ready anymore
        let isReady3 = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isTrue(isReady3, 'Subscription should not be ready')
        // subscription should not be cancelled
        let isCancelled2 = await contract.isSubscriptionCancelled(subscriptionHash)
        assert.isFalse(isCancelled2, 'Subscription should not be cancelled')

        // try to reset subscription again
        try {
          await contract.resetSubscription(...subscriptionArgs, { from: fromAddress })
          assert.fail('Should throw error.')
        } catch (error) {
          const revertFound = error.message.search('revert') >= 0
          assert.isTrue(revertFound, `Expected "revert", got ${error} instead`)
        }

        // execute subscription
        await contract.executeSubscription(...subscriptionArgs, { from: proxy })

        // subscription's author and subscription executer should have got twice now the tokenAmount and gasPrice
        let balancePublisher = await testTokenInstance.balanceOf(toAddress)
        assert.equal(
          balancePublisher.toNumber(),
          contractArgs[2] * 2,
          'User should have now a increased balance.'
        )
        let balanceExecuter = await testTokenInstance.balanceOf(proxy)
        assert.equal(
          balanceExecuter.toNumber(),
          contractArgs[4] * 2,
          'Subscription executer should have now a increased balance.'
        )

        console.log('End of test reached')
      })
    })
  })

  it('...reset subscription from non-subscriber', async () => {
    // let testTokenInstance = await TestToken.deployed()
    return TestToken.new({
      from: accounts[0],
      data: TestToken.bytecode,
      gas: 6721975,
      gasPrice: 2000000000,
      // arguments: contractArgs,
    }).then(async testTokenInstance => {
      // initialize TestToken
      let data = encodeCall('initialize', ['address'], [accounts[0]])
      await testTokenInstance.sendTransaction({ data, from: accounts[0] })

      let fromAddress = accounts[2]
      let toAddress = accounts[1]

      let contractArgs = [
        toAddress,
        testTokenInstance.address,
        1000000000000000000,
        3,
        100000000000000000,
        0,
      ]

      // let gas = await web3.eth.estimateGas({ data: Subscription.bytecode })
      let gas = 6721975
      let gasPrice = 2000000000

      return Subscription.new(...contractArgs, {
        from: contractArgs[0],
        data: Subscription.bytecode,
        gas: gas,
        gasPrice: gasPrice,
        // arguments: contractArgs,
      }).then(async contract => {
        let subscriptionContract = contract.address
        let author = await contract.author()
        let toAddress = await contract.toAddress()
        let tokenAddress = await contract.tokenAddress()
        let tokenAmount = await contract.tokenAmount()
        let periodSeconds = await contract.periodSeconds()
        let gasPrice = await contract.gasPrice()

        assert.equal(author, contractArgs[0], 'Author should be set correctly.')
        assert.equal(toAddress, contractArgs[0], 'To address should be set correctly.')
        assert.equal(tokenAddress, contractArgs[1], 'Token address should be set correctly.')
        assert.equal(
          tokenAmount.toNumber(),
          contractArgs[2],
          'Token amount should be set correctly.'
        )
        assert.equal(
          periodSeconds.toNumber(),
          contractArgs[3],
          'Period seconds should be set correctly.'
        )
        assert.equal(gasPrice.toNumber(), contractArgs[4], 'Gas price should be set correctly.')

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
        const subscriptionHash = await contract.getSubscriptionHash(...parts)
        // const hash = soliditySha3('0x19', '0', subscriptionContract, ...parts)
        // assert.equal(subscriptionHash, hash, 'Subscription hashes should be identical.')

        // sign the subscription hash
        let signature = await web3.eth.sign('' + fromAddress, '' + subscriptionHash)

        // recover signer from signature
        let signer = await contract.getSubscriptionSigner(subscriptionHash, signature)
        assert.equal(signer, fromAddress, 'Signer should be identical.')

        let subscriptionArgs = parts.concat([signature])

        // calculate approve amount
        let approveAmount = (tokenAmount.toNumber() + gasPrice.toNumber()) * 12
        // increase allowance
        await testTokenInstance.approve(subscriptionContract, approveAmount, { from: fromAddress })
        // increase balance
        await testTokenInstance.transfer(fromAddress, approveAmount, { from: accounts[0] })

        // execute subscription
        await contract.executeSubscription(...subscriptionArgs, { from: proxy })
        // wait that periodSecond passes
        await new Promise(resolve => setTimeout(resolve, contractArgs[3] * 1000))

        // subscription should be ready now
        let isReady = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isTrue(isReady, 'Subscription should be now ready')

        // cancel subscription
        await contract.cancelSubscription(...subscriptionArgs, { from: fromAddress })

        // subscription should not be ready anymore
        let isReady2 = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isFalse(isReady2, 'Subscription should not be ready')
        // subscription should be cancelled
        let isCancelled = await contract.isSubscriptionCancelled(subscriptionHash)
        assert.isTrue(isCancelled, 'Subscription should be cancelled')

        // try to reset subscription again from non-subscriber
        try {
          await contract.resetSubscription(...subscriptionArgs, { from: toAddress })
          assert.fail('Should throw error.')
        } catch (error) {
          const revertFound = error.message.search('revert') >= 0
          assert.isTrue(revertFound, `Expected "revert", got ${error} instead`)
        }

        // reset subscription
        await contract.resetSubscription(...subscriptionArgs, { from: fromAddress })

        // subscription should not be ready anymore
        let isReady3 = await contract.isSubscriptionReady(...subscriptionArgs)
        assert.isTrue(isReady3, 'Subscription should not be ready')
        // subscription should not be cancelled
        let isCancelled2 = await contract.isSubscriptionCancelled(subscriptionHash)
        assert.isFalse(isCancelled2, 'Subscription should not be cancelled')

        // execute subscription
        await contract.executeSubscription(...subscriptionArgs, { from: proxy })

        // subscription's author and subscription executer should have got twice now the tokenAmount and gasPrice
        let balancePublisher = await testTokenInstance.balanceOf(toAddress)
        assert.equal(
          balancePublisher.toNumber(),
          contractArgs[2] * 2,
          'User should have now a increased balance.'
        )
        let balanceExecuter = await testTokenInstance.balanceOf(proxy)
        assert.equal(
          balanceExecuter.toNumber(),
          contractArgs[4] * 2,
          'Subscription executer should have now a increased balance.'
        )

        console.log('End of test reached')
      })
    })
  })
})
