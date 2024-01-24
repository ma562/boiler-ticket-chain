import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next'


export default function handler(req, res) {
    res.status(200).end("hey")
}