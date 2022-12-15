$( document ).ready(function() {

    $("#logout-button").on("click",function() {
        logoutAccount();
    });

    //Module Navigation buttons
    $("#item-button").on("click",function() {
       selectItem(this);
    });
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


    $("#item-number").on("input change", function(){
        getItemNumberData();
    });

    //Automatically called function
    getItemNumbers();
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

//Module Navigation buttons
function selectItem(thisBtn)
{
    $(".nav-container").addClass("hide");
    $("#item").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}
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

function getItemNumbers()
{
    const getItemNumbers = true;
    $.ajax({
        url: "class/item.php",
        method: "POST",
        dataType: "JSON",
        data: {getItemNumbers:getItemNumbers},
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

function getItemNumberData()
{
    const itemNumber = $("#item-number").val();
    if(itemNumber != "")
    {
        const getItemNumberData = true;
        $.ajax({
            url: "class/item.php",
            method: "POST",
            dataType: "JSON",
            data: {
                getItemNumberData:getItemNumberData,
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

function itemFormSetToDefault()
{
    $("#item-product-id").val("");
    $("#item-name").val("");
    $("#item-status").val("");
    $("#item-description").val("");
    $("#item-discount").val("0");
    $("#item-unit-price").val("0");
    $("#item-total-stock").val("");

    //image
    let imgsrc = "img/item_images/imageNotAvailable.jpg";
    $("#item-image-display").attr("src",imgsrc);
}