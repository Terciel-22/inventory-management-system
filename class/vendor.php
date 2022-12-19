<?php 

    require_once("../config/config.php");

    class Vendor extends PDOHandler
    {
        private $pdo;

        function __construct($pdo)
        {
            $this->pdo = $pdo;
        }

        function getAllVendorNames()
        {
            $sql = "SELECT fullName,vendorID from vendor WHERE status = 'Active'";
            $this->pdo->prepareQuery($sql);
            return $this->pdo->getAllResults();
        }
    }

    $vendor = new Vendor($pdo);

    if(isset($_POST["getAllVendorNames"]))
    {
        $results = $vendor->getAllVendorNames();
        echo json_encode($results);
        exit();
    }

    //Prevent direct access to this file from URL
    else {
        header("Location: ../");
    }
?>