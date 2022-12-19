$( document ).ready(function() {

    //Logout button
    $("#logout-button").on("click", logoutAccount);

    //Nav button
    $("#item-button").on("click", selectItem);
    $("#purchase-button").on("click", selectPurchase);
    $("#vendor-button").on("click", selectVendor);
    $("#sale-button").on("click", selectSale);
    $("#customer-button").on("click", selectCustomer);
    $("#search-button").on("click", selectSearch);
    $("#report-button").on("click", selectReport);

    //For item number suggestion
    getItemNumbers();

    //For setting min and max date
    getCalendarMinAndMax();
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

function selectPurchase()
{
    let thisBtn = $("#purchase-button");
    $(".nav-container").addClass("hide");
    $("#purchase").removeClass("hide");
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
function selectSale()
{
    let thisBtn = $("#sale-button");
    $(".nav-container").addClass("hide");
    $("#sale").removeClass("hide");
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
function selectSearch()
{
    let thisBtn = $("#search-button");
    $(".nav-container").addClass("hide");
    $("#search").removeClass("hide");
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

function getItemNumbers() //Needed for getting item number auto-complete suggestions
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
            
            //For item form
            $( "#item-number" ).autocomplete({
                source: itemNumbers
            });

            //For purchase form
            $( "#purchase-item-number" ).autocomplete({
                source: itemNumbers
            });
        }
    });
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
}