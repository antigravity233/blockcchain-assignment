async function loadAllShop() {
    merchant_list = document.getElementById('merchant-list');
    shop_list = await window.contract.methods.getAllShop().call();
    shop_name_list = shop_list['ShopName'];
    shop_address_list = shop_list['ShopAddress'];
    console.log(shop_list);

    elm = `
    <div id="temprow">
            <p id="title">Shops</p>
            <p id="balance">Market Place Token(MTG) Balance: <span>2000</span></p>
        </div>
    `;

    for (let i = 0; i < shop_name_list.length; i++) {
        shop = shop_name_list[i];
        address = shop_address_list[i]

        elm += `
        <a href="view_product.html?shop=${address}" class="merchant">
            <div>
                <p class="num">${i+1}.</p>
                <p class="shop-name"><span>shop:</span>${shop}</p>
            </div>
            <img src="img/play.png" alt="visit">
        </a>
        `;
    };

    merchant_list.innerHTML = elm;
}

async function checkBuyerBalance() {
    balance = await window.contract.methods.checkBalance(account).call();

    document.getElementById('balance').querySelector('span').innerHTML = balance;
}