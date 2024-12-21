async function loadDetails() {
    const url = window.location.search;
    const url_params = new URLSearchParams(url);
    const trxHash = url_params.get('trxHash');
    const value = url_params.get('value');
    let index = -1;
    if(value == 1){
    data = await window.contract.getPastEvents('ProductPurchased', {
        fromBlock: 0,
        toBlock: 'latest',
    });

    for (let i = 0; i < data.length; i++) {
        if (data[i].transactionHash === trxHash) {
            index = i;
            break;
        }
    }

    let d = data[index];
    let shopname;
    shopnamelist = await window.contract.methods.getAllShop().call();

    for (let i = 0; i < shopnamelist['ShopAddress'].length; i++) {

        if (d.returnValues.shopAddress == shopnamelist['ShopAddress'][i]) {
            shopname = shopnamelist['ShopName'][i];
            break;
        }
    }

    elm = `<div id="info-block-1" class="block">
    <div>
        <p class="rtitle">Transaction Hash:</p>
        <p class="rvalue">${d.transactionHash}</p>
    </div>
    <div>
        <p class="rtitle">Block Hash:</p>
        <p class="rvalue">${d.blockHash}</p>
    </div>
    <div>
        <p class="rtitle">Block:</p>
        <p class="rvalue">${d.blockNumber}</p>
    </div>
    <div>
        <p class="rtitle">Event:</p>
        <p class="rvalue">${d.event}</p>
    </div>
</div>

<div id="info-block-2" class="block">
    <div>
        <p class="rtitle">From:</p>
        <p>${d.returnValues.buyerAddress}</p>
    </div>
    <div>
        <p class="rtitle">To:</p>
        <p>${d.returnValues.shopAddress}</p>
    </div>
    <div>
        <p class="rtitle">Product:</p>
        <p>${d.returnValues.productID}</p>
    </div>
    <div>
        <p class="rtitle">Shop:</p>
        <p>${shopname}</p>
    </div>
</div>

<div id="info-block-4" class="block">
    <div>
        <p class="rtitle">Value:</p>
        <p class="rvalue">${d.returnValues.totalPayment} MGT</p>
    </div>
</div>`;

    document.getElementById('content').innerHTML = elm;

    document.getElementById('title').querySelector('p span').innerHTML =  d.transactionHash;

    console.log(data);
}else{
    console.log("not 1");
}
}

async function loadAddOnDetails() {
    const url = window.location.search;
    const url_params = new URLSearchParams(url);
    const trxHash = url_params.get('trxHash');
    const value = url_params.get('value');
    if(value == 2){
    let shopAddress;
    let productName;
    let price;
    let stock;
    let block;
    let blockNum;
    let Event;


    data = await window.contract.getPastEvents('ShopProductAdded', {
        fromBlock: 0,
        toBlock: 'latest',
    });
    
    for (let i = 0; i < data.length; i++) {
        console.log("first : "+data[i].transactionHash);
        console.log("second : "+trxHash);

        if (data[i].transactionHash === trxHash) {
            shopAddress = data[i].returnValues.shopAddress;
            productName = data[i].returnValues.productName;
            price = data[i].returnValues.price;
            stock = data[i].returnValues.numberOfStock;
            block = data[i].blockHash;
            blockNum = data[i].blockNumber;
            Event = data[i].event;
            console.log(shopAddress);
            break;
        }
    }
    
    shopDetails = await window.contract.methods.getShopProducts(shopAddress).call();

    shopName = shopDetails[0];

    elm = `<div id="info-block-1" class="block">
    <div>
        <p class="rtitle">Transaction Hash:</p>
        <p class="rvalue">${trxHash}</p>
    </div>
    <div>
        <p class="rtitle">Block Hash:</p>
        <p class="rvalue">${block}</p>
    </div>
    <div>
        <p class="rtitle">Block:</p>
        <p class="rvalue">${blockNum}</p>
    </div>
    <div>
        <p class="rtitle">Event:</p>
        <p class="rvalue">${Event}</p>
    </div>
</div>

<div id="info-block-2" class="block">
    <div>
        <p class="rtitle">Shop:</p>
        <p>${shopAddress}</p>
    </div>
    <div>
        <p class="rtitle">Shop Name:</p>
        <p>${shopName}</p>
    </div>
    <div>
        <p class="rtitle">Product:</p>
        <p>${productName}</p>
    </div>
    <div>
        <p class="rtitle">Price:</p>
        <p>${price}</p>
    </div>
     <div>
        <p class="rtitle">Stock:</p>
        <p>${stock}</p>
    </div>
</div>
`;

    document.getElementById('content').innerHTML = elm;

    document.getElementById('title').querySelector('p span').innerHTML =  trxHash;

    console.log(data);

}else{
    console.log("not 2");
}
}


async function loadValidateBuyerDetails() {
    const url = window.location.search;
    const url_params = new URLSearchParams(url);
    const trxHash = url_params.get('trxHash');
    const value = url_params.get('value');
    if(value == 3){
    let BuyerAddress;
    let BuyerName;
    let block;
    let blockNum;
    let Event;


    data = await window.contract.getPastEvents('BuyerValidated', {
        fromBlock: 0,
        toBlock: 'latest',
    });
    
    for (let i = 0; i < data.length; i++) {
        console.log("first : "+data[i].transactionHash);
        console.log("second : "+trxHash);

        if (data[i].transactionHash === trxHash) {
            BuyerAddress = data[i].returnValues.buyerAddress;
            BuyerName = data[i].returnValues.name;
            block = data[i].blockHash;
            blockNum = data[i].blockNumber;
            Event = data[i].event;
            console.log(BuyerAddress);
            break;
        }
    }

    elm = `<div id="info-block-1" class="block">
    <div>
        <p class="rtitle">Transaction Hash:</p>
        <p class="rvalue">${trxHash}</p>
    </div>
    <div>
        <p class="rtitle">Block Hash:</p>
        <p class="rvalue">${block}</p>
    </div>
    <div>
        <p class="rtitle">Block:</p>
        <p class="rvalue">${blockNum}</p>
    </div>
    <div>
        <p class="rtitle">Event:</p>
        <p class="rvalue">${Event}</p>
    </div>
</div>

<div id="info-block-2" class="block">
    <div>
        <p class="rtitle">Buyer Address:</p>
        <p>${BuyerAddress}</p>
    </div>
    <div>
        <p class="rtitle">Buyer Name:</p>
        <p>${BuyerName}</p>
    </div>
</div>
`;

    document.getElementById('content').innerHTML = elm;

    document.getElementById('title').querySelector('p span').innerHTML =  trxHash;

    console.log(data);
}else{
    console.log("not 3");
}
}

async function loadValidateShopDetails() {
    const url = window.location.search;
    const url_params = new URLSearchParams(url);
    const trxHash = url_params.get('trxHash');
    const value = url_params.get('value');
    if(value == 4){
    let ShopAddress;
    let ShopName;
    let block;
    let blockNum;
    let Event;


    data = await window.contract.getPastEvents('ShopValidated', {
        fromBlock: 0,
        toBlock: 'latest',
    });
    
    for (let i = 0; i < data.length; i++) {
        console.log("first : "+data[i].transactionHash);
        console.log("second : "+trxHash);

        if (data[i].transactionHash === trxHash) {
            ShopAddress = data[i].returnValues.shopAddress;
            ShopName = data[i].returnValues.name;
            block = data[i].blockHash;
            blockNum = data[i].blockNumber;
            Event = data[i].event;
            console.log(ShopAddress);
            break;
        }
    }

    elm = `<div id="info-block-1" class="block">
    <div>
        <p class="rtitle">Transaction Hash:</p>
        <p class="rvalue">${trxHash}</p>
    </div>
    <div>
        <p class="rtitle">Block Hash:</p>
        <p class="rvalue">${block}</p>
    </div>
    <div>
        <p class="rtitle">Block:</p>
        <p class="rvalue">${blockNum}</p>
    </div>
    <div>
        <p class="rtitle">Event:</p>
        <p class="rvalue">${Event}</p>
    </div>
</div>

<div id="info-block-2" class="block">
    <div>
        <p class="rtitle">Buyer Address:</p>
        <p>${ShopAddress}</p>
    </div>
    <div>
        <p class="rtitle">Buyer Name:</p>
        <p>${ShopName}</p>
    </div>
</div>
`;

    document.getElementById('content').innerHTML = elm;

    document.getElementById('title').querySelector('p span').innerHTML =  trxHash;

    console.log(data);
}else{
    console.log("not 4");
}
}