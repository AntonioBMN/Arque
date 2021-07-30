// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract Obra is  ERC721, Ownable {
    //struct referente aos dados das obras
    struct dadosDaObra {
    string nomeDaObra;
    string tipoDeObra;
    string descricao;
}
    //Array que armazena os dadosDasObras
    dadosDaObra[] public dadosDasObras;
    //mapping que armazena os dados de determinada obra
    mapping (uint => dadosDaObra) idToDados;
    //mapping que armazena as obras que determinado endereço possui
    mapping (address => uint) addressToId;
    //mapping para verificar se uma determinada Obra já foi mintada
    mapping (uint => bool) nftExists;
    //mapping que armazena o valor da obra
    mapping (uint => uint) idToPrice;
    //mapping que recebe o preço e retorna o address
    mapping (uint => address) bidPriceToAddress;
    event DadosDaObra (
    string _nomeDaObra,
    string _tipoDaObra,
    string _descricao
);

    constructor () ERC721("Obra", "OBRA") {} 
    //função que retorna uma Obra passando o ID dela;
    function getDadosDaObra(uint _id) public view returns (dadosDaObra memory) {
        return dadosDasObras[_id];
    }

    //Função que cria a struct dadosDaObra e insere ela no array de structs "dadosDasObras";
    function createDadosDaObra (
        string memory _nomeDaObra,
        string memory _tipoDaObra,
        string memory _descricao) public {
            dadosDasObras.push(dadosDaObra(_nomeDaObra,_tipoDaObra,_descricao));

        emit DadosDaObra(_nomeDaObra,_tipoDaObra,_descricao);
    }

    function mint (dadosDaObra memory _dados, uint _id) public {
        //Requerir que a mesma NFT não seja mintada mais de uma vez
        require(!nftExists[_id]);
        //Adiciona no mapping Id To Dados para que tenhamos acesso a quem mintou determinada NFT
        idToDados[_id] = _dados;
        //Minta com a função de mint da biblioteca ERC721
        _safeMint(msg.sender, _id);
        //Adiciona a NFT no mapping de existencia de NFTs
        nftExists[_id] = true;
    }

    function sellNFT(address _address, uint _id) public {
        approve(_address, _id);
    }
    
    function announce(uint  _id, uint _price) public {
        require(msg.sender == ownerOf(_id));
        idToPrice[_id] = _price;
        bidPriceToAddress[_id] = msg.sender;
    }

    function placeBid (uint _id, uint _value) public payable {
        require(_value > idToPrice[_id]);
        require(_value == msg.value);
        idToPrice[_id] = _value;
        bidPriceToAddress[_id] = msg.sender;
    }

    function closeAuction(uint _id) public payable{
        require(msg.sender == ownerOf(_id));
        address _to = bidPriceToAddress[_id];
        transferObra(msg.sender, _to, _id);
        payable(msg.sender).call{value: idToPrice[_id]}("");
    }


    function transferObra(address _from,address _to,uint _id ) public {
        safeTransferFrom(_from,_to , _id);
    }

    function buyObra(uint _id, uint _value)  public payable {
    address _to = msg.sender;
    address  _from = ownerOf(_id);
    require(msg.value  == _value);
    _to.call{value: _value}("");
    transferObra(_from, _to, _id);    
    }

}