const NCR_CODE = 130000000;

$(document).ready(function() {
    //Logout button
    $("#logout-button").on("click", logoutAccount);

    //Nav button
    $("#item-button").on("click", selectItem);
    $("#vendor-button").on("click", selectVendor);
    $("#customer-button").on("click", selectCustomer);
    $("#purchase-button").on("click", selectPurchase);
    $("#sale-button").on("click", selectSale);
    $("#report-button").on("click", selectReport);

    //For setting min and max date
    getCalendarMinAndMax();

    //Enabling tooltip
    $(".form-control").tooltip();

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

function selectItem()
{ 
    let thisBtn = $("#item-button");
    $(".nav-container").addClass("hide");
    $("#item").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}
function selectVendor()
{
    let thisBtn = $("#vendor-button");
    $(".nav-container").addClass("hide");
    $("#vendor").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}
function selectCustomer()
{
    let thisBtn = $("#customer-button");
    $(".nav-container").addClass("hide");
    $("#customer").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}
function selectPurchase()
{
    let thisBtn = $("#purchase-button");
    $(".nav-container").addClass("hide");
    $("#purchase").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}
function selectSale()
{
    let thisBtn = $("#sale-button");
    $(".nav-container").addClass("hide");
    $("#sale").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}

function selectReport()
{
    let thisBtn = $("#report-button");
    $(".nav-container").addClass("hide");
    $("#report").removeClass("hide");
    $("a.active").removeClass("active");
    $(thisBtn).addClass("active");
}

function getCalendarMinAndMax()
{
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
    dd = '0' + dd;
    }

    if (mm < 10) {
    mm = '0' + mm;
    } 
        
    today = yyyy + '-' + mm + '-' + dd;

    //For purchase form
    $("#purchase-date").attr("min", "2000-01-01"); 
    $("#purchase-date").attr("max", today); 

    //For sale form
    $("#sale-date").attr("min", "2000-01-01"); 
    $("#sale-date").attr("max", today); 
}