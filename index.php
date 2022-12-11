<?php 

    $action = "";
    if(isset($_GET['action'])){
        $action = $_GET['action'];
    }
        

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Inventory Management System">
    <meta name="keywords" content="Inventory, Management, System">
    <meta name="author" content="Mark Abe Fiel">
    
    <!- CSS link->
    <link rel="stylesheet" href="css/style.css">

    <title>Inventory Management System</title>
</head>
<body>
    
    <?php if($action=="register"){ ?>
        <!--Registration Form -->
        <div class="container">
            <div class="header">
                <h1>Create Account</h1>
            </div>
            <div class="form">
                <form action="" method="POST">
                    <div class="form-group">
                        <input type="text" placeholder="Name" id="register-name" name="register-name" class="no-outline">
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Username" id="register-username" name="register-username" class="no-outline">
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password" id="register-password" name="register-password" class="no-outline">
                    </div>
                    <input type="submit" value="Register" class="btn no-outline">
                    <input type="reset" value="Clear" class="btn no-outline">
                    <br>
                    <span>Already have an account? </span>
                    <a href="?action=login">Login</a>
                </form>
            </div>
        </div>

    <?php } else { ?>
        <!-- Login Form -->
        <div class="container">
            <div class="header">
                <h1>Login</h1>
            </div>
            <div class="form">
                <form action="" method="POST">
                    <div class="form-group">
                        <input type="text" placeholder="Username" id="login-username" name="login-username" class="no-outline">
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password" id="login-password" name="login-password" class="no-outline">
                    </div>
                    <input type="submit" value="Login" class="btn no-outline">
                    <input type="reset" value="Clear" class="btn no-outline">
                    <br>
                    <span>Don't have an account? </span><a href="?action=register">Register</a>
                </form>
            </div>
        </div>
    <?php } ?>
</body>
</html>