pragma solidity 0.5.0;

contract Chain {
	string chainHash;
	//write fun
	function set(string memory _chainHash) public {
		chainHash = _chainHash;

	}
	//read fun
	function get() public view returns (string memory){
		return chainHash;
	}


}
