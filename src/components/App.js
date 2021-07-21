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

    blend_colors = (color1, color2, percentage) => {
    // check input
    color1 = color1 || '#000000';
    color2 = color2 || '#ffffff';
    percentage = percentage || 0.5;

    // output to canvas for proof
    var cvs = document.createElement('canvas');
    var ctx = cvs.getContext('2d');
    cvs.width = 90;
    cvs.height = 25;
    document.body.appendChild(cvs);

    // color1 on the left
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, 30, 25);

    // color2 on the right
    ctx.fillStyle = color2;
    ctx.fillRect(60, 0, 30, 25);

    // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
    //      the three character hex is just a representation of the 6 hex where each character is repeated
    //      ie: #060 => #006600 (green)
    if (color1.length == 4)
        color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
    else
        color1 = color1.substring(1);
    if (color2.length == 4)
        color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
    else
        color2 = color2.substring(1);   

    console.log('valid: c1 => ' + color1 + ', c2 => ' + color2);
    console.log(percentage)

    // 3: we have valid input, convert colors to rgb
    color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
    color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];

    console.log('hex -> rgba: c1 => [' + color1.join(', ') + '], c2 => [' + color2.join(', ') + ']');

    // 4: blend
    var color3 = [ 
        (1 - percentage) * color1[0] + percentage * color2[0], 
        (1 - percentage) * color1[1] + percentage * color2[1], 
        (1 - percentage) * color1[2] + percentage * color2[2]
    ];

    console.log('c3 => [' + color3.join(', ') + ']');

    // 5: convert to hex
    color3 =  this.int_to_hex(color3[0]) + this.int_to_hex(color3[1]) + this.int_to_hex(color3[2]);
    console.log(color3);

    // color3 in the middle
    ctx.fillStyle = color3;
    ctx.fillRect(30, 0, 30, 25);

    // return hex
    return color3;
}

    breed = (color1, color2) => {
        console.log(color2, color1)
        var newColor = this.blend_colors(color1, color2, 0.5)
        console.log(newColor.toString(16))
        console.log(newColor.toString(16))
        this.mint("#" + newColor);
    }

    mint = (color) => {
        this.state.contract.methods.mint(color).send({ from: this.state.account }).once('receipt', (receipt) => {
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
                                    <input type='submit' className='btn btn-block btn-primary' value='MINT' />
                                </form>
                            </div>
                            <div className="content mr-auto ml-auto flex-md-nowrap">
                                <h1> Gerar 10 aleatórios </h1>
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    this.inserirAleatorio();
                                }}>
                                    <br/>
                                    <input type='submit' className='btn btn-block btn-primary' value='GERAR' />
                                </form>
                            </div>
                            
                            <div role="main" className="content mr-auto ml-auto">
                                <h1> Breed </h1>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const color1 = this.color1.value
                                    const color2 = this.color2.value
                                    var re = /[0-9A-Fa-f]{6}/g;
                                    if (re.test(color1)) {
                                        if (parseInt(color1, 16) <= parseInt('FFFFFF', 16)) {
                                            var a = true;
                                        } else {
                                            alert("Hexadecimal maior que o aceito");
                                        }
                                    }
                                    if (re.test(color2)) {
                                        if (parseInt(color2, 16) <= parseInt('FFFFFF', 16)) {
                                            var b = true;
                                        } else {
                                            alert("Hexadecimal maior que o aceito");
                                        }
                                    }
                                    if (a == true || b == true) {
                                        this.breed(color1, color2);
                                    }
                                }}>
                                    <input type='text' className='form-control mb-1 flex' placeholder='e.g. #Color1' ref={(input) => { this.color1 = input }} />
                                    <input type='text' className='form-control mb-1 flex' placeholder='e.g. #Color2' ref={(input) => { this.color2 = input }} />
                                    <input type='submit' className='btn btn-block btn-primary' value='BREED' />
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
