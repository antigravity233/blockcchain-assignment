async function removeProduct() {

    const url = window.location.search;
    const url_params = new URLSearchParams(url);
    const productName = url_params.get('productName');

    await window.contract.methods.removeProduct(productName).send({ from: account});
        
    alert("Product removed successfully");
}