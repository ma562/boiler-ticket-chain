import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';
// import fetch from 'node-fetch';
import { getDataURL } from '../upload1';

let gameInfo: { opponent: string, date: string, time: string, location: string, state: string, stadium: string, cost: string }[] = [];

const UserProfile = () => {
  let abi_1 = require("./abi/BoilerPass.json");
  const [tokenIds, setToken] = useState<number[]>([])
  const [links, setLinks] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const [name, setName] = useState<string>();
  const [userAddress, setAddress] = useState<string>();
  let myAddress: string;
  
  function parseGameInfo(gameString: string) {
    const [opponent, date, time, location, state, stadium, cost] = gameString.split("_");
    const gameObj = {
      opponent: opponent,
      date: date,
      time: time,
      location: location,
      state: state,
      stadium: stadium,
      cost: cost
    };

    gameInfo.push(gameObj);
  }

  async function handleLoad() {

    try{
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      myAddress = accounts[0];
      setAddress(accounts[0]);
      // console.log(typeof accounts)
      // console.log(accounts[0])
      
      // console.log(accounts[0]);
      // alert(accounts[0])
      // meAddress = accounts[0];
      // alert(myAddress);
      setIsAdmin(("0x5eC954001ab123f52aeba0Bd9356a7bDbf35E0a0".toLowerCase() === accounts[0].toLowerCase()))
    }
    catch(error){
      window.location.href = "/";
    }
    // alert(myAddress);
    var name =  localStorage.getItem("user_name")
    if(name != null) {
      setName(name);
    }
    else {
      setName("John Purdue");
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // alert(localStorage.getItem('myAddress'))
    // console.log(signer);
    
    let contract = new ethers.Contract("0x3185dD8Ca6762580D8408412573013B88fD2C7B2",abi_1.abi,provider);
    console.log(contract);

    setLoaded(false);
    // let TOKEN = '0x5eC954001ab123f52aeba0Bd9356a7bDbf35E0a0'
    // localStorage.setItem('myTOKEN', TOKEN);
    // let links_1 = await contract.getTokensByOwner(localStorage.getItem('myAddress'));  //admin address
    let links_1 = await contract.getTokensByOwner(myAddress);  //admin address
    let tokenIds = []
    for (let i = 0; i < links_1.length; i++){
      let temp = await contract.getTokenIdByOwnerIndex(myAddress, i)
      tokenIds.push(temp)
    }
    
    // console.log(tokenIds);
    // console.log(links_1);

    let eventInfoArr = await contract.getEventDataByArray(tokenIds);
    // console.log(eventInfoArr);

    for(let i = 0; i < eventInfoArr.length; i++) {
      if(i == 0 && gameInfo.length != 0) {
        //it's already loaded in.
        setLoaded(true);
        break;
      }
      parseGameInfo(eventInfoArr[i]);

    }

    // console.log(gameInfo);
    
    let links = []
    let temp;
    for (let j = 0; j < links_1.length; j++) {
      temp = await getDataURL(links_1[j])
      // console.log(temp);
      links.push(temp)      
    }  
    await console.log(links)  
    setToken(tokenIds)  
    setLinks(links);
    setLoaded(true);
  }

  useEffect(() => {
    handleLoad();
  }, []);

  function goSub() {
    window.location.href = "/subdirectory";
  }

  // function goProf() {
  //   window.location.href = "/userprofile";
  // }

  const redirectToLink = async (index: number) => {
    localStorage.setItem("event_info", JSON.stringify(gameInfo[index]));
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // myAddress = accounts[0];
    // const provider = new ethers.providers.Web3Provider(window.ethereum);    
    // let contract = new ethers.Contract("0x7a533bE7c05ac0Eb236B33C3b50589C9Df04022b",abi_1.abi,provider);
    // var selectedNumber = await contract.getTokenIdByOwnerIndex(myAddress, index)
    var selectedNumber = tokenIds[index];
    var data = links[index];
    localStorage.setItem('tokenData', data);

    // selectedNumber = selectedNumber.toString();
    var url = "/ticketprofile"; // Replace with the actual URL you want to navigate to
    // Create a new URL object with the base URL
    var newUrl = new URL(url, window.location.origin);

    // Add the selected number as a URL parameter
    newUrl.searchParams.set("number", selectedNumber.toString());

    // Redirect to the new URL
    window.location.href = newUrl.href;
  };

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

        {isAdmin && (<button className="py-2 px-6 bg-blue-400 text-black rounded-xl" style={{ position: 'relative', left: '850px', top: '-10px', width: '135px' }} onClick={goSub}>
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
    <main className="container py-5">
        <div style={{color: 'white', position: 'relative', left: '5%', fontFamily: 'Chalkduster, fantasy', fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2em'}} className="mb-4">
            {name}'s Wallet
        </div>
        <div style={{width: '800px', backgroundColor: 'rgba(255, 255, 255, 0.85)', color: 'black', position: 'relative', left: '25%', fontFamily: 'Arial', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2em', borderRadius: '20px'}} className="mb-4">
          User Address: {userAddress}
          </div>
        <div className="container py-6" style={{position: 'relative', left: '15%', width: '80%', height: '80vh', backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '20px', borderRadius: '10px', maxHeight: '550px', border: '10px solid #FFFFCC', overflowY: 'auto'}}>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
              {loaded && gameInfo.length > 0 && links.map((link, index) => (
              <div key={index} className="image-box mt-4" style={{ flexBasis: '25%', marginRight: '1rem', marginBottom: '1rem' }}>
                <div className="image-container" onClick={() => redirectToLink(index)}>
                  <img src={link.toString()} alt={`Image ${index}`} style={{ width: '100%', height: 'auto', cursor: 'pointer' }} />
                </div>
                <div className="info-container">
                  <div className="info-row">
                    <div className="info-label">Opponent:</div>
                    <div className="info-value">{gameInfo[index].opponent}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">Date:</div>
                    <div className="info-value">{gameInfo[index].date}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">Time:</div>
                    <div className="info-value">{gameInfo[index].time}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">Location:</div>
                    <div className="info-value">{gameInfo[index].location}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">State:</div>
                    <div className="info-value">{gameInfo[index].state}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">Stadium:</div>
                    <div className="info-value">{gameInfo[index].stadium}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">Cost:</div>
                    <div className="info-value">$ {gameInfo[index].cost}</div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
      </main>
      <style jsx>{`
      .image-box {
        border: 5px solid grey;
        padding: 1rem;
        display: flex;
        border-radius: 10px;
        flex-direction: column;
      }

      .image-container {
        position: relative;
      }

      .index-container {
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-size: 1.2rem;
        padding: 0.2rem 0.5rem;
        border-radius: 0.2rem;
      }

      .info-container {
        margin-top: 1rem;
      }

      .info-row {
        display: flex;
        margin-bottom: 0.5rem;
      }

      .info-label {
        font-weight: bold;
        width: 6rem;
        margin-right: 1rem;
      }

      .info-value {
        flex: 1;

      `}</style>
     
    </div>

  );
};

export default UserProfile;
