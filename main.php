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

    <!-- JQuery UI -->
    <link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    

    <title>Inventory Management System</title>
</head>
<body>
    <div class="navbar nav-header p-2">
        <a class="navbar-brand" href="main.php">
            Inventory Management System
        </a>
        <div class="float-right m-2">
            <a href="" id="profile-button"><?php echo ucwords($accountName); ?></a>
                <span> | </span>
            <a href="" id="logout-button">Logout</a>
        </div>
    </div>

    <div class="card main-card">
        <div class="m-2 mx-auto">
            <a class="btn active" id="item-button">Item</a>
            <a class="btn" id="purchase-button">Purchase</a>
            <a class="btn" id="vendor-button">Vendor</a>
            <a class="btn" id="sale-button">Sale</a>
            <a class="btn" id="customer-button">Customer</a>
            <a class="btn" id="search-button">Search</a>
            <a class="btn" id="report-button">Reports</a> 
        </div>
        
        <!-- ITEMS -->
        <div class="nav-container" id="item">
            <?php include "inc/item.html";?>
        </div>

        <!-- PURCHASE -->
        <div class="nav-container hide" id="purchase">
            <?php include "inc/purchase.html";?>
        </div>

        <!-- VENDOR -->
        <div class="nav-container hide" id="vendor">
            <?php include "inc/vendor.html";?>
        </div>

        <!-- SALE -->
        <div class="nav-container hide" id="sale">
            <div class="card-header">
                <h2>Sale Details</h2>
            </div>
            <div class="card-body">
                
            </div>
        </div>

        <!-- CUSTOMER -->
        <div class="nav-container hide" id="customer">
            <div class="card-header">
                <h2>Customer Details</h2>
            </div>
            <div class="card-body">
                
            </div>
        </div>

        <!-- SEARCH -->
        <div class="nav-container hide" id="search">
            <div class="card-header">
                <h2>Search Inventory</h2>
            </div>
            <div class="card-body">
                
            </div>
        </div>

        <!-- REPORT -->
        <div class="nav-container hide" id="report">
            <div class="card-header">
                <h2>Reports</h2>
            </div>
            <div class="card-body">
                
            </div>
        </div>

    </div>
    <!-- JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    
    <!-- JQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <!-- JQuery UI -->
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
    
    <!-- Custom JS -->
    <script src="js/main.js"></script>
    <script src="js/item.js"></script>
    <script src="js/purchase.js"></script>
    <script src="js/vendor.js"></script>
</body>
</html>