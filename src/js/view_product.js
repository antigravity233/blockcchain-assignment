async function loadShopDetails() {
    const url = window.location.search;
    const url_params = new URLSearchParams(url);
    const _shop_address = url_params.get('shop');
    const data = await window.contract.methods.getShopProducts(_shop_address).call();
    prod_list = document.getElementById('prod-list');

    const product_list = data['Products'];
    const product_details = data['ProductDetails'];
    // const product_quantity = data['ProductQuantity'];
    const prices = data['Prices'];
    const category = data['catelogs'];

    console.log(data);
    document.getElementById('title').innerHTML = `<p>${data['ShopName']}</p>`;
    
    elm = ``;

    if (product_list.length < 1) {
        elm = 'No product.'
    }

    for (let i = 0; i < product_list.length; i++) {
        prod_name = product_list[i];
        elm += `
        <div class="product p${i+1}">
                    <div class="prod-name-price">
                        <p class="prod-name">${prod_name}</p>
                        <p class="prod-price">${prices[i]} MGT</p>
                    </div>
                    <p class="prod-des">${product_details[i]}</p>
                    <div class="temp-cat">
                        <p class="prod-cat">${category[i]}</p>
                    </div>
                    <input type="button" value="Buy" class="prod-btn" onclick="buyProduct('${_shop_address}', '${prod_name}', 1)">
                </div>
        `;
    }

    prod_list.innerHTML = elm;
}

async function buyProduct(_shop_address, _prod_name, _quantity) {
    try {
        console.log(account, _quantity, _shop_address, _prod_name);

        await window.contract.methods.purchaseProduct(_quantity, _shop_address, _prod_name).send({from: account});
        alert('Purchase product \''+ _prod_name+ ' \' successfully');

    } catch (err) {
        alert('You have no enough MGT.');
    }
}