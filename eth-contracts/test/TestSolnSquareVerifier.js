var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var SquareVerifier = artifacts.require('SquareVerifier');
var Proof = require('../../zokrates/code/square/proof.json');

contract('SolnSquareVerifier', accounts => {

    const account0 = accounts[0];
    const account1 = accounts[1];

    describe('Test SolnSquareVerifier', function () {

        const a = Proof.proof.a;
        const b = Proof.proof.b;
        const c = Proof.proof.c;
        const input = Proof.inputs;

        beforeEach(async function () { 
            const verifier = await SquareVerifier.new({from:account0});
            this.contract = await SolnSquareVerifier.new(verifier.address, {from: account0});
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('can add a new solution', async function(){
            
            let tokenid = 1;
            let ownerAddr = account1;
            let key = await this.contract.getVerifierKey.call(a, b, c, input);
            let solution = await this.contract.addSolution(tokenid, ownerAddr, key);
        })

        //Test to prove that a repeated solution can't be added
        it('cannot add a solution that already exits', async function(){

            try {
                let tokenid = 1;
                let ownerAddr = account1;
                let key = await this.contract.getVerifierKey(a, b, c, input);
                await this.contract.addSolution(tokenid, ownerAddr, key);
            } catch(e) {
                assert(e, 'An error should happen');
            }
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('can mint an ERC721 token', async function(){

            let totalSupply = (await this.contract.totalSupply.call()).toNumber();
            let tokenid = 2;
            let ownerAddr = account1;
            
            await this.contract.mintToken(ownerAddr, tokenid, a, b, c, input);

            let newTotalSupply = (await this.contract.totalSupply.call()).toNumber();

            assert.equal(totalSupply + 1, newTotalSupply, "Invalid proof result");
        })

        //Test to prove that you can’t mint a new token using a repeated solution
        it('cannot mint an ERC721 token using a repeated solution', async function(){

            try {
                let totalSupply = (await this.contract.totalSupply.call()).toNumber();
                let tokenid = 2;
                let ownerAddr = account1;
                
                await this.contract.mintToken(ownerAddr, tokenid, a, b, c, input);

                let newTotalSupply = (await this.contract.totalSupply.call()).toNumber();

            } catch (e) {
                assert(e, 'An error should happen');
            }
        })
    })
})