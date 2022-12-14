<?php 
    session_start();
    if(isset($_SESSION['fullName']))
    {
        header("Location:main.php");
    }

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
    <meta http-equiv="cache-control" content="no-cache" />
    <meta name="description" content="Inventory Management System">
    <meta name="keywords" content="Inventory, Management, System">
    <meta name="author" content="Mark Abe Fiel">
    
    <!-- BOOTSTRAP CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    

    <title>Inventory Management System</title>
</head>
<body>
    <?php if($action=="register"){ ?>
        <!--Registration Form -->
        <div class="card index-card rounded-4">
            <div class="card-header">
                <h1>Create Account</h1>
            </div>
            <div class="card-body">
                <div id="register-errmessage"></div>
                <form action="">
                    <div class="form-group">
                        <input type="text" placeholder="Name" id="register-name" name="register-name" class="form-control">
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Username" id="register-username" name="register-username" class="form-control">
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password" id="register-password" name="register-password" class="form-control">
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Confirm password" id="register-cpassword" name="register-cpassword" class="form-control">
                    </div>
                    <button type="button" id="register-button" name="register-button" class="btn btn-primary">Register</button>
                    <button type="button" id="clean-inputfields" class="btn btn-danger">Clear</button>
                    <br>
                    <span>Already have an account? </span>
                    <a href="?action=login">Login</a>
                </form>
            </div>
        </div>

    <?php } else { ?>
        <!-- Login Form -->
        <div class="card index-card rounded-4">
            <div class="card-header">
                <h1>Login</h1>
            </div>
            <div class="card-body">
                <div id="login-errmessage"></div>
                <form action="">
                    <div class="form-group">
                        <input type="text" placeholder="Username" id="login-username" name="login-username" class="form-control">
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password" id="login-password" name="login-password" class="form-control">
                    </div>
                    <button type="button" id="login-button" name="login-button" class="btn btn-primary">Login</button>
                    <button type="button" id="clean-inputfields" class="btn btn-danger">Clear</button>
                    <br>
                    <span>Don't have an account? </span><a href="?action=register">Register</a>
                </form>
            </div>
        </div>
    <?php } ?>

    <!-- JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    
    <!-- JQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    
    <!-- Custom JS -->
    <script src="js/index.js"></script>
</body>
</html>