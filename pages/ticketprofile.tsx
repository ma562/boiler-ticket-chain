import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';
// import fetch from 'node-fetch';
import { getDataURL } from '../upload1';

const gameObj = {
  opponent: "",
  date: "",
  time: "",
  location: "",
  state: "",
  stadium: "",
  cost: 0,
};

const TicketProfile = () => {
  let abi_1 = require("./abi/BoilerPass.json");
  // const [links, setLinks] = useState<string[]>([]);
  const [tokenData, setTokenData] = useState<string>();
  // const [loaded, setLoaded] = useState(false);
  const [INDEX, setINDEX] = useState<string>(""); // Declare INDEX as a state variable with an initial value of null
  const [isOwner, setOwner] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [bid, setBid] = useState('')
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const [isListed, setListed] = useState<boolean>();
  // const [myAddress, setAddress] = useState<string>();
  let myAddress: string;

  async function handleLoad() {

    try{
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      myAddress = accounts[0];
      setIsAdmin(("0x5eC954001ab123f52aeba0Bd9356a7bDbf35E0a0" === accounts[0]))
    }
    catch(error){
      window.location.href = "/";
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract("0x3185dD8Ca6762580D8408412573013B88fD2C7B2",abi_1.abi,provider);
    var currentUrl = window.location.href;
    // Create a URL object with the current URL
    var url = new URL(currentUrl);
    // Get the value of the "number" parameter from the URL
    var tokenId = url.searchParams.get("number");
    // Convert the parameter value to a number (if needed)
    //var selectedNumber = parseInt(number, 10); // Use parseInt with base 10 for decimal numbers

    if(localStorage.getItem('tokenData') != null){
      // alert("got tokendata from localstorage");
      const tokenData = localStorage.getItem('tokenData');      //GET TOKEN DATA
      // alert(tokenData);
      localStorage.removeItem('tokenData');
      if(tokenData != null) {
        setTokenData(tokenData);
      }
    }
    else{
      // alert("got tokendata from blockchain");
      setTokenData(await getDataURL(await contract.tokenURI(tokenId)))
    }

    if(localStorage.getItem('event_info') != null){
      // alert("got eventinfo from localstorage");
      Object.assign(gameObj, JSON.parse(localStorage.getItem('event_info') as string));
      localStorage.removeItem('event_info');
      // console.log(gameObj);
    }
    else {
      // alert("got eventinfo from blockchain");
      let eventInfo = await contract.getEventDataByTokenId(tokenId);
      const [opponent, date, time, location, state, stadium, cost] = eventInfo.split("_");
      gameObj.opponent = opponent;
      gameObj.date = date;
      gameObj.time = time;
      gameObj.location = location;
      gameObj.state = state;
      gameObj.stadium = stadium;
      gameObj.cost = cost;
      // console.log(gameObj);
    }
    


    // let eventInfo = await contract.getEventDataByTokenId(tokenId);
    // alert(eventInfo)
    let tokenOwner = await contract.ownerOf(tokenId);
    // alert(tokenOwner)

    if(tokenOwner.toLowerCase() === myAddress.toLowerCase()) {
      setOwner(true);
      let marketplace = (await contract.getMarketplace()).toString().split(",")
      if(marketplace.includes(tokenId)){
        setListed(true)
      }
      // console.log(marketplace)
      // console.log(tokenId)
      // console.log(marketplace.toString().split(","));
      // console.log(typeof tokenId);
      
      // console.log(marketplace.includes(tokenId?.toString()))
    }


    if(tokenId != null){
      setINDEX(tokenId); // Update the state variable with the value of index
    }
    setLoaded(true)
  }

  useEffect(() => {
    handleLoad();
  }, []);

  function goSub() {
    window.location.href = "/subdirectory";
  }

  function goProf() {
    window.location.href = "/userprofile";
  }

  async function goBuy() {
    // alert("buying ticket");
    // alert(typeof bid)      //FOR SIDD - We most likely should check the type of value entered for the bid (make sure it's integer)
    let offer = Number(bid)
    // alert(offer)
    if(offer == 0){
      alert("Please enter a valid number")
      return
    }else if(offer < gameObj.cost){
      alert("Please enter a bid higher than the asking value")
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    let contract = new ethers.Contract("0x3185dD8Ca6762580D8408412573013B88fD2C7B2",abi_1.abi, signer);
    // alert(`index = ${INDEX}`)
    try {
      await contract.buy(INDEX, {value: offer});
      window.location.href = "/userprofile";    //direct to user profile if we buy
    }
    catch (error) {
      alert("Transaction rejected.");
    }
  }

  async function goSell() {
    // alert("selling ticket");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    let contract = new ethers.Contract("0x3185dD8Ca6762580D8408412573013B88fD2C7B2",abi_1.abi, signer);
    try {
      await contract.list(INDEX);
      window.location.href = "/marketplace";    //direct to marketplace if we sell
    }
    catch (error) {
      alert("Transaction rejected.")
    }
  }
  if (loaded)
  return (
    <div>
      <Head>
        <title>Purdue Boilermakers Image List</title>
        <style>
          {`
            body {
              background-image: url('./BoilerTicket.png');
              background-repeat: no-repeat;
              background-size: 100%;
              background-size: cover;
            }
          `}
        </style>
      </Head>

      <nav style={{ background: '#CEB888', height: '70px'}} className="navbar navbar-expand-lg navbar-dark">
        <a className="navbar-brand" href="/marketplace">
          <span style={{ fontFamily: 'Impact, sans-serif', fontSize: '3rem', marginLeft: '20px' }}>Boiler Ticket Chain</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <button className="py-2 px-6 bg-blue-400 text-black rounded-xl" style={{ position: 'relative', left: '850px', top: '-10px', width: '135px' }} onClick={goProf}>
          My Profile
        </button>
        {isAdmin && (<button className="py-2 px-6 bg-blue-400 text-black rounded-xl" style={{ position: 'relative', left: '550px', top: '-10px', width: '135px' }} onClick={goSub}>
          Go Mint
        </button>)}

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Home <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/subdirectory">
                Subdirectory
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/image-list">
                Image List
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container py-5" style={{maxHeight: '500px', marginLeft: '-350px', marginTop: '50px'}}>

      </main>

 
{/*        <div className="container py-6" style={{width: '50%', height: '1000px', marginLeft: '600px', marginTop: '-550px', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '20px', border: 'solid 5px #CEB888', maxHeight: '500px', overflowY: 'auto'}}>
*/}
{/*      <div className="bg-white bg-opacity-80 p-4 rounded-lg max-w-md mx-auto border-yellow-500 border-4">
*/}        
      <div className="bg-white bg-opacity-80 p-4 rounded-lg max-w-4xl mx-auto border-yellow-500 border-4" style={{ minHeight: '500px' }}>

        <div style={{marginTop: '40px', display: 'flex', justifyContent: 'space-between'}}>
          <div style={{flex: '1'}}>
            <img src={tokenData} alt="Ticket Image" style={{width: '375px', height: '375px', borderRadius: '5px'}} />
          </div>

          <div style={{flex: '1', paddingLeft: '20px'}}>
            <h2 style={{fontWeight: 'bold', color: '#B8860B', fontSize: '3.0rem'}}>Ticket Token #{INDEX}</h2>
            <p style={{fontWeight: 'bold', fontSize: '1.5rem', color: '#000'}}>Opponent: {gameObj.opponent}</p>
            <p style={{fontWeight: 'bold', fontSize: '1.5rem', color: '#000'}}>Location: {gameObj.location}, {gameObj.state}</p>
            <p style={{fontWeight: 'bold', fontSize: '1.5rem', color: '#000'}}>Stadium: {gameObj.stadium}</p>
            <p style={{fontWeight: 'bold', fontSize: '1.5rem', color: '#000'}}>Date: {gameObj.date}</p>
            <p style={{fontWeight: 'bold', fontSize: '1.5rem', color: '#000'}}>Time: {gameObj.time}</p>
            <p style={{fontWeight: 'bold', fontSize: '1.5rem', color: '#000'}}>Ticket Cost: {gameObj.cost} Wei</p>
            {isListed ? 
              <button type='button' disabled 
                className="py-2 px-6 bg-green-400 text-black rounded-xl"
                style={{ position: 'relative', left: '0px', top: '50px', width: '135px' }}>
                  Already Listed
                </button> : 
              <button
                className="py-2 px-6 bg-green-400 text-black rounded-xl"
                style={{ position: 'relative', left: '0px', top: '50px', width: '135px' }}
                onClick={isOwner ? goSell : goBuy}>
                  {isOwner ? 'Sell' : 'Buy'}
              </button>}

            {!isOwner && (
              <input 
                type="number" 
                placeholder="Enter your offer" 
                value={bid} 
                onChange={(e) => setBid(e.target.value)} 
                className="px-4 py-2 w-50 border-2 border-blue-400 rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ 
                color: 'black',
                height: '40px',  
                position: 'relative',  
                top: '50px',  
                left: '30px',  // move the input to the left
              }} 
              />
            )}

          </div>
        </div>
        <hr style={{marginTop: '40px', marginBottom: '20px'}} />
      </div>
    </div>

  );
};

export default TicketProfile;
