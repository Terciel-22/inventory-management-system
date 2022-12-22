const NCR_CODE = 130000000;

$(document).ready(function(){
    getAllRegions();
    $("#vendor-region").on("change", ()=> {
        if($("#vendor-region").val() != "")
        {
            $("#vendor-province").val("");
            $("#vendor-province").attr("disabled","disabled");
            $("#vendor-city-municipality").val("");
            $("#vendor-city-municipality").attr("disabled","disabled");
            $("#vendor-barangay").val("");
            $("#vendor-barangay").attr("disabled","disabled");

            regionArr = $("#vendor-region").val().split("|");
            if(regionArr[1] == NCR_CODE)
            {
                getAllCitiesAndMunicipalities(regionArr[1]);
            } else
            {
                getAllProvinces(regionArr[1]);
            }
        }
    });
    $("#vendor-province").on("change", ()=> {
        if($("#vendor-province").val() != "")
        {
            $("#vendor-city-municipality").val("");
            $("#vendor-city-municipality").attr("disabled","disabled");
            $("#vendor-barangay").val("");
            $("#vendor-barangay").attr("disabled","disabled");

            provinceArr = $("#vendor-province").val().split("|");
            getAllCitiesAndMunicipalities(provinceArr[1]);
        }
    });
    $("#vendor-city-municipality").on("change", ()=> {
        if($("#vendor-city-municipality").val() != "")
        {
            $("#vendor-barangay").val("");
            $("#vendor-barangay").attr("disabled","disabled");
            cityMunicipalityArr = $("#vendor-city-municipality").val().split("|");
            getAllBarangay(cityMunicipalityArr[1]);
        }
    });

    //CRUD
    $("#vendor-id").on("focus",getVendorIDs); //For auto-complete
    $("#vendor-id").on("input change focusout", getVendorData);
    $("#vendor-add-button").on("click", addVendor);
    $("#vendor-clear-button").on("click", ()=>{
        $("#vendor-id").val("");
        vendorFormSetToDefault(true);
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
        $("#vendor-region").html(options);
    });
}
function getAllProvinces(regionCode, callback)
{
    $("#vendor-city-municipality").attr("disabled","disabled");
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
        $("#vendor-province").html(options);
        $("#vendor-province").removeAttr("disabled");
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
        $("#vendor-city-municipality").html(options);
        $("#vendor-city-municipality").removeAttr("disabled");
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
        $("#vendor-barangay").html(options);
        $("#vendor-barangay").removeAttr("disabled");
        callback();
    });
}

//CRUD
function getVendorIDs()
{
    let vendorIDs = [];
    function getVendorIDsFromDB()
    {
        return $.ajax({
            method: "POST",
            url: "class/vendor.php",
            dataType: "JSON",
            data: {getVendorIDs:true},
            success: function(result)
            {
                let values = Object.values(result);
                for(let i=0; i<values.length; i++)
                {
                    vendorIDs.push(String(values[i].vendorID));
                }
            }
        });
    }
    
    $.when(getVendorIDsFromDB()).done(()=>{
        //For item form
        $( "#vendor-id" ).autocomplete({
            source: vendorIDs
        });
    });
}

function getVendorData()
{
    const vendorID = $("#vendor-id").val();
    if(vendorID != "")
    {
        $.ajax({
            method: "POST",
            url: "class/vendor.php",
            dataType: "JSON",
            data: {
                getVendorData:true,
                vendorID:vendorID
            },
            success: function(result)
            {
                if(result != "404")
                {
                    let vendorData = result[0];
                    
                    $("#vendor-fullname").val(vendorData["fullName"]);
                    $("#vendor-status").val(vendorData["status"]);
                    $("#vendor-mobile-number").val(vendorData["mobileNumber"]);
                    $("#vendor-telephone-number").val(vendorData["telephoneNumber"]);
                    $("#vendor-email").val(vendorData["email"]);
                    $("#vendor-address").val(vendorData["address"]);
                    $("#vendor-region").val(vendorData["region"]);
                    regionArr = vendorData["region"].split("|");
                    if(vendorData["province"] != "")
                    {
                        if(regionArr[1] != NCR_CODE)
                        {
                            getAllProvinces(regionArr[1], ()=>{
                                $("#vendor-province").val(vendorData["province"]);
                            });
                        }
                    }
                    if(vendorData["city_municipality"] != "")
                    {
                        if(regionArr[1] == NCR_CODE)
                        {
                            code = regionArr[1];
                        } else
                        {
                            provinceArr = vendorData["province"].split("|");
                            code = provinceArr[1];
                        }
                        
                        getAllCitiesAndMunicipalities(code, ()=>{
                            $("#vendor-city-municipality").val(vendorData["city_municipality"]);
                        });
                    }
                    if(vendorData["vendor-barangay"] != "")
                    {
                        cityMunicipalityArr = vendorData["city_municipality"].split("|");
                        
                        getAllBarangay(cityMunicipalityArr[1], ()=>{
                            $("#vendor-barangay").val(vendorData["barangay"]);
                        });
                    }

                    $("#vendor-update-button").prop("disabled",false);
                    $("#vendor-delete-button").prop("disabled",false);
                } else
                {
                    $("#vendor-update-button").prop("disabled",true);
                    $("#vendor-delete-button").prop("disabled",true);
                    vendorFormSetToDefault(true);
                }
            }
        });
    }else
    {
        vendorFormSetToDefault(true);
    }
}

function addVendor()
{
    $("#vendor-id").val("");
    const vendorForm = $("#vendor-form");
    const vendorFormURL = vendorForm.attr("action");
    const vendorFormData = vendorForm.serializeArray();
    vendorFormData.push({name: "vendor-add-submitted", value: "true"});
    $.ajax({
        method: "POST",
        url: vendorFormURL,
        data: vendorFormData,
        success: function (result) {
            if(result == "Successfully Added!")
            {
                vendorFormSetToDefault(false);
                getVendorData();
            }
            message = `<div class='alert alert-danger'>${result}</div>`;
            $("#vendorform-errmessage").html(message);
        }
    });
}

function vendorFormSetToDefault(deleteMessage)
{
    if(deleteMessage)
    {
        message = "";
        $("#vendorform-errmessage").html(message);
    }

    $("#vendor-fullname").val("");
    $("#vendor-status").val("");
    $("#vendor-mobile-number").val("");
    $("#vendor-telephone-number").val("");
    $("#vendor-email").val("");
    $("#vendor-address").val("");
    $("#vendor-region").val("");
    $("#vendor-province").val("");
    $("#vendor-city-municipality").val("");
    $("#vendor-barangay").val("");
    $("#vendor-province").prop("disabled",true);
    $("#vendor-city-municipality").prop("disabled",true);
    $("#vendor-barangay").prop("disabled",true);
}
