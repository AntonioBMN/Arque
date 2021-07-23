// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Color {
    //Nome do token
    string public name = "Color";
    //Simbolo do token
    string public symbol = "COLOR";
    //Cor do token
    string[] public colors;


    event Mint(address indexed _to, uint256 indexed _tokenId, bytes32 _ipfsHash);
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

    mapping(uint256 => address) internal idToOwner;
    mapping(string => bool) _colorExists;
    constructor () {

    }

    function _mint(address _to, bytes32 _ipfsHash) public {
        uint256 _tokenId = colors.length;
        idToOwner[_tokenId] = _to;
        emit Mint(_to, _tokenId, _ipfsHash);
    }

    function _transfer(address _to, uint256 _tokenId) public returns (address){
        require(msg.sender == idToOwner[_tokenId]);
        idToOwner[_tokenId] = _to;
        emit Transfer(msg.sender, _to, _tokenId);
        return _to;
    }

    function totalSupply() public view returns(uint) {
        return colors.length;
    }

    function getBalance() public view returns(uint)  {
        return address(this).balance;
    }


    function buy (string memory _color) external payable {
        require(!_colorExists[_color]);
        colors.push(_color);
        uint _id = colors.length;
        _mint(msg.sender, bytes32(_id));
        _transfer(msg.sender, _id);
        _colorExists[_color] = true;
        
    }
}

