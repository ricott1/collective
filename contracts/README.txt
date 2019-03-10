# Collective

## Inspiration
The crypto ecosystem is famous for innovative crowdfunding mechanisms like ICOs or newer and more sustainable alternatives like GitCoin Grants. However funding decisions are done on an individual level. Without effective coordination of the funders often times many projects end up receiving small and meaningless funding. If the supporters were able to agree on the most important or promising projects, the accumulated small pledges would make a difference for the deserving projects.

Thanks to crypto economics we can explore entirely new ways of crowdfunding. The Collective crowdfunding platform makes it possible to pool funds and allocate them effectively. It implements the Collective Voting Token (CVT) to incentivize early and long-term investment commitment combining a continuos token protocol with a long-term subscription system. The CVT can be exchanged back in any moment for the original DAO token.

 The platform could be used to fund single projects or sub-projects, like Ethereum Improvement Proposals for example. 

Collective is inspired by Token Curated Registries. Here a community of users is incentivized to 

## What it does
Collective is a crowdfunding platform for the crypto ecosystem. It is a web app with an intuitive, Reddit-like UI. Every entry is a project in need for funding. The ranking is determined by the allocation of Voting Tokens, i.e. a Token Curated Registry. Projects have a minimum funding goal they need to achieve. The number of projects that receive funding and the amount they receive is a function of the total size of the funding pool. This ensures that projects only receive funding if a meaningful amount of funds is available. And at the same time to avoid a few projects receiving an excessive amount if the funding pool is large.

You can expand projects to see more details and add a new one by clicking Create Project.
Funders can pledge monthly investments in DAI. The funds are pooled and paid out to the projects on a monthly basis. In return for his monthly pledge the funder receives CVT that represent his decision making power on fund allocation. The more he invests, the more Votes he receives. The Votes are minted according to Token Bonding Curves, meaning the sooner he invests, the more Votes he receives. To incentivize long-term commitment, we implemented a modifier that takes into account the number of months he’s been an investor. So, the longer his commitment, the more Votes he receives.

The specifications of the Token Bonding Curve make it extremely costly to buy up the majority of the voting power (51% attack), since as the demand increases, the price increases, driving other funders to convert the CVT back for a gain. 

## How we built it

The central part of the project is the smart contract managing projects creation and funding. We extended a continuous token based on token-bonding curves to create the CVT. We integrated a recurring-payments-system smart contract to allow funders to subscribe to the platform to help creators with a long-term vision. We incentivize subscriptions by modifying the CVT price based on the user fidelity. The token-bonding curves on which the CVT is based guarantees a layer of security against 51% attacks that would try to control the funding decision by making it economically costly.

The contracts are deployed on a SKALE sidechain. We benefit from SKALE high-speed and low-cost transactions to improve user experience. This is especially important for our user case because of the high costs that we would sustain with a normal blockchain due to the amount of data we manage. Furthermore, the SKALE blockchain provides an integrated file-storage system that we employ as a decentralized database for the projects data.

We take advantage of the Openzeppelin-solidity github repository as a provider for utility smart contracts.

The frontend is built with react. 


## Challenges we ran into

The main challenge we faced has been the integration of the various smart contracts, in particular of the subscription layer mediating between the users and the platform, and the CVT smart contract.

## Accomplishments that we're proud of

## What we learned

## What's next for Collective

