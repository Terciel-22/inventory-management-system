let minPurchaseDate, maxPurchaseDate;
 // Custom filtering function which will search data in column four between two values
$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        let min = minPurchaseDate.val();
        let max = maxPurchaseDate.val();
        let date = new Date( data[2] );
 
        if (
            ( min === null && max === null ) ||
            ( min === null && date <= max ) ||
            ( min <= date   && max === null ) ||
            ( min <= date   && date <= max )
        ) {
            return true;
        }
        return false;
    }
);

let minSaleDate, maxSaleDate;
// Custom filtering function which will search data in column four between two values
$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        let min = minSaleDate.val();
        let max = maxSaleDate.val();
        let date = new Date( data[5] );
 
        if (
            ( min === null && max === null ) ||
            ( min === null && date <= max ) ||
            ( min <= date   && max === null ) ||
            ( min <= date   && date <= max )
        ) {
            return true;
        }
        return false;
    }
);

$(document).ready( function () {

    getItemsRecord();
   
    getVendorsRecord();

    getCustomersRecord();

    getPurchasesRecord();

    getSalesRecord();
    
    // Create date inputs
    minPurchaseDate = new DateTime($('#min-purchase-date'), {
        format: 'MMMM Do, YYYY'
    });
    maxPurchaseDate = new DateTime($('#max-purchase-date'), {
        format: 'MMMM Do, YYYY'
    });

    minSaleDate = new DateTime($('#min-sale-date'), {
        format: 'MMMM Do, YYYY'
    });
    maxSaleDate = new DateTime($('#max-sale-date'), {
        format: 'MMMM Do, YYYY'
    });

    // Refilter the table
    $("#min-purchase-date, #max-purchase-date").on("change", function () {
        purchaseTable.draw();
    });

    $("#min-sale-date, #max-sale-date").on("change", function () {
        saleTable.draw();
    });
});

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
                        he.decode(results[i].itemName),
                        results[i].discount,
                        results[i].stock,
                        results[i].unitPrice,
                        results[i].status,
                        he.decode(results[i].description),
                        he.decode(results[i].imageURL),
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
            buttons: [
                {extend: 'pdf', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Item Report'},
                {extend: 'excel', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Item Report'},
                {extend: 'csv', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Item Report'},
                'copy'
            ],
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
                $(api.column(5).footer()).html('₱' + pageTotal + ' ( ₱' + total + ' total)');
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
                        he.decode(results[i].fullName),
                        he.decode(results[i].email),
                        results[i].mobileNumber,
                        results[i].telephoneNumber,
                        he.decode(results[i].address),
                        he.decode(regionArr[0]),
                        he.decode(provinceArr[0]),
                        he.decode(cityMunicipalityArr[0]),
                        he.decode(barangayArr[0]),
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
            buttons: [
                {extend: 'pdf', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Vendor Report'},
                {extend: 'excel', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Vendor Report'},
                {extend: 'csv', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Vendor Report'},
                'copy'
            ],
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
                        he.decode(results[i].fullName),
                        he.decode(results[i].email),
                        results[i].mobileNumber,
                        results[i].telephoneNumber,
                        he.decode(results[i].address),
                        he.decode(regionArr[0]),
                        he.decode(provinceArr[0]),
                        he.decode(cityMunicipalityArr[0]),
                        he.decode(barangayArr[0]),
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
            buttons: [
                {extend: 'pdf', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Customer Report'},
                {extend: 'excel', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Customer Report'},
                {extend: 'csv', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Customer Report'},
                'copy'
            ],
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

function getPurchasesRecord()
{
    let purchases = [];
    
    function getAllPurchasesFromDB(){
        return $.ajax({
            method: "POST",
            url: "class/purchase.php",
            dataType: "JSON",
            data: {
                getPurchaseRecords:true
            },
            success: function(results)
            {
                for(let i=0;i<results.length;i++)
                {
                    let totalPrice = results[i].quantity * results[i].unitPrice;
                    let tempArr = [
                        results[i].purchaseID,
                        results[i].itemNumber,
                        results[i].purchaseDate,
                        he.decode(results[i].itemName),
                        he.decode(results[i].vendorName),
                        results[i].vendorID,
                        results[i].quantity,
                        results[i].unitPrice,
                        totalPrice,
                    ];
                    purchases.push(tempArr);
                }
            }
        });
    }

    $.when(getAllPurchasesFromDB()).done(()=>{
        purchaseTable = $("#purchase-table").DataTable({
            "autoWidth": false,
            order: [[0, 'asc']],
            data: purchases,
            dom: "<'row mt-3 mb-3'l>Bf<'#scrollX' 'mt-3'tr>ip",
            buttons: [
                {extend: 'pdf', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Purchase Report'},
                {extend: 'excel', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Purchase Report'},
                {extend: 'csv', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Purchase Report'},
                'copy'
            ],
            columns: [
                { title: "Purchase ID" },
                { title: "Item Number" },
                { title: "Purchase Date" },
                { title: "Item Name" },
                { title: "Vendor Name" },
                { title: "Vendor ID" },
                { title: "Quantity" },
                { title: "Unit Price" },
                { title: "Total Price" }
            ],
            footerCallback: function (row, data, start, end, display) {
                var api = this.api();
     
                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                    return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                };
     
                // Total of quantity over all pages
                quantityTotal = api
                    .column(6)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total of unitPrice over all pages
                unitPriceTotal = api
                    .column(7)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total of totalPrice over all pages
                totalPriceTotal = api
                    .column(8)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
     

                // Total of quantity over this page
                quantityPageTotal = api
                    .column(6, { page: 'current' })
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total of unitPrice over this page
                unitPricePageTotal = api
                    .column(7, { page: 'current' })
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total of totalPrice over this page
                totalPricePageTotal = api
                    .column(8, { page: 'current' })
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
     
                // Update footer
                $(api.column(6).footer()).html(quantityPageTotal + ' pcs. (' + quantityTotal + 'pcs. total)');
                $(api.column(7).footer()).html('₱' + unitPricePageTotal + ' ( ₱' + unitPriceTotal + ' total)');
                $(api.column(8).footer()).html('₱' + totalPricePageTotal + ' ( ₱' + totalPriceTotal + ' total)');
            },
        });
    });
}

function getSalesRecord()
{
    let sales = [];
    
    function getAllSalesFromDB(){
        return $.ajax({
            method: "POST",
            url: "class/sale.php",
            dataType: "JSON",
            data: {
                getSaleRecords:true
            },
            success: function(results)
            {
                for(let i=0;i<results.length;i++)
                {
                    let totalPrice = results[i].quantity * results[i].unitPrice;
                    let discountedPrice = totalPrice - (totalPrice * (results[i].discount/100));
                    let tempArr = [
                        results[i].saleID,
                        results[i].itemNumber,
                        results[i].customerID,
                        he.decode(results[i].customerName),
                        he.decode(results[i].itemName),
                        results[i].saleDate,
                        results[i].discount,
                        results[i].quantity,
                        results[i].unitPrice,
                        discountedPrice,
                    ];
                    sales.push(tempArr);
                }
            }
        });
    }

    $.when(getAllSalesFromDB()).done(()=>{
        saleTable = $("#sale-table").DataTable({
            "autoWidth": false,
            order: [[0, 'asc']],
            data: sales,
            dom: "<'row mt-3 mb-3'l>Bf<'#scrollX' 'mt-3'tr>ip",
            buttons: [
                {extend: 'pdf', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Sale Report'},
                {extend: 'excel', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Sale Report'},
                {extend: 'csv', footer: true, orientation: 'landscape', pageSize: 'LEGAL', title: 'Sale Report'},
                'copy'
            ],
            columns: [
                { title: "Sale ID" },
                { title: "Item Number" },
                { title: "Customer ID" },
                { title: "Customer Name" },
                { title: "Item Name" },
                { title: "Sale Date" },
                { title: "Discount %" },
                { title: "Quantity" },
                { title: "Unit Price" },
                { title: "Total Price" }
            ],
            footerCallback: function (row, data, start, end, display) {
                var api = this.api();
     
                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                    return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                };
     
                // Total of quantity over all pages
                quantityTotal = api
                    .column(7)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total of unitPrice over all pages
                unitPriceTotal = api
                    .column(8)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total of totalCost over all pages
                totalPriceTotal = api
                    .column(9)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
     

                // Total of quantity over this page
                quantityPageTotal = api
                    .column(7, { page: 'current' })
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total of unitPrice over this page
                unitPricePageTotal = api
                    .column(8, { page: 'current' })
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total of totalCost over this page
                totalPricePageTotal = api
                    .column(9, { page: 'current' })
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
     
                // Update footer
                $(api.column(7).footer()).html(quantityPageTotal + ' pcs. (' + quantityTotal + 'pcs. total)');
                $(api.column(8).footer()).html('₱' + unitPricePageTotal + ' ( ₱' + unitPriceTotal + ' total)');
                $(api.column(9).footer()).html('₱' + totalPricePageTotal + ' ( ₱' + totalPriceTotal + ' total)');
            },
        });
    });
}

