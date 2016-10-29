var drinks = [];
var index;
var drink;
$(document).ready(function () {

    $("#updateDrink").click(function () {
        var title = $('#title').val();
        var price = $('#price').val();
        updateDrink(drink.id, title, price);
        $("#updateDrink").hide();

    });

    $("#addDrink").click(function () {
        var title = $('#title').val();
        var price = $('#price').val();
        $('#title').val("");
        $('#price').val("");
        addDrink(title, price);
    });

    $("#updateDrink").hide();

});


function initTable(data) {
    drinks = [];
    var theUrl = "http://localhost:8080/CafeteriaServer/rest/web/getDrinks";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: theUrl,
        timeout: 5000,
        success: function (data, textStatus) {
            //            alert('request successful');
            $.each(data, function (index, element) {
                $('#drinksTable').append($('<tr><td>' + element.title + '</td>' + '<td> <button type="button" class="btn btn-primary" id="editDrink" >Edit <span' + ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" id="deleteDrink"' + '>Delete <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));


                drinks.push({
                    "id": element.id,
                    "title": element.title,
                    "price": element.price
                });
            })



            $(document).on("click", "#drinksTable #deleteDrink", function (e) {
                index = $(this).closest('tr').index();
                drink = drinks[index];
                deleteDrink(drink);
            });

            $(document).on("click", "#drinksTable #editDrink", function (e) {
                index = $(this).closest('tr').index();
                drink = drinks[index];
                $("#addDrink").hide();
                $("#updateDrink").show();
                $('#price').val("" + drink.price);
                $('#title').val(drink.title);
            });


        },
        error: function (xhr, textStatus, errorThrown) {
            alert('request failed');
        }
    });

}

function addDrink(title, price) {
    var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/addDrink";
    var drink = {
        id: 0,
        title: title,
        price: price
    };

    $.ajax({
        type: "POST",
        url: urlAddress,
        data: JSON.stringify(drink),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $("#drinksTable tr").remove();
            initTable();

        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });

}

function deleteDrink(drink) {
    var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/deleteDrink";

    var drink = {
        id: drink.id,
        title: drink.title,
        price: drink.price
    };

    $.ajax({
        type: "POST",
        url: urlAddress,
        data: JSON.stringify(drink),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //            $("#drinksTable tr").remove();
            //            initTable();
            //            $("#deleteDrink").removeAttr("disabled");
            location.reload();

        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });
}

function updateDrink(id, title, price) {
    var drink = {
        id: id,
        title: title,
        price: price
    };
    var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/editDrink";

    $.ajax({
        type: "POST",
        url: urlAddress,
        data: JSON.stringify(drink),
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
