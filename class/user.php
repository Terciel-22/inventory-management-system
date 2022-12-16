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
            } else
            {
                return "Username doesn't exist!";
            }
        }

        function loginAccount($username, $password)
        {
            $sql = "SELECT * FROM user WHERE username = :username AND password = :password"; 
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":username",$username);
            $this->pdo->bindValueToStatement(":password",$password);
            $userData = $this->pdo->getSingleResult();
            $recordCount = $this->pdo->getAffectedRowCount();
            return ['user-data' => $userData, 'record-count' => $recordCount];
        }
    }

    $user = new User($pdo);
    session_start();
    extract($_POST);

    //Validation for registration form
    if(isset($_POST["register-submitted"]))
    {
        $name = htmlentities($_POST["register-name"]);
        $username = htmlentities($_POST["register-username"]);
        $password = htmlentities($_POST["register-password"]);
        $cpassword = htmlentities($_POST["register-cpassword"]);

        if($name != "" && $username != "" && $password != "" && $cpassword != "")
        {
            if($user->checkIfUsernameExist($username) != "Existing")
            {
                if($password === $cpassword)
                {
                    $hashPassword = md5($cpassword);
                    $isRegistered = $user->registerAccount(ucwords($name), $username, $hashPassword);
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

    //Validation for login form
    else if(isset($_POST["login-submitted"]))
    {
        $username = htmlentities($_POST["login-username"]);
        $password = htmlentities($_POST["login-password"]);
        $hashPassword = md5($password);
        if($username != "" && $password != "")
        {
            $isUsernameExist = $user->checkIfUsernameExist($username);
            if($isUsernameExist == "Existing")
            {
                $userAccount = $user->loginAccount($username, $hashPassword);
                if($userAccount['record-count'] == 1)
                {
                    $accountName = $userAccount['user-data']->fullName;
                    echo "Logging in...";
                    $_SESSION['fullName'] = $accountName;
                    exit();
                } else 
                {
                    echo "Incorrect password!";
                    exit();
                }
            } else
            {
                echo $isUsernameExist;
                exit();
            }
        } else 
        {
            echo "Please insert all required field.";
            exit();
        }
    }

    //Logout account
    else if(isset($_POST["logoutButton"]))
    {
        session_unset();
        session_destroy();
        echo "Logging out...";
        exit();
    }

    //Prevent direct access this file from URL
    else {
        header("Location: ../");
    }
?>