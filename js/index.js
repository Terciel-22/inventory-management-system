$( document ).ready(function() {

    $("#register-button").on("click", registerAccount);

    $("#login-button").on("click", loginAccount);

    $("#clean-inputfields").on("click", cleanInputFields);
});

//Registration form function
function registerAccount()
{
    const registerForm = $("#register-form");
    const registerFormURL = registerForm.attr("action");
    const registerFormData = registerForm.serializeArray();
    registerFormData.push({name: "register-submitted", value: "true"});

    $.ajax({
        method: "POST",
        url: registerFormURL,
        data: registerFormData,
        success: function(result){
            let message = `<div class='alert alert-secondary'>${result}</div>`;
            $("#register-errmessage").html(message);
        }
    });
}
    
//Login form function
function loginAccount()
{
	const loginForm = $("#login-form");
    const loginFormURL = loginForm.attr("action");
    const loginFormData = loginForm.serializeArray();
    loginFormData.push({name: "login-submitted", value: "true"});

    $.ajax({
        method: "POST",
        url: loginFormURL,
        data: loginFormData,
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

function cleanInputFields()
{
    message = "";
    $("#register-errmessage").html(message);
    $("#login-errmessage").html(message);
    $("input[type=text]").val("");
    $("input[type=password]").val("");
}