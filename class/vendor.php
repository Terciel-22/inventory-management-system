<?php 

    require_once("../config/config.php");

    class Vendor extends PDOHandler
    {
        private $pdo;

        function __construct($pdo)
        {
            $this->pdo = $pdo;
        }

        function getAvailableVendorIDs()
        {
            $sql = "SELECT vendorID FROM vendor";
            $this->pdo->prepareQuery($sql);
            return $this->pdo->getAllResults();
        }

        function getAllVendorNames()
        {
            $sql = "SELECT fullName,vendorID from vendor WHERE status = 'Active'";
            $this->pdo->prepareQuery($sql);
            return $this->pdo->getAllResults();
        }

        function getVendorData($vendorID)
        {
            $sql = "SELECT * FROM vendor WHERE vendorID = :vendorID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":vendorID", $vendorID);
            $vendorData = $this->pdo->getAllResults();
            $rowCount = $this->pdo->getAffectedRowCount();
            return ["vendorData" => $vendorData, "rowCount" => $rowCount];
        }

        function addVendor($vendorFullName,$vendorStatus,$vendorMobileNumber,$vendorTelephoneNumber,$vendorEmail,$vendorAddress,$vendorRegion,$vendorProvince,$vendorCityMunicipality,$vendorBarangay)
        {
            $sql = "INSERT INTO vendor(fullName,mobileNumber,telephoneNumber,email,address,region,province,city_municipality,barangay,status) VALUES (:fullName,:mobileNumber,:telephoneNumber,:email,:address,:region,:province,:city_municipality,:barangay,:status)";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":fullName", $vendorFullName);
            $this->pdo->bindValueToStatement(":mobileNumber", $vendorMobileNumber);
            $this->pdo->bindValueToStatement(":telephoneNumber", $vendorTelephoneNumber);
            $this->pdo->bindValueToStatement(":email", $vendorEmail);
            $this->pdo->bindValueToStatement(":address", $vendorAddress);
            $this->pdo->bindValueToStatement(":region", $vendorRegion);
            $this->pdo->bindValueToStatement(":province", $vendorProvince);
            $this->pdo->bindValueToStatement(":city_municipality", $vendorCityMunicipality);
            $this->pdo->bindValueToStatement(":barangay", $vendorBarangay);
            $this->pdo->bindValueToStatement(":status", $vendorStatus);
            return $this->pdo->executeStatement();
        }

        function updateVendor($vendorFullName,$vendorStatus,$vendorMobileNumber,$vendorTelephoneNumber,$vendorEmail,$vendorAddress,$vendorRegion,$vendorProvince,$vendorCityMunicipality,$vendorBarangay,$vendorID)
        {
            $sql = "UPDATE vendor SET fullName=:fullName,mobileNumber=:mobileNumber,telephoneNumber=:telephoneNumber,email=:email,address=:address,region=:region,province=:province,city_municipality=:city_municipality,barangay=:barangay,status=:status WHERE vendorID = :vendorID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":fullName", $vendorFullName);
            $this->pdo->bindValueToStatement(":mobileNumber", $vendorMobileNumber);
            $this->pdo->bindValueToStatement(":telephoneNumber", $vendorTelephoneNumber);
            $this->pdo->bindValueToStatement(":email", $vendorEmail);
            $this->pdo->bindValueToStatement(":address", $vendorAddress);
            $this->pdo->bindValueToStatement(":region", $vendorRegion);
            $this->pdo->bindValueToStatement(":province", $vendorProvince);
            $this->pdo->bindValueToStatement(":city_municipality", $vendorCityMunicipality);
            $this->pdo->bindValueToStatement(":barangay", $vendorBarangay);
            $this->pdo->bindValueToStatement(":status", $vendorStatus);
            $this->pdo->bindValueToStatement(":vendorID", $vendorID);
            return $this->pdo->executeStatement();
        }

        function deleteVendor($vendorID)
        {
            $sql = "DELETE FROM vendor WHERE vendorID = :vendorID";
            $this->pdo->prepareQuery($sql);
            $this->pdo->bindValueToStatement(":vendorID", $vendorID);
            return $this->pdo->executeStatement();
        }
    } 

    $vendor = new Vendor($pdo);
    extract($_POST);
    define("VALID_PHONE_NUMBER","/^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$/");
    define("VALID_EMAIL","");

    if(isset($_POST["getVendorIDs"]))
    {
        $results = $vendor->getAvailableVendorIDs();
        
        echo json_encode($results);
        exit();
    }

    else if(isset($_POST["getAllVendorNames"]))
    {
        $results = $vendor->getAllVendorNames();
        echo json_encode($results);
        exit();
    }

    else if(isset($_POST["getVendorData"]))
    {
        $vendorID = htmlentities($_POST["vendorID"]);
        if(!is_numeric($vendorID))
        {
            echo "404";
            exit();
        }

        $result = $vendor->getVendorData($vendorID);
        if($result["rowCount"] === 1)
        {
            echo json_encode($result["vendorData"]);
            exit();
        } else 
        {
            echo "404";
            exit();
        }
    }

    else if(isset($_POST["vendor-add-submitted"]))
    {
        $vendorFullName = htmlentities($_POST["vendor-fullname"]);
        $vendorStatus = htmlentities($_POST["vendor-status"]);
        $vendorID = htmlentities($_POST["vendor-id"]);
        $vendorMobileNumber = htmlentities($_POST["vendor-mobile-number"]);
        $vendorTelephoneNumber = htmlentities($_POST["vendor-telephone-number"]);
        $vendorEmail = htmlentities($_POST["vendor-email"]);
        $vendorAddress = htmlentities($_POST["vendor-address"]);
        $vendorRegion = htmlentities($_POST["vendor-region"]);

        if(isset($_POST["vendor-province"]))
        {
            $vendorProvince = htmlentities($_POST["vendor-province"]);
        } else
        {
            $vendorProvince = "";
        }
        if(isset($_POST["vendor-city-municipality"]))
        {
            $vendorCityMunicipality = htmlentities($_POST["vendor-city-municipality"]);
        } else
        {
            $vendorCityMunicipality = "";
        }
        if(isset($_POST["vendor-barangay"]))
        {
            $vendorBarangay = htmlentities($_POST["vendor-barangay"]);
        } else
        {
            $vendorBarangay = "";
        }

        if($vendorID != "")
        {
            echo "Vendor ID is auto-generated when adding.";
            exit();
        }

        if($vendorFullName != "" && $vendorStatus != "" && $vendorMobileNumber != "" && $vendorEmail != "" && $vendorAddress != ""
        && $vendorRegion != "")
        {
            if(!preg_match(VALID_PHONE_NUMBER,$vendorMobileNumber))
            {
                echo "Invalid mobile number.";
                exit();
            }
            if($vendorTelephoneNumber!="")
            {
                if(!preg_match(VALID_PHONE_NUMBER,$vendorTelephoneNumber))
                {
                    echo "Invalid telephone number.";
                    exit();
                }
            } 
            if(!preg_match("/^[A-z0-9_\-]+[@][A-z0-9_\-]+([.][A-z0-9_\-]+)+[A-z.]{2,4}$/", $vendorEmail))
            {
                echo "Invalid E-mail.";
                exit();
            }


            $isAdded = $vendor->addVendor($vendorFullName,$vendorStatus,$vendorMobileNumber,$vendorTelephoneNumber,$vendorEmail,$vendorAddress,$vendorRegion,$vendorProvince,$vendorCityMunicipality,$vendorBarangay);

            if($isAdded)
            {
                echo "Successfully added!";
                exit();
            } else
            {
                echo "Error in adding vendor!";
                exit();
            }

        } else
        {
            echo "Fill all the required(*) field.";
            exit();
        }
    }

    else if(isset($_POST["vendor-update-submitted"]))
    {
        $vendorFullName = htmlentities($_POST["vendor-fullname"]);
        $vendorStatus = htmlentities($_POST["vendor-status"]);
        $vendorID = htmlentities($_POST["vendor-id"]);
        $vendorMobileNumber = htmlentities($_POST["vendor-mobile-number"]);
        $vendorTelephoneNumber = htmlentities($_POST["vendor-telephone-number"]);
        $vendorEmail = htmlentities($_POST["vendor-email"]);
        $vendorAddress = htmlentities($_POST["vendor-address"]);
        $vendorRegion = htmlentities($_POST["vendor-region"]);

        if(isset($_POST["vendor-province"]))
        {
            $vendorProvince = htmlentities($_POST["vendor-province"]);
        } else
        {
            $vendorProvince = "";
        }
        if(isset($_POST["vendor-province"]))
        {
            $vendorCityMunicipality = htmlentities($_POST["vendor-city-municipality"]);
        } else
        {
            $vendorCityMunicipality = "";
        }
        if(isset($_POST["vendor-province"]))
        {
            $vendorBarangay = htmlentities($_POST["vendor-barangay"]);
        } else
        {
            $vendorBarangay = "";
        }

        if($vendorFullName != "" && $vendorStatus != "" && $vendorMobileNumber != "" && $vendorEmail != "" && $vendorAddress != ""
        && $vendorRegion != "" && $vendorID != "")
        {
            if(!preg_match(VALID_PHONE_NUMBER,$vendorMobileNumber))
            {
                echo "Invalid mobile number.";
                exit();
            }
            if($vendorTelephoneNumber!="")
            {
                if(!preg_match(VALID_PHONE_NUMBER,$vendorTelephoneNumber))
                {
                    echo "Invalid telephone number.";
                    exit();
                }
            } 
            if(!preg_match("/^[A-z0-9_\-]+[@][A-z0-9_\-]+([.][A-z0-9_\-]+)+[A-z.]{2,4}$/", $vendorEmail))
            {
                echo "Invalid E-mail.";
                exit();
            }


            $isUpdated = $vendor->updateVendor($vendorFullName,$vendorStatus,$vendorMobileNumber,$vendorTelephoneNumber,$vendorEmail,$vendorAddress,$vendorRegion,$vendorProvince,$vendorCityMunicipality,$vendorBarangay,$vendorID);

            if($isUpdated)
            {
                echo "Successfully updated!";
                exit();
            } else
            {
                echo "Error in adding vendor!";
                exit();
            }

        } else
        {
            echo "Fill all the required(*) field.";
            exit();
        }
    }

    else if (isset($_POST["deleteVendorID"])) 
    {
        $vendorID = htmlentities($_POST["deleteVendorID"]);
        $isDeleted = $vendor->deleteVendor($vendorID);
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