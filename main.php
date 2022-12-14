<?php 
    session_start();
    if(!isset($_SESSION['fullName']))
    {
        header("Location: index.php");
    } else
    {
        $accountName = $_SESSION['fullName'];
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
    <div class="navbar navbar-light bg-light p-2">
        <a class="navbar-brand btn" href="main.php">
            <img src="https://cdn-icons-png.flaticon.com/512/7656/7656399.png" width="30" height="30" class="d-inline-block align-top" alt="">
            Inventory Management System
        </a>

        <div class="ms-auto">
            <a id="profile-button" class="btn"><?php echo $accountName; ?></a>
                <span>|</span>
            <a id="logout-button" class="btn">Logout</a>
        </div>
    </div>

    <div class="navbar navbar-light bg-light">
        <div class="mx-auto">
            <a class="btn active" id="item-button">Item</a>
            <a class="btn" id="purchase-button">Purchase</a>
            <a class="btn" id="vendor-button">Vendor</a>
            <a class="btn" id="sale-button">Sale</a>
            <a class="btn" id="customer-button">Customer</a>
            <a class="btn" id="search-button">Search</a>
            <a class="btn" id="report-button">Reports</a> 
        </div>
    </div>
    
    <!-- ITEMS -->
    <div class="card main-card  nav-container"  id="item">
        <div class="card-header">
            <h2>Item Details</h2>
        </div>
        <div class="card-body">
            
        </div>
    </div>

    <!-- PURCHASE -->
    <div class="card main-card nav-container hide" id="purchase">
        <div class="card-header">
            <h2>Purchase Details</h2>
        </div>
        <div class="card-body">
            
        </div>
    </div>

    <!-- VENDOR -->
    <div class="card main-card nav-container hide" id="vendor">
        <div class="card-header">
            <h2>Vendor Details</h2>
        </div>
        <div class="card-body">
            
        </div>
    </div>

    <!-- SALE -->
    <div class="card main-card nav-container hide" id="sale">
        <div class="card-header">
            <h2>Sale Details</h2>
        </div>
        <div class="card-body">
            
        </div>
    </div>

    <!-- CUSTOMER -->
    <div class="card main-card nav-container hide" id="customer">
        <div class="card-header">
            <h2>Customer Details</h2>
        </div>
        <div class="card-body">
            
        </div>
    </div>

    <!-- SEARCH -->
    <div class="card main-card nav-container hide" id="search">
        <div class="card-header">
            <h2>Search Inventory</h2>
        </div>
        <div class="card-body">
            
        </div>
    </div>

    <!-- REPORT -->
    <div class="card main-card nav-container hide" id="report">
        <div class="card-header">
            <h2>Reports</h2>
        </div>
        <div class="card-body">
            
        </div>
    </div>

    <!-- JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    
    <!-- JQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    
    <!-- Custom JS -->
    <script src="js/main.js"></script>
</body>
</html>