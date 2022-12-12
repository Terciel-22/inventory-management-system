$( document ).ready(function() {

    $("#register-button").on("click",function() {
        registerAccount();
    });

});

//Registration form function
function registerAccount(){
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
    