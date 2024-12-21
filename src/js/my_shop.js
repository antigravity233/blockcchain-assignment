async function checkMerchantBalance() {
    balance = await window.contract.methods.checkBalance(account).call();

    document.getElementById('balance').querySelector('span').innerHTML = balance;
}

async function getShopProducts() {
    const shopAddress = account;
    const product_list = await window.contract.methods.getShopProducts(shopAddress).call();
    
    prod_name = product_list['Products'];
    prod_stock = product_list['ProductQuantity'];
    prod_price = product_list['Prices'];

    elm = document.getElementById('product-list').innerHTML;

    for (let i = 0; i < prod_name.length; i++) {
        elm += `
        <a href="product_details.html?productName=${prod_name[i]}" class="product">
            <div>
                <p class="num">${i+1}.</p>
                <p class="prod-name"><span>product:</span>${prod_name[i]}</p>
                <p class="prod-stock"><span>stock:</span>${prod_stock[i]}</p>
                <p class="prod-price"><span>price:</span>${prod_price[i]} MGT</p>
            </div>
            <img src="img/play.png" alt="visit">
        </a>
        `;
    }
    document.getElementById('product-list').innerHTML = elm;
}




// async function getShopProducts() {
//     const shopAddress = document.getElementById('shopAddress').value;

//     const contract = new web3.eth.Contract(contractABI, contractAddress);

//     try {
//         const result = await contract.methods.getShopProducts(shopAddress).call();
//         displayShopProducts(result);
//     } catch (error) {
//         console.error(error);
//         alert("Failed to fetch shop products.");
//     }
// }

// const readfromContract = async()

// function displayShopProducts(data) {

//     const shopName = data.ShopName;
//     const products = data.Products;
//     const prices = data.Prices;
//     const quantities = data.ProductQuantity;
//     const details = data.ProductDetails;
//     const categories = data.catelogs;

//     document.getElementById('shopName').innerText = shopName;

//     for (let i = 0; i < products.length; i++) {
//         const row = document.createElement('tr');

//         const productCell = document.createElement('td');
//         productCell.innerText = products[i];
//         row.appendChild(productCell);

//         const priceCell = document.createElement('td');
//         priceCell.innerText = prices[i];
//         row.appendChild(priceCell);

//         const quantityCell = document.createElement('td');
//         quantityCell.innerText = quantities[i];
//         row.appendChild(quantityCell);

//         const detailCell = document.createElement('td');
//         detailCell.innerText = details[i];
//         row.appendChild(detailCell);

//         const categoryCell = document.createElement('td');
//         categoryCell.innerText = categories[i];
//         row.appendChild(categoryCell);

//         tableBody.appendChild(row);
//     }

//     document.getElementById('shopDetails').style.display = 'block';
// }