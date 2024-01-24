// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BoilerPass is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    mapping(uint => string) private tokenIdToEvent;
    uint[] private marketplace;
    //uint256 MAX_SUPPLY = 3;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("BoilerPass", "BP") {}

    function Mint(string calldata eventData, address to, string calldata ipfsHash) public onlyOwner{
        //require(_tokenIdCounter.current() <= MAX_SUPPLY, "I'm sorry we reached the cap");
        // require(num > 0 && num < 500, "Please enter a valid number of tickets")
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, ipfsHash);            
        tokenIdToEvent[tokenId] = eventData;
        marketplace.push(tokenId);
    }

    function getCounter() external view returns(uint){
        return _tokenIdCounter.current();
    }

    function getMarketplace() external view returns(uint [] memory){
        uint[] memory data = marketplace;
        return data;
    }

    function getEventDataByTokenId(uint tokenId) public view returns(string memory){
        require(tokenId < _tokenIdCounter.current(), "invalid id");
        return tokenIdToEvent[tokenId];
    }


    function remove(uint val) private returns(bool){ 
        for (uint i; i < marketplace.length; i++){
            if ( marketplace[i] == val){
                marketplace[i] = marketplace[marketplace.length - 1];
                marketplace.pop();
                return true;
            }
        }
        return false;
    }

    function buy(uint256 tokenId) external payable {
        //address payable recipient = _userAddress; // Get the address and cast it to payable
        require(msg.value >= 1 wei, "Insufficient funds.");
        // require(msg.sender != address(recipient), "User already owns the NFT");
        // address payable buyer = payable(msg.sender);
        address payable owner = payable(ERC721.ownerOf(tokenId));
        require(owner.send(msg.value),"Unable to send"); //Transfer value
        // bool is_inMarketplace = remove(tokenId);
        if (remove(tokenId)){
            _safeTransfer(ERC721.ownerOf(tokenId), msg.sender, tokenId, ""); 
        } else{
            revert("The tokenID you tried to buy is invalid");
        }
        // TODO: make sure that ticket is from marketplace
    }

    function list(uint tokenId) external {
        require(_exists(tokenId), "Token doesn't exists.");
        require(ERC721.ownerOf(tokenId) == msg.sender, "You are not the owner");
        marketplace.push(tokenId);
    }

    function getMarketplaceURI(uint[] memory tokenIds) external view returns(string[] memory){
        string[] memory URIs = new string[](tokenIds.length);
        for(uint i; i < tokenIds.length; ++i){
            URIs[i] = tokenURI(tokenIds[i]);
        }
        return URIs;
    }

    function getEventDataByArray(uint[] memory tokenIds) external view returns(string[] memory){
        string[] memory eventDataArr = new string[](tokenIds.length);
        for(uint i; i < tokenIds.length; ++i){
            eventDataArr[i] = getEventDataByTokenId(tokenIds[i]);
        }
        return eventDataArr;
    }


    function getTokensByOwner(address owner) external view returns(string[] memory){
        //address marketplaceOwner = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
        uint256 availableTokensNum = ERC721.balanceOf(owner);
        string[] memory tokens = new string[](availableTokensNum);
        for (uint i = 0; i < availableTokensNum; i++) {
            tokens[i] = tokenURI(ERC721Enumerable.tokenOfOwnerByIndex(owner, i));
        }
        return tokens;
    }

    function getTokenIdByOwnerIndex(address owner, uint index) external view returns(uint){
        uint tokenID = ERC721Enumerable.tokenOfOwnerByIndex(owner, index);
        return tokenID;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool){
        return super.supportsInterface(interfaceId);
    }
}
