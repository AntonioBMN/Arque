// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "src\contracts\Erc721.sol";

contract Obra is  Erc721 {
    //struct referente aos dados das obras
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
    //mapping que armazena os dados de determinada obra
    mapping (uint => dadosDaObra) idToDados;
    //mapping que armazena as obras que determinado endereço possui
    mapping (address => uint) addressToId;
    //mapping para verificar se uma determinada Obra já foi mintada
    mapping (uint => bool) nftExists;

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
    //função que retorna uma Obra passando o ID dela;
    function getDadosDaObra(uint _id) public view returns (dadosDaObra memory) {
        return dadosDasObras[_id];
    }
    //Função que cria a struct dadosDaObra e insere ela no array de structs "dadosDasObras";
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
        require(!nftExists[_id]);
        //Adiciona no mapping Id To Dados para que tenhamos acesso a quem mintou determinada NFT
        idToDados[_id] = _dados;
        //Minta com a função de mint da biblioteca ERC721
        _mint(msg.sender, _id);
        //Adiciona a NFT no mapping de existencia de NFTs
        nftExists[_id] = true;
    }


}