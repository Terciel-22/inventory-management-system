$( document ).ready(function() {
    getItemNumbers();
    $("#item-number").on("input change", getItemNumberData);
    $("#item-image").on("change", changeImageDisplay);
    $("#item-add-button").on('click', addItem);
    $("#item-update-button").on('click', updateItem);
    $("#item-delete-button").on('click', deleteItem);
    $("#item-clear-button").on('click', itemFormSetToDefault);
});

function addItem() 
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
            message = `<div class='alert alert-secondary'>${result}</div>`;
            $("#itemform-errmessage").html(message);
        }
    });
}

function updateItem()
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
            message = `<div class='alert alert-secondary'>${result}</div>`;
            $("#itemform-errmessage").html(message);
        }
    });
}

function deleteItem()
{
    const itemProductID = $("#item-product-id").val();
    if(itemProductID != "")
    {
        message = "";
        $("#itemform-errmessage").html(message);
        if(confirm("Are you sure you want to delete it?"))
        {
            $.ajax({
                method: "POST",
                url: "class/item.php",
                data: {deleteItemProductID:itemProductID},
                success: function (result) {
                    message = `<div class='alert alert-secondary'>${result}</div>`;
                    $("#itemform-errmessage").html(message);
                }
            });
        }
    } else
    {
        message = `<div class='alert alert-secondary'>You didn't select item to be deleted.</div>`;
        $("#itemform-errmessage").html(message);
    }
}

function getItemNumbers() //Needed for auto-complete suggestions
{
    $.ajax({
        method: "POST",
        url: "class/item.php",
        dataType: "JSON",
        data: {getItemNumbers:true},
        success: function(result)
        {
            let values = Object.values(result);
            let itemNumbers = [];
            for(let i=0; i<values.length; i++)
            {
                itemNumbers.push(values[i].itemNumber);
            }
            $( "#item-number" ).autocomplete({
                source: itemNumbers
            });
        }
    });
}

function getItemNumberData() //Supply data to the fields after selecting item number
{
    const itemNumber = $("#item-number").val();
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
                    $("#item-product-id").val(itemData['productID']);
                    $("#item-name").val(itemData['itemName']);
                    $("#item-status").val(itemData['status']);
                    $("#item-description").val(itemData['description']);
                    $("#item-discount").val(itemData['discount']);
                    $("#item-unit-price").val(itemData['unitPrice']);
                    $("#item-total-stock").val(itemData['stock']);

                    //image
                    $("#item-image").val("");
                    let imgsrc = "img/item_images/"+itemData['itemNumber']+"/"+itemData['imageURL'];
                    $("#item-image-filename").val(itemData['imageURL']);
                    $("#item-image-display").attr("src",imgsrc);
                } else
                {
                    itemFormSetToDefault();
                }
            }
        });
    } else 
    {
        itemFormSetToDefault();
    }
}

function changeImageDisplay() //Change image display after uploading on input[type=file]
{
    const [imgInputFile] = $("#item-image")[0].files;
    if(imgInputFile)
    {
        $("#item-image-display").attr("src",URL.createObjectURL(imgInputFile));
    }
}

function itemFormSetToDefault() //Set all field to default
{
    message = "";
    $("#itemform-errmessage").html(message);

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