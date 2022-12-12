<?php 

    class PDOHandler{
        private $stmt, $dbhandler;

        function __construct($dns,$username,$password,$options)
        {
            try {
                $this->dbhandler = new PDO($dns,$username,$password,$options);
            } catch (PDOException $e)
            {
                echo "Error in connecting to database: " .$e->getMessage();
                exit();
            }
        }

        protected function prepareQuery($sql)
        {
            $this->stmt = $this->dbhandler->prepare($sql);
        }

        protected function bindValueToStatement($param,$value,$type=null)
        {
            if(is_null($type))
            {
                switch(true)
                {
                    case is_int($value):
                        $type = PDO::PARAM_INT;
                        break;
                    case is_bool($value):
                        $type = PDO::PARAM_BOOL;
                        break;
                    case is_null($value):
                        $type = PDO::PARAM_NULL;
                        break;
                    default:
                        $type = PDO::PARAM_STR;
                }
            }
            $this->stmt->bindValue($param,$value,$type);
        }

        protected function executeStatement()
        {
            try {
                $this->stmt->execute();
                return true;
            } catch (PDOException $e)
            {
                echo "Error in executing statement: " .$e->getMessage();
                exit();
            }
        }

        protected function getAffectedRowCount()
        {
            return $this->stmt->rowCount();
        }

        protected function getSingleResult()
        {
            $isExecuted = $this->executeStatement();
            if($isExecuted){
                return $this->stmt->fetch(PDO::FETCH_OBJ); 
            }
        }

        protected function getAllResults()
        {
            $isExecuted = $this->executeStatement();
            if($isExecuted){
                return $this->stmt->fetchAll(PDO::FETCH_OBJ); 
            }
        }
    }
?>