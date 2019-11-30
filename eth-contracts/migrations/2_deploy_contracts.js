// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var ERC721Mintable = artifacts.require("./CustomERC721Token.sol");
 

module.exports = function(deployer) {
  //deployer.deploy(ERC721Mintable);
  deployer.deploy(SquareVerifier);
  deployer.deploy(SolnSquareVerifier);
};
