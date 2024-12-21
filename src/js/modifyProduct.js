
async function displayModifyData(){
    let selectElement = document.getElementById("prod-cate");
    const url = window.location.search;
    const url_params = new URLSearchParams(url);
    const productName = url_params.get('productName');
    const data = await window.contract.methods.getProductDetails(productName).call({ from: account });
    console.log(data);
    const PCategory = data[1];
    document.getElementById("prod-name").value = data[0];
    
    // Set the value of the selected attribute to the desired category
    // selectElement.setAttribute("value", PCategory);
    
    // Find the option element corresponding to the selected category
    const options = selectElement.options;
    for (let i = 0; i < options.length; i++) {
        
        if (options[i].value === PCategory) {
            // Set the selected option to the one matching the category
            
            options[i].selected = true;
        }
        else{
            options[i].selected = false;
        }
    }
    
    document.getElementById("prod-des").value = data[2];
    document.getElementById("prod-price").value = data[3];
    document.getElementById("prod-stock").value = data[4];


}

async function modifyProductDetails(){
    const url = window.location.search;
    const url_params = new URLSearchParams(url);
    const productName = url_params.get('productName');


    const NewName = document.getElementById("prod-name").value;

    const selectElement = document.getElementById("prod-cate");
    // const selectionCategory = selectElement.value; // Get the value of the selected option
    const selectedIndex = selectElement.selectedIndex; // Get the index of the selected option
    const NewCategoryText = selectElement.options[selectedIndex].text; // Get the text of the selected option

    const NewProductDescription = document.getElementById("prod-des").value;
    const NewProductPrice = document.getElementById("prod-price").value;
    const NewStock = document.getElementById("prod-stock").value;



    await window.contract.methods.modifyProductDetails(productName,NewName,NewProductPrice,NewStock,NewProductDescription,NewCategoryText).send({ from: account });
    window.location.href = "my_shop.html"
    alert("Modify Successfully");

}

//product_details.html?productName=hotdog