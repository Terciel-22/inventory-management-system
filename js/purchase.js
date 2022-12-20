lastQuantity = 0;

$(document).ready(function(){
    getAllVendorNames(); //For select vendor option
    getPurchaseIDs(); //For auto-complete
    $("#purchase-form").on("change click input mouseleave", getTotalCost);
    $("#purchase-item-number").on("input change", getPurchaseItemData);
    $("#purchase-id").on("input change", getPurchaseData);
    $("#purchase-add-button").on("click", addPurchase);
    $("#purchase-update-button").on("click", () => updatePurchase(lastQuantity));
    $("#purchase-clear-button").on("click", purchaseFormSetToDefault);
});

function getPurchaseIDs()
{
    $.ajax({
        method: "POST",
        url: "class/purchase.php",
        dataType: "JSON",
        data: {getPurchaseIDs:true},
        success: function(result)
        {
            let values = Object.values(result);
            let purchaseID_arr = [];
            for(let i=0; i<values.length; i++)
            {
                purchaseID_arr.push(String(values[i].purchaseID));
            }
            //For item form
            $( "#purchase-id" ).autocomplete({
                source: purchaseID_arr
            });
        }
    });
}

function getPurchaseData()
{
    const purchaseID = $("#purchase-id").val();
    if(purchaseID != "")
    {
        $.ajax({
            method: "POST",
            url: "class/purchase.php",
            dataType: "JSON",
            data: {
                getPurchaseData:true,
                purchaseID:purchaseID
            },
            success: function(result)
            {
                if(result != "404")
                {
                    let purchaseData = result[0];
    
                    $("#purchase-item-number").val(purchaseData["itemNumber"]);
                    $("#purchase-date").val(purchaseData["purchaseDate"]);
                    $("#purchase-item-name").val(purchaseData["itemName"]);
                    $("#purchase-current-stock").val(purchaseData["stock"]);
                    $("#purchase-vendor-name").val(`${purchaseData["vendorID"]}|${purchaseData["vendorName"]}`);
                    lastQuantity = purchaseData["quantity"];
                    $("#purchase-item-quantity").val(purchaseData["quantity"]);
                    $("#purchase-unit-price").val(purchaseData["unitPrice"]);
                } else
                {
                    $("#purchase-item-number").val("");
                    purchaseFormSetToDefault();
                }
            }
        });
    }else
    {
        purchaseFormSetToDefault();
    }
}

function addPurchase()
{
    const purchaseForm = $("#purchase-form");
    const purchaseFormURL = purchaseForm.attr("action");
    const purchaseFormData = purchaseForm.serializeArray();
    purchaseFormData.push({name: "purchase-add-submitted", value: "true"});
    $.ajax({
        method: "POST",
        url: purchaseFormURL,
        data: purchaseFormData,
        success: function (result) {
            if(result == "Successfully Added!")
            {
                getPurchaseData();
            }
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#purchaseform-errmessage").html(message);
        }
    });
}

function updatePurchase(lastQuantity)
{
    const purchaseForm = $("#purchase-form");
    const purchaseFormURL = purchaseForm.attr("action");
    const purchaseFormData = purchaseForm.serializeArray();
    purchaseFormData.push({name: "purchase-last-quantity", value: lastQuantity});
    purchaseFormData.push({name: "purchase-update-submitted", value: "true"});
    $.ajax({
        method: "POST",
        url: purchaseFormURL,
        data: purchaseFormData,
        success: function (result) {
            if(result == "Successfully Updated!")
            {
                getPurchaseData();
            }
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#purchaseform-errmessage").html(message);
        }
    }); 
}

function getTotalCost()
{
    let itemQuantity = $("#purchase-item-quantity").val();
    let unitPrice = $("#purchase-unit-price").val();
    let totalCost = itemQuantity * unitPrice;
    $("#purchase-total-cost").val(totalCost);
}

function getAllVendorNames() 
{
    $.ajax({
        method: "POST",
        url: "class/vendor.php",
        data: {
            getAllVendorNames:true
        },
        success: function(result)
        {
            let vendors = JSON.parse(result);
            let options = `<option value="" selected hidden>-Select Vendor-</option>`;
            
            vendors.forEach(vendor => {
                options += `<option value="${vendor.vendorID}|${vendor.fullName}">
                                ${vendor.fullName}
                            </option>`;
            });
            $("#purchase-vendor-name").html(options);
        }
    });
}

function getPurchaseItemData()
{
    const itemNumber = $("#purchase-item-number").val();
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
                    $("#purchase-item-name").val(itemData["itemName"]);
                    $("#purchase-current-stock").val(itemData["stock"]);
                } else
                {
                    purchaseFormSetToDefault();
                }
            }
        });
    } else 
    {
        purchaseFormSetToDefault();
    }
}

function purchaseFormSetToDefault()
{
    message = "";
    $("#purchaseform-errmessage").html(message);

    $("#purchase-date").val("");
    $("#purchase-item-name").val("");
    $("#purchase-current-stock").val("");
    $("#purchase-vendor-name").val("");
    $("#purchase-item-quantity").val("0");
    $("#purchase-unit-price").val("0");
    $("#purchase-total-cost").val("0"); 
}
