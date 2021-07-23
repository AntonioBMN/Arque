import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Color from '../abis/Color.json'

class App extends Component {

    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Non-Ethereum Browser detected. You should consider trying Metamask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] })

        const networkId = await web3.eth.net.getId();
        const networkData = Color.networks[networkId]
        if (networkData) {
            const abi = Color.abi
            const address = networkData.address
            const contract = new web3.eth.Contract(abi, address)
            this.setState({ contract })
            const totalSupply = await contract.methods.totalSupply().call()
            this.setState({ totalSupply })

            for (var i = 0; i < totalSupply; i++) {
                const color = await contract.methods.colors(i).call()
                this.setState({
                    colors: [...this.state.colors, color]
                })
            }
            console.log(this.state.colors)
        } else {
            window.alert('Smart contract not deployed to detected network')
        }

    }
     int_to_hex = (num) => {
    var hex = Math.round(num).toString(16);
    if (hex.length == 1)
        hex = '0' + hex;
    return hex;
}

    inserirAleatorio = () => {
        for(var i = 0; i < 12; i+=1) {
            var g = Math.random()*16777215;
            this.mint('#'+parseInt(g).toString(16));
        }
    }

    mint = (color) => {
        this.state.contract.methods.buy(color).send({ from: this.state.account }).once('receipt', (receipt) => {
            this.setState({
                colors: [...this.state.colors, color]
            })
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            contract: null,
            totalSupply: 0,
            colors: []
        }
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                        className="navbar-brand col-sm-3 col-md-2 mr-0"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Color Tokens
                    </a>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                            <small className="text-white"><span id="account">{this.state.account}</span></small>
                        </li>
                    </ul>
                </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <h1> Mint </h1>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const color = this.color.value
                                    var re = /[0-9A-Fa-f]{6}/g;
                                    if (re.test(color)) {
                                        if (parseInt(color, 16) <= parseInt('FFFFFF', 16)) {
                                            this.mint("#" + color);
                                        } else {
                                            alert("Hexadecimal maior que o aceito");
                                        }
                                    } else {
                                        alert("Imput não é Hexadecimal");
                                    }
                                }}>

                                    <input type='text' className='form-control mb-1' placeholder='e.g. #FFFFFF' ref={(input) => { this.color = input }} />
                                    <input type='submit' className='btn btn-block btn-primary' value='COST 1 ETH TO MINT' />
                                </form>
                            </div>
                            </main>
                    </div>
                    <hr />
                    <div className="row text-center">
                        {this.state.colors.map((color, key) => {
                            return (
                                <div key={key} className="col-md-3 mb-3">
                                    <div className="token" style={{ backgroundColor: color }}></div>
                                    <div>{color}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
