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
    <meta http-equiv="cache-control" content="no-cache" />
    <meta name="description" content="Inventory Management System">
    <meta name="keywords" content="Inventory, Management, System">
    <meta name="author" content="Mark Abe Fiel">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,600;1,900&display=swap" rel="stylesheet">

    <!-- CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="css/style.css">
    

    <title>Inventory Management System</title>
</head>
<body>
    <?php if($action=="register"){ ?>
        <!--Registration Form -->
        <div class="card">
            <div class="card-header">
                <h1>Create Account</h1>
            </div>
            <div class="card-body">
                <form action="" method="POST">
                    <div class="form-group">
                        <input type="text" placeholder="Name" id="register-name" name="register-name" class="form-control">
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Username" id="register-username" name="register-username" class="form-control">
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password" id="register-password" name="register-password" class="form-control">
                    </div>
                    <input type="submit" value="Register" class="btn btn-primary">
                    <input type="reset" value="Clear" class="btn btn-danger">
                    <br>
                    <span>Already have an account? </span>
                    <a href="?action=login">Login</a>
                </form>
            </div>
        </div>

    <?php } else { ?>
        <!-- Login Form -->
        <div class="card">
            <div class="card-header">
                <h1>Login</h1>
            </div>
            <div class="card-body">
                <form action="" method="POST">
                    <div class="form-group">
                        <input type="text" placeholder="Username" id="login-username" name="login-username" class="form-control">
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password" id="login-password" name="login-password" class="form-control">
                    </div>
                    <input type="submit" value="Login" class="btn btn-primary">
                    <input type="reset" value="Clear" class="btn btn-danger">
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
</body>
</html>