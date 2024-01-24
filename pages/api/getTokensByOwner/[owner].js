import { ethers } from 'ethers';
let providers = require('ethers').providers;
import { NextApiRequest, NextApiResponse } from 'next'
const abi = require("../../abi/BoilerPass.json");


export default async function handler(req, res) {
  const { owner } = req.query
  
  const provider = new providers.AlchemyProvider("goerli", "7a1TKw3J5Vce8jOBYycYbEKWeveDejwr");
  // const signer = provider.getSigner();

  let contract = new ethers.Contract("0x7a533bE7c05ac0Eb236B33C3b50589C9Df04022b",abi.abi,provider);
  let tokens = await contract.getTokensByOwner(owner);  //admin address
  // console.log("hahahah");
  res.status(200).send({
    "owner": owner,
    "provider": await provider.getNetwork(),
    "tokens": tokens,
    "contract": contract,
  })
}