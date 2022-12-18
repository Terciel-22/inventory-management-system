$( document ).ready(function() {

    $("#register-form").on("submit", registerAccount);

    $("#login-form").on("submit", loginAccount);

    $("#clean-inputfields").on("click", cleanInputFields);
});

//Registration form function
function registerAccount()
{
    const registerForm = $("#register-form");
    const registerFormURL = registerForm.attr("action");

    $.ajax({
        method: "POST",
        url: registerFormURL,
        data: registerForm.serializeArray(),
        success: function(result){
            let message = `<div class='alert alert-secondary'>${result}</div>`;
            $("#register-errmessage").html(message);
        }
    });
    return false;
}
   
//Login form function
function loginAccount()
{
	const loginForm = $("#login-form");
    const loginFormURL = loginForm.attr("action");
    if( $( "#login-username" ).val().length === 0 || $( "#login-password" ).val().length === 0 )
    {
        errorMessage = "<div class='alert alert-secondary'>Input require field!</div>";
        $("#login-errmessage").html(errorMessage);
    } else
    { 
        $.ajax({
            method: "POST",
            url: loginFormURL,
            data: loginForm.serializeArray(),
            success: function(result){
                if(result == "Logging in...")
                {
                    alert(result);
                    window.location.reload();
                } else 
                {
                    let message = `<div class='alert alert-secondary'>${result}</div>`;
                    $("#login-errmessage").html(message);
                }
            }
        });
    }
    return false;
}

function cleanInputFields()
{
    $("input[type=text]").val('');
    $("input[type=password]").val('');
}