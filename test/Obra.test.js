const { assert, expect } = require('chai');

const Obra = artifacts.require('./Obra.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Obra',(accounts) => {
    let contract;
    before(async()=>{
        contract = await Obra.deployed();
    })

    describe('deployment',async() => {
        it('deploys successfully', async() => {
            
            const address = contract.address;
            assert.notEqual(address, '0x0', 'Não é vazio')
            assert.notEqual(address, '', 'Não é vazio!')
            assert.notEqual(address, 'null', 'Não é vazio!')
            assert.notEqual(address, 'undefined', 'Não é vazio!')
            
           
        })
        it('tem um nome', async() =>{
            const name = await contract.name()
            assert.equal(name,'Obra')
        })

        it('Tem um simbolo', async() =>{
            const symbol = await contract.symbol()
            assert.equal(symbol, 'OBRA')
        })
    })

    describe('Criar dadosDaObra', async() => {
        it('Chama a função criarDadosDaObra', async() => {
            var test = [];
            const result = await contract.createDadosDaObra( "Antonio Bezerra de Morais Neto", "08468689386",  "",  test, test, "Antonio Bezerra de Morais Neto", "08468689386", "Obra NFT", "Programa de Computador", "Programa de Computador que armazena uma Obra no formato de NFT");
            const event = result.logs[0].args;
            assert.equal(event._nomeDoAutor, 'Antonio Bezerra de Morais Neto', 'Nome do Autor correto' );
            assert.equal(event._cpfDoAutor.toNumber(), '08468689386', 'Nome do Autor correto' );
            assert.equal(event._nomeArtisticoDoAutor, '', 'Nome artistico do Autor correto' );
            assert.equal(event._coAutores, '', 'Nome do CoAutor correto');
            assert.equal(event._cpfDoCoautor, '', 'CPF do CoAutor correto');
            assert.equal(event._nomeDoTitular, 'Antonio Bezerra de Morais Neto', 'Nome do titular correto');
            assert.equal(event._cpfDoTitular.toNumber(), '08468689386', 'CPF do titular correto');
            assert.equal(event._nomeDaObra, 'Obra NFT', 'Nome da Obra correto');
            assert.equal(event._tipoDaObra, 'Programa de Computador', 'Tipo da Obra correto');
            assert.equal(event._descricao, 'Programa de Computador que armazena uma Obra no formato de NFT', 'Descrição da Obra correto');
        })
    })
    describe('Minta uma Obra', async()=> {
        it('Minta uma Obra', async()=>{
            var test = [];
            await contract.createDadosDaObra( "Antonio Bezerra de Morais Neto", "08468689386",  "",  test, test, "Antonio Bezerra de Morais Neto", "08468689386", "Obra NFT", "Programa de Computador", "Programa de Computador que armazena uma Obra no formato de NFT");
            const a = await contract.getDadosDaObra(0);
            const result = await contract.mint(a,'123231',{from: accounts[0]});
            const event = result.logs[0].args;
            assert.equal(event.tokenId.toNumber(),'123231')
            assert.equal(event.from,'0x0000000000000000000000000000000000000000')
            assert.equal(event.to,accounts[0])

            


        })
    })
})