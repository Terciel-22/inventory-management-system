$(document).ready(function(){
    getAllVendorNames();
    $("#purchase-form").on("change", getTotalCost);
    $("#purchase-item-number").on("input change", getPurchaseItemData);
    $("#purchase-add-button").on('click', addPurchase);
    $("#purchase-update-button").on('click', updatePurchase);
    $("#purchase-clear-button").on('click', purchaseFormSetToDefault);
});

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
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#purchaseform-errmessage").html(message);
        }
    });
}

function updatePurchase()
{
    
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
                getItemNumberData:true,
                itemNumber:itemNumber
            },
            success: function(result)
            {
                if(result != "404")
                {
                    let itemData = result[0];
                    $("#purchase-item-name").val(itemData['itemName']);
                    $("#purchase-current-stock").val(itemData['stock']);
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
    $("#purchase-id").val("");
    $("#purchase-item-name").val("");
    $("#purchase-current-stock").val("");
    $("#purchase-vendor-name").val("");
    $("#purchase-item-quantity").val("0");
    $("#purchase-unit-price").val("0");
    $("#purchase-total-cost").val("0");
}

