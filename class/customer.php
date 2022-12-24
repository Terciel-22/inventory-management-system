<?php 

    require_once("../config/config.php");

    class Customer extends PDOHandler
    {
        private $pdo;

        function __construct($pdo)
        {
            $this->pdo = $pdo;
        }

        function getCustomerRecords()
        {
            $sql = "SELECT * FROM customer";
            $this->pdo->prepareQuery($sql);
            return $this->pdo->getAllResults();
        }

        function getCustomerData($customerID)
        {
            $sql = "SELECT * FROM customer WHERE customerID = :customerID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":customerID", $customerID);
            $customerData = $this->pdo->getAllResults();
            $rowCount = $this->pdo->getAffectedRowCount();
            return ["customerData" => $customerData, "rowCount" => $rowCount];
        }

        function addCustomer($customerFullName,$customerStatus,$customerMobileNumber,$customerTelephoneNumber,$customerEmail,$customerAddress,$customerRegion,$customerProvince,$customerCityMunicipality,$customerBarangay)
        {
            $sql = "INSERT INTO customer(fullName,mobileNumber,telephoneNumber,email,address,region,province,city_municipality,barangay,status) VALUES (:fullName,:mobileNumber,:telephoneNumber,:email,:address,:region,:province,:city_municipality,:barangay,:status)";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":fullName", $customerFullName);
            $this->pdo->bindValueToStatement(":mobileNumber", $customerMobileNumber);
            $this->pdo->bindValueToStatement(":telephoneNumber", $customerTelephoneNumber);
            $this->pdo->bindValueToStatement(":email", $customerEmail);
            $this->pdo->bindValueToStatement(":address", $customerAddress);
            $this->pdo->bindValueToStatement(":region", $customerRegion);
            $this->pdo->bindValueToStatement(":province", $customerProvince);
            $this->pdo->bindValueToStatement(":city_municipality", $customerCityMunicipality);
            $this->pdo->bindValueToStatement(":barangay", $customerBarangay);
            $this->pdo->bindValueToStatement(":status", $customerStatus);
            return $this->pdo->executeStatement();
        }

        function updateCustomer($customerFullName,$customerStatus,$customerMobileNumber,$customerTelephoneNumber,$customerEmail,$customerAddress,$customerRegion,$customerProvince,$customerCityMunicipality,$customerBarangay,$customerID)
        {
            $sql = "UPDATE customer SET fullName=:fullName,mobileNumber=:mobileNumber,telephoneNumber=:telephoneNumber,email=:email,address=:address,region=:region,province=:province,city_municipality=:city_municipality,barangay=:barangay,status=:status WHERE customerID = :customerID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":fullName", $customerFullName);
            $this->pdo->bindValueToStatement(":mobileNumber", $customerMobileNumber);
            $this->pdo->bindValueToStatement(":telephoneNumber", $customerTelephoneNumber);
            $this->pdo->bindValueToStatement(":email", $customerEmail);
            $this->pdo->bindValueToStatement(":address", $customerAddress);
            $this->pdo->bindValueToStatement(":region", $customerRegion);
            $this->pdo->bindValueToStatement(":province", $customerProvince);
            $this->pdo->bindValueToStatement(":city_municipality", $customerCityMunicipality);
            $this->pdo->bindValueToStatement(":barangay", $customerBarangay);
            $this->pdo->bindValueToStatement(":status", $customerStatus);
            $this->pdo->bindValueToStatement(":customerID", $customerID);
            return $this->pdo->executeStatement();
        }

        function deleteCustomer($customerID)
        {
            $sql = "DELETE FROM customer WHERE customerID = :customerID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":customerID", $customerID);
            return $this->pdo->executeStatement();
        }
    } 

    $customer = new Customer($pdo);
    extract($_POST);
    define("VALID_PHONE_NUMBER","/^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$/");
    define("VALID_EMAIL","");

    if(isset($_POST["getCustomerRecords"]))
    {
        $results = $customer->getCustomerRecords();
        
        echo json_encode($results);
        exit();
    }

    else if(isset($_POST["getCustomerData"]))
    {
        $customerID = htmlentities($_POST["customerID"]);
        if(!is_numeric($customerID))
        {
            echo "404";
            exit();
        }

        $result = $customer->getCustomerData($customerID);
        if($result["rowCount"] === 1)
        {
            echo json_encode($result["customerData"]);
            exit();
        } else 
        {
            echo "404";
            exit();
        }
    }

    else if(isset($_POST["customer-add-submitted"]))
    {
        $customerFullName = htmlentities($_POST["customer-fullname"]);
        $customerStatus = htmlentities($_POST["customer-status"]);
        $customerID = htmlentities($_POST["customer-id"]);
        $customerMobileNumber = htmlentities($_POST["customer-mobile-number"]);
        $customerTelephoneNumber = htmlentities($_POST["customer-telephone-number"]);
        $customerEmail = htmlentities($_POST["customer-email"]);
        $customerAddress = htmlentities($_POST["customer-address"]);
        $customerRegion = htmlentities($_POST["customer-region"]);

        if(isset($_POST["customer-province"]))
        {
            $customerProvince = htmlentities($_POST["customer-province"]);
        } else
        {
            $customerProvince = "";
        }
        if(isset($_POST["customer-city-municipality"]))
        {
            $customerCityMunicipality = htmlentities($_POST["customer-city-municipality"]);
        } else
        {
            $customerCityMunicipality = "";
        }
        if(isset($_POST["customer-barangay"]))
        {
            $customerBarangay = htmlentities($_POST["customer-barangay"]);
        } else
        {
            $customerBarangay = "";
        }

        if($customerID != "")
        {
            echo "Customer ID is auto-generated when adding.";
            exit();
        }

        if($customerFullName != "" && $customerStatus != "" && $customerMobileNumber != "" && $customerEmail != "" && $customerAddress != ""
        && $customerRegion != "")
        {
            if(!preg_match(VALID_PHONE_NUMBER,$customerMobileNumber))
            {
                echo "Invalid mobile number.";
                exit();
            }
            if($customerTelephoneNumber!="")
            {
                if(!preg_match(VALID_PHONE_NUMBER,$customerTelephoneNumber))
                {
                    echo "Invalid telephone number.";
                    exit();
                }
            } 
            if(!preg_match("/^[A-z0-9_\-]+[@][A-z0-9_\-]+([.][A-z0-9_\-]+)+[A-z.]{2,4}$/", $customerEmail))
            {
                echo "Invalid E-mail.";
                exit();
            }


            $isAdded = $customer->addCustomer($customerFullName,$customerStatus,$customerMobileNumber,$customerTelephoneNumber,$customerEmail,$customerAddress,$customerRegion,$customerProvince,$customerCityMunicipality,$customerBarangay);

            if($isAdded)
            {
                echo "Successfully added!";
                exit();
            } else
            {
                echo "Error in adding customer!";
                exit();
            }

        } else
        {
            echo "Fill all the required(*) field.";
            exit();
        }
    }

    else if(isset($_POST["customer-update-submitted"]))
    {
        $customerFullName = htmlentities($_POST["customer-fullname"]);
        $customerStatus = htmlentities($_POST["customer-status"]);
        $customerID = htmlentities($_POST["customer-id"]);
        $customerMobileNumber = htmlentities($_POST["customer-mobile-number"]);
        $customerTelephoneNumber = htmlentities($_POST["customer-telephone-number"]);
        $customerEmail = htmlentities($_POST["customer-email"]);
        $customerAddress = htmlentities($_POST["customer-address"]);
        $customerRegion = htmlentities($_POST["customer-region"]);

        if(isset($_POST["customer-province"]))
        {
            $customerProvince = htmlentities($_POST["customer-province"]);
        } else
        {
            $customerProvince = "";
        }
        if(isset($_POST["customer-province"]))
        {
            $customerCityMunicipality = htmlentities($_POST["customer-city-municipality"]);
        } else
        {
            $customerCityMunicipality = "";
        }
        if(isset($_POST["customer-province"]))
        {
            $customerBarangay = htmlentities($_POST["customer-barangay"]);
        } else
        {
            $customerBarangay = "";
        }

        if($customerFullName != "" && $customerStatus != "" && $customerMobileNumber != "" && $customerEmail != "" && $customerAddress != ""
        && $customerRegion != "" && $customerID != "")
        {
            if(!preg_match(VALID_PHONE_NUMBER,$customerMobileNumber))
            {
                echo "Invalid mobile number.";
                exit();
            }
            if($customerTelephoneNumber!="")
            {
                if(!preg_match(VALID_PHONE_NUMBER,$customerTelephoneNumber))
                {
                    echo "Invalid telephone number.";
                    exit();
                }
            } 
            if(!preg_match("/^[A-z0-9_\-]+[@][A-z0-9_\-]+([.][A-z0-9_\-]+)+[A-z.]{2,4}$/", $customerEmail))
            {
                echo "Invalid E-mail.";
                exit();
            }


            $isUpdated = $customer->updateCustomer($customerFullName,$customerStatus,$customerMobileNumber,$customerTelephoneNumber,$customerEmail,$customerAddress,$customerRegion,$customerProvince,$customerCityMunicipality,$customerBarangay,$customerID);

            if($isUpdated)
            {
                echo "Successfully updated!";
                exit();
            } else
            {
                echo "Error in adding customer!";
                exit();
            }

        } else
        {
            echo "Fill all the required(*) field.";
            exit();
        }
    }

    else if (isset($_POST["deleteCustomerID"])) 
    {
        $customerID = htmlentities($_POST["deleteCustomerID"]);
        $isDeleted = $customer->deleteCustomer($customerID);
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