// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { MyToken } from "./My20.sol";
import { MyNFT } from "./My721.sol";

contract TokenSale is Ownable {
    uint256 public ratio;
    uint256 public price;
    MyToken public token;
    MyNFT public nft;

    constructor(uint256 _ratio, uint256 _price, MyToken _token, MyNFT _nft) Ownable(msg.sender) {
        ratio = _ratio;
        price = _price;
        token = _token;
        nft = _nft;
    }

    function buyTokens() public payable {
        token.mint(msg.sender, msg.value * ratio);
    }

    function returnTokens(uint256 _amount) public {
        token.burnFrom(msg.sender, _amount);
        payable(msg.sender).transfer(_amount/ratio);
    }

    function buyNFT(uint256 _tokenId) public {
        token.transferFrom(msg.sender, address(this), price);
        nft.safeMint(msg.sender, _tokenId);
    }

    function returnNFT(uint256 _tokenId) public {
        nft.burn(_tokenId);
        token.transfer(msg.sender, price/2);
    }
}
