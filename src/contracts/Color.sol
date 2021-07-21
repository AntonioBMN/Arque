// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Ownable {
  address public owner;
  constructor () {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function transferOwnership(address newOwner) public onlyOwner {
    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }

}


contract Color is  ERC721Enumerable, Ownable {
    uint dnaModulus = 10 * 6;
    string[] public colors;
    event Sell(address _buyer);

    mapping(string => bool) _colorExists;

    constructor() ERC721("Color", "COLOR") {
    }

    function mint(string memory  _color) public payable {
        
        require(!_colorExists[_color]);
        colors.push(_color);
        uint _id = colors.length;
        _mint(msg.sender, _id);
        _colorExists[_color] = true;
        emit Seel(msg.sender)
    }
}

