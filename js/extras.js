var extras = [];
var index;
var extra;
var row;
$(document).ready(function () {

    $("#updateExtra").click(function () {
        var title = $('#title').val();
        var price = $('#price').val();
        updateExtra(extra.id, title, price);
        $("#updateExtra").hide();

    });

    $("#addExtra").click(function () {
        var title = $('#title').val();
        var price = $('#price').val();
        $('#title').val("");
        $('#price').val("");
        addExtra(title, price);
    });

    $("#updateExtra").hide();

});


function initTable(data) {
    extras = [];
    var theUrl = "http://localhost:8080/CafeteriaServer/rest/web/getExtras";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: theUrl,
        timeout: 5000,
        success: function (data, textStatus) {
            //            alert('request successful');
            $.each(data, function (index, element) {
                $('#extrasTable').append($('<tr id="' + element.id + '"><td>' + element.title + '</td>' + '<td> <button type="button" class="btn btn-primary" id="editExtra">Edit <span' + ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" id="deleteExtra"' + '>Delete <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));


                extras.push({
                    "id": element.id,
                    "title": element.title,
                    "price": element.price
                });

            })

            $(document).on("click", "#extrasTable #deleteExtra", function (e) {
                index = $(this).closest('tr').index();
                extra = extras[index];
                confirmDelete(extra);
            });

            $(document).on("click", "#extrasTable #editExtra", function (e) {
                row = $(this).closest('tr');
                index = $(this).closest('tr').index();
                extra = extras[index];
                $("#addExtra").hide();
                $("#updateExtra").show();
                $('#price').val("" + extra.price);
                $('#title').val(extra.title);
            });

        },
        error: function (xhr, textStatus, errorThrown) {
            alert('request failed');
        }
    });

}

function addExtra(title, price) {
    var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/addExtra";
    var extra = {
        id: 0,
        title: title,
        price: price
    };

    $.ajax({
        type: "POST",
        url: urlAddress,
        data: JSON.stringify(extra),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var extra = {
                id: data.id,
                title: data.title,
                price: data.price
            };

            $('#extrasTable').append($('<tr id="' + data.id + '"><td>' + data.title + '</td>' + '<td> <button type="button" class="btn btn-primary" id="editExtra">Edit <span' + ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" id="deleteExtra"' + '>Delete <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));

            extras.push(extra);

        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });

}

function confirmDelete(extra) {
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
                deleteExtra(extra);
            }
        }
    });
}

function deleteExtra(extra) {
    var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/deleteExtra";

    var extra = {
        id: extra.id,
        title: extra.title,
        price: extra.price
    };

    $.ajax({
        type: "POST",
        url: urlAddress,
        data: JSON.stringify(extra),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var tableRowId = "#" + extras[index].id;
            $(tableRowId).remove();
            extras.splice(index, 1);

        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });
}

function updateExtra(id, title, price) {
    var extra = {
        id: id,
        title: title,
        price: price
    };
    var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/editExtra";

    $.ajax({
        type: "POST",
        url: urlAddress,
        data: JSON.stringify(extra),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            row.find('td:eq(0)').html(title);
            extras[index] = extra;
            $("#addExtra").show();
            $('#title').val("");
            $('#price').val("");
        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });
}
