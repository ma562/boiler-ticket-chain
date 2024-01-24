// import { useState } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';
import { useState, useEffect } from 'react';

const Home = () => {
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  
  async function connectToMetaMask() {

    if ( (typeof window?.ethereum !== "undefined") ) {
      // Request account access if needed
      await window.ethereum.enable();
      if(!name){
        alert("Please enter a name for this session")
        return
      }
      localStorage.setItem('user_name', name);

      // Create a new provider and connect to MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Get the user's address
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);

      setAddress(address)
      // console.log("Your meta mask address is " + String(address));
      // console.log(balance.toString());


      // localStorage.setItem('myAddress', address);

      window.location.href = "/marketplace";

    }
    else {
      alert("Metamask not working")
    }
  }

  return (

    <div className="flex min-h-screen flex-col items-center justify-center py-2">

      <Head>
        <title>Create Next App</title>
        {/*<link rel="icon" href="/favicon.ico" />*/}
        <style>
          {`
            body {
              background-image: url('./Main6.png');
              background-repeat: no-repeat;
              background-size: cover;
            }
          `}
        </style>
      </Head>
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center mt-2" style={{marginTop: '-500px'}}>
    <h1 className="text-6xl font-bold mb-8">
      <span className="text-white">Welcome to</span>{' '}
      <span className="text-[#CEB888]">
        Boiler Ticket Chain
      </span>
    </h1>

  {/*<div className="flex items-center">
  <input 
    type="text" 
    placeholder="What's your session name?" 
    value={name} 
    onChange={(e) => setName(e.target.value)} 
    className="px-4 py-2 w-64 border-2 border-blue-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2" 
  />

  <button
    className="py-2 px-6 bg-blue-400 text-black rounded-xl"
    onClick={connectToMetaMask}
  >
    Connect with MetaMask
  </button>
</div>*/}
<div className="flex items-center">
  <input 
    type="text" 
    placeholder="What's your session name?" 
    value={name} 
    onChange={(e) => setName(e.target.value)} 
    className="px-4 py-2 w-64 border-2 border-blue-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2 mb-2" 
  />

  <button
    className="py-2 px-6 bg-blue-400 text-black rounded-xl"
    onClick={connectToMetaMask}
  >
    Connect with MetaMask
  </button>
</div>


</main>



      <footer className="flex h-24 w-full items-center justify-center border-t text-white"> {/* Updated className */}
        Powered by Ethereum
      </footer>
    </div>
  );
};

export default Home;


