async function buyerIdentity(){

    const data = await window.contract.methods.buyerChecker(account).call();
    
    if(data){
        document.location.href = 'buy_product.html';
    }else{
        alert("Only buyer can access the section!!!");
    }
    console.log(data)

}

async function shopIdentity(){

    const data = await window.contract.methods.shopChecker(account).call();
    
    if(data){
        document.location.href = 'my_shop.html';
    }else{
        alert("Only shop owner can access the section!!!");
    }
    console.log(data)

}

async function ownerIdentity(){

    const data = await window.contract.methods.checkIsOwner(account).call();
    
    if(data){
        document.location.href = 'validateParticipant.html';
    }else{
        alert("Only Owner can access the section!!!");
    }
    console.log(data)

}
