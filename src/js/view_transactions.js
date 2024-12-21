let totalTransaction = 0;

async function loadTransaction() {
    const events = await window.contract.getPastEvents('ProductPurchased', {
        fromBlock: 0,
        toBlock: 'latest'
    });

    display(events);
    console.log(events);
}

function display(events) {
    elm = `
    <tr>
                <td>Transaction Hash</td>
                <td>Block</td>
                <td>Event</td>
                <td>From</td>
                <td>To</td>
                <td>Product</td>
                <td>Value</td>
            </tr>`;

    for (let i = events.length - 1; i >= 0; i--) {

        trx_hash = shortAddress(events[i].transactionHash);
        buyer_address = shortAddress(events[i].returnValues.buyerAddress);
        shop_address = shortAddress(events[i].returnValues.shopAddress);
        console.log(events[i].ProductPurchased);
        elm += `
            <tr>
                <td><a href="transaction_details.html?trxHash=${events[i].transactionHash}&value=1">${trx_hash}</a></td>
                <td>${events[i].blockNumber}</td>
                <td>${events[i].event}</td>
                <td>${buyer_address}</td>
                <td>${shop_address}</td>
                <td>${events[i].returnValues.productID}</td>
                <td>${events[i].returnValues.totalPayment} MGT</td>
            </tr>
        `;
    }
    document.getElementById('transactions').querySelector('table').innerHTML = elm;
    console.log("ttl transaction" + totalTransaction);
    totalTransaction += events.length;    
}

function shortAddress(_address) {
    let short = _address.substring(0, 9) + '...' + _address.substring(_address.length - 4);
    return short;
}

async function search() {
    const _address = document.getElementById('keyword').value;

    if (_address === '') {
        loadTransaction();
        loadAddOnTransaction();
        loadValidateTransaction();

        return;
    }

    const events = await window.contract.getPastEvents('ProductPurchased', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    const events2 = await window.contract.getPastEvents('ShopProductAdded', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    const events3 = await window.contract.getPastEvents('BuyerValidated', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    const events4 = await window.contract.getPastEvents('ShopValidated', {
        fromBlock: 0,
        toBlock: 'latest'
    });



    let selected = [];
    let selected2 =[];
    let selected3 =[];
    let selected4 =[];

    for (let i = 0; i < events.length; i++) {
        isBuyer = events[i].returnValues.buyerAddress.toLowerCase().localeCompare(_address.toLowerCase()) == 0;
        isShop = events[i].returnValues.shopAddress.toLowerCase().localeCompare(_address.toLowerCase()) == 0

        if (isBuyer || isShop) {
            selected.push(events[i]);
        }
    }

    for (let i = 0; i < events2.length; i++) {
        isShop = events2[i].returnValues.shopAddress.toLowerCase().localeCompare(_address.toLowerCase()) == 0

        if (isShop) {
            selected2.push(events2[i]);
        }
    }

    for (let i = 0; i < events3.length; i++) {
        isBuyer = events3[i].returnValues.buyerAddress.toLowerCase().localeCompare(_address.toLowerCase()) == 0;

        if (isBuyer) {
            selected3.push(events3[i]);
        }
    }

    for (let i = 0; i < events4.length; i++) {
        isShop = events4[i].returnValues.shopAddress.toLowerCase().localeCompare(_address.toLowerCase()) == 0

        if (isShop) {
            selected4.push(events4[i]);
        }
    }

    
    display(selected);
    display2(selected2);
    display3(selected3,selected4);
    // console.log(selected);
}

async function loadAddOnTransaction() {
    const events = await window.contract.getPastEvents('ShopProductAdded', {
        fromBlock: 0,
        toBlock: 'latest'
    });

    display2(events);
    console.log(events);
}

function display2(events) {
    elm = `
    <tr>
                <td>Transaction Hash</td>
                <td>Block</td>
                <td>Event</td>
                <td>ShopAddress</td>
                <td>Stock</td>
                <td>Product</td>
                <td>Price</td>
            </tr>`;

    for (let i = events.length - 1; i >= 0; i--) {
       
        trx_hash = shortAddress(events[i].transactionHash);
        shop_address = shortAddress(events[i].returnValues.shopAddress);
        console.log(events[i].ProductPurchased);
        elm += `
            <tr>
                <td><a href="transaction_details.html?trxHash=${events[i].transactionHash}&value=2">${trx_hash}</a></td>
                <td>${events[i].blockNumber}</td>
                <td>${events[i].event}</td>
                <td>${shop_address}</td>
                <td>${events[i].returnValues.numberOfStock}</td>
                <td>${events[i].returnValues.productName}</td>
                <td>${events[i].returnValues.price} MGT</td>
            </tr>
        `;
    }
    document.getElementById('AddOnTransactions').querySelector('table').innerHTML = elm;

    // document.getElementById('ttl-transaction').innerHTML = events.length;
    totalTransaction += events.length;    
}

async function loadValidateTransaction() {
    const events = await window.contract.getPastEvents('BuyerValidated', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    const events2 = await window.contract.getPastEvents('ShopValidated', {
        fromBlock: 0,
        toBlock: 'latest'
    });

    display3(events,events2);
    console.log("buyer:" + events);
    console.log("shop:" + events2);
}

function display3(events, events2) {
    elm = `
    <tr>
                <td>Transaction Hash</td>
                <td>Block</td>
                <td>Event</td>
                <td>Address</td>
                <td>Name</td>
            </tr>`;

    for (let i = events.length - 1; i >= 0; i--) {
       
        trx_hash = shortAddress(events[i].transactionHash);
        buyer_address = shortAddress(events[i].returnValues.buyerAddress);
        console.log(events[i].buyerAddress);
        elm += `
            <tr>
                <td><a href="transaction_details.html?trxHash=${events[i].transactionHash}&value=3">${trx_hash}</a></td>
                <td>${events[i].blockNumber}</td>
                <td>${events[i].event}</td>
                <td>${buyer_address}</td>
                <td>${events[i].returnValues.name}</td>
            </tr>
        `;
    }
    for (let i = events2.length - 1; i >= 0; i--) {
       
        trx_hash = shortAddress(events2[i].transactionHash);
        shop_address = shortAddress(events2[i].returnValues.shopAddress);
        console.log(events2[i].buyerAddress);
        elm += `
            <tr>
                <td><a href="transaction_details.html?trxHash=${events2[i].transactionHash}&value=4">${trx_hash}</a></td>
                <td>${events2[i].blockNumber}</td>
                <td>${events2[i].event}</td>
                <td>${shop_address}</td>
                <td>${events2[i].returnValues.name}</td>
            </tr>
        `;
    }

    

    document.getElementById('ValidatedTransactions').querySelector('table').innerHTML = elm;
    totalTransaction += events.length + events2.length;    
    // document.getElementById('ttl-transaction').innerHTML = events.length;
    
}

function displayTotalTransaction(){
    
    document.getElementById('ttl-transaction').innerHTML = totalTransaction;

}
