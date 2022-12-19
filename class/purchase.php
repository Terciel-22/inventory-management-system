<?php 

    require_once("../config/config.php");

    class Purchase extends PDOHandler
    {
        private $pdo;

        function __construct($pdo)
        {
            $this->pdo = $pdo;
        } 

        function getAvailablePurchaseIDs()
        {
            $sql = "SELECT purchaseID FROM purchase";
            $this->pdo->prepareQuery($sql);
            return $this->pdo->getAllResults();
        }

        function getPurchaseData($purchaseID)
        {
            $sql = "SELECT purchase.*, item.stock FROM purchase JOIN item ON purchase.itemNumber=item.itemNumber WHERE purchaseID = :purchaseID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":purchaseID", $purchaseID);
            $purchaseData = $this->pdo->getAllResults();
            $rowCount = $this->pdo->getAffectedRowCount();
            return ["purchaseData" => $purchaseData, "rowCount" => $rowCount];
        }
        
        function addPurchase($purchaseItemNumber,$purchaseDate,$purchaseItemName,$purchaseUnitPrice,$purchaseItemQuantity,$purchaseVendorName,$purchaseVendorID)
        {
            //Update item stock
            $sql1 = "UPDATE item SET stock = stock + :quantity";
            $this->pdo->prepareQuery($sql1);
            $this->pdo->bindValueToStatement(":quantity",$purchaseItemQuantity);
            $isAddedToItem = $this->pdo->executeStatement();
            if(!$isAddedToItem)
            {
                echo "Can't add new purchase due to error in updating stock.";
                exit();
            }

            //Add new purchase
            $sql2 = "INSERT INTO purchase (itemNumber,purchaseDate,itemName,unitPrice,quantity,vendorName,vendorID) VALUES (:itemNumber,:purchaseDate,:itemName,:unitPrice,:quantity,:vendorName,:vendorID)";
            $this->pdo->prepareQuery($sql2);
            $this->pdo->bindValueToStatement(":itemNumber",$purchaseItemNumber);
            $this->pdo->bindValueToStatement(":purchaseDate",$purchaseDate);
            $this->pdo->bindValueToStatement(":itemName",$purchaseItemName);
            $this->pdo->bindValueToStatement(":unitPrice",$purchaseUnitPrice);
            $this->pdo->bindValueToStatement(":quantity",$purchaseItemQuantity);
            $this->pdo->bindValueToStatement(":vendorName",$purchaseVendorName);
            $this->pdo->bindValueToStatement(":vendorID",$purchaseVendorID);
            return $this->pdo->executeStatement();
        }
    }

    $purchase = new Purchase($pdo);
    extract($_POST);
    
    if(isset($_POST["getPurchaseIDs"]))
    {
        $results = $purchase->getAvailablePurchaseIDs();
        
        echo json_encode($results);
        exit();
    }

    else if(isset($_POST["getPurchaseData"]))
    {
        $purchaseID = htmlentities($_POST["purchaseID"]);
        $result = $purchase->getPurchaseData($purchaseID);
        if($result["rowCount"] === 1)
        {
            echo json_encode($result["purchaseData"]);
            exit();
        } else 
        {
            echo "404";
            exit();
        }
    }

    else if(isset($_POST["purchase-add-submitted"])) {
        $purchaseItemNumber = htmlentities($_POST["purchase-item-number"]);
        $purchaseDate = htmlentities($_POST["purchase-date"]);
        $purchaseItemName = htmlentities($_POST["purchase-item-name"]);
        $purchaseUnitPrice = htmlentities($_POST["purchase-unit-price"]);
        $purchaseItemQuantity = htmlentities($_POST["purchase-item-quantity"]);
        $purchaseVendor = htmlentities($_POST["purchase-vendor-name"]);
        
        if($purchaseItemNumber != "" && $purchaseDate != "" && $purchaseVendor != "" && $purchaseItemQuantity != "" && $purchaseUnitPrice != "")
        {
            if($purchaseItemName == "")
            {
                echo "Your item number doesn't exist.";
                exit();
            }
            if($purchaseItemQuantity <= 0)
            {
                echo "Please put a quantity.";
                exit();
            }

            $purchaseVendorArr = explode("|",$purchaseVendor);
            $purchaseVendorID = $purchaseVendorArr[0];
            $purchaseVendorName = $purchaseVendorArr[1];

            $isAdded = $purchase->addPurchase($purchaseItemNumber,$purchaseDate,$purchaseItemName,$purchaseUnitPrice,$purchaseItemQuantity,$purchaseVendorName,$purchaseVendorID);

            if($isAdded)
            {
                echo "Successfully added!";
                exit();
            } else
            {
                echo "Error in adding purchase!";
                exit();
            }

        } else
        {
            echo "Fill all the blank field.";
            exit();
        }
    }

    //Prevent direct access to this file from URL
    else {
        header("Location: ../");
    }
?>