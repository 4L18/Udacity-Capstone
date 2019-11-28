var ERC721Mintable = artifacts.require("./ERC721Mintable.sol");

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
            
            // TODO: mint multiple tokens
            try {
                await this.contract.mint().call(account_one, 1, tokenURI, {from: account_one});
                await this.contract.mint().call(account_two, 2, tokenURI, {from: account_one});
                await this.contract.mint().call(account_one, 3, tokenURI, {from: account_one});
                await this.contract.mint().call(account_two, 4, tokenURI, {from: account_one});
            } catch (e) {
                console.log(e);
            }
        })

        it('should return total supply', async function () { 
            let total = await this.contract.totalSupply().call();
            assert(total == 4, "Total supply does not match the expected amount");
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf().call(account_one, {from: account_one});
            assert(balance == 2, "Balance does not match the expected amount");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let expectedUri = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1";
            let uri = await this.contract.tokenUri().call(1, {from: account_one});
            assert(uri == expectedUri, "URI does not match the expected amount");           
        })

        it('should transfer token from one owner to another', async function () { 
            let previousOwner = await this.contract.ownerOf().call(3);
            assert(previousOwner == account_one, "Previous token owner incorrect");
            await this.contract.transferOwnership().call(account_two, {from: account_one});
            let posteriorOwner = await this.contract.ownerOf().call(3);
            assert(posteriorOwner == account_two, "Posterior token owner incorrect");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let failed = false;

            try {
                await this.contract.mint().call(account_two, 5, {from: account_two});
            } catch (e) {
                failed = true;
            }
    
            assert.equal(failed, true, "Non contract owner can mint tokens");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner().call();
            assert(owner == account_one, "Contract owner's address incorrect");
        })

    });
})