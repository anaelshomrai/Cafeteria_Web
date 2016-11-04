window.customer = JSON.parse(localStorage.customer);
var categories = [];
$(document).ready(function () {

    $("#addCategory").click(function () {
        window.location.replace("category-details.html");
    });
});


function initTable(data) {
    categories = [];
    var theUrl = "http://localhost:8080/CafeteriaServer/rest/web/getAllCategories";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: theUrl,
        timeout: 5000,
        success: function (data, textStatus) {
            //            alert('request successful');
            $.each(data, function (index, element) {
                $('#categoriesTable').append($('<tr id="' + element.id + '"><td>' + element.title + '</td>' + '<td> <button type="button" class="btn btn-primary"     id="editCategory">Edit <span' + ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" ' + 'id="deleteCategory">Delete    <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));


                categories.push({
                    id: element.id,
                    title: element.title,
                    description: element.description,
                    items: element.items,
                    meals: element.meals,
                    icon: element.icon
                });
            })

            addOnClickFunctions();
        },
        error: function (xhr, textStatus, errorThrown) {
            alert('request failed');
        }
    });

}

function confirmDelete(category,index) {
    BootstrapDialog.confirm({
        title: 'Pay Attention!',
        message: 'Are you sure you want to delete this item ?',
        type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
        closable: true, // <-- Default value is false
        draggable: true, // <-- Default value is false
        btnCancelLabel: 'No', // <-- Default value is 'Cancel',
        btnOKLabel: 'Yes', // <-- Default value is 'OK',
        btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog type will be used,
        callback: function (result) {
            // result will be true if button was click, while it will be false if users close the dialog directly.
            if (result) { //no clicked
                deleteCategory(category);
            }
        }
    });
}

function deleteCategory(category,index) {
    var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/deleteCategory";

    var decoded = arrayBufferToBase64(category.icon);
    category.icon = decoded;

    $.ajax({
        type: "POST",
        url: urlAddress,
        data: JSON.stringify(category),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var tableRowId = "#" + category.id;
            $(tableRowId).remove();
            categories.splice(index, 1);

        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });
}

function addOnClickFunctions() {
    $(document).on("click", "#categoriesTable #deleteCategory", function (e) {
        var row = $(this).closest('tr');
        var index = row.index();
        var category = categories[index];
        confirmDelete(category,index);
    });

    $(document).on("click", "#categoriesTable #editCategory", function (e) {

        var row = $(this).closest('tr');
        var index = row.index();
        var categoryEdit = categories[index];
        sessionStorage.setItem("categoryEdit", JSON.stringify(categoryEdit));
        window.location.replace("category-details.html");


    });
}

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
