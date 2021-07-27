// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Obra is  ERC721 {
    struct dadosDaObra {
    string nomeDoAutor;
    uint64 cpfDoAutor;
    string nomeArtisticoDoAutor;
    string[]  coAutores;
    uint64[] cpfDoCoautor;
    string nomeDoTitular;
    uint64 cpfDoTitular;
    string nomeDaObra;
    string tipoDeObra;
    string descricao;
}
    dadosDaObra[] public dadosDasObras;

    mapping (uint => dadosDaObra) idToDados;
    mapping (address => uint) addressToId;

    event DadosDaObra (
    string _nomeDoAutor,
    uint64 _cpfDoAutor,
    string _nomeArtisticoDoAutor,
    string[] _coAutores,
    uint64[] _cpfDoCoautor,
    string _nomeDoTitular,
    uint64  _cpfDoTitular,
    string _nomeDaObra,
    string _tipoDaObra,
    string _descricao
);

    constructor () ERC721("Obra", "OBRA") {} 

    function getDadosDaObra(uint _id) public view returns (dadosDaObra memory) {
        return dadosDasObras[_id];
    }

    function createDadosDaObra (
        string memory _nomeDoAutor,
        uint64 _cpfDoAutor,
        string memory _nomeArtisticoDoAutor,
        string[] memory _coAutores,
        uint64[] memory _cpfDoCoautor,
        string memory _nomeDoTitular,
        uint64  _cpfDoTitular,
        string memory _nomeDaObra,
        string memory _tipoDaObra,
        string memory _descricao
        
    ) public {
        dadosDasObras.push(dadosDaObra(_nomeDoAutor,_cpfDoAutor,_nomeArtisticoDoAutor, _coAutores, _cpfDoCoautor,_nomeDoTitular,_cpfDoTitular,_nomeDaObra,_tipoDaObra,_descricao));
        emit DadosDaObra(_nomeDoAutor,_cpfDoAutor,_nomeArtisticoDoAutor, _coAutores, _cpfDoCoautor,_nomeDoTitular,_cpfDoTitular,_nomeDaObra,_tipoDaObra,_descricao);
    }

    function mint (dadosDaObra memory _dados, uint _id) public {
        //Requerir que a mesma NFT não seja mintada mais de uma vez
        require(addressToId[msg.sender] != _id);
        //Adiciona no mapping Id To Dados para que tenhamos acesso a quem mintou determinada NFT
        idToDados[_id] = _dados;
        _mint(msg.sender, _id);
    }


}