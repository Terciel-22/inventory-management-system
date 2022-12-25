purchaseLastItemQuantity = 0;

$(document).ready(function(){
    $("#purchase-item-number").on("focus", getItemNumbers); //Show itemnumber auto complete
    $("#purchase-item-number").on("input change focusout", getPurchaseItemData);
    $("#purchase-form").on("change click input mouseleave", getPurchaseTotalCost);
    getAllVendorNames();
    
    //CRUD
    $("#purchase-id").on("focus",getPurchaseIDs ); //For auto-complete
    $("#purchase-id").on("input change focusout", getPurchaseData);
    $("#purchase-add-button").on("click", addPurchase);
    $("#purchase-update-button").on("click", () => updatePurchase(purchaseLastItemQuantity));
    $("#purchase-clear-button").on("click", ()=>{
        $("#purchase-id").val("");
        $("#purchase-item-number").val("");
        purchaseFormSetToDefault(true);
    });
});

function getPurchaseTotalCost()
{
    let itemQuantity = $("#purchase-item-quantity").val();
    let unitPrice = $("#purchase-item-unit-price").val();
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
                getVendorRecords:true
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
            let decodedVendorName = he.decode(sortedVendors[i][0]);
            options += `<option value="${decodedVendorName}|${sortedVendors[i][1]}">${decodedVendorName}</option>`;
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

                    //Decode Data
                    let decodedPurchaseItemName = he.decode(itemData["itemName"]);
                    $("#purchase-item-name").val(decodedPurchaseItemName);
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
            data: {getPurchaseRecords:true},
            success: function(results)
            {
                for(let i=0; i<results.length; i++)
                {
                    purchaseIDs.push(String(results[i].purchaseID));
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
                    
                    //Decode data 
                    let decodedItemName = he.decode(purchaseData["itemName"]);
                    let decodedVendorName = he.decode(purchaseData["vendorName"]);

                    $("#purchase-item-number").prop("readonly",true);
                    $("#purchase-item-number").val(purchaseData["itemNumber"]);
                    $("#purchase-date").val(purchaseData["purchaseDate"]);
                    $("#purchase-item-name").val(decodedItemName);
                    $("#purchase-current-stock").val(purchaseData["stock"]);
                    $("#purchase-vendor-name").val(`${decodedVendorName}|${purchaseData["vendorID"]}`);
                    purchaseLastItemQuantity = purchaseData["quantity"];
                    $("#purchase-item-quantity").val(purchaseData["quantity"]);
                    $("#purchase-item-unit-price").val(purchaseData["unitPrice"]);
                    $("#purchase-update-button").prop("disabled",false);
                } else
                {
                    $("#purchase-item-number").val("");
                    $("#purchase-item-number").prop("readonly",false);
                    $("#purchase-update-button").prop("disabled",true);
                    purchaseFormSetToDefault(true);
                }
                getPurchaseTotalCost();
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
            if(result == "Successfully added!")
            {
                getPurchaseItemData();
            }
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#purchaseform-errmessage").html(message);
        }
    });
}

function updatePurchase(purchaseLastItemQuantity)
{
    const purchaseForm = $("#purchase-form");
    const purchaseFormURL = purchaseForm.attr("action");
    const purchaseFormData = purchaseForm.serializeArray();
    purchaseFormData.push({name: "purchase-last-item-quantity", value: purchaseLastItemQuantity});
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
            getPurchaseTotalCost();
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
    $("#purchase-item-unit-price").val("0");
    $("#purchase-total-cost").val("0"); 

    $("#purchase-item-number").prop("readonly",false);

    $("#purchase-update-button").prop("disabled",true);
}