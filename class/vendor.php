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

        function getVendorData($vendorID)
        {
            $sql = "SELECT * FROM vendor WHERE vendorID = :vendorID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":vendorID", $vendorID);
            $vendorData = $this->pdo->getAllResults();
            $rowCount = $this->pdo->getAffectedRowCount();
            return ["vendorData" => $vendorData, "rowCount" => $rowCount];
        }
    } 

    $vendor = new Vendor($pdo);
    extract($_POST);

    if(isset($_POST["getAllVendorNames"]))
    {
        $results = $vendor->getAllVendorNames();
        echo json_encode($results);
        exit();
    }

    else if(isset($_POST["getVendorData"]))
    {
        $vendorID = htmlentities($_POST["vendorID"]);
        $result = $vendor->getVendorData($vendorID);
        if($result["rowCount"] === 1)
        {
            echo json_encode($result["vendorData"]);
            exit();
        } else 
        {
            echo "404";
            exit();
        }
    }

    //Prevent direct access to this file from URL
    else {
        header("Location: ../");
    }
?>