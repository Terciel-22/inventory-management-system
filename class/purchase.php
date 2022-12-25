<?php 

    require_once("../config/config.php");

    class Purchase extends PDOHandler
    {
        private $pdo;

        function __construct($pdo)
        {
            $this->pdo = $pdo;
        } 

        function checkIfItemNumberExist($purchaseItemNumber)
        {
            $sql = "SELECT * FROM item WHERE itemNumber = :itemNumber";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":itemNumber", $purchaseItemNumber);
            $this->pdo->executeStatement();
            $rowCount = $this->pdo->getAffectedRowCount();
            if($rowCount==1)
            {
                return true;
            } else
            {
                return false;
            }
        }

        function getPurchaseRecords()
        {
            $sql = "SELECT * FROM purchase";
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
            $sql1 = "UPDATE item SET stock = stock + :quantity WHERE itemNumber = :itemNumber";
            $this->pdo->prepareQuery($sql1);
            $this->pdo->bindValueToStatement(":quantity",$purchaseItemQuantity);
            $this->pdo->bindValueToStatement(":itemNumber",$purchaseItemNumber);
            $isUpdatedToItem = $this->pdo->executeStatement();
            if(!$isUpdatedToItem)
            {
                echo "Can't update stock on add sale.";
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

        function updatePurchase($purchaseItemNumber,$purchaseDate,$purchaseItemName,$purchaseUnitPrice,$itemQuantity,$purchaseItemQuantity,$purchaseVendorName,$purchaseVendorID,$purchaseID)
        {
            //Update item stock
            $sql1 = "UPDATE item SET stock = stock + :quantity WHERE itemNumber = :itemNumber";
            $this->pdo->prepareQuery($sql1);
            $this->pdo->bindValueToStatement(":quantity",$itemQuantity);
            $this->pdo->bindValueToStatement(":itemNumber",$purchaseItemNumber);
            $isAddedToItem = $this->pdo->executeStatement();
            if(!$isAddedToItem)
            {
                echo "Can't add new purchase due to error in updating stock.";
                exit();
            }

            //Add new purchase
            $sql2 = "UPDATE purchase SET itemNumber = :itemNumber, purchaseDate = :purchaseDate, itemName = :itemName, unitPrice = :unitPrice, quantity = :quantity, vendorName = :vendorName, vendorID = :vendorID WHERE purchaseID = :purchaseID";
            $this->pdo->prepareQuery($sql2);
            $this->pdo->bindValueToStatement(":itemNumber",$purchaseItemNumber);
            $this->pdo->bindValueToStatement(":purchaseDate",$purchaseDate);
            $this->pdo->bindValueToStatement(":itemName",$purchaseItemName);
            $this->pdo->bindValueToStatement(":unitPrice",$purchaseUnitPrice);
            $this->pdo->bindValueToStatement(":quantity",$purchaseItemQuantity);
            $this->pdo->bindValueToStatement(":vendorName",$purchaseVendorName);
            $this->pdo->bindValueToStatement(":vendorID",$purchaseVendorID);
            $this->pdo->bindValueToStatement(":purchaseID",$purchaseID);

            return $this->pdo->executeStatement();
        }
    }

    $purchase = new Purchase($pdo);
    extract($_POST);
    
    if(isset($_POST["getPurchaseRecords"]))
    {
        $results = $purchase->getPurchaseRecords();
        
        echo json_encode($results);
        exit();
    }

    else if(isset($_POST["getPurchaseData"]))
    {
        $purchaseID = htmlentities($_POST["purchaseID"]);
        if(!is_numeric($purchaseID))
        {
            echo "404";
            exit();
        }

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
        $purchaseID = htmlentities($_POST["purchase-id"]);
        $purchaseItemNumber = htmlentities($_POST["purchase-item-number"]);
        $purchaseDate = htmlentities($_POST["purchase-date"]);
        $purchaseItemName = htmlentities($_POST["purchase-item-name"]);
        $purchaseUnitPrice = htmlentities($_POST["purchase-item-unit-price"]);
        $purchaseItemQuantity = htmlentities($_POST["purchase-item-quantity"]);
        $purchaseVendor = htmlentities($_POST["purchase-vendor-name"]);
        
        if($purchaseID != "")
        {
            echo "Purchase ID is auto-generated when adding.";
            exit();
        }
 
        if($purchaseItemNumber != "" && $purchaseDate != "" && $purchaseVendor != "" && $purchaseItemQuantity != "" && $purchaseUnitPrice != "")
        {
            if(!$purchase->checkIfItemNumberExist($purchaseItemNumber))
            {
                echo "Your item doesn't exist.";
                exit();
            }
            if($purchaseItemQuantity <= 0)
            {
                echo "Please put a quantity.";
                exit();
            }
            if(!is_numeric($purchaseUnitPrice) || $purchaseUnitPrice < 0){
                echo "Please put a valid unit price.";
                exit();
            }

            $purchaseVendorArr = explode("|",$purchaseVendor);
            $purchaseVendorID = $purchaseVendorArr[1];
            $purchaseVendorName = $purchaseVendorArr[0];

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
            echo "Fill all the required(*) field.";
            exit();
        }
    }

    else if(isset($_POST["purchase-update-submitted"])) {
        
        $purchaseID = htmlentities($_POST["purchase-id"]);
        $purchaseItemNumber = htmlentities($_POST["purchase-item-number"]);
        $purchaseDate = htmlentities($_POST["purchase-date"]);
        $purchaseItemName = htmlentities($_POST["purchase-item-name"]);
        $purchaseUnitPrice = htmlentities($_POST["purchase-item-unit-price"]);
        $purchaseItemQuantity = htmlentities($_POST["purchase-item-quantity"]);
        $purchaseVendor = htmlentities($_POST["purchase-vendor-name"]);
        $purchaseLastItemQuantity = htmlentities($_POST["purchase-last-item-quantity"]);

        if($purchaseID != "" && $purchaseItemNumber != "" && $purchaseDate != "" && $purchaseVendor != "" && $purchaseItemQuantity != "" && $purchaseUnitPrice != "")
        {
            if(!$purchase->checkIfItemNumberExist($purchaseItemNumber))
            {
                echo "Your item doesn't exist.";
                exit();
            }
            if($purchaseItemQuantity < 0)
            {
                echo "Please put a quantity.";
                exit();
            }
            if(!is_numeric($purchaseUnitPrice) || $purchaseUnitPrice < 0){
                echo "Please put a valid unit price.";
                exit();
            }

            if($purchaseItemQuantity != $purchaseLastItemQuantity)
            {
                $itemQuantity = $purchaseItemQuantity - $purchaseLastItemQuantity;
            } else
            {
                $itemQuantity = 0;
            }
 
            $purchaseVendorArr = explode("|",$purchaseVendor);
            $purchaseVendorID = $purchaseVendorArr[1];
            $purchaseVendorName = $purchaseVendorArr[0];

            $isUpdated = $purchase->updatePurchase($purchaseItemNumber,$purchaseDate,$purchaseItemName,$purchaseUnitPrice,$itemQuantity,$purchaseItemQuantity,$purchaseVendorName,$purchaseVendorID,$purchaseID);

            if($isUpdated)
            {
                echo "Successfully Updated!";
                exit();
            } else
            {
                echo "Error in updating purchase!";
                exit();
            }

        } else
        {
            echo "Fill all the required(*) field.";
            exit();
        }
    }

    //Prevent direct access to this file from URL
    else {
        header("Location: ../");
    }
?>