<?php 

    require_once("../config/config.php");

    class Item extends PDOHandler
    {
        private $pdo;

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
            return ['itemData' => $itemData, 'rowCount' => $rowCount];
        }
    }

    $item = new Item($pdo);

    if(isset($_POST['getItemNumbers']))
    {
        $results = $item->getAvailableItemNumbers();
        
        echo json_encode($results);
        exit();
    }
    else if(isset($_POST['getItemNumberData']))
    {
        $itemNumber = htmlentities($_POST['itemNumber']);
        $result = $item->getItemData($itemNumber);
        if($result['rowCount'] === 1)
        {
            echo json_encode($result['itemData']);
            exit();
        } else 
        {
            echo "404";
        }
        
    }
?>