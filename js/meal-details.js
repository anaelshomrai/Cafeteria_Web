var dualllistbox;
var selectpicker;
var mains = [];
var extras = [];
var selectedIndex;
var newMain = true;
$(document).ready(function () {
    $("#existing-main").hide();
    $("#new-main").hide();

    $("#back").click(function () {
        window.location.replace("category-details.html");
    });

    $('.selectpicker').selectpicker();
    initMains();

    dualllistbox = $('select[name="duallistbox"]').bootstrapDualListbox({
        nonSelectedListLabel: 'Non-selected',
        selectedListLabel: 'Selected',
        preserveSelectionOnMove: 'moved',

    });


    $("#addExtra").click(function () {
        var title = $('#extraTitle').val();
        var price = $('#extraPrice').val();
        if (title.length < 1 || price.length < 1) {
            alert("you must fill all fields");
        } else {
            $('#extraTitle').val("");
            $('#extraPrice').val("");
            addExtra(title, price);
        }
    });

    $("#addExistingMain").click(function () {
        $("#new-main").hide();
        $("#existing-main").show();
    });

    $("#addNewMain").click(function () {
        $("#new-main").show();
        $("#existing-main").hide();
    });

    $("#saveMeal").click(function () {
        var mealTitle = $('#mealTitle').val();
        var mealPrice = $('#mealPrice').val();
        var main;
        if ($('#new-main').is(":visible")) {
            main = {
                id: -1,
                title: $('#mainTitle').val()
            };

        } else if ($('#existing-main').is(":visible")) {
            main = mains[selectedIndex];
            newMain = false;
        }
        var extraAmount = $('#extraAmount').val();

        var selectedExtras = [];
        var extrasIndexes = $('[name="duallistbox"]').val();
        $.each(extrasIndexes, function (index, element) {
            var thisExtra = extras[element];
            selectedExtras.push({
                id: thisExtra.id,
                title: thisExtra.title,
                price: thisExtra.price
            });
        })

        var meal = {
            id: 0,
            main: main,
            title: mealTitle,
            extras: selectedExtras,
            extraAmount: extraAmount,
            price: mealPrice
        };


        //        alert("meal title: " + meal.title + "\n" +
        //            "meal price: " + meal.price + "\n" +
        //            "main: " + meal.main.id + "\n" +
        //            "extra amount: " + meal.extraAmount + "\n" +
        //            "selected extra: " + meal.extras.length
        //        );

        sessionStorage.setItem("meal",JSON.stringify(meal));
        window.location.replace("category-details.html");

    });

    $('.selectpicker').on('changed.bs.select', function (event, clickedIndex, newValue, oldValue) {
        selectedIndex = clickedIndex;
    });

});

function initExtras() {
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
                dualllistbox.append('<option value="' + element.id + '">' + element.title + '</option>');
                dualllistbox.bootstrapDualListbox('refresh', true);

                extras.push({
                    id: element.id,
                    title: element.title,
                    price: element.price
                });
            })
            $('.selectpicker').selectpicker('refresh');

        },
        error: function (xhr, textStatus, errorThrown) {
            alert('request failed');
        }
    });
}

function initMains() {
    var theUrl = "http://localhost:8080/CafeteriaServer/rest/web/getMains";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: theUrl,
        timeout: 5000,
        success: function (data, textStatus) {
            //           alert('request successful');
            $.each(data, function (index, element) {
                $('.selectpicker').append('<option>' + element.title + '</option>');

                mains.push({
                    id: element.id,
                    title: element.title
                });
            })

        },
        error: function (xhr, textStatus, errorThrown) {
            alert('request failed');
        }
    });

}

function addExtra(title, price) {

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
            dualllistbox.append('<option value="' + data.id + '"selected="selected">' + data.title + '</option>');
            dualllistbox.bootstrapDualListbox('refresh', true);

            extras.push({
                id: data.id,
                title: data.title,
                price: data.price
            });
        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });

}
