const Chain = artifacts.require("Chain");

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Chain',(accounts)=>{
	let chain

	before(async () => {
		chain = await Chain.deployed()
	})

	describe('deployment',async () =>{

		it('deploys successfully',async () =>{
	
		const address = chain.address
		assert.notEqual(address,0x0)
		assert.notEqual(address,'')
		assert.notEqual(address,null)
		assert.notEqual(address,undefined)
		})
	}) 

	describe('storage',async () => {
		it('updates the chainHash',async() =>{
			let chainHash
			chainHash = 'abc123'
			await chain.set(chainHash)
			const result = await chain.get()
			assert.equal(result,chainHash)
			
		})
	})

})
