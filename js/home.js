window.customer = JSON.parse(localStorage.customer);

$(document).ready(function () {

    $("#addCategory").click(function () {
        window.location.replace("/categoryDetails.html");
    });
});


function initTable(data) {
    var categories = [];
    var theUrl = "http://localhost:8080/CafeteriaServer/rest/web/getAllCategories";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: theUrl,
        timeout: 5000,
        success: function (data, textStatus) {
//            alert('request successful');
            $.each(data, function (index, element) {
                $('#categoriesTable').append($('<tr><td>' + element.title + '</td>' + '<td> <button type="button" class="btn btn-primary" (click)="onEdit(category)">Edit <span' + ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" ' + '(click)="onDelete(category)">Delete    <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));


                categories.push({
                    "id": element.id,
                    "title": element.title,
                    "description": element.description,
                    "items": element.items,
                    "meals": element.meals
                });
            })

        },
        error: function (xhr, textStatus, errorThrown) {
            alert('request failed');
        }
    });

}
