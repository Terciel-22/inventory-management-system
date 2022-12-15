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
            <div class="card-header">
                <h2>Item Details</h2>
            </div>
            <div class="card-body">
                <form method="POST">
                    <div class="row">
                        <div class="col-md-4">
                            <label for="item-image">Image</label>
                            <div class="card image">
                                <div class="card-body">
                                    <img src="img/item_images/imageNotAvailable.jpg" alt="Image not available" class="img-fluid" id="item-image-display">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="row mb-3">
                                <div class="form-group col-md-6">
                                    <label for="item-number">Item number</label>
                                    <input type="text" id="item-number" name="item-number" class="form-control">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="item-product-id">Product ID</label>
                                    <input type="text" id="item-product-id" name="item-product-id" class="form-control" disabled>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="form-group col-md-8">
                                    <label for="item-name">Item name</label>
                                    <input type="text" id="item-name" name="item-name" class="form-control">
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="item-status">Status</label>
                                    <select name="item-status" id="item-status" class="form-control">
                                        <option value="" selected disabled hidden>-Select Status-</option>
                                        <option value="Active">Active</option>
                                        <option value="Disabled">Disabled</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="form-group">
                                    <label for="item-description">Item description</label>
                                    <textarea type="text" id="item-description" name="item-description" class="form-control" rows="7"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="form-group col-md-3">
                            <label for="item-discount">Discount %</label>
                            <input type="text" id="item-discount" name="item-discount" class="form-control" value="0">
                        </div>
                        <div class="form-group col-md-3">
                            <label for="item-quantity">Quantity</label>
                            <input type="number" id="item-quantity" name="item-quantity" class="form-control" value="0">
                        </div>
                        <div class="form-group col-md-3">
                            <label for="item-unit-price">Unit Price</label>
                            <input type="text" id="item-unit-price" name="item-unit-price" class="form-control" value="0">
                        </div>
                        <div class="form-group col-md-3">
                            <label for="item-total-stock">Total Stock</label>
                            <input type="text" id="item-total-stock" name="item-total-stock" class="form-control" disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-5">
                            <button type="button" class="btn btn-primary">Add item</button>
                            <button type="button" class="btn btn-primary">Update</button>
                            <button type="button" class="btn btn-primary">Delete</button>
                            <button type="button" class="btn btn-primary">Clear</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- PURCHASE -->
        <div class="nav-container hide" id="purchase">
            <div class="card-header">
                <h2>Purchase Details</h2>
            </div>
            <div class="card-body">
            </div>
        </div>

        <!-- VENDOR -->
        <div class="nav-container hide" id="vendor">
            <div class="card-header">
                <h2>Vendor Details</h2>
            </div>
            <div class="card-body">
                
            </div>
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
</body>
</html>