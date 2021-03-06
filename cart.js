const append = document.getElementById('append');
const viewBtn = document.getElementById('view');
// const totalPrice = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout');
var db;
var db_v = 1;
var db_n ="cart";
var stote;
var index;
var total;


function submit()
{
    viewBtn.click();
    
};


openDB();
function openDB()
{
    var request = indexedDB.open(db_n , 1);
    request.onsuccess = (e) =>
    {
        db = e.target.result;
          // alert("success");
        
    }
};



viewBtn.addEventListener('click', (ev ) => {
    // console.log(db);

    if (db instanceof IDBDatabase) {
        const tx = db.transaction(db_n, 'readwrite');
        const cart_products = tx.objectStore(db_n);  
        
        // viewDiv.innerHTML="";

        cart_products.getAll().onsuccess = (ev)=>{
            console.log(ev.target.result);
            const result = ev.target.result;
            result.forEach(el => {

                const xml = new XMLHttpRequest();


                    xml.open('GET', 'https://afternoon-falls-30227.herokuapp.com/api/v1/products/'+el.pId);
                    xml.send();



                    xml.onload = () =>
                    {
                        console.log('onload');
                        console.log(xml.status);
                        if(xml.status === 200)
                        {
                            console.log(typeof(xml.response));
                            var json = JSON.parse(xml.response);
                            console.log(json);
                            console.log(xml.response);
                        }

                        if(xml.status !== 200)
                        {
                            console.log("bad request");
                            
                        }
                        
                        var pName =json.data.ProductId;
                        var src = json.data.ProductPicUrl;
                        var pDesc =json.data.Description;
                        var pPrice = json.data.Price;
                        var pCategory = json.data.Category;
                        total = pPrice;


                        var tr = document.createElement('tr');
                        tr.setAttribute('class' , 'table-row')

                tr.innerHTML = 
                `	
                <td class="column-1">
                <div class="cart-img-product b-rad-4 o-f-hidden">
                    <img src=${src}>
                </div>
            </td>
            <td class="column-2">${pName}</td>
            <td class="column-3">${pPrice}$</td>            
            `
            // totalPrice.innerHTML= total;

            function appendAfter(el, referenceNode) {
                referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
            };
            appendAfter(tr ,append);
                    }      
            });
        }   
        viewBtn.disabled = true;     
    }
});

checkoutBtn.addEventListener('click',(ev)=>{
    // IDBObjectStore.clear;
    // Let us open our database
    var DBOpenRequest = window.indexedDB.open(db_n, 1);

    DBOpenRequest.onsuccess = function(event) {

        db = DBOpenRequest.result;
        clearData();

    };

function clearData() {
    var transaction = db.transaction(db_n, 'readwrite');

    transaction.onerror = function(event) {
        console.log("Error occured");
    };
    var objectStore = transaction.objectStore(db_n);
    var objectStoreRequest = objectStore.clear();

    objectStoreRequest.onsuccess = function(event) {
        console.log("success");
    };
};
    alert('Your order will be delievered to your address\nThank you for visiting our website');
});

