$( document ).ready(function() {

    //Logout button
    $("#logout-button").on("click", logoutAccount);

    /* --- Item container events start --- */
    $("#item-button").on("click", selectItem);
    $("#item-number").on("input change", getItemNumberData);
    $("#item-image").on("change", changeImageDisplay);
    $("#item-add-button").on('click', addItem);
    $("#item-clear-button").on('click', itemFormSetToDefault);
    getItemNumbers();
    /* --- Item container events end --- */

    /* --- Purchase container buttons --- */
    $("#purchase-button").on("click",function() {
        selectPurchase(this);
    });
    $("#vendor-button").on("click",function() {
        selectVendor(this);
    });
    $("#sale-button").on("click",function() {
        selectSale(this);
    });
    $("#customer-button").on("click",function() {
        selectCustomer(this);
    });
    $("#search-button").on("click",function() {
        selectSearch(this);
    });
    $("#report-button").on("click",function() {
        selectReport(this);
    });


    
});

function logoutAccount()
{
    let = logoutButton = true;
    $.ajax({
        url: "class/user.php",
        method: "POST",
        data: {logoutButton:logoutButton},
        success: function(result)
        {
            alert(result);
            window.location.reload();
        }
    });
}

/* --- Item container start --- */
function selectItem(thisBtn) //Indicate selected button on navbar and shows corresponding container for item form
{
    thisBtn = $("#item-button");
    $(".nav-container").addClass("hide");
    $("#item").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}

function addItem() //Adding item to server
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
    let imgsrc = "img/item_images/imageNotAvailable.jpg";
    $("#item-image-display").attr("src",imgsrc);
}
/* --- Item container end--- */






function selectPurchase(thisBtn)
{
    $(".nav-container").addClass("hide");
    $("#purchase").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}
function selectVendor(thisBtn)
{
    $(".nav-container").addClass("hide");
    $("#vendor").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}
function selectSale(thisBtn)
{
    $(".nav-container").addClass("hide");
    $("#sale").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}
function selectCustomer(thisBtn)
{
    $(".nav-container").addClass("hide");
    $("#customer").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}
function selectSearch(thisBtn)
{
    $(".nav-container").addClass("hide");
    $("#search").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}
function selectReport(thisBtn)
{
    $(".nav-container").addClass("hide");
    $("#report").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}