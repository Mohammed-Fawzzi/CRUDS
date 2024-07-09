const title = document.querySelector('#title');
const price = document.querySelector('#price');
const taxes = document.querySelector('#taxes');
const ads = document.querySelector('#ads');
const discount = document.querySelector('#discount');
const total = document.querySelector('#total');
const count = document.querySelector('#count');
const category = document.querySelector('#category');
const submitBtn = document.querySelector('#submit');
const deleteAll = document.querySelector('#deleteAll');
const searchInput = document.querySelector('#search');
const searchTitle = document.querySelector('#searchTitle');
const categoryTitle = document.querySelector('#categoryTitle');
const tBody = document.querySelector('#tBody');
let productArr = [];
let globalIndex;
let searchMood = 'Title';

// Negative numbers are not allowed 
document.querySelectorAll('input[type="number"]').forEach(function(ele) {
    ele.addEventListener('input', (e) => {
        if (e.target.value < 0) {
            e.target.value = '';
        }
    });
});

// Check in Local Storage Data
if(localStorage.getItem("products") != null) {
    productArr = JSON.parse(localStorage.getItem("products"))
}else {
    productArr = [];
}

// Create Products
submitBtn.onclick = function() {
    if(titleValidate() && categoryValidate()){
    let productData = {
        title : title.value.toLowerCase(),
        price : price.value,
        taxes : taxes.value,
        ads : ads.value,
        discount : discount.value,
        total : total.innerHTML,
        count : count.value,
        category : category.value.toLowerCase(),
    }
        if(submitBtn.innerHTML == "Create Product") {
            if(productData.count > 1) {
                for(i = 0; i < productData.count; i++) {
                    productArr.push(productData);
                }
            }else {
                productArr.push(productData);
            }
        }else {
            productArr[globalIndex] = productData;
            count.style.display = "block";
            submitBtn.innerHTML = "Create Product";
        }
        localStorage.setItem("products",JSON.stringify(productArr));
        displayProduct(productArr);
        clearData();
        getTotal();
        // Regex Styling
        title.style.outline = 'none';
        title.nextElementSibling.style.display = "none";
        category.style.outline = 'none';
        category.nextElementSibling.style.display = "none";
    }else {
        notMatch();
    }
}

// Display products
function displayProduct(arr) {
    let box = ``;
    for(i = 0; i < arr.length; i++) {
        box += `
        <tr>
            <td>[${i + 1}]</td>
            <td>${arr[i].title}</td>
            <td>${arr[i].price}</td>
            <td>${arr[i].taxes}</td>
            <td>${arr[i].ads}</td>
            <td>${arr[i].discount}</td>
            <td>${arr[i].total}</td>
            <td>${arr[i].category}</td>
            <td><button id="updateBtn" onclick="updateProduct(${i})"><i class="fa-regular fa-pen-to-square"></i> Update</button></td>
            <td><button id="deleteBtn" onclick="deleteProduct(${i})"><i class="fa-solid fa-trash-can"></i> Delete</button></td>
        </tr>
        `;
    }
    tBody.innerHTML = box;
    if(productArr.length > 0 ) {
        deleteAll.innerHTML = `<button class="deleteAll" onclick="deleteAllProducts()">Delete All [${productArr.length}]</button>`
    }else {
        deleteAll.innerHTML = '';
    }
}
displayProduct(productArr);

// Get Total Price Of Product
function getTotal() {
    if(price.value !='') {
        let result = (+price.value + +taxes.value + +ads.value) - (+discount.value) 
        total.innerHTML = result;
        total.style.background = "#ffc107";
        total.style.color = "#000";
    }else {
        total.innerHTML = '';
        total.style.background = "#dc3545";
        total.style.color = "#fff";
    }
}

// Clear Inputs After Create Product
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    discount.innerHTML = '';
    count.value = '';
    category.value = '';
}

// Delete Products
function deleteProduct(deleteIndex) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "custom-confirmButton",
          cancelButton: "custom-cancelButton"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete it!",
        cancelButtonText: "No, Cancel!",
        reverseButtons: false
      }).then((result) => {
        if (result.isConfirmed) {
            productArr.splice(deleteIndex , 1);
            displayProduct(productArr);
            localStorage.setItem("products" , JSON.stringify(productArr));
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your Product has been deleted.",
            icon: "success"
          });
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your Product file is safe :)",
            icon: "error"
          });
        }
      });
}

// Delete All products
function deleteAllProducts() {
    localStorage.clear();
    productArr.splice(0);
    displayProduct(productArr);
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "All Products has been Deleted",
        showConfirmButton: false,
        timer: 1500
    });
}

// Update Products
function updateProduct(updateIndex) {
    title.value = productArr[updateIndex].title;
    price.value = productArr[updateIndex].price;
    taxes.value = productArr[updateIndex].taxes;
    ads.value = productArr[updateIndex].ads;
    discount.value = productArr[updateIndex].discount;
    getTotal();
    count.style.display = "none";
    category.value = productArr[updateIndex].category;
    submitBtn.innerHTML = "Update Product";
    globalIndex = updateIndex;
    scroll({
        top : 0,
        behavior : "smooth"
    })
}

// Set Buttons To Search 
function getSearchMood(buttonId) {
    if(buttonId == "searchTitle") {
        searchMood = "Title"
    }else {
        searchMood = "Category"
    }
    searchInput.focus();
    searchInput.placeholder = `Search By ${searchMood}`;
}

// Search In Products With Title and Category 
function searchProduct(term) {
    let SearchedArr = [];
    for(i = 0; i < productArr.length; i++){
        if(searchMood == "Title") {
            if(productArr[i].title.includes(term.toLowerCase())) {
                SearchedArr.push(productArr[i]);
            }
        }else {
            if(productArr[i].category.includes(term.toLowerCase())) {
                SearchedArr.push(productArr[i]);
            }
        }
    }
    displayProduct(SearchedArr);
}

/* Regular Expression */

// Title Regex
function titleValidate() {
    let titleRegex = /^[a-zA-Z]{3}[a-zA-Z0-9\s!@#$%^&*()-=_+{}\[\]:;"'<>,.?\/]{0,}$/;
    return titleRegex.test(title.value);
}
// Category Regex
function categoryValidate() {
    let categoryRegex = /^[a-zA-Z]{2}[a-zA-Z0-9\s!@#$%^&*()-=_+{}\[\]:;"'<>,.?\/]{0,}$/;
    return categoryRegex.test(category.value);
}
// Not Match Function 
function notMatch() {
    if (!titleValidate()) {
        title.style.outline = '2.5px solid #653383';
        title.nextElementSibling.style.display = "block";
    } else {
        title.style.outline = 'none';
        title.nextElementSibling.style.display = "none";
    }

    if (!categoryValidate()) {
        category.style.outline = '2.5px solid #653383';
        category.nextElementSibling.style.display = "block";
    } else {
        category.style.outline = 'none';
        category.nextElementSibling.style.display = "none";
    }
}