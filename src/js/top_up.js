const topUp = async () => {

    const _topUpAmount = document.getElementById("topup").value

    if (_topUpAmount >= 1) {
        await window.contract.methods.topUp().send({ from: account, value: web3.utils.toWei(_topUpAmount, "ether") });
        alert('Top up successfully.');
    }
    else {
        alert('Top up amount must at least 1 ETH');
    }

}