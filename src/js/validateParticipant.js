async function validateParticipant() {
    _address = document.getElementById('address').value;
    _name = document.getElementById('name').value;
    _utype = document.getElementById('type').value;

    let is_registered = false;

    if (_utype == 0) {
        is_registered = await window.contract.methods.buyerChecker(_address).call();
    }
    else if (_utype == 1) {
        is_registered = await window.contract.methods.shopChecker(_address).call();
    }


    if (is_registered) {
        alert('Address \''+ account+ '\' has already registered as '+ (_utype == 0 ? 'Buyer' : 'Merchant'));
    }
    else {
        console.log('3');
        if (!(_address === "") && !(_name === "")) {
            switch (_utype) {
                case '0':
                    await window.contract.methods.validateBuyer(_address, _name).send({ from: account });
                    break;
                case '1':
                    await window.contract.methods.validateShop(_address, _name).send({ from: account });
                    break;
            }
            alert('Address \''+ account+ '\' registered as a '+ (_utype == 0 ? 'Buyer' : 'Merchant')+ ' successfully.');
        }
    }
}