$( document ).ready(function() {

    $("#logout-button").on("click",function() {
        logoutAccount();
    });

    //Module buttons
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
});

function logoutAccount()
{
    const logoutButton = true;
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

//Module buttons
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
