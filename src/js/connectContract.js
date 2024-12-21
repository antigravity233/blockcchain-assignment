//1- Access to metamask
let account;
async function accessToMetamask() {

    if (window.ethereum !== "undefined") {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        account = accounts[0];
        // document.getElementById("metamask").innerHTML = account;
        console.log("User Account: " + account);
		await accessToContract();
    }
}

//2- connect to smart contract
async function accessToContract() {
    const ABI = [
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_productName",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_price",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_numberOfStock",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "_productDetails",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_category",
					"type": "string"
				}
			],
			"name": "addOnProduct",
			"outputs": [
				{
					"internalType": "bool",
					"name": "isSuccess",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_selectedProductName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_newProductName",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_prices",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_productQuantity",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "_productDetails",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_newCategory",
					"type": "string"
				}
			],
			"name": "modifyProductDetails",
			"outputs": [
				{
					"internalType": "bool",
					"name": "isSuccess",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_tokenAddress",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_initialRate",
					"type": "uint256"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "owner",
					"type": "address"
				}
			],
			"name": "OwnableInvalidOwner",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "account",
					"type": "address"
				}
			],
			"name": "OwnableUnauthorizedAccount",
			"type": "error"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "buyerAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "BuyerValidated",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_newShopName",
					"type": "string"
				}
			],
			"name": "modifyShopProfile",
			"outputs": [
				{
					"internalType": "bool",
					"name": "isSuccess",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "previousOwner",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "OwnershipTransferred",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "string",
					"name": "productID",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "ProductAdded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "buyerAddress",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "shopAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "productID",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "totalPayment",
					"type": "uint256"
				}
			],
			"name": "ProductPurchased",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_quantity",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "_shopAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_productName",
					"type": "string"
				}
			],
			"name": "purchaseProduct",
			"outputs": [
				{
					"internalType": "bool",
					"name": "isSuccess",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_productName",
					"type": "string"
				}
			],
			"name": "removeProduct",
			"outputs": [
				{
					"internalType": "bool",
					"name": "isSuccess",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "renounceOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "shopAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "productName",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "price",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "numberOfStock",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "productDetails",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "category",
					"type": "string"
				}
			],
			"name": "ShopProductAdded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "shopAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "ShopValidated",
			"type": "event"
		},
		{
			"inputs": [],
			"name": "topUp",
			"outputs": [
				{
					"internalType": "bool",
					"name": "isSuccess",
					"type": "bool"
				}
			],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "buyerAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "weiAmount",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "tokenAmount",
					"type": "uint256"
				}
			],
			"name": "TopUp",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "transferOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_newBuyerAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				}
			],
			"name": "validateBuyer",
			"outputs": [
				{
					"internalType": "bool",
					"name": "isSuccess",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_newShopAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				}
			],
			"name": "validateShop",
			"outputs": [
				{
					"internalType": "bool",
					"name": "isSuccess",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "buyerAddresses",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "buyerChecker",
			"outputs": [
				{
					"internalType": "bool",
					"name": "isTrue",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_sender",
					"type": "address"
				}
			],
			"name": "checkBalance",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "check",
					"type": "address"
				}
			],
			"name": "checkIsOwner",
			"outputs": [
				{
					"internalType": "bool",
					"name": "isTrue",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "exchangeRate",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getAllBuyer",
			"outputs": [
				{
					"internalType": "string[]",
					"name": "BuyerName",
					"type": "string[]"
				},
				{
					"internalType": "address[]",
					"name": "BuyerAddress",
					"type": "address[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getAllShop",
			"outputs": [
				{
					"internalType": "string[]",
					"name": "ShopName",
					"type": "string[]"
				},
				{
					"internalType": "address[]",
					"name": "ShopAddress",
					"type": "address[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getChairpPerson",
			"outputs": [
				{
					"internalType": "address",
					"name": "_chairPerson",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_productName",
					"type": "string"
				}
			],
			"name": "getProductDetails",
			"outputs": [
				{
					"internalType": "string",
					"name": "ProductName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "Category",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "ProductDetails",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "ProductPrice",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "productQuantity",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_shopAddress",
					"type": "address"
				}
			],
			"name": "getShopProducts",
			"outputs": [
				{
					"internalType": "string",
					"name": "ShopName",
					"type": "string"
				},
				{
					"internalType": "string[]",
					"name": "Products",
					"type": "string[]"
				},
				{
					"internalType": "uint256[]",
					"name": "Prices",
					"type": "uint256[]"
				},
				{
					"internalType": "uint256[]",
					"name": "ProductQuantity",
					"type": "uint256[]"
				},
				{
					"internalType": "string[]",
					"name": "ProductDetails",
					"type": "string[]"
				},
				{
					"internalType": "string[]",
					"name": "catelogs",
					"type": "string[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "shopAddresses",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "shopChecker",
			"outputs": [
				{
					"internalType": "bool",
					"name": "isTrue",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "token",
			"outputs": [
				{
					"internalType": "contract MarketGroceryToken",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	];


    const Address = "0xd93db376230065588987f36a77F4696665E2fCD1";
    window.web3 = await new Web3(window.ethereum); //how to access to smart contract 
    window.contract = await new window.web3.eth.Contract(ABI, Address); //how you create an instance of that contract by using the abi and address  
}