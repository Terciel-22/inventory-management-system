$( document ).ready(function() {

    $("#register-button").on("click",function() {
        registerAccount();
    });

    $("#login-button").on("click",function() {
        loginAccount();
    });

    $("#clean-inputfields").on("click",function() {
        cleanInputFields();
    });
});

//Registration form function
function registerAccount()
{
    const registerName = $("#register-name").val();
	const registerUsername = $("#register-username").val();
	const registerPassword = $("#register-password").val();
    const registerCPassword = $("#register-cpassword").val();
	const registerButton = $("#register-button").val();

    $.ajax({
        url: "class/user.php",
        method: "POST",
        data: {
            registerName:registerName,
            registerUsername:registerUsername,
            registerPassword:registerPassword,
            registerCPassword:registerCPassword,
            registerButton:registerButton 
        },
        success: function(data){
            let result = `<div class='alert alert-secondary'>${data}</div>`;
            $("#register-errmessage").html(result);
        }
    });
}
   
//Login form function
function loginAccount()
{
	const loginUsername = $("#login-username").val();
	const loginPassword = $("#login-password").val();
	const loginButton = $("#login-button").val();

    $.ajax({
        url: "class/user.php",
        method: "POST",
        data: {
            loginUsername:loginUsername,
            loginPassword:loginPassword,
            loginButton:loginButton 
        },
        success: function(data){
            if(data == "Logging in...")
            {
                alert(data);
                window.location.reload();
            } else 
            {
                let result = `<div class='alert alert-secondary'>${data}</div>`;
                $("#login-errmessage").html(result);
            }
        }
    });
}

function cleanInputFields()
{
    $("input").val('');
}