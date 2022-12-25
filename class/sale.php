<?php 

    require_once("../config/config.php");

    class Sale extends PDOHandler
    {
        private $pdo;

        function __construct($pdo)
        {
            $this->pdo = $pdo;
        } 

        function checkIfItemNumberExist($saleItemNumber)
        {
            $sql = "SELECT * FROM item WHERE itemNumber = :itemNumber";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":itemNumber", $saleItemNumber);
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

        function checkIfCustomerExist($saleCustomerID)
        {
            $sql = "SELECT * FROM customer WHERE customerID = :customerID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":customerID", $saleCustomerID);
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

        function getSaleRecords()
        {
            $sql = "SELECT * FROM sale";
            $this->pdo->prepareQuery($sql);
            return $this->pdo->getAllResults();
        }

        function getSaleData($saleID)
        {
            $sql = "SELECT sale.*, item.stock, item.imageURL FROM sale JOIN item on sale.itemNumber=item.itemNumber WHERE saleID = :saleID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":saleID", $saleID);
            $saleData = $this->pdo->getAllResults();
            $rowCount = $this->pdo->getAffectedRowCount();
            return ["saleData" => $saleData, "rowCount" => $rowCount];
        }
        
        function addSale($saleDate,$saleCustomerID,$saleCustomerName,$saleItemNumber,$saleItemName,$saleItemDiscount,$saleItemQuantity,$saleItemUnitPrice)
        {
            //Update item stock
            $sql1 = "UPDATE item SET stock = stock - :quantity WHERE itemNumber = :itemNumber";
            $this->pdo->prepareQuery($sql1);
            $this->pdo->bindValueToStatement(":quantity",$saleItemQuantity);
            $this->pdo->bindValueToStatement(":itemNumber",$saleItemNumber);
            $isUpdatedToItem = $this->pdo->executeStatement();
            if(!$isUpdatedToItem)
            {
                echo "Can't update stock on add sale.";
                exit();
            }

            //Add new sale
            $sql2 = "INSERT INTO sale (saleDate,customerID,customerName,itemNumber,itemName,discount,quantity,unitPrice) VALUES (:saleDate,:customerID,:customerName,:itemNumber,:itemName,:discount,:quantity,:unitPrice)";
            $this->pdo->prepareQuery($sql2);
            $this->pdo->bindValueToStatement(":saleDate",$saleDate);
            $this->pdo->bindValueToStatement(":customerID",$saleCustomerID);
            $this->pdo->bindValueToStatement(":customerName",$saleCustomerName);
            $this->pdo->bindValueToStatement(":itemNumber",$saleItemNumber);
            $this->pdo->bindValueToStatement(":itemName",$saleItemName);
            $this->pdo->bindValueToStatement(":discount",$saleItemDiscount);
            $this->pdo->bindValueToStatement(":quantity",$saleItemQuantity);
            $this->pdo->bindValueToStatement(":unitPrice",$saleItemUnitPrice);
            return $this->pdo->executeStatement();
        }

        function updateSale($saleDate,$saleCustomerID,$saleCustomerName,$saleItemNumber,$saleItemName,$saleItemDiscount,$itemQuantity,$saleItemQuantity,$saleItemUnitPrice,$saleID)
        {
            //Update item stock
            $sql1 = "UPDATE item SET stock = stock - :quantity WHERE itemNumber = :itemNumber";
            $this->pdo->prepareQuery($sql1);
            $this->pdo->bindValueToStatement(":quantity",$itemQuantity);
            $this->pdo->bindValueToStatement(":itemNumber",$saleItemNumber);
            $isAddedToItem = $this->pdo->executeStatement();
            if(!$isAddedToItem)
            {
                echo "Can't add new sale due to error in updating stock.";
                exit();
            }

            //Add new sale
            $sql2 = "UPDATE sale SET saleDate=:saleDate,customerID=:customerID,customerName=:customerName,itemNumber=:itemNumber,itemName=:itemName,discount=:discount,quantity=:quantity,unitPrice=:unitPrice WHERE saleID = :saleID";
            $this->pdo->prepareQuery($sql2);
            $this->pdo->bindValueToStatement(":saleDate",$saleDate);
            $this->pdo->bindValueToStatement(":customerID",$saleCustomerID);
            $this->pdo->bindValueToStatement(":customerName",$saleCustomerName);
            $this->pdo->bindValueToStatement(":itemNumber",$saleItemNumber);
            $this->pdo->bindValueToStatement(":itemName",$saleItemName);
            $this->pdo->bindValueToStatement(":discount",$saleItemDiscount);
            $this->pdo->bindValueToStatement(":quantity",$saleItemQuantity);
            $this->pdo->bindValueToStatement(":unitPrice",$saleItemUnitPrice);
            $this->pdo->bindValueToStatement(":saleID",$saleID);

            return $this->pdo->executeStatement();
        }

        function deleteSale($saleID)
        {
            $sql = "DELETE FROM sale WHERE saleID = :saleID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":saleID", $saleID);
            return $this->pdo->executeStatement();
        }
    }

    $sale = new Sale($pdo);
    extract($_POST);
    
    if(isset($_POST["getSaleRecords"]))
    {
        $results = $sale->getSaleRecords();
        
        echo json_encode($results);
        exit();
    }

    else if(isset($_POST["getSaleData"]))
    {
        $saleID = htmlentities($_POST["saleID"]);
        if(!is_numeric($saleID))
        {
            echo "404";
            exit();
        }

        $result = $sale->getSaleData($saleID);
        if($result["rowCount"] === 1)
        {
            echo json_encode($result["saleData"]);
            exit();
        } else 
        {
            echo "404";
            exit();
        }
    }

    else if(isset($_POST["sale-add-submitted"])) {

        $saleID = htmlentities($_POST["sale-id"]);
        $saleDate = htmlentities($_POST["sale-date"]);
        $saleCustomerID = htmlentities($_POST["sale-customer-id"]);
        $saleCustomerName = htmlentities($_POST["sale-customer-name"]);
        $saleItemNumber = htmlentities($_POST["sale-item-number"]);
        $saleItemName = htmlentities($_POST["sale-item-name"]);
        $saleItemDiscount = htmlentities($_POST["sale-item-discount"]);
        $saleItemQuantity = htmlentities($_POST["sale-item-quantity"]);
        $saleItemUnitPrice = htmlentities($_POST["sale-item-unit-price"]);
        
        
        if($saleID != "")
        {
            echo "Sale ID is auto-generated when adding.";
            exit();
        }
 
        if($saleDate != "" && $saleCustomerID != "" && $saleCustomerName != "" && $saleItemNumber != "" && $saleItemName != "" && $saleItemQuantity != "" && $saleItemUnitPrice != "")
        {
            if(!$sale->checkIfItemNumberExist($saleItemNumber))
            {
                echo "Your item number doesn't exist.";
                exit();
            }
            if(!$sale->checkIfCustomerExist($saleCustomerID))
            {
                echo "Your item number doesn't exist.";
                exit();
            }
            if($saleItemQuantity <= 0)
            {
                echo "Please put a quantity.";
                exit();
            }
            if(!is_numeric($saleItemUnitPrice) || $saleItemUnitPrice < 0){
                echo "Please put a valid unit price.";
                exit();
            }

            $isAdded = $sale->addSale($saleDate,$saleCustomerID,$saleCustomerName,$saleItemNumber,$saleItemName,$saleItemDiscount,$saleItemQuantity,$saleItemUnitPrice);

            if($isAdded)
            {
                echo "Successfully added!";
                exit();
            } else
            {
                echo "Error in adding sale!";
                exit();
            }

        } else
        {
            echo "Fill all the required(*) field.";
            exit();
        }
    }

    else if(isset($_POST["sale-update-submitted"])) {
        
        $saleID = htmlentities($_POST["sale-id"]);
        $saleDate = htmlentities($_POST["sale-date"]);
        $saleCustomerID = htmlentities($_POST["sale-customer-id"]);
        $saleCustomerName = htmlentities($_POST["sale-customer-name"]);
        $saleItemNumber = htmlentities($_POST["sale-item-number"]);
        $saleItemName = htmlentities($_POST["sale-item-name"]);
        $saleItemDiscount = htmlentities($_POST["sale-item-discount"]);
        $saleItemQuantity = htmlentities($_POST["sale-item-quantity"]);
        $saleLastItemQuantity = htmlentities($_POST["sale-last-item-quantity"]);
        $saleItemUnitPrice = htmlentities($_POST["sale-item-unit-price"]);
        
        if($saleID == "")
        {
            echo "Please put a valid Sale ID.";
            exit();
        }

        if($saleDate != "" && $saleCustomerID != "" && $saleCustomerName != "" && $saleItemNumber != "" && $saleItemName != "" && $saleItemQuantity != "" && $saleItemUnitPrice != "")
        {
            if(!$sale->checkIfItemNumberExist($saleItemNumber))
            {
                echo "Your item number doesn't exist.";
                exit();
            }
            if(!$sale->checkIfCustomerExist($saleCustomerID))
            {
                echo "Your item number doesn't exist.";
                exit();
            }
            if($saleItemQuantity <= 0)
            {
                echo "Please put a quantity.";
                exit();
            }
            if(!is_numeric($saleItemUnitPrice) || $saleItemUnitPrice < 0){
                echo "Please put a valid unit price.";
                exit();
            }

            if($saleItemQuantity != $saleLastItemQuantity)
            {
                $itemQuantity = $saleItemQuantity - $saleLastItemQuantity;
            } else
            {
                $itemQuantity = 0;
            }
 
            $isUpdated = $sale->updateSale($saleDate,$saleCustomerID,$saleCustomerName,$saleItemNumber,$saleItemName,$saleItemDiscount,$itemQuantity,$saleItemQuantity,$saleItemUnitPrice,$saleID);

            if($isUpdated)
            {
                echo "Successfully Updated!";
                exit();
            } else
            {
                echo "Error in updating sale!";
                exit();
            }

        } else
        {
            echo "Fill all the required(*) field.";
            exit();
        }
    }

    else if (isset($_POST["deleteSaleID"])) 
    {
        $saleID = htmlentities($_POST["deleteSaleID"]);
        $isDeleted = $sale->deleteSale($saleID);
        if($isDeleted)
        {
            echo "Successfully deleted!";
            exit();
        } else
        {
            echo "Unable to delete due to error.";
            exit();
        }
    } 

    //Prevent direct access to this file from URL
    else {
        header("Location: ../");
    }
?>