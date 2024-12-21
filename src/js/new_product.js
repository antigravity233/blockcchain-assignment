const addProduct = async () => {

    const productName = document.getElementById("prod-name").value
    const productCategory = document.getElementById("cat").value
    const productDescription = document.getElementById("prod-des").value
    const productPrice = document.getElementById("prod-price").value
    const productStock = document.getElementById("prod-stock").value

    valid_name = false;
    valid_des = false;
    valid_price = false;
    valid_stock = false;

    if (!(productName === ''))
        valid_name = true;
    if (!(productDescription === ''))
        valid_des = true;
    if (!(productPrice < 1))
        valid_price = true;
    if (!(productStock < 1))
        valid_stock = true;

    if (valid_name && valid_des && valid_price && valid_stock) {
        await window.contract.methods.addOnProduct(
            productName, 
            productPrice, 
            productStock,  
            productDescription, 
            productCategory).send({ from: account});
            
        alert("Add product successfully");
    }
    else {
        let err = '';
        if (!valid_name)
            err += 'Name cannot be empty.\n';
        if (!valid_des)
            err += 'Description cannot be empty.\n';
        if (!valid_price)
            err += 'Price cannot be zero.\n';
        if (!valid_stock)
            err += 'Stock cannot be zero.\n';

        alert(err);
    }
    
}