<?php 
    
    define("DBMS", "mysql");
    define("HOST", "localhost");
    define("DB_NAME", "shop_inventory");
    define("PORT", "3306");
    define("CHARSET", "utf8mb4");
    define("USERNAME", "root");
    define("PASSWORD", "");
    define("OPTIONS", array("PDO::ATTR_ERRMODE" => "PDO::ERRMODE_EXCEPTION"));

    $dns = sprintf("%s:localhost=%s;dbname=%s;port=%s;charset=%s",DBMS,HOST,DB_NAME,PORT,CHARSET);

    require_once("pdo.php");
    $pdo = new PDOHandler($dns,USERNAME,PASSWORD,OPTIONS);
?>