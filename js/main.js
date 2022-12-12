$( document ).ready(function() {

    $("#logout-button").on("click",function() {
        logoutAccount();
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