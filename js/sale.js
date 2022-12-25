saleLastItemQuantity = 0;

$(document).ready(function(){
    $("#sale-form").on("change click input mouseleave", getSaleTotalCost);
    $("#sale-item-number").on("focus", getItemNumbers); //Show itemnumber auto complete
    $("#sale-item-number").on("input change focusout", getSaleItemData);
    $("#sale-customer-id").on("focus", getCustomerIDs); //Show itemnumber auto complete
    $("#sale-customer-id").on("input change focusout", getSaleCustomerData);
    
    //CRUD
    $("#sale-id").on("focus",getSaleIDs ); //For auto-complete
    $("#sale-id").on("input change focusout", getSaleData);
    $("#sale-add-button").on("click", addSale);
    $("#sale-update-button").on("click", () => updateSale(saleLastItemQuantity));
    $("#sale-delete-button").on('click', deleteSale);
    $("#sale-clear-button").on("click", ()=>{
        $("#sale-id").val("");
        $("#sale-customer-id").val("");
        $("#sale-item-number").val("");
        saleFormSetToDefault(true,true);
    });
});

function getSaleTotalCost()
{
    let discount = $("#sale-item-discount").val();
    let itemQuantity = $("#sale-item-quantity").val();
    let unitPrice = $("#sale-item-unit-price").val();
    let totalCost = itemQuantity * unitPrice;
    let discountedCost = totalCost - (totalCost * discount / 100)
    $("#sale-total-cost").val(discountedCost);
}

function getSaleItemData()
{
    const itemNumber = $("#sale-item-number").val();
    if(itemNumber != "")
    {
        $.ajax({
            method: "POST",
            url: "class/item.php",
            dataType: "JSON",
            data: {
                getItemData:true,
                itemNumber:itemNumber
            },
            success: function(result)
            {
                if(result != "404")
                {
                    //Decode Data
                    let $decodedSaleItemName = he.decode(result.itemName);
                    let $decodedImageURL = he.decode(result.imageURL);
                    $("#sale-item-name").val($decodedSaleItemName);
                    $("#sale-total-stock").val(result.stock);
                    $("#sale-item-discount").val(result.discount);
                    $("#sale-item-unit-price").val(result.unitPrice);

                    //sale-image-display
                    let imgsrc = "";
                    if($decodedImageURL !="imageNotAvailable.jpg")
                    {
                        imgsrc = "img/item_images/"+result.itemNumber +"/"+$decodedImageURL;
                    } else
                    {
                        imgsrc = "img/item_images/"+$decodedImageURL;
                    }
                    $("#sale-image-display").attr("src",imgsrc);
                } else
                {
                    saleFormSetToDefault(true,false);
                }
            }
        });
    } else 
    {
        saleFormSetToDefault(true,false);
    }
}

function getSaleCustomerData()
{
    const customerID = $("#sale-customer-id").val();
    if(customerID != "")
    {
        $.ajax({
            method: "POST",
            url: "class/customer.php",
            dataType: "JSON",
            data: {
                getCustomerData:true,
                customerID:customerID
            },
            success: function(result)
            {
                if(result != "404")
                {
                    //Decode data
                    let decodedSaleCustomerName = he.decode(result.fullName);
                    $("#sale-customer-name").val(decodedSaleCustomerName);
                } else
                {
                    $("#sale-customer-name").val("");
                }
            }
        });
    }else
    {
        $("#sale-customer-name").val("");
    }
}

//CRUD
function getSaleIDs()
{
    let saleIDs = [];

    function getSaleIDsFromDB()
    {
        return $.ajax({
            method: "POST",
            url: "class/sale.php",
            dataType: "JSON",
            data: {getSaleRecords:true},
            success: function(results)
            {
                for(let i=0; i<results.length; i++)
                {
                    saleIDs.push(String(results[i].saleID));
                }
            }
        });
    }
    
    $.when(getSaleIDsFromDB()).done(()=>{
        //For sale form
        $( "#sale-id" ).autocomplete({
            source: saleIDs
        });
    });
}

function getSaleData()
{
    const saleID = $("#sale-id").val();
    if(saleID != "")
    {
        $.ajax({
            method: "POST",
            url: "class/sale.php",
            dataType: "JSON",
            data: {
                getSaleData:true,
                saleID:saleID
            },
            success: function(result)
            {
                if(result != "404")
                {
                    let saleData = result[0];
                    
                    //Decode data
                    let decodedCustomerName = he.decode(result.customerName);
                    let decodedItemName = he.decode(result.itemName);
                    let decodedImageURL = he.decode(result.imageURL);

                    $("#sale-date").val(result.saleDate);
                    $("#sale-customer-id").val(result.customerID);
                    $("#sale-customer-name").val(decodedCustomerName);
                    $("#sale-item-number").val(result.itemNumber);
                    $("#sale-item-name").val(decodedItemName);

                    $("#sale-total-stock").val(result.stock);
                    $("#sale-item-discount").val(result.discount);
                    $("#sale-item-quantity").val(result.quantity);
                    saleLastItemQuantity = result.quantity;
                    $("#sale-item-unit-price").val(result.unitPrice);

                    $("#sale-item-number").prop("readonly",true);
                    $("#sale-customer-id").prop("readonly",true);

                    //sale-image-display
                    let imgsrc = "";
                    if(decodedImageURL != "imageNotAvailable.jpg")
                    {
                        imgsrc = "img/item_images/"+result.itemNumber+"/"+decodedImageURL;
                    } else
                    {
                        imgsrc = "img/item_images/"+decodedImageURL;
                    }
                    $("#sale-image-display").attr("src",imgsrc);

                    $("#sale-update-button").prop("disabled",false);
                    $("#sale-delete-button").prop("disabled",false);
                } else
                {
                    $("#sale-item-number").val("");
                    $("#sale-customer-id").val("");

                    $("#sale-item-number").prop("readonly",false);
                    $("#sale-customer-id").prop("readonly",false);

                    $("#sale-update-button").prop("disabled",true);
                    $("#sale-delete-button").prop("disabled",true);
                    saleFormSetToDefault(true,true);
                }
                getSaleTotalCost();
            }
        });
    }else
    {
        saleFormSetToDefault(true,true);
    }
}

function addSale()
{
    $("#sale-id").val("");
    const saleForm = $("#sale-form");
    const saleFormURL = saleForm.attr("action");
    const saleFormData = saleForm.serializeArray();
    saleFormData.push({name: "sale-add-submitted", value: "true"});
    $.ajax({
        method: "POST",
        url: saleFormURL,
        data: saleFormData,
        success: function (result) {
            if(result == "Successfully added!")
            {
                getSaleItemData();
            }
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#saleform-errmessage").html(message);
        }
    });
}
 
function updateSale(saleLastItemQuantity)
{
    const saleForm = $("#sale-form");
    const saleFormURL = saleForm.attr("action");
    const saleFormData = saleForm.serializeArray();
    saleFormData.push({name: "sale-last-item-quantity", value: saleLastItemQuantity});
    saleFormData.push({name: "sale-update-submitted", value: "true"});
    $.ajax({
        method: "POST",
        url: saleFormURL,
        data: saleFormData,
        success: function (result) {
            if(result == "Successfully Updated!")
            {
                saleFormSetToDefault(false,false);
                getSaleData();
            }
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#saleform-errmessage").html(message);
            getSaleTotalCost();
        }
    }); 
}

function deleteSale() //Delete selected sale
{
    const saleID = $("#sale-id").val();
    
    if(confirm("Are you sure you want to delete it?"))
    {
        $.ajax({
            method: "POST",
            url: "class/sale.php",
            data: {deleteSaleID:saleID},
            success: function (result) {
                message = `<div class='alert alert-danger'>${result}</div>`;
                $("#saleform-errmessage").html(message);
                if(result=="Successfully deleted!")
                {
                    $("#sale-id").val("");
                    $("#sale-item-number").val("");
                    saleFormSetToDefault(false,true);
                }
            }
        });
    }
}

function saleFormSetToDefault(deleteMessage,customerDefault)
{
    if(deleteMessage)
    {
        message = "";
        $("#saleform-errmessage").html(message);
    }

    if(customerDefault)
    {
        $("#sale-customer-id").val("");
        $("#sale-customer-name").val("");
    }
    
    let imgsrc = "img/item_images/imageNotAvailable.jpg";
    $("#sale-image-display").attr("src",imgsrc);

    $("#sale-date").val("");
    $("#sale-item-name").val("");
    

    $("#sale-total-stock").val(""); 
    $("#sale-item-discount").val("0");
    $("#sale-item-quantity").val("0");
    $("#sale-item-unit-price").val("0");
    $("#sale-total-cost").val("0"); 

    $("#sale-item-number").prop("readonly",false);
    $("#sale-customer-id").prop("readonly",false);

    $("#sale-update-button").prop("disabled",true);
    $("#sale-delete-button").prop("disabled",true);
}