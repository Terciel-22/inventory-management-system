lastQuantity = 0;

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
    $("#sale-update-button").on("click", () => updateSale(lastQuantity));
    $("#sale-clear-button").on("click", ()=>{
        $("#sale-id").val("");
        $("#sale-customer-id").val("");
        $("#sale-item-number").val("");
        saleFormSetToDefault(true);
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
                    let itemData = result[0];
                    $("#sale-item-name").val(itemData["itemName"]);
                    $("#sale-total-stock").val(itemData["stock"]);
                    $("#sale-item-discount").val(itemData["discount"]);
                    $("#sale-item-unit-price").val(itemData["unitPrice"]);

                    //sale-image-display
                    let imgsrc = "";
                    if(itemData['imageURL']!="imageNotAvailable.jpg")
                    {
                        imgsrc = "img/item_images/"+itemData["itemNumber"]+"/"+itemData['imageURL'];
                    } else
                    {
                        imgsrc = "img/item_images/"+itemData['imageURL'];
                    }
                    $("#sale-image-display").attr("src",imgsrc);
                } else
                {
                    $("#sale-customer-id").val("");
                    saleFormSetToDefault(true);
                }
            }
        });
    } else 
    {
        $("#sale-customer-id").val("");
        saleFormSetToDefault(true);
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
                    let customerData = result[0];
                    
                    $("#sale-customer-name").val(customerData["fullName"]);
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
            data: {getSaleIDs:true},
            success: function(result)
            {
                let values = Object.values(result);
                for(let i=0; i<values.length; i++)
                {
                    saleIDs.push(String(values[i].saleID));
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
    
                    $("#sale-date").val(saleData["saleDate"]);
                    $("#sale-customer-id").val(saleData["customerID"]);
                    $("#sale-customer-name").val(saleData["customerName"]);
                    $("#sale-item-number").val(saleData["itemNumber"]);
                    $("#sale-item-name").val(saleData["itemName"]);

                    $("#sale-total-stock").val(saleData["stock"]);
                    $("#sale-item-discount").val(saleData["discount"]);
                    $("#sale-item-quantity").val(saleData["quantity"]);
                    lastQuantity = saleData["quantity"];
                    $("#sale-item-unit-price").val(saleData["unitPrice"]);

                    $("#sale-item-number").prop("readonly",true);
                    $("#sale-customer-id").prop("readonly",true);

                    //sale-image-display
                    let imgsrc = "";
                    if(saleData['imageURL']!="imageNotAvailable.jpg")
                    {
                        imgsrc = "img/item_images/"+saleData["itemNumber"]+"/"+saleData['imageURL'];
                    } else
                    {
                        imgsrc = "img/item_images/"+saleData['imageURL'];
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
                    saleFormSetToDefault(true);
                }
            }
        });
    }else
    {
        saleFormSetToDefault(true);
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

// function updateSale(lastQuantity,lastItemNumber)
// {
//     const saleForm = $("#sale-form");
//     const saleFormURL = saleForm.attr("action");
//     const saleFormData = saleForm.serializeArray();
//     saleFormData.push({name: "sale-last-quantity", value: lastQuantity});
//     saleFormData.push({name: "sale-last-item-number", value: lastItemNumber});
//     saleFormData.push({name: "sale-update-submitted", value: "true"});
//     $.ajax({
//         method: "POST",
//         url: saleFormURL,
//         data: saleFormData,
//         success: function (result) {
//             if(result == "Successfully Updated!")
//             {
//                 saleFormSetToDefault(false);
//                 getSaleData();
//             }
//             message = `<div class='alert alert-danger'>${result}</div>`;
//             $("#saleform-errmessage").html(message);
//         }
//     }); 
// }

function saleFormSetToDefault(deleteMessage)
{
    if(deleteMessage)
    {
        message = "";
        $("#saleform-errmessage").html(message);
    }

    let imgsrc = "img/item_images/imageNotAvailable.jpg";
    $("#sale-image-display").attr("src",imgsrc);

    $("#sale-date").val("");
    $("#sale-item-name").val("");
    $("#sale-customer-name").val("");

    $("#sale-total-stock").val("0"); 
    $("#sale-item-discount").val("0");
    $("#sale-item-quantity").val("0");
    $("#sale-item-unit-price").val("0");
    $("#sale-total-cost").val("0"); 

    $("#sale-item-number").prop("readonly",false);
    $("#sale-customer-id").prop("readonly",false);

    $("#sale-update-button").prop("disabled",true);
    $("#sale-delete-button").prop("disabled",true);
}