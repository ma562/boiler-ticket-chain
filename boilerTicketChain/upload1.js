const { randomUUID } = require('crypto');
const { NFTStorage } = require('nft.storage')
const QRCode = require('qrcode')
const fetch = require('node-fetch')
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweENlNTBlYzMyMzdkZjlmZjVDOGQ1Mzk4QkI1OEM2YmMxMDE3NzE4NzIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NzcxODIwNTA1OSwibmFtZSI6InRlc3RpbmcifQ.79LXpGPLKNp3tyYc-ZEE6ouUNAx5VB2eOnk1PhHoy74'

export async function getDataURL(link){
    let resp = await fetch(link);
    resp = await resp.text()
    return resp
}

export function getEventHash(eventDate, city, stadium, state, cost, time, opponent){
    // return crypto.randomUUID() + '__' + eventDate + '_' + opponent + '_' + place
    return opponent + '_' + eventDate + '_' + time + '_' + city + '_' + state + '_' + stadium + '_' + cost
}

async function storeNFT(data) {
    console.log("Entered storeNFT");
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })
    let ipfsHash = await nftstorage.storeBlob(new Blob([data]))
    ipfsHash = 'https://nftstorage.link/ipfs/' + ipfsHash
    console.log(ipfsHash);
    return ipfsHash
    // const metadata = await nftstorage.store({name: `${name}`, description:`${description}`, image: new File(
    //     [ await fs.promises.readFile(imagePath) ],
    //     'BoilerPass.png',
    //     { type: 'image/png' })
    // })
    // let resp = await axios.get(metadata.url.replace('ipfs://', 'https://nftstorage.link/ipfs/'))
    
    // console.log(metadata.url.replace('ipfs://', 'https://nftstorage.link/ipfs/'));
    // let resp = await fetch(metadata.url.replace('ipfs://', 'https://nftstorage.link/ipfs/'))
    
    // console.log(await resp.json());
    // resp = await resp.json()
    // console.log(resp)
    // let ipfsURI = resp.image
    // console.log(ipfsURI)
    // let ipfsLink = ipfsURI.replace('ipfs://', 'https://nftstorage.link/ipfs/')
    // console.log(ipfsLink);
    // return ipfsLink
}

// async function fileFromPath(filePath) {
//     const content = await fs.promises.readFile(filePath)
//     const type = mime.getType(filePath)
//     return new File([content], path.basename(filePath), { type })
// }


// QRCode.toFile('./data/1.png', 'BoilerPass', function(err){
//     if (err) throw err;
//     console.log("done")
// })

var opts = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    quality: 0.3,
    margin: 1,
    color: {
      dark:"#010599FF",
      light:"#FFBF60FF"
    }
}

async function getQRCode(name){
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(name, opts, function(err, url){
            if(err){
                reject('QR Code gen failed')
            }
            else{
                // console.log(url);
                resolve(url)
            }
        })
    })
}

export async function upload(hash, description){
    // var path = `./data/${num}.png`
    // console.log(QRCode);
    let qrcodeurl = await getQRCode(hash)
    // console.log(qrcodeurl);
    console.log("hahahahaahah");
    // console.log(path);
    let ipfsHash = await storeNFT(qrcodeurl)
    return ipfsHash
    // return ipfsLink
}

async function hello() {
    console.log("hello");
}


// upload(12, "Full test", "This is your ticket")

// TODO: Directly use qrcode bytes and put to ipfs instead of saving image

// getDataURL('https://nftstorage.link/ipfs/bafkreigxaiwiqruowfiart4ners2gqljp5t2yfedvotob2knhpc72vnary')