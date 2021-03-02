import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Chain from '../abis/Chain.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


class App extends Component {


async componentWillMount(){
  await this.loadWeb3()
  await this.loadBlockchainData()
}

//get the account
//get the network
//get the smart contract 
//get chain Hash
async loadBlockchainData(){
  const web3 = window.web3
  const accounts = await web3.eth.getAccounts()
  this.setState({account : accounts[0]})
  const networkId  = await web3.eth.net.getId()
  const networkData = Chain.networks[networkId]
  if(networkData){
    const abi = Chain.abi
    const address = networkData.address
    const contract = web3.eth.Contract(Chain.abi,address)
    this.setState({contract})
    const chainHash = await contract.methods.get().call()
    this.setState({chainHash})

  } else {
    window.alert('Smart contract not deployed to detected network')
  }
}


  constructor(props){
    super(props);
    this.state={
      account: '',
      buffer: null,
      contract:null,
      chainHash:"QmVgvrCZMYzMtxZDeqcSC5YQsfkCAxDioZwoDR3xyNoUde"
    };
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)

    } else{
      window.alert('Please use metamask!')
    }
  }


  captureFile = (event)=>{ 
    event.preventDefault()
    //process the file in IPFS
    const file =  event.target.files[0]
    const reader  = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () =>{
      this.setState({buffer: Buffer(reader.result)

      })
    } 
  }
  //Ex(hashofthefile): "QmVgvrCZMYzMtxZDeqcSC5YQsfkCAxDioZwoDR3xyNoUde"
  //Ex(url): https://ipfs.infura.io/ipfs/QmVgvrCZMYzMtxZDeqcSC5YQsfkCAxDioZwoDR3xyNoUde
  onSubmit = (event) =>{
    event.preventDefault()
    console.log(' Submitting the Data... ')
    ipfs.add(this.state.buffer,(error,result)=>{
      console.log('Ipfs result',result)
      const chainHash = result[0].hash
      
      if(error){
        console.error(error)
        return
      }
      this.state.contract.methods.set(chainHash).send({from: this.state.account}).then((r)=>{
        this.setState({chainHash})
      })
    })
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pvt Blockchian
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block"> 
            <small className="text-white">{this.state.account}
            </small>
            </li> 
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.chainHash}`}/>
                </a>
                <p>&nbsp;</p>
                <h2> Health Monetering Data </h2>
                <p>&nbsp;</p>
                <form onSubmit={this.onSubmit}>
                <input type='file' onChange={this.captureFile} /> 
                <input type='submit'/>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
