$(document).ready(function(){
    getAllRegions();
    $("#customer-region").on("change", ()=> {
        if($("#customer-region").val() != "")
        {
            $("#customer-province").val("");
            $("#customer-province").attr("disabled","disabled");
            $("#customer-city-municipality").val("");
            $("#customer-city-municipality").attr("disabled","disabled");
            $("#customer-barangay").val("");
            $("#customer-barangay").attr("disabled","disabled");

            regionArr = $("#customer-region").val().split("|");
            if(regionArr[1] == NCR_CODE)
            {
                getAllCitiesAndMunicipalities(regionArr[1],()=>{});
            } else
            {
                getAllProvinces(regionArr[1],()=>{});
            }
        }
    });
    $("#customer-province").on("change", ()=> {
        if($("#customer-province").val() != "")
        {
            $("#customer-city-municipality").val("");
            $("#customer-city-municipality").attr("disabled","disabled");
            $("#customer-barangay").val("");
            $("#customer-barangay").attr("disabled","disabled");

            provinceArr = $("#customer-province").val().split("|");
            getAllCitiesAndMunicipalities(provinceArr[1],()=>{});
        }
    });
    $("#customer-city-municipality").on("change", ()=> {
        if($("#customer-city-municipality").val() != "")
        {
            $("#customer-barangay").val("");
            $("#customer-barangay").attr("disabled","disabled");
            cityMunicipalityArr = $("#customer-city-municipality").val().split("|");
            getAllBarangay(cityMunicipalityArr[1],()=>{});
        }
    });

    //CRUD
    $("#customer-id").on("focus",getCustomerIDs); //For auto-complete
    $("#customer-id").on("input change focusout", getCustomerData);
    $("#customer-add-button").on("click", addCustomer);
    $("#customer-update-button").on("click", updateCustomer);
    $("#customer-delete-button").on("click", deleteCustomer);
    $("#customer-clear-button").on("click", ()=>{
        $("#customer-id").val("");
        customerFormSetToDefault(true);
    });
});

function getAllRegions()
{
    let regions = [];
    function getRegionsFromAPI(){
        return $.ajax({
            method: "GET",
            url: "https://psgc.gitlab.io/api/regions/",
            dataType: "JSON",
            success: function(results)
            {
                for(let i=0; i<results.length; i++)
                {
                    let tempArr = [results[i].name,results[i].code];
                    regions.push(tempArr);
                }
            }
        });
    }

    $.when(getRegionsFromAPI()).done(()=>{
        sortedRegions = regions.sort();
        let options = `<option value="" selected hidden>-Select Region-</option>`;
        for(let i=0;i<sortedRegions.length;i++)
        {
            options += `<option value="${sortedRegions[i][0]}|${sortedRegions[i][1]}">${sortedRegions[i][0]}</option>`;
        }
        $("#customer-region").html(options);
    });
}
function getAllProvinces(regionCode, callback)
{
    $("#customer-city-municipality").attr("disabled","disabled");
    let provinces = [];
    let sortedProvinces = [];

    function getProvincesFromAPI()
    {
        return $.ajax({
            method: "GET",
            url: `https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`,
            dataType: "JSON",
            success: function(results)
            {
                for(let i=0; i<results.length; i++)
                {
                    let tempArr = [results[i].name,results[i].code];
                    provinces.push(tempArr);
                }
            }
        });
    }

    $.when(getProvincesFromAPI()).done(function(){
        sortedProvinces = provinces.sort();
        let options = `<option value="" selected hidden>-Select Province-</option>`;
        for(let i=0;i<sortedProvinces.length;i++)
        {
            options += `<option value="${sortedProvinces[i][0]}|${sortedProvinces[i][1]}">${sortedProvinces[i][0]}</option>`;
        }
        $("#customer-province").html(options);
        $("#customer-province").removeAttr("disabled");
        callback();
    });
}
function getAllCitiesAndMunicipalities(code, callback)
{
    let citiesAndMunicipalities = [];
    let sortedCitiesAndMunicipalities = [];

    function getCitiesMunicipalitiesFromAPI()
    {
        if(code == 130000000) //Metro Manila code
        {
            return $.ajax({
                method: "GET",
                url: `https://psgc.gitlab.io/api/regions/130000000/cities-municipalities/`,
                dataType: "JSON",
                success: function(results)
                {
                    for(let i=0; i<results.length; i++)
                    {
                        let tempArr = [results[i].name,results[i].code];
                        citiesAndMunicipalities.push(tempArr);
                    }
                }
            });
        }else
        {
            return $.ajax({
                method: "GET",
                url: `https://psgc.gitlab.io/api/provinces/${code}/cities-municipalities/`,
                dataType: "JSON",
                success: function(results)
                {
                    for(let i=0; i<results.length; i++)
                    {
                        let tempArr = [results[i].name,results[i].code];
                        citiesAndMunicipalities.push(tempArr);
                    }
                }
            });
        }
    }

    $.when(getCitiesMunicipalitiesFromAPI()).done(function(){
        sortedCitiesAndMunicipalities = citiesAndMunicipalities.sort();
        let options = `<option value="" selected hidden>-Select City/Municipality-</option>`;
        for(let i=0;i<sortedCitiesAndMunicipalities.length;i++)
        {
            options += `<option value="${sortedCitiesAndMunicipalities[i][0]}|${sortedCitiesAndMunicipalities[i][1]}">${sortedCitiesAndMunicipalities[i][0]}</option>`;
        }
        $("#customer-city-municipality").html(options);
        $("#customer-city-municipality").removeAttr("disabled");
        callback();
    });
}
function getAllBarangay(cityMunicipalitycode,callback)
{
    let barangays = [];
    let sortedBarangays = [];

    function getBarangayFromAPI()
    {
        return $.ajax({
            method: "GET",
            url: `https://psgc.gitlab.io/api/cities-municipalities/${cityMunicipalitycode}/barangays/`,
            dataType: "JSON",
            success: function(results)
            {
                for(let i=0; i<results.length; i++)
                {
                    let tempArr = [results[i].name,results[i].code];
                    barangays.push(tempArr);
                }
            }
        });
    }

    $.when(getBarangayFromAPI()).done(function(){
        sortedBarangays = barangays.sort();
        let options = `<option value="" selected hidden>-Select Barangay-</option>`;
        for(let i=0;i<sortedBarangays.length;i++)
        {
            options += `<option value="${sortedBarangays[i][0]}|${sortedBarangays[i][1]}">${sortedBarangays[i][0]}</option>`;
        }
        $("#customer-barangay").html(options);
        $("#customer-barangay").removeAttr("disabled");
        callback();
    });
}

//CRUD
function getCustomerIDs()
{
    let customerIDs = [];
    function getCustomerIDsFromDB()
    {
        return $.ajax({
            method: "POST",
            url: "class/customer.php",
            dataType: "JSON",
            data: {getCustomerIDs:true},
            success: function(result)
            {
                let values = Object.values(result);
                for(let i=0; i<values.length; i++)
                {
                    customerIDs.push(String(values[i].customerID));
                }
            }
        });
    }
    
    $.when(getCustomerIDsFromDB()).done(()=>{
        //For item form
        $( "#customer-id" ).autocomplete({
            source: customerIDs
        });
    });
}

function getCustomerData()
{
    const customerID = $("#customer-id").val();
    if(customerID != "")
    {
        $.ajax({
            method: "POST",
            url: "class/customer.php",
            dataType: "JSON",
            data: {
                getCustomerData:true,
                customerID:customerID
            },
            success: function(result)
            {
                if(result != "404")
                {
                    let customerData = result[0];
                    
                    $("#customer-fullname").val(customerData["fullName"]);
                    $("#customer-status").val(customerData["status"]);
                    $("#customer-mobile-number").val(customerData["mobileNumber"]);
                    $("#customer-telephone-number").val(customerData["telephoneNumber"]);
                    $("#customer-email").val(customerData["email"]);
                    $("#customer-address").val(customerData["address"]);
                    $("#customer-region").val(customerData["region"]);
                    regionArr = customerData["region"].split("|");
                    if(customerData["province"] != "")
                    {
                        if(regionArr[1] != NCR_CODE)
                        {
                            getAllProvinces(regionArr[1], ()=>{
                                $("#customer-province").val(customerData["province"]);
                            });
                        }
                    }
                    if(customerData["city_municipality"] != "")
                    {
                        if(regionArr[1] == NCR_CODE)
                        {
                            code = regionArr[1];
                        } else
                        {
                            provinceArr = customerData["province"].split("|");
                            code = provinceArr[1];
                        }
                        
                        getAllCitiesAndMunicipalities(code, ()=>{
                            $("#customer-city-municipality").val(customerData["city_municipality"]);
                        });
                    }
                    if(customerData["customer-barangay"] != "")
                    {
                        cityMunicipalityArr = customerData["city_municipality"].split("|");
                        
                        getAllBarangay(cityMunicipalityArr[1], ()=>{
                            $("#customer-barangay").val(customerData["barangay"]);
                        });
                    }

                    $("#customer-update-button").prop("disabled",false);
                    $("#customer-delete-button").prop("disabled",false);
                } else
                {
                    $("#customer-update-button").prop("disabled",true);
                    $("#customer-delete-button").prop("disabled",true);
                    customerFormSetToDefault(true);
                }
            }
        });
    }else
    {
        customerFormSetToDefault(true);
    }
}

function addCustomer()
{
    $("#customer-id").val("");
    const customerForm = $("#customer-form");
    const customerFormURL = customerForm.attr("action");
    const customerFormData = customerForm.serializeArray();
    customerFormData.push({name: "customer-add-submitted", value: "true"});
    $.ajax({
        method: "POST",
        url: customerFormURL,
        data: customerFormData,
        success: function (result) {
            if(result == "Successfully Added!")
            {
                customerFormSetToDefault(false);
                getCustomerData();
            }
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#customerform-errmessage").html(message);
        }
    });
}

function updateCustomer()
{
    const customerForm = $("#customer-form");
    const customerFormURL = customerForm.attr("action");
    const customerFormData = customerForm.serializeArray();
    customerFormData.push({name: "customer-update-submitted", value: "true"});
    $.ajax({
        method: "POST",
        url: customerFormURL,
        data: customerFormData,
        success: function (result) {
            if(result == "Successfully Updated!")
            {
                customerFormSetToDefault(false);
                getCustomerData();
            }
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#customerform-errmessage").html(message);
        }
    });
}

function deleteCustomer() //Delete selected customer
{
    const customerID = $("#customer-id").val();
    
    if(confirm("Are you sure you want to delete it?"))
    {
        $.ajax({
            method: "POST",
            url: "class/customer.php",
            data: {deleteCustomerID:customerID},
            success: function (result) {
                message = `<div class='alert alert-danger'>${result}</div>`;
                $("#customerform-errmessage").html(message);
                if(result=="Successfully deleted!")
                {
                    $("#customer-id").val("");
                    customerFormSetToDefault(false);
                }
            }
        });
    }
}

function customerFormSetToDefault(deleteMessage)
{
    if(deleteMessage)
    {
        message = "";
        $("#customerform-errmessage").html(message);
    }

    $("#customer-fullname").val("");
    $("#customer-status").val("");
    $("#customer-mobile-number").val("");
    $("#customer-telephone-number").val("");
    $("#customer-email").val("");
    $("#customer-address").val("");
    $("#customer-region").val("");
    $("#customer-province").val("");
    $("#customer-city-municipality").val("");
    $("#customer-barangay").val("");
    $("#customer-province").prop("disabled",true);
    $("#customer-city-municipality").prop("disabled",true);
    $("#customer-barangay").prop("disabled",true);

    $("#customer-update-button").prop("disabled",true);
    $("#customer-delete-button").prop("disabled",true);
} 