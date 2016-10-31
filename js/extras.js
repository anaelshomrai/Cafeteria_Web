var extras = [];
var index;
var extra;
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
                $('#extrasTable').append($('<tr><td>' + element.title + '</td>' + '<td> <button type="button" class="btn btn-primary" id="editExtra">Edit <span' + ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" id="deleteExtra"' + '>Delete <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));


                extras.push({
                    "id": element.id,
                    "title": element.title,
                    "price": element.price
                });

            })

            $(document).on("click", "#extrasTable #deleteExtra", function (e) {
                index = $(this).closest('tr').index();
                extra = extras[index];
                deleteExtra(extra);
            });

            $(document).on("click", "#extrasTable #editExtra", function (e) {
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
            location.reload();

        },
        failure: function (errMsg) {
            alert(errMsg);
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
            location.reload();

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
            location.reload();
        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });
}
