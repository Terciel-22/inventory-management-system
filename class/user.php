<?php 
    require_once("../config/config.php");

    class User extends PDOHandler
    {
        private $pdo;

        function __construct($pdo)
        {
            $this->pdo = $pdo;
        }

        function registerAccount($name, $username, $password)
        {
            $sql = "INSERT INTO user (fullName,username,password) VALUES (:name,:username,:password)";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":name",$name);
            $this->pdo->bindValueToStatement(":username",$username);
            $this->pdo->bindValueToStatement(":password",$password);
            return $this->pdo->executeStatement();
        }

        function checkIfUsernameExist($username)
        {
            $sql = "SELECT * FROM user WHERE username = :username";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":username",$username);
            $this->pdo->executeStatement();
            $rowNum = $this->pdo->getAffectedRowCount();
            if($rowNum >= 1)
            {
                return "Existing";
            } 
        }
    }

    $user = new User($pdo);

    //Validation for register
    if(isset($_POST["registerButton"]))
    {
        $name = htmlentities($_POST["registerName"]);
        $username = htmlentities($_POST["registerUsername"]);
        $password = htmlentities($_POST["registerPassword"]);
        $cpassword = htmlentities($_POST["registerCPassword"]);

        if(!($name == "" || $username == "" || $password == "" || $cpassword == ""))
        {
            if($user->checkIfUsernameExist($username) != "Existing")
            {
                if($password === $cpassword)
                {
                    $hashPassword = md5($cpassword);
                    $isRegistered = $user->registerAccount($name, $username, $hashPassword);
                    if($isRegistered)
                    {
                        echo "Account successfully added!";
                        exit();
                    } else
                    {
                        echo "Error in registration!";
                        exit();
                    }
                } else 
                {
                    echo "Password and Confirm password does not match.";
                    exit();
                }
            } else 
            {
                echo "Username already exist.";
                exit();
            }
        } else 
        {
            echo "Please insert all required field.";
            exit();
        }
    }
?>