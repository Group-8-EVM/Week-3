you can see my transactions here at explorer:
https://sepolia.etherscan.io/address/0x92FE67bE9C0697ee32768cd2B2BCDC411774A056

---

deployed the votes token wtih:
```shell
npx ts-node .\scripts\DeployVoteToken.ts 
```
transaction address:  0x0044acd5a0c096ab9287d8af8461126c190295d88618dc646f0f380b569f6d68

contract address:  0x13d2b334d6a6a73427923436cfa0f1ad363a1500

---

mint tokens wtih:
```shell
npx ts-node .\scripts\MintVoteToken.ts 0x13d2b334d6a6a73427923436cfa0f1ad363a1500 10
```
transaction:  0x1c5d2850db661c4322a05ec16cb1a91133b160fd2cfe59429c4a06119652e5b6


---

mint tokens wtih:
```shell
npx ts-node .\scripts\MintVoteToken.ts 0x13d2b334d6a6a73427923436cfa0f1ad363a1500 10
```
transaction:  0x1c5d2850db661c4322a05ec16cb1a91133b160fd2cfe59429c4a06119652e5b6


---

get vote tokens by:
```shell
npx ts-node .\scripts\GetVoteTokens.ts 0x13d2b334d6a6a73427923436cfa0f1ad363a1500 0x92FE67bE9C0697ee32768cd2B2BCDC411774A056
```
0x92FE67bE9C0697ee32768cd2B2BCDC411774A056 has 20 voting tokens and 0 voting power

---

get vote tokens by:
```shell
npx ts-node .\scripts\GetVoteTokens.ts 0x13d2b334d6a6a73427923436cfa0f1ad363a1500 0x56951EdE351a4f2Ef80E650f94E4f5f0ebBDAA8c
```
0x56951EdE351a4f2Ef80E650f94E4f5f0ebBDAA8c has 0 voting tokens and 0 voting power

---


transferring 5 tokens to 0x92FE67bE9C0697ee32768cd2B2BCDC411774A056 by:
```shell
npx ts-node .\scripts\TransferVoteToken.ts 0x13d2b334d6a6a73427923436cfa0f1ad363a1500 0x56951EdE351a4f2Ef80E650f94E4f5f0ebBDAA8c 5
```
transaction: 0xd95a47d602f712b49f55665a949f84312fe1d7d84e3f4dae74a013be672894d1


---

get vote tokens by:
```shell
npx ts-node .\scripts\GetVoteTokens.ts 0x13d2b334d6a6a73427923436cfa0f1ad363a1500 0x92FE67bE9C0697ee32768cd2B2BCDC411774A056
```
0x92FE67bE9C0697ee32768cd2B2BCDC411774A056 has 15 voting tokens and 0 voting power

---

get vote tokens by:
```shell
npx ts-node .\scripts\GetVoteTokens.ts 0x13d2b334d6a6a73427923436cfa0f1ad363a1500 0x56951EdE351a4f2Ef80E650f94E4f5f0ebBDAA8c
```
0x56951EdE351a4f2Ef80E650f94E4f5f0ebBDAA8c has 5 voting tokens and 0 voting power

---


self delegating tokens by:
```shell
npx ts-node .\scripts\DelegateVoteToken.ts 0x13d2b334d6a6a73427923436cfa0f1ad363a1500 0x92FE67bE9C0697ee32768cd2B2BCDC411774A056
```
transaction:  0xec862ea96212ffb3bc6149b96feca0b87e872bd768d39354fdef431e485b3611

---

get vote tokens by:
```shell
npx ts-node .\scripts\GetVoteTokens.ts 0x13d2b334d6a6a73427923436cfa0f1ad363a1500 0x92FE67bE9C0697ee32768cd2B2BCDC411774A056
```
0x92FE67bE9C0697ee32768cd2B2BCDC411774A056 has 15 voting tokens and 15 voting power

---

deployed the ballot wtih:
```shell
npx ts-node .\scripts\DeployTokenizedBallot.ts 0x13d2b334d6a6a73427923436cfa0f1ad363a1500 red green blue
```
target block number:  7116725n
transaction address:  0x6d8d08df69abfbf4c6e4ec2debc91486b272ab92a402c94db42ff50a41373082
contract address:  0xeddc2a95cc1b315d302648760736c86f0e5347dd

---

get vote power in ballot by:
```shell
npx ts-node .\scripts\GetBallotVotePower.ts 0xeddc2a95cc1b315d302648760736c86f0e5347dd 0x92FE67bE9C0697ee32768cd2B2BCDC411774A056
```
0x92FE67bE9C0697ee32768cd2B2BCDC411774A056 has 15 voting power

---
get winning proposal:
```shell
npx ts-node .\scripts\GetWinning.ts 0xeddc2a95cc1b315d302648760736c86f0e5347dd
```
green is winning

---
10 votes to red:
```shell
npx ts-node .\scripts\CastVote.ts 0xeddc2a95cc1b315d302648760736c86f0e5347dd 0 10
```
transaction:  0x17e0ebe79f2ede3fe902e1670340fa15975610023a02a87aff1a4d6115ef1a8f

---
get winning proposal:
```shell
npx ts-node .\scripts\GetWinning.ts 0xeddc2a95cc1b315d302648760736c86f0e5347dd
```
red is winning
---

get vote power in ballot by:
```shell
npx ts-node .\scripts\GetBallotVotePower.ts 0xeddc2a95cc1b315d302648760736c86f0e5347dd 0x92FE67bE9C0697ee32768cd2B2BCDC411774A056
```
0x92FE67bE9C0697ee32768cd2B2BCDC411774A056 has 5 voting power

---
