<?php 

    require_once("../config/config.php");

    class Item extends PDOHandler
    {
        protected $pdo;

        function __construct($pdo)
        {
            $this->pdo = $pdo;
        } 

        function getAvailableItemNumbers()
        {
            $sql = "SELECT itemNumber FROM item";
            $this->pdo->prepareQuery($sql);
            return $this->pdo->getAllResults();
        }

        function getItemData($itemNumber)
        {
            $sql = "SELECT * FROM item WHERE itemNumber = :itemNumber";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":itemNumber", $itemNumber);
            $itemData = $this->pdo->getAllResults();
            $rowCount = $this->pdo->getAffectedRowCount();
            return ["itemData" => $itemData, "rowCount" => $rowCount];
        }

        function addItem($itemNumber,$itemName,$itemDiscount,$itemQuantity,$itemUnitPrice,$itemImageFileName,$itemStatus,$itemDescription)
        {
            $sql = "INSERT INTO item (itemNumber,itemName,discount,stock,unitPrice,imageURL,status,description) VALUES (:itemNumber,:itemName,:discount,:stock,:unitPrice,:imageURL,:status,:description)";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":itemNumber", $itemNumber);
            $this->pdo->bindValueToStatement(":itemName", $itemName);
            $this->pdo->bindValueToStatement(":discount", $itemDiscount);
            $this->pdo->bindValueToStatement(":stock", $itemQuantity);
            $this->pdo->bindValueToStatement(":unitPrice", $itemUnitPrice);
            $this->pdo->bindValueToStatement(":imageURL", $itemImageFileName);
            $this->pdo->bindValueToStatement(":status", $itemStatus);
            $this->pdo->bindValueToStatement(":description", $itemDescription);
            return $this->pdo->executeStatement();
        }

        function updateItem($itemNumber,$itemName,$itemDiscount,$itemQuantity,$itemUnitPrice,$itemImageFileName,$itemStatus,$itemDescription,$itemProductID)
        {
            $sql = "UPDATE item SET itemNumber=:itemNumber, itemName=:itemName,discount=:discount,stock=stock+:stock,unitPrice=:unitPrice,imageURL=:imageURL,status=:status,description=:description WHERE productID = :productID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":itemNumber", $itemNumber);
            $this->pdo->bindValueToStatement(":itemName", $itemName);
            $this->pdo->bindValueToStatement(":discount", $itemDiscount);
            $this->pdo->bindValueToStatement(":stock", $itemQuantity);
            $this->pdo->bindValueToStatement(":unitPrice", $itemUnitPrice);
            $this->pdo->bindValueToStatement(":imageURL", $itemImageFileName);
            $this->pdo->bindValueToStatement(":status", $itemStatus);
            $this->pdo->bindValueToStatement(":description", $itemDescription);
            $this->pdo->bindValueToStatement(":productID", $itemProductID);
            return $this->pdo->executeStatement();
        }

        function deleteItem($itemProductID)
        {
            $sql = "DELETE FROM item WHERE productID = :productID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":productID", $itemProductID);
            return $this->pdo->executeStatement();
        }
    }

    $item = new Item($pdo);
    extract($_POST);

    //Get all available item number in the database
    if(isset($_POST["getItemNumbers"]))
    {
        $results = $item->getAvailableItemNumbers();
        
        echo json_encode($results);
        exit();
    }

    //Get data of selected item
    else if(isset($_POST["getItemData"]))
    {
        $itemNumber = htmlentities($_POST["itemNumber"]);
        $result = $item->getItemData($itemNumber);
        if($result["rowCount"] === 1)
        {
            echo json_encode($result["itemData"]);
            exit();
        } else 
        {
            echo "404";
            exit();
        } 
    } 
    
    //Add item
    else if (isset($_POST["item-add-submitted"])) 
    {
        //Get all data
        $itemNumber = htmlentities($_POST["item-number"]);
        $itemName = htmlentities($_POST["item-name"]);
        $itemDiscount = htmlentities($_POST["item-discount"]);
        $itemQuantity = htmlentities($_POST["item-quantity"]);
        $itemUnitPrice = htmlentities($_POST["item-unit-price"]);
        $itemStatus = htmlentities($_POST["item-status"]);
        $itemDescription = htmlentities($_POST["item-description"]);
        
        

        if ($itemNumber != "" && $itemName != "" && $itemQuantity != "" && $itemUnitPrice != "" && $itemStatus != "")
        {
            if(!is_numeric($itemNumber) || $itemNumber <= 0)
            {
                echo "Please put a valid item number.";
                exit();
            }
            if(!is_numeric($itemDiscount))
            {
                echo "Please put a valid discount.";
                exit();
            }
            if(!is_numeric($itemUnitPrice) || $itemUnitPrice < 0)
            {
                echo "Please put a valid unit price.";
                exit();
            }
            if($itemQuantity <= 0)
            {
                echo "Please put a quantity.";
                exit();
            }

            $itemData = $item->getItemData($itemNumber);
            if($itemData["rowCount"] <= 0)
            {
                if($_FILES["item-image"]["size"] > 0 && $_FILES["item-image"]["error"] == 0)
                {
                    //File upload
                    $itemImage = $_FILES["item-image"];
                    $itemImageName = $itemImage["name"];
                    $itemImageTmpPath = $itemImage["tmp_name"];
                    $itemImageSize = $itemImage["size"];
                    $tmp = explode(".", $itemImageName);
                    $itemImageExtension = end($tmp);
                    $requiredExtensions = array("jpeg","jpg","png");

                    if(in_array($itemImageExtension, $requiredExtensions) == false)
                    {
                        echo "Please use a require image format.";
                        exit();
                    }

                    if($itemImageSize > 500000)
                    {
                        echo "Your image file is too large.";
                        exit();
                    }

                    define("IMAGE_DIRECTORY", "../img/item_images/$itemNumber/");
                    if(!is_dir(IMAGE_DIRECTORY)) {
                        mkdir(IMAGE_DIRECTORY);
                    }
                    move_uploaded_file($itemImageTmpPath,IMAGE_DIRECTORY.$itemImageName);
                    
                    $itemImageFileName = $itemImageName;
                } else 
                {
                    $itemImageFileName = "imageNotAvailable.jpg";
                }
                $isInserted = $item->addItem($itemNumber,$itemName,$itemDiscount,$itemQuantity,$itemUnitPrice,$itemImageFileName,$itemStatus,$itemDescription);

                if($isInserted)
                {
                    echo "Successfully added!";
                    exit();
                } else
                {
                    echo "Error in adding new item.";
                    exit();
                }
            }else 
            {
                echo "Item number already exist. Click \"update\" instead.";
                exit();
            }
        } else 
        {
            echo "Fill all the required(*) field.";
            exit();
        }
    } 
    
    //Update item
    else if (isset($_POST["item-update-submitted"])) 
    {
        //Get all data
        $itemProductID = htmlentities($_POST["item-product-id"]);
        $itemNumber = htmlentities($_POST["item-number"]);
        $itemName = htmlentities($_POST["item-name"]);
        $itemDiscount = htmlentities($_POST["item-discount"]);
        $itemQuantity = htmlentities($_POST["item-quantity"]);
        $itemUnitPrice = htmlentities($_POST["item-unit-price"]);
        $itemImageURL = htmlentities($_POST["item-image-filename"]);
        $itemStatus = htmlentities($_POST["item-status"]);
        $itemDescription = htmlentities($_POST["item-description"]);
        
        

        if ($itemNumber != "" && $itemName != "" && $itemDiscount != "" && $itemQuantity != "" && $itemUnitPrice != "" && $itemStatus != "")
        {
            if(!is_numeric($itemNumber) || $itemNumber <= 0)
            {
                echo "Please put a valid item number.";
                exit();
            }
            if(!is_numeric($itemDiscount) || $itemDiscount < 0)
            {
                echo "Please put a valid discount.";
                exit();
            }
            if(!is_numeric($itemUnitPrice) || $itemUnitPrice < 0)
            {
                echo "Please put a valid unit price.";
                exit();
            }
            
            if($_FILES["item-image"]["size"] > 0 && $_FILES["item-image"]["error"] == 0)
            {
                //File upload
                $itemImage = $_FILES["item-image"];
                $itemImageName = $itemImage["name"];
                $itemImageTmpPath = $itemImage["tmp_name"];
                $itemImageSize = $itemImage["size"];
                $tmp = explode(".", $itemImageName);
                $itemImageExtension = end($tmp);
                $requiredExtensions = array("jpeg","jpg","png");

                if(in_array($itemImageExtension, $requiredExtensions) == false)
                {
                    echo "Please use a require image format.";
                    exit();
                }

                if($itemImageSize > 500000)
                {
                    echo "Your image file is too large.";
                    exit();
                }

                define("IMAGE_DIRECTORY", "../img/item_images/$itemNumber/");
                if(!is_dir(IMAGE_DIRECTORY)) {
                    mkdir(IMAGE_DIRECTORY);
                }
                move_uploaded_file($itemImageTmpPath,IMAGE_DIRECTORY.$itemImageName);
                
                $itemImageFileName = $itemImageName;
            } else 
            {
                $itemImageFileName = $itemImageURL;
            }
            $isUpdated = $item->updateItem($itemNumber,$itemName,$itemDiscount,$itemQuantity,$itemUnitPrice,$itemImageFileName,$itemStatus,$itemDescription,$itemProductID);

            if($isUpdated)
            {
                echo "Successfully updated!";
                exit();
            } else
            {
                echo "Error in updating item.";
                exit();
            }
        } else 
        {
            echo "Fill all the required(*) field.";
            exit();
        }
    } 
    
    //Delete item
    else if (isset($_POST["deleteItemProductID"])) 
    {
        $itemProductID = htmlentities($_POST["deleteItemProductID"]);
        $isDeleted = $item->deleteItem($itemProductID);
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