pragma solidity ^0.4.2;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {

	mapping (address => uint) balances;
	

	uint typeOfBin;
	uint timeStamp;
	uint public pickupsThisWeekSoFarGet;
	uint public lastCensorId;
	uint pickupsNonRecycleThisMonthSoFar;
	uint totalCreditsAccrued;
	uint threshHoldAmount = 15;
	bool needPickUp = false;
	uint binCurrentLevel;
	string[] public concatenatedString;
	


	struct sensorData{
	  address houseaddress;
      string week;
      uint binType;
      bool pickup;
      //address seller;
    }
	mapping(uint => sensorData) public sensordatas;
	//string[101][] dataEnteredSensor;
	address[] private sensorDataIndex;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	function MetaCoin() {
		balances[tx.origin] = 10000;
		//pickupsThisWeekSoFarGet =0;
	}


	function evaluatePickUpStatus() constant returns(bool) {
		var result = binCurrentLevel > threshHoldAmount;
		return result;
	}

  	function isSensorData(address houseAddress)
    public 
    constant
    returns(bool isIndeed) 
  	{
    if(sensorDataIndex.length == 0) return false;
    return (sensorDataIndex[sensorData[houseaddress].index] == houseaddress);
  	}	

    function inserSensorData(bool result ,string weekNum, uint binTypeReceived	) 
    public
    returns(uint index)
	{
		if(isSensorData(sensorDataIndex)) throw; 
		sensorData[sensorDataIndex].result = userEmail;
		sensorData[sensorDataIndex].weeknum   = userAge;
		sensorData[sensorDataIndex].binTypeReceived  = sensorDataIndex.push(houseaddress)-1;
		LogNewData(
			//userAddress, 
			//userStructs[userAddress].index, 
			//userEmail, 
			//userAge
	  	houseaddress
		,sensorData[houseaddress].index
      	, week
      	, binType
      	  pickup
			);
		return sensorDataIndex.length-1;
	}

	function newSensorData(bool result ,string weekNum, uint binTypeReceived){
		uint newId = lastCensorId+1;
	    sensorData sD = sensordatas[newId];
		sD.week = weekNum;
		sD.binType =  binTypeReceived;
		sD.pickup = result;

		lastCensorId = newId;
	}

  function isSensorData(string weeknum)
    public 
    constant
    returns(bool isIndeed) 
  {
    if(userIndex.length == 0) return false;
    return (userIndex[userStructs[userAddress].index] == userAddress);
  }


	function fetchSensorData(string weeknum)
    public 
    constant
    returns//(bytes32 userEmail, uint userAge, uint index)
	(string week, uint binType,bool pickup)
  {
    if(!isUser(userAddress)) throw; 
    return(
      userStructs[userAddress].userEmail, 
      userStructs[userAddress].userAge, 
      userStructs[userAddress].index);
  } 
//refresh the bin pick status starts
	function saveBinValue (uint _binFillUpLevel){
		binCurrentLevel = _binFillUpLevel;
	}

	function getBinValue () returns (uint){
		return binCurrentLevel;
	}

//refresh the bin pick status finshes

//refresh the count starts
	function pickUpDoneCalculate()  returns(uint ){
		return pickupsThisWeekSoFarGet;
	}
	
	function pickUpDoing() {
		uint c =1;
		pickupsThisWeekSoFarGet = pickupsThisWeekSoFarGet + c;

	}	
//refresh the count finishes


	function sendCoin(address receiver, uint amount,uint binFillUpLevel) returns(bool sufficient) {
		if (balances[msg.sender] < amount) 
		return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		return true;
	}

	function getBalanceInEth(address addr) returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) returns(uint) {
		return balances[addr];
	}
}
