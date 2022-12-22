$(document).ready(function() {
    $("#item-number").on("input change focusout", ()=>{
        message = "";
        $("#itemform-errmessage").html(message);
        getItemData();
    });
    $("#item-number").on("focus", getItemNumbers);
    $("#item-image").on("change", changeImageDisplay);

    //CRUD
    $("#item-add-button").on('click', addItem);
    $("#item-update-button").on('click', updateItem);
    $("#item-delete-button").on('click', deleteItem);
    $("#item-clear-button").on('click', () => {
        $("#item-number").val("");
        itemFormSetToDefault(true);
    });
});

function changeImageDisplay() //Change image display after uploading on input[type=file]
{
    const [imgInputFile] = $("#item-image")[0].files;
    if(imgInputFile)
    {
        $("#item-image-display").attr("src",URL.createObjectURL(imgInputFile));
    }
}

//CRUD
function getItemData() //Supply data to the fields after selecting item number
{
    const itemNumber = $("#item-number").val();
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
                    $("#item-product-id").val(itemData["productID"]);
                    $("#item-name").val(itemData["itemName"]);
                    $("#item-status").val(itemData["status"]);
                    $("#item-description").val(itemData["description"]);
                    $("#item-discount").val(itemData["discount"]);
                    $("#item-unit-price").val(itemData["unitPrice"]);
                    $("#item-total-stock").val(itemData["stock"]);

                    //image
                    $("#item-image").val("");
                    if(itemData['imageURL']!="imageNotAvailable.jpg")
                    {
                        imgsrc = "img/item_images/"+itemData["itemNumber"]+"/"+itemData['imageURL'];
                    } else
                    {
                        imgsrc = "img/item_images/"+itemData['imageURL'];
                    }
                    
                    $("#item-image-filename").val(itemData["imageURL"]);
                    $("#item-image-display").attr("src",imgsrc);
                    $("#item-update-button").prop("disabled",false);
                    $("#item-delete-button").prop("disabled",false);
                } else
                {

                    itemFormSetToDefault(true);
                    $("#item-update-button").prop("disabled",true);
                    $("#item-delete-button").prop("disabled",true);
                }
            }
        });
    } else 
    {
        itemFormSetToDefault(true);
    }
}

function addItem() //Add new item
{ 
    const itemForm = $("#item-form");
    const itemFormURL = itemForm.attr("action");
    const itemFormData = new FormData(itemForm[0]);
    itemFormData.append("item-add-submitted","true");
    $.ajax({
        method: "POST",
        url: itemFormURL,
        data: itemFormData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (result) {
            if(result == "Successfully added!")
            {
                itemFormSetToDefault(false);
                getItemData();
            }
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#itemform-errmessage").html(message);
        }
    });
}

function updateItem() //Update selected item
{
    const itemForm = $("#item-form");
    const itemFormURL = itemForm.attr("action");
    const itemFormData = new FormData(itemForm[0]);
    itemFormData.append("item-update-submitted","true");
    $.ajax({
        method: "POST",
        url: itemFormURL,
        data: itemFormData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (result) {
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#itemform-errmessage").html(message);
            if(result=="Successfully updated!")
            {
                itemFormSetToDefault(false);
                getItemData();
            }
        }
    });
}

function deleteItem() //Delete selected item
{
    const itemProductID = $("#item-product-id").val();
    
    if(confirm("Are you sure you want to delete it?"))
    {
        $.ajax({
            method: "POST",
            url: "class/item.php",
            data: {deleteItemProductID:itemProductID},
            success: function (result) {
                message = `<div class='alert alert-danger'>${result}</div>`;
                $("#itemform-errmessage").html(message);
                if(result=="Successfully deleted!")
                {
                    $("#item-number").val("");
                    itemFormSetToDefault(false);
                }
            }
        });
    }
}

function itemFormSetToDefault(deleteMessage) //Set all field to default
{
    if(deleteMessage)
    {
        message = "";
        $("#itemform-errmessage").html(message);
    }

    $("#item-product-id").val("");
    $("#item-name").val("");
    $("#item-status").val("");
    $("#item-description").val("");
    $("#item-discount").val("0");
    $("#item-quantity").val("0");
    $("#item-unit-price").val("0");
    $("#item-total-stock").val("");

    //image
    $("#item-image").val("");
    $("#item-image-filename").val("");
    let imgsrc = "img/item_images/imageNotAvailable.jpg";
    $("#item-image-display").attr("src",imgsrc);
}