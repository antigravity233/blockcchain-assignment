// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MarketGroceryToken is ERC20 {
    constructor() ERC20("MarketGroceryToken", "MGT") {
        _mint(msg.sender, 10000 * 10**decimals());
    }

    function transfer(
        address from,
        address to,
        uint256 value
    ) public virtual returns (bool) {
        _transfer(from, to, value);
        return true;
    }
}

contract MarketPlace is Ownable(msg.sender) {
    using SafeMath for uint256;
    MarketGroceryToken public token;
    address payable private chairPerson;
    uint256 public exchangeRate;
    uint256 taxRate = 6;
    address[] public shopAddresses; // Track all shop addresses
    address[] public buyerAddresses; // Track all shop addresses


    struct registedBuyer {
        string name;
        bool registered;
    }

    struct registedShop {
        string shopName;
        bool registered;
        string[] shopOnSaleProduct;
        mapping(string => string) productDetails;
        mapping(string => uint256) productQuantity;
        mapping(string => uint256) productPrices;
        mapping(string => string) category;
    }

    mapping(address => registedBuyer) buyer;
    mapping(address => registedShop) shop;

    constructor(address _tokenAddress, uint256 _initialRate) {
        token = MarketGroceryToken(_tokenAddress);
        chairPerson = payable(msg.sender);
        exchangeRate = _initialRate;
    }

    event BuyerValidated(address indexed buyerAddress, string name);
    event ShopValidated(address indexed shopAddress, string name);
    event ProductAdded(string indexed productID, string name);
    event ProductPurchased(
        address indexed buyerAddress,
        address indexed shopAddress,
        string productID,
        uint256 amount,
        uint256 totalPayment
    );
    event ShopProductAdded(
        address indexed shopAddress,
        string productName,
        uint256 price,
        uint256 numberOfStock,
        string productDetails,
        string category
    );
    event TopUp(
        address indexed buyerAddress,
        uint256 weiAmount,
        uint256 tokenAmount
    );

    //admin action
    function validateBuyer(address _newBuyerAddress, string memory _name)
        public
        onlyOwner
        returns (bool isSuccess)
    {
        bool condition = false;
        require(
            buyer[_newBuyerAddress].registered == false,
            "Error : Buyer already exist"
        );
        buyer[_newBuyerAddress].name = _name;
        buyer[_newBuyerAddress].registered = true;
        
        emit BuyerValidated(_newBuyerAddress, _name);
        buyerAddresses.push(_newBuyerAddress);
        condition = true;
        return condition;
    }

    function validateShop(address _newShopAddress, string memory _name)
        public
        onlyOwner
        returns (bool isSuccess)
    {
        require(
            shop[_newShopAddress].registered == false,
            "Error : Shop already exist"
        );
        bool condition = false;
        shop[_newShopAddress].shopName = _name;
        shop[_newShopAddress].registered = true;
        emit ShopValidated(_newShopAddress, _name);
        shopAddresses.push(_newShopAddress);
        condition = true;
        return condition;
    }

    //buyer action
    function purchaseProduct(
        uint256 _quantity,
        address _shopAddress,
        string memory _productName
    ) external returns (bool isSuccess) {
        bool condition = false;
        require(
            buyer[msg.sender].registered && shop[_shopAddress].registered,
            "Only Valid shop and buyer can do transaction"
        );
        require(msg.sender != _shopAddress, "Cannot purchase ur own item");
        require(
            shop[_shopAddress].productPrices[_productName] != 0,
            "The shop is not selling the product"
        );
        require(
            shop[_shopAddress].productQuantity[_productName] >= _quantity,
            "Not enough stock"
        );

        //calculate total payment
        uint256 totalPayment = shop[_shopAddress].productPrices[_productName] *
            _quantity;

        //stock decrease
        shop[_shopAddress].productQuantity[_productName] =
            shop[_shopAddress].productQuantity[_productName] -
            _quantity;

        // Calculate the tax amount (6% of totalPayment)
        uint256 taxAmount = totalPayment.mul(taxRate).div(100);

        // Transfer the final payment (after deducting tax) to the shop
        uint256 finalPayment = totalPayment.sub(taxAmount);
        token.transfer(msg.sender, _shopAddress, finalPayment);

        // Transfer the tax amount to the chairperson (or any specific address)
        token.transfer(msg.sender, chairPerson, taxAmount); // Replace 'chairperson' with the actual address
        emit ProductPurchased(
            msg.sender,
            _shopAddress,
            _productName,
            _quantity,
            finalPayment
        );
        condition = true;
        return condition;
    }

    //Shop action

    function addOnProduct(
        string memory _productName,
        uint256 _price,
        uint256 _numberOfStock,
        string memory _productDetails,
        string memory _category
    ) public returns (bool isSuccess) {
        bool condition = false;
        require(
            shop[msg.sender].registered,
            "Only validated shop can add products"
        );
        require(
            shop[msg.sender].productPrices[_productName] == 0,
            "Product already exists"
        );
        require(_price >= 1, "Price cannot less than 1");
        require(bytes(_productName).length != 0, "Product Name cannot empty");
        require(
            bytes(_productDetails).length != 0,
            "Product Details cannot empty"
        );
        shop[msg.sender].shopOnSaleProduct.push(_productName);
        shop[msg.sender].productQuantity[_productName] = _numberOfStock;
        shop[msg.sender].productPrices[_productName] = _price;
        shop[msg.sender].productDetails[_productName] = _productDetails;
        shop[msg.sender].category[_productName] = _category;

        emit ShopProductAdded(
            msg.sender,
            _productName,
            _price,
            _numberOfStock,
            _productDetails,
            _category
        );
        condition = true;
        return condition;
    }

    function modifyProductDetails(
        string memory _selectedProductName,
        string memory _newProductName,
        uint256 _prices,
        uint256 _productQuantity,
        string memory _productDetails,
        string memory _newCategory
    ) public returns (bool isSuccess) {
        bool condition = false;
        require(
            shop[msg.sender].registered,
            "Only validated shop modify products"
        );
        require(_productQuantity >= 0, "Quantity cannot be negative");
        require(
            bytes(_newProductName).length != 0,
            "Product name cannot be empty"
        );
        require(_prices >= 1, "Price cannot less than 1");

        for (
            uint256 i = 0;
            i < shop[msg.sender].shopOnSaleProduct.length;
            i++
        ) {
            if (
                keccak256(abi.encodePacked(_selectedProductName)) ==
                keccak256(
                    abi.encodePacked(shop[msg.sender].shopOnSaleProduct[i])
                )
            ) {
                //clear old data
                shop[msg.sender].productPrices[_selectedProductName] = 0;
                shop[msg.sender].productQuantity[_selectedProductName] = 0;
                shop[msg.sender].productDetails[_selectedProductName] = "";
                shop[msg.sender].category[_selectedProductName] = "";

                //input new data
                shop[msg.sender].shopOnSaleProduct[i] = _newProductName;
                shop[msg.sender].productPrices[_newProductName] = _prices;
                shop[msg.sender].productQuantity[
                    _newProductName
                ] = _productQuantity;
                shop[msg.sender].productDetails[
                    _newProductName
                ] = _productDetails;
                shop[msg.sender].category[
                    _newProductName
                ] = _newCategory;
                condition = true;
            }
        }
        return condition;
    }

    function removeProduct(string memory _productName)
        public
        returns (
            bool isSuccess
        )
    {
        bool condition = false;
        uint256 indexToRemove = 0;

        for (
            uint256 i = 0;
            i < shop[msg.sender].shopOnSaleProduct.length;
            i++
        ) {
            if (
                keccak256(
                    abi.encodePacked(shop[msg.sender].shopOnSaleProduct[i])
                ) == keccak256(abi.encodePacked(_productName))
            ) {
                indexToRemove = i;
                condition = true;
                break;
            }
        }

        // If the product is found in the array
        if (condition) {
            for (
                uint256 i = indexToRemove;
                i < shop[msg.sender].shopOnSaleProduct.length - 1;
                i++
            ) {
                shop[msg.sender].shopOnSaleProduct[i] = shop[msg.sender]
                    .shopOnSaleProduct[i + 1];
            }
            shop[msg.sender].shopOnSaleProduct.pop();

            // Update the product-related mappings
            shop[msg.sender].productPrices[_productName] = 0;
            shop[msg.sender].productQuantity[_productName] = 0;
            shop[msg.sender].productDetails[_productName] = "";
            shop[msg.sender].category[_productName] = "";
        }

        return condition;
    }

    function modifyShopProfile(string memory _newShopName)
        public
        returns (bool isSuccess)
    {
        bool condition = false;
        require(
            shop[msg.sender].registered,
            "Only validated shop modify products"
        );
        require(
            bytes(_newShopName).length != 0,
            "Product name cannot be empty"
        );
        
        shop[msg.sender].shopName = _newShopName;
        condition = true;
        return condition;
    }

    //public action (everyone can use)
    function checkBalance(address _sender) external view returns (uint256) {
        require(
            buyer[_sender].registered ||
                shop[_sender].registered ||
                _sender == chairPerson,
            "Only Valid buyer or shop can do transaction"
        );
        return token.balanceOf(_sender);
    }

    function topUp() public payable returns (bool isSuccess) {
        bool condition = false;
        require(
            buyer[msg.sender].registered || shop[msg.sender].registered,
            "Only Valid buyer or shop top up the token"
        );

        if (msg.value > msg.sender.balance) {
            revert("Not enough Ether provided.");
        } else {
            condition = true;
        }
        chairPerson.transfer(msg.value);
        uint256 weiAmount = msg.value;
        uint256 inEther = weiAmount / 1e18;
        uint256 tokenAmount = inEther * exchangeRate; //exchangeRate = 1000
        token.transfer(chairPerson, msg.sender, tokenAmount);

        emit TopUp(msg.sender, msg.value, tokenAmount);
        return condition;
    }

    

    //for system use

    function buyerChecker(address _address) public view returns (bool isTrue) {
        return buyer[_address].registered;
    }

    function shopChecker(address _address) public view returns (bool isTrue) {
        return shop[_address].registered;
    }

    function getChairpPerson() public view returns (address _chairPerson) {
        return chairPerson;
    }

    function checkIsOwner(address check) public view returns (bool isTrue) {
        if (check == chairPerson) {
            return true;
        } else {
            return false;
        }
    }

    //display function

    function getShopProducts(address _shopAddress)
        public
        view
        returns (
            string memory ShopName,
            string[] memory Products,
            uint256[] memory Prices,
            uint256[] memory ProductQuantity,
            string[] memory ProductDetails,
            string[] memory catelogs
        )
    {
        require(
            shop[_shopAddress].registered,
            "Shop does not exist or is not validated"
        );

        string[] memory products = shop[_shopAddress].shopOnSaleProduct;
        uint256[] memory prices = new uint256[](products.length);
        uint256[] memory quantity = new uint256[](products.length);
        string[] memory productDetail = new string[](products.length);
        string[] memory category = new string[](products.length);

        for (uint256 i = 0; i < products.length; i++) {
            prices[i] = shop[_shopAddress].productPrices[products[i]];
            quantity[i] = shop[_shopAddress].productQuantity[products[i]];
            productDetail[i] = shop[_shopAddress].productDetails[products[i]];
            category[i] = shop[_shopAddress].category[products[i]];
        }

        return (
            shop[_shopAddress].shopName,
            products,
            prices,
            quantity,
            productDetail,
            category
        );
    }

    function getAllShop() public view returns(
        string[] memory ShopName, address[] memory ShopAddress){
        uint256 shopCount = shopAddresses.length;

        string[] memory shopNames = new string[](shopCount);
        address[] memory addresses = new address[](shopCount);

        for (uint256 i = 0; i < shopCount; i++) {
            address shopAddress = shopAddresses[i];
            addresses[i] = shopAddress;
            shopNames[i] = shop[shopAddresses[i]].shopName;
        }
        return (shopNames, addresses);
    }

    function getAllBuyer() public view returns(string[] memory BuyerName,address[] memory BuyerAddress){
        uint256 buyerCount = buyerAddresses.length;

        string[] memory buyerNames = new string[](buyerCount);
        address[] memory addresses = new address[](buyerCount);

        for (uint256 i = 0; i < buyerCount; i++) {
            address buyerAddress = buyerAddresses[i];
            addresses[i] = buyerAddress;
            buyerNames[i] = buyer[buyerAddresses[i]].name;
        }
        return (buyerNames, addresses);

    }

    function getProductDetails(string memory _productName) public view returns(string memory ProductName,string memory Category,string memory ProductDetails,uint256 ProductPrice,uint256 productQuantity){
        string memory modifyProductName = _productName;
        return(
            modifyProductName,
            shop[msg.sender].category[modifyProductName],
            shop[msg.sender].productDetails[modifyProductName],
            shop[msg.sender].productPrices[modifyProductName],
            shop[msg.sender].productQuantity[modifyProductName]


        );
    }




    


}
