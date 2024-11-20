you can see my transactions here at explorer:
https://sepolia.etherscan.io/address/0x92FE67bE9C0697ee32768cd2B2BCDC411774A056

deployed the votes token wtih:
```shell
npx ts-node .\scripts\DeployVoteToken.ts 
```
transaction address:  0x0044acd5a0c096ab9287d8af8461126c190295d88618dc646f0f380b569f6d68
contract address:  0x13d2b334d6a6a73427923436cfa0f1ad363a1500

mint tokens wtih:
```shell
npx ts-node .\scripts\MintVoteToken.ts 0x13d2b334d6a6a73427923436cfa0f1ad363a1500 10
```
transaction:  0x1c5d2850db661c4322a05ec16cb1a91133b160fd2cfe59429c4a06119652e5b6


deployed the ballot wtih:
```shell
npx hardhat run .\scripts\DeployTokenizedBallot.ts 
```




