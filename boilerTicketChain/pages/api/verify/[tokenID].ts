import { ethers } from 'ethers';
let providers = require('ethers').providers;
import { NextApiRequest, NextApiResponse } from 'next'
const abi = require("../../abi/BoilerPass.json");


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tokenID } = req.query
  const provider = new providers.AlchemyProvider("goerli", "7a1TKw3J5Vce8jOBYycYbEKWeveDejwr");
  let contract = new ethers.Contract("0x3185dD8Ca6762580D8408412573013B88fD2C7B2",abi.abi,provider);
  try{
    let owner = await contract.ownerOf(tokenID);
    res.status(200).send({
    "owner": owner,
    })
  } catch (err) {
    res.status(404).send("Invalid Token ID")
  }
}