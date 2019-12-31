import sha256 from './sha256.js';

class Block {
	constructor(blockNumber, nonce, prevHash, transaction){
		this.blockNumber = blockNumber;
		this.timeStamp = Date.now();
		this.transaction = transaction;
		this.prevHash = prevHash;
		this.nonce = nonce;
		this.blockHash = '';
		this.calculateHash();
	}
	calculateHash() {
		this.blockHash = sha256(JSON.stringify(this));
		return this;
	}
}

class Blockchain {

	constructor(){
		this.chain = [];		
		this.data = [];
		this.constructGenesis();
	}

	constructGenesis() {
		this.chain.push(this.createBlock(0, 0));
		return this;
	}

	createBlock(proofNo, prevHash) {
		const newBlock = new Block(this.chain.length, proofNo, prevHash, this.data);
		this.data = [];		
		return newBlock;
	}

	proofOfWork(lastProof){
		let proofNo = 0;
		while(Blockchain.verifyingProof(lastProof, proofNo)) proofNo += 1;
		return proofNo;
	}

	newTransaction(sender, recipient, amount){
		const st = {
			sender,
			recipient, 
			amount
		};
		this.data.push(st);
		return this;
	}

	latestBlock() {
		return this.chain[this.chain.length - 1];
	}

	checkValidity(block, prevBlock){
		console.log(block);
		console.log(prevBlock);
		if(prevBlock.blockNumber + 1 != block.blockNumber) return false;
		else if (prevBlock.blockHash != block.prevHash) return false;
		else if (Blockchain.verifyingProof(prevBlock.nonce, block.nonce)) return false;
		return true;
	}

	mining(){
		let lastBlock = this.latestBlock();
		let proofNo = this.proofOfWork(lastBlock.nonce);
		let lastHash = lastBlock.blockHash;
		let newBlock = this.createBlock(proofNo, lastHash);		
		if(this.checkValidity(newBlock, lastBlock)) this.chain.push(newBlock);
		return this;
	}

	static verifyingProof(lastProof, proof){
		const st = sha256(`${lastProof}${proof}`);
		return st.slice(st.length-4, st.length) != '0000';
	}

}

export default Blockchain;
