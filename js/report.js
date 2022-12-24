$(document).ready( function () {

    getItemsRecord();
   
    getVendorsRecord();

    getCustomersRecord();
    // $('#vendor-table').DataTable();
    // $('#customer-table').DataTable();
    // $('#purchase-table').DataTable();
    // $('#sale-table').DataTable();


    
} );

function getItemsRecord()
{
    let items = [];
    
    function getAllItemsFromDB(){
        return $.ajax({
            method: "POST",
            url: "class/item.php",
            dataType: "JSON",
            data: {
                getItemRecords:true
            },
            success: function(results)
            {
                for(let i=0;i<results.length;i++)
                {
                    let tempArr = [
                        results[i].productID,
                        results[i].itemNumber,
                        he.encode(results[i].itemName),
                        results[i].discount,
                        results[i].stock,
                        results[i].unitPrice,
                        results[i].status,
                        he.encode(results[i].description),
                        he.encode(results[i].imageURL),
                    ];
                    items.push(tempArr);
                }
            }
        });
    }

    $.when(getAllItemsFromDB()).done(()=>{
        let itemTable = $("#item-table").DataTable({
            "autoWidth": false,
            order: [[2, 'asc']],
            data: items,
            columnDefs: [
                {
                    target: 8,
                    visible: false,
                    searchable: true,
                },
            ],
            dom: "<'row mt-3 mb-3'l>Bf<'#scrollX' 'mt-3'tr>ip",
            columns: [
                { title: "Product ID" },
                { title: "Item Number" },
                { title: "Item Name" },
                { title: "Discount" },
                { title: "Stock" },
                { title: "Unit Price" },
                { title: "Status" },
                { title: "Description" },
                { title: "Image Filename" }
            ],
            footerCallback: function (row, data, start, end, display) {
                var api = this.api();
     
                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                    return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                };
     
                // Total over all pages
                total = api
                    .column(5)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
     
                // Total over this page
                pageTotal = api
                    .column(5, { page: 'current' })
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
     
                // Update footer
                $(api.column(5).footer()).html('$' + pageTotal + ' ( $' + total + ' total)');
            },
        });

        $('#item-table tbody').on('click', 'tr', function () {
            let data = itemTable.row(this).data();
            let image = "";
            if(data[8] != "imageNotAvailable.jpg")
            {
                image = $(`<img src="img/item_images/${data[1]}/${data[8]}" alt="Item image" class="img-fluid"/>`);
            } else
            {
                image = $(`<img src="img/item_images/imageNotAvailable.jpg" alt="Item image" class="img-fluid"/>`);
            }
             
            bootbox.dialog({
                closeButton: false,
                size: "small",
                title: data[2],
                message: image,
                buttons: {
                    success:{
                        label: "Ok",
                    }
                }       
            });
        });
    });
} 

function getVendorsRecord()
{
    let vendors = [];

    function getAllVendorsFromDB(){
        return $.ajax({
            method: "POST",
            url: "class/vendor.php",
            dataType: "JSON",
            data: {
                getVendorRecords:true
            },
            success: function(results)
            {
                for(let i=0;i<results.length;i++)
                {
                    let regionArr = results[i].region.split("|");
                    let provinceArr = results[i].province.split("|");
                    let cityMunicipalityArr = results[i].city_municipality.split("|");
                    let barangayArr = results[i].barangay.split("|");

                    let tempArr = [
                        results[i].vendorID,
                        he.encode(results[i].fullName),
                        he.encode(results[i].email),
                        results[i].mobileNumber,
                        results[i].telephoneNumber,
                        he.encode(results[i].address),
                        he.encode(regionArr[0]),
                        he.encode(provinceArr[0]),
                        he.encode(cityMunicipalityArr[0]),
                        he.encode(barangayArr[0]),
                        results[i].status
                    ];
                    vendors.push(tempArr);
                }
            }
        });
    }

    $.when(getAllVendorsFromDB()).done(()=>{
        vendorTable = $("#vendor-table").DataTable({
            "autoWidth": false,
            order: [[1, 'asc']],
            data: vendors,
            dom: "<'row mt-3 mb-3'l>Bf<'#scrollX' 'mt-3'tr>ip",
            columns: [
                { title: "Vendor ID" },
                { title: "Full Name" },
                { title: "Email" },
                { title: "Mobile Number" },
                { title: "Telephone Number" },
                { title: "Address" },
                { title: "Region" },
                { title: "Province" },
                { title: "City/Municipality" },
                { title: "Barangay" },
                { title: "Status" },
            ]
        });
    });
}

function getCustomersRecord()
{
    let customers = [];

    function getAllCustomersFromDB(){
        return $.ajax({
            method: "POST",
            url: "class/customer.php",
            dataType: "JSON",
            data: {
                getCustomerRecords:true
            },
            success: function(results)
            {
                for(let i=0;i<results.length;i++)
                {
                    let regionArr = results[i].region.split("|");
                    let provinceArr = results[i].province.split("|");
                    let cityMunicipalityArr = results[i].city_municipality.split("|");
                    let barangayArr = results[i].barangay.split("|");

                    let tempArr = [
                        results[i].customerID,
                        he.encode(results[i].fullName),
                        he.encode(results[i].email),
                        results[i].mobileNumber,
                        results[i].telephoneNumber,
                        he.encode(results[i].address),
                        he.encode(regionArr[0]),
                        he.encode(provinceArr[0]),
                        he.encode(cityMunicipalityArr[0]),
                        he.encode(barangayArr[0]),
                        results[i].status
                    ];
                    customers.push(tempArr);
                }
            }
        });
    }

    $.when(getAllCustomersFromDB()).done(()=>{
        customerTable = $("#customer-table").DataTable({
            "autoWidth": false,
            order: [[1, 'asc']],
            data: customers,
            dom: "<'row mt-3 mb-3'l>Bf<'#scrollX' 'mt-3'tr>ip",
            columns: [
                { title: "Customer ID" },
                { title: "Full Name" },
                { title: "Email" },
                { title: "Mobile Number" },
                { title: "Telephone Number" },
                { title: "Address" },
                { title: "Region" },
                { title: "Province" },
                { title: "City/Municipality" },
                { title: "Barangay" },
                { title: "Status" },
            ]
        });
    });
}