var ERC721Mintable = artifacts.require("./CustomERC721Token.sol");

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new('RealEstateToken', 'RET', {from: account_one});
            
            // TODO: mint multiple tokens
            try {
                await this.contract.mint(account_one, 1, {from: account_one});
                await this.contract.mint(account_two, 2, {from: account_one});
                await this.contract.mint(account_two, 3, {from: account_one});
                await this.contract.mint(account_two, 4, {from: account_one});
            } catch (e) {
                console.log(e.message);
            }
        })

        it('should return total supply', async function () { 
            let total = await this.contract.totalSupply();
            assert(total == 4, "Total supply does not match the expected amount");
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf(account_two, {from: account_one});
            assert(balance == 3, "Balance does not match the expected amount");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let expectedUri = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1";
            let uri = await this.contract.getTokenURI(1, {from: account_one});
            assert(uri == expectedUri, "URI does not match the expected amount");           
        })

        it('should transfer token from one owner to another', async function () { 
            let previousOwner = await this.contract.ownerOf(1);
            assert(previousOwner == account_one, "Previous token owner incorrect");
            await this.contract.safeTransferFrom(account_one, account_two, 1, {from: account_one});
            let posteriorOwner = await this.contract.ownerOf(1);
            assert(posteriorOwner == account_two, "Posterior token owner incorrect");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new('RealEstateToken', 'RET', {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
            try {
                await this.contract.mint(account_two, 5, {from: account_two});
            } catch (error) {
                assert(error, "Address should not be authorized to call");
            }
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner();
            assert(owner == account_one, "Contract owner's address incorrect");
        })

    });
})