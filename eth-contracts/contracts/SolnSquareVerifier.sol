pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/utils/Address.sol";
import "./verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {

}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {
    
    SquareVerifier public verifier;

    constructor(address verifierAddress) CustomERC721Token() public {
        verifier = SquareVerifier(verifierAddress);
    }    

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint tokenId;
        address ownerAddr;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping (bytes32 => Solution) private uniqueSolutions;

    function getVerifierKey(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) pure public returns(bytes32) {
        return keccak256(abi.encodePacked(a, b, c, input));
    }

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint tokenid, address addr);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint tokenid, address addr, bytes32 key) public {

        Solution memory sol = Solution({
            tokenId: tokenid,
            ownerAddr: addr
        });

        solutions.push(sol);
        uniqueSolutions[key] = sol;
        emit SolutionAdded(sol.tokenId, sol.ownerAddr);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    function mintToken(address addr, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public {
        
        bytes32 key = getVerifierKey(a, b, c, input);

        //  - make sure the solution is unique (has not been used before)        
        require(uniqueSolutions[key].ownerAddr == address(0), "Solution must be unique to mint a token");
        require(verifier.verifyTx(a,b,c,input), "Solution is not correct");
        
        addSolution(tokenId, addr, key);
        //  - make sure you handle metadata as well as tokenSupply
        super.mint(addr, tokenId);
    }
}