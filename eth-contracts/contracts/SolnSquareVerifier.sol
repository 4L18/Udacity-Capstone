pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/utils/Address.sol";
import "./verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {

}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier {
    
    SquareVerifier public verifierContract;

    //constructor(address verifierAddress) ERC721Mintable public {
       // verifierContract = SquareVerifier(verifierAddress);
    //}    

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint tokenId;
        address ownerAddr;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping (bytes32 => Solution) private uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint tokenid, address addr);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint tokenid, address addr) public {
        Solution memory sol = Solution({
            tokenId: tokenid,
            ownerAddr: addr
        });
        solutions.push(sol);
        emit SolutionAdded(tokenid, addr);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly

}