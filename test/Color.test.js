const { assert, expect } = require('chai');

const Color = artifacts.require('./Color.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Color',(accounts) => {
    let contract;
    before(async()=>{
        contract = await Color.deployed(),{from: accounts[0]};
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
            assert.equal(name,'Color')
        })

        it('tem um simbolo', async() =>{
            const symbol = await contract.symbol()
            assert.equal(symbol, 'COLOR')
        })
    })

    describe('mint 1 token',async() => {
        it('creates a new token', async() => {
            const result = await contract.buy('#EC058E',{from: accounts[1]});
            const totalSupply = await contract.totalSupply();
            //Mint log
            //Sucesso
            assert.equal(totalSupply, 1, "Total Supply Correto");
            const event = result.logs[0].args;
            assert.equal(event._tokenId.toNumber(), 1, "Id correto");
            assert.notEqual(event._to, accounts[0], "To tá correto")
            //Fracasso: Mesma cor duas vezes;
            await contract.buy('#EC058E').should.be.rejected;
            
            //Transfer log
            const eventt = result.logs[1].args;
            assert.equal(eventt._from, accounts[0], "Conta from tá certa")
            assert.notEqual(eventt._to, accounts[0], "Conta to ta certa")
            assert.equal(eventt._tokenId.toNumber(),1,"tokenId Correto")
        })
        
    })
})