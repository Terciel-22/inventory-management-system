lastQuantity = 0;
lastItemNumber = 0;

$(document).ready(function(){
    $("#purchase-item-number").on("focus", getItemNumbers); //Show itemnumber auto complete
    $("#purchase-item-number").on("input change focusout", getPurchaseItemData);
    $("#purchase-form").on("change click input mouseleave", getTotalCost);
    getAllVendorNames(); //For select vendor option

    //CRUD
    $("#purchase-id").on("focus",getPurchaseIDs ); //For auto-complete
    $("#purchase-id").on("input change focusout", getPurchaseData);
    $("#purchase-add-button").on("click", addPurchase);
    $("#purchase-update-button").on("click", () => updatePurchase(lastQuantity,lastItemNumber));
    $("#purchase-clear-button").on("click", ()=>{
        $("#purchase-item-number").val("");
        $("#purchase-id").val("");
        purchaseFormSetToDefault(true);
    });
});

function getTotalCost()
{
    let itemQuantity = $("#purchase-item-quantity").val();
    let unitPrice = $("#purchase-unit-price").val();
    let totalCost = itemQuantity * unitPrice;
    $("#purchase-total-cost").val(totalCost);
}

function getAllVendorNames() 
{
    let vendors = [];
    let sortedVendors = [];
    
    function getVendorNamesFromDB(){
        return $.ajax({
            method: "POST",
            url: "class/vendor.php",
            dataType: "JSON",
            data: {
                getAllVendorNames:true
            },
            success: function(results)
            {
                for(let i=0; i<results.length; i++)
                {
                    tempArr = [results[i]["fullName"],results[i]["vendorID"]];
                    vendors.push(tempArr);
                }
            }
        });
    }

    $.when(getVendorNamesFromDB()).done(()=>{
        sortedVendors = vendors.sort();

        let options = `<option value="" selected hidden>-Select Vendor-</option>`;
        for(let i=0;i<sortedVendors.length;i++)
        {
            options += `<option value="${sortedVendors[i][0]}|${sortedVendors[i][1]}">${sortedVendors[i][0]}</option>`;
        }
        $("#purchase-vendor-name").prop("disabled",false);
        $("#purchase-vendor-name").html(options);
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
                    purchaseFormSetToDefault(true);
                }
            }
        });
    } else 
    {
        purchaseFormSetToDefault(true);
    }
}

//CRUD
function getPurchaseIDs()
{

    let purchaseIDs = [];
    function getPurchaseIDsFromDB()
    {
        return $.ajax({
            method: "POST",
            url: "class/purchase.php",
            dataType: "JSON",
            data: {getPurchaseIDs:true},
            success: function(result)
            {
                let values = Object.values(result);
                for(let i=0; i<values.length; i++)
                {
                    purchaseIDs.push(String(values[i].purchaseID));
                }
            }
        });
    }
    
    $.when(getPurchaseIDsFromDB()).done(()=>{
        //For item form
        $( "#purchase-id" ).autocomplete({
            source: purchaseIDs
        });
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
                    lastItemNumber = purchaseData["itemNumber"];
                    $("#purchase-date").val(purchaseData["purchaseDate"]);
                    $("#purchase-item-name").val(purchaseData["itemName"]);
                    $("#purchase-current-stock").val(purchaseData["stock"]);
                    $("#purchase-vendor-name").val(`${purchaseData["vendorName"]}|${purchaseData["vendorID"]}`);
                    lastQuantity = purchaseData["quantity"];
                    $("#purchase-item-quantity").val(purchaseData["quantity"]);
                    $("#purchase-unit-price").val(purchaseData["unitPrice"]);
                    $("#purchase-update-button").prop("disabled",false);
                } else
                {
                    $("#purchase-item-number").val("");
                    $("#purchase-update-button").prop("disabled",true);
                    purchaseFormSetToDefault(true);
                }
            }
        });
    }else
    {
        purchaseFormSetToDefault(true);
    }
}

function addPurchase()
{
    $("#purchase-id").val("");
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
                purchaseFormSetToDefault(false);
                getPurchaseData();
            }
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#purchaseform-errmessage").html(message);
        }
    });
}

function updatePurchase(lastQuantity,lastItemNumber)
{
    const purchaseForm = $("#purchase-form");
    const purchaseFormURL = purchaseForm.attr("action");
    const purchaseFormData = purchaseForm.serializeArray();
    purchaseFormData.push({name: "purchase-last-quantity", value: lastQuantity});
    purchaseFormData.push({name: "purchase-last-item-number", value: lastItemNumber});
    purchaseFormData.push({name: "purchase-update-submitted", value: "true"});
    $.ajax({
        method: "POST",
        url: purchaseFormURL,
        data: purchaseFormData,
        success: function (result) {
            if(result == "Successfully Updated!")
            {
                purchaseFormSetToDefault(false);
                getPurchaseData();
            }
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#purchaseform-errmessage").html(message);
        }
    }); 
}

function purchaseFormSetToDefault(deleteMessage)
{
    if(deleteMessage)
    {
        message = "";
        $("#purchaseform-errmessage").html(message);
    }

    $("#purchase-date").val("");
    $("#purchase-item-name").val("");
    $("#purchase-current-stock").val("");
    $("#purchase-vendor-name").val("");
    $("#purchase-item-quantity").val("0");
    $("#purchase-unit-price").val("0");
    $("#purchase-total-cost").val("0"); 
}