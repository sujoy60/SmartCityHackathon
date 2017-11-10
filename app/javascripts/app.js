// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    //var status = document.getElementById("status");
    //status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBinValue.call();
    })

    .then(function(value) {
      return meta.evaluatePickUpStatus();//.call();
    })
    .then(function(value) {
      console.log("pickup value is " + value.valueOf())
      var binRequirePickUP_element = document.getElementById("needPickUpBool");
      var resultFetched = value.valueOf();
      var toDisplay;
      var btn_pickup = document.getElementById("BtnPickUpBin");

      if(resultFetched)
      { toDisplay = "1 Pickup pending";
        btn_pickup.style.display = 'block';
    }
      else
      { toDisplay = "0 Pickup pending";
      btn_pickup.style.display = 'none';};
 
      binRequirePickUP_element.innerHTML = toDisplay.toString();//value.valueOf();


    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  }, 



 refreshPickUpDone: function() {   

  var self = this;
    this.setStatus("Refreshing pick ups done... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      //alert("inside refresh func");
      return meta.pickUpDoneCalculate.call();//console.log("pickups done value is " + value.valueOf());
      
    }).then(function(value) {
      
      var txtBxPickUpDone = document.getElementById("txt_pickUpsDone");
      var binRequirePickUP_element = document.getElementById("needPickUpBool");
      var garbageLevelReceived_element = document.getElementById("garbageLevel");
      var toDisplay;
      var btn_pickup = document.getElementById("BtnPickUpBin");
      

      txt_pickUpsDone.innerHTML = value.valueOf();
      self.setStatus("Pick Up value refreshed!")
      


      toDisplay = "0 Pickup pending";
      btn_pickup.style.display = 'none';
      binRequirePickUP_element.innerHTML = toDisplay.toString();//value.valueOf();
      //garbageLevelReceived_element.value = "";
      //self.registertheData();

    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error picking up bin; see log.");
    });
  },

  registertheData: function() {
    var self = this;

    this.setStatus("Storing the data... (please wait)");
    var weekPickedUp = document.getElementById("week").value.toString();
    var recycleBin = document.getElementById("recycleBin").value;
    var recycleYes;
    if(document.getElementById('recycleBin').checked)    {recycleYes = 1;}    else{recycleYes = 2};
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;//alert(weekPickedUp + "" + recycleYes);
      return meta.newSensorData( true,weekPickedUp,recycleYes, {from: account});
      return true;
    }).then(function() {
      //return meta.pickUpDoing();//console.log("pickups done value is " + value.valueOf());
      self.setStatus("Pick Up Complete! "  );      
      self.refreshPickUpDone();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error picking up bin; see log.");
    });
  },

  pickUpDoing: function() {
    var self = this;

    this.setStatus("Initiating pick up... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.pickUpDoing( {from: account});
    }).then(function() {
      //return meta.pickUpDoing();//console.log("pickups done value is " + value.valueOf());
      self.setStatus("Pick Up Complete! "  );      
      self.refreshPickUpDone();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error picking up bin; see log.");
    });
  },

  sendCoin: function() {
    var self = this;

    var garbageLevelReceived = document.getElementById("garbageLevel").value;
    var weekControl = document.querySelector('input[type="week"]');
    var currentWeek  = weekControl.value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.saveBinValue(garbageLevelReceived, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
