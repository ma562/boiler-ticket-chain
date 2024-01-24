import { useState } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';
import { upload, getEventHash } from '../upload1';
import React, { useRef, useEffect } from "react";

const Subdirectory = () => {
  const [address, setAddress] = useState('');
  const [num, setNum] = useState('');
  const [eventDate, setEventDate] = useState('')
  const [opponent, setOpponent] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [stadium, setStadium] = useState('')
  const [time, setTime] = useState('')
  const [cost, setCost] = useState('')


  let abi_1 = require("./abi/BoilerPass.json");
  // const [count, setCount] = useState(0);

  function inputValidation(){
    // console.log(num, eventDate, city, stadium, state, typeof cost, time, opponent);
    // console.log(typeof num);
    // alert(Number(num))
    // alert(time);
    
    if(Number(num) == 0){
      alert("Number of Mints should be a valid number")
      return
    }
    if(!opponent){
      alert("Opponent name cannot be empty")
      return
    }
    if(!eventDate){
      alert("Event Date cannot be empty")
      return
    }
    if(!stadium){
      alert("Stadium name cannot be empty")
      return
    }
    if(!city){
      alert("City cannot be empty")
      return
    }
    if(!state){
      alert("State name cannot be empty")
      return
    }
    if(!time){
      alert("Time cannot be empty");
      return
    }
    if(Number(cost) == 0){
      alert("Cost should be a valid number")
      return
    }

    return true
    // let eventHash = getEventHash(eventDate, city, stadium, state, cost, time, opponent)
    // alert(eventHash);
  }


  async function handleMetaMask() {
    setNum('');
    if(!inputValidation()){
      return
    }
    // if(eventDate ==)
    // let baseUrl = "localhost:3000/api/verify/"
    let baseUrl = "https://boiler-ticket-chain-imp4n7zkj-siddmitra10.vercel.app/api/verify/"
    // console.log(num + String(""));
    // console.log(city, eventDate, typeof(eventDate), opponent);

    // TODO: Add error handling if button is pressed before entering fields
    if ( (typeof window.ethereum !== "undefined") ) {
      try{
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // console.log(localStorage.getItem('myAddress'));
        // myAddress = accounts[0];
        setAddress(accounts[0]);
        // console.log(accounts[0]);
        // setIsAdmin(("0x5eC954001ab123f52aeba0Bd9356a7bDbf35E0a0" === accounts[0]))
      }
      catch(error){
        window.location.href = "/";
      }


      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // const the_address = localStorage.getItem('myAddress');
      // console.log("Your meta mask address is " + String(address));
      // console.log(balance.toString());

      let contract = new ethers.Contract("0x3185dD8Ca6762580D8408412573013B88fD2C7B2",abi_1.abi,signer); //for array put provider not signer
      let currTokenID = await contract.getCounter();
      // alert(`initially: ${currTokenID}`);
      ///marketplace
      // let uri = contract.tokenURI(0);
      // console.log(uri);
      // console.log(num, eventDate, city, stadium, state, cost, time, opponent)
      // let eventHash = getEventHash(eventDate, opponent, place)
      let eventHash = getEventHash(eventDate, city, stadium, state, cost, time, opponent)
      // alert(eventHash);
      
      for(let i = 0; i < parseInt(num); i++) {
        //run the loop num times
        //await
        try {
          // let ipfsHash = upload(eventHash + `#${i}`, "This is a placeholder right now. Has no functionality");
          let ipfsHash = await upload(`https://boiler-ticket-chain.vercel.app/api/verify/${currTokenID++}`, "This is a placeholder right now. Has no functionality");
          // alert(`after ${i}: ${currTokenID}`);
          contract.Mint(eventHash, "0x5eC954001ab123f52aeba0Bd9356a7bDbf35E0a0", ipfsHash);
          // console.log(ipfsHash);
        }
        catch(error) {
          console.error(error);
        }

        // console.log(i);
      }
    }
    else{
      alert("Please have metamask installed");
    }

  }

  function goSub() {
    window.location.href = "/marketplace";
  }

  function goProf() {
    window.location.href = "/userprofile";
  }


  return (
    <div >

      <Head>
        <title>Purdue Boilermakers Subdirectory</title>
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
      {/* <script src="../dist/main.js"></script> */}
      <nav style={{ background: '#000000', height: '70px'}} className="navbar navbar-expand-lg navbar-dark">
        <a className="navbar-brand" href="/marketplace">
          <span style={{color: '#CEB888', fontFamily: 'Impact, sans-serif', fontSize: '3rem' }}>Boiler Ticket Chain</span>
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
        {/*<button className="py-2 px-6 bg-blue-400 text-black rounded-xl" style = {{position: 'relative', left: '800px', top: '-10px'}} onClick = {goSub}>
            Go to Marketplace
        </button>*/}
        <button className="py-2 px-6 bg-blue-400 text-black rounded-xl" style={{ position: 'relative', left: '850px', top: '-10px', width: '135px' }} onClick={goProf}>
          My Profile
        </button>
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
          </ul>
        </div>
      </nav>
{/*        <main className="container py-5">
          <div style={{color: 'white', position: 'relative', left: '5%', fontFamily: 'Chalkduster, fantasy', fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2em'}} className="mb-4">
            Minting Subdirectory
          </div>
          <div className="container py-5" style={{position: 'relative', left: '15%', width: '80%', height: '80vh', backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '20px', borderRadius: '10px', maxHeight: '550px', border: '10px solid #FFFFCC', overflowY: 'auto'}}>

            <input type="number" placeholder="Enter # of mints" value={num} onChange={(e) => setNum(e.target.value)} className="mr-4" style={{ color: 'black' }} />
            <input type="text" placeholder="Enter opponent" value={opponent} onChange={(e) => setOpponent(e.target.value)} className="mr-4" style={{ color: 'black' }} />
            <input type="date" placeholder="Date of Event" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="mr-4" style={{ color: 'black' }} />
            <input type="text" placeholder="Stadium" value={stadium} onChange={(e) => setStadium(e.target.value)} className="mr-4" style={{ color: 'black' }} />
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="mr-4" style={{ color: 'black' }} />
            <input type='text' placeholder='State' value={state} onChange={(e) => setState(e.target.value)} className="mr-4" style={{ color: 'black' }} />
            <input type='time' placeholder='Time' value={time} onChange={(e) => setTime(e.target.value)} className="mr-4" style={{ color: 'black' }} />
            <input type='number' placeholder='Ticket Cost' value={cost} onChange={(e) => setCost(e.target.value)} className="mr-4" style={{ color: 'black' }} />
            <button type='submit' className="py-2 px-6 bg-blue-400 text-black rounded-xl" onClick={handleMetaMask}>Start Mint</button>

          </div>
        </main>*/}
        <main className="container py-5">
  <div style={{left: '5%', position: 'relative', fontFamily: 'Chalkduster, fantasy', fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2em' }} className="mb-4 text-white">
    Minting Subdirectory
  </div>

    <div className="container py-5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '10px', border: '10px solid #FFFFCC', maxHeight: '500px', overflowY: 'auto', padding: '20px', position: 'relative', width: '80%', left: '15%', marginTop: '100px' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label className="block text-gray-700 font-bold mb-2">Number of Mints:</label>
        <input type="number" placeholder="Enter # of mints" value={num} onChange={(e) => setNum(e.target.value)} className="px-4 py-2 w-full border-2 border-blue-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">Opponent:</label>
        <input type="text" placeholder="Enter opponent" value={opponent} onChange={(e) => setOpponent(e.target.value)} className="px-4 py-2 w-full border-2 border-blue-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">Date of Event:</label>
        <input type="date" placeholder="Date of Event" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="px-4 py-2 w-full border-2 border-blue-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">Stadium:</label>
        <input type="text" placeholder="Stadium" value={stadium} onChange={(e) => setStadium(e.target.value)} className="px-4 py-2 w-full border-2 border-blue-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">City:</label>
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2 w-full border-2 border-blue-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">State:</label>
        <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="px-4 py-2 w-full border-2 border-blue-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">Time:</label>
        <input type='time' placeholder='Time' value={time} onChange={(e) => setTime(e.target.value)} className="px-4 py-2 w-full border-2 border-blue-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" style={{ color: 'black' }} />
      </div>
      <div>
        <label className="block text-gray-700 font-bold mb-2">Ticket Cost:</label>
        <input type="number" placeholder="Cost" value={cost} onChange={(e) => setCost(e.target.value)} className="px-4 py-2 w-full border-2 border-blue-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
{/*      <button type='submit' className="py-0 px-4 bg-blue-400 text-black rounded-xl" onClick={handleMetaMask} style={{fontSize: '1rem'}}>Start Mint</button>
*/}       
        <button className="py-1 px-6 bg-blue-400 text-black rounded-xl" onClick={handleMetaMask}>
          Mint
        </button>
    </div>
    </div>
    </main>
  </div>
  );
};

export default Subdirectory;
