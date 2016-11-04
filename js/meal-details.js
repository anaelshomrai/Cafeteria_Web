var dualllistbox;
var selectpicker;
var mains = [];
var extras = [];
var selectedIndex;
var newMain = true;
var inEdit = false;
var editMeal;
$(document).ready(function () {
    $("#existing-main").hide();
    $("#new-main").hide();

    $("#back").click(function () {
        sessionStorage.removeItem("editMeal");
        sessionStorage.removeItem("editMealIndex");
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

    $("#mealDetailsForm").submit(function () {
        if ($('#new-main').is(":hidden") && $('#existing-main').is(":hidden")) {
            alert("Fill main !");
            return false;
        }
        if ($('#new-main').is(":visible")){
            if ($('#mainTitle').val().length < 1){
                alert("main is empty");
                return false;
            }
        } else{
            if (selectedIndex === undefined){
                alert("main is empty");
                return false;
            }
        }

        $("#saveMeal").attr("disabled", true);

        var mealTitle = $('#mealTitle').val();
        var mealPrice = $('#mealPrice').val();

        var extraAmount = $('#extraAmount').val();

        var selectedExtras = [];
        var extrasIndexes = $('[name="duallistbox"]').val();
        $.each(extrasIndexes, function (index, element) {
            var thisExtra = findExtra(element);

            selectedExtras.push({
                id: thisExtra.id,
                title: thisExtra.title,
                price: thisExtra.price
            });
        })

        var meal = {
            id: 0,
            main: "to be filled",
            title: mealTitle,
            extras: selectedExtras,
            extraAmount: extraAmount,
            price: mealPrice
        };

        if ($('#new-main').is(":visible")) {

            addNewMainToDB($('#mainTitle').val(),
                function (result) {
                    meal.main = result;
                    alert("meal in new main " + meal.main.id);
                    if ($("#saveMeal").text() == "Update") {
                        var meals = JSON.parse(sessionStorage.getItem("meals"));
                        var index = sessionStorage.getItem("editMealIndex");
                        meals[index] = meal;
                        sessionStorage.setItem("meals", JSON.stringify(meals));
                        sessionStorage.removeItem("editMeal");
                        sessionStorage.removeItem("editMealIndex");
                        alert("meals saved after update");
                    } else {
                        sessionStorage.setItem("meal", JSON.stringify(meal));
                    }

                    window.location.replace("category-details.html");

                });

        } else if ($('#existing-main').is(":visible")) {
            meal.main = mains[selectedIndex - 1];
            newMain = false;
        }

        //        alert("meal title: " + meal.title + "\n" +
        //            "meal price: " + meal.price + "\n" +
        //            "main id: " + meal.main.id + "\n" +
        //            "main title: " + meal.main.title + "\n" +
        //            "extra amount: " + meal.extraAmount + "\n" +
        //            "selected extra: " + meal.extras.length
        //        );

        if (newMain === true) {

        } else {
            if ($("#saveMeal").text() == "Update") {
                var meals = JSON.parse(sessionStorage.getItem("meals"));
                var index = sessionStorage.getItem("editMealIndex");
                meals[index] = meal;
                sessionStorage.setItem("meals", JSON.stringify(meals));
                sessionStorage.removeItem("editMeal");
                sessionStorage.removeItem("editMealIndex");
                alert("meals saved after update");
                window.location.replace("category-details.html");
            } else {
                sessionStorage.setItem("meal", JSON.stringify(meal));
            }
            window.location.replace("category-details.html");
        }

        return false;


    });

    $('.selectpicker').on('changed.bs.select', function (event, clickedIndex, newValue, oldValue) {
        selectedIndex = clickedIndex;
    });

    if (sessionStorage.getItem("editMeal") !== null) {
        inEdit = true;
        editMeal = JSON.parse(sessionStorage.getItem("editMeal"));
        alert("at update found edit meal");

        $('#mealTitle').val(editMeal.title);
        $('#mealPrice').val(editMeal.price);
        var main = editMeal.main;
        $("#existing-main").show();

        $('#extraAmount').val(editMeal.extraAmount);
        $('#saveMeal').text("Update");

    }

});

function initExtras() {
    var editExtras;
    if (inEdit === true) {
        editMeal = JSON.parse(sessionStorage.getItem("editMeal"));
        editExtras = editMeal.extras;
    }
    var theUrl = "http://localhost:8080/CafeteriaServer/rest/web/getExtras";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: theUrl,
        timeout: 5000,
        success: function (data, textStatus) {
            //            alert('request successful');
            $.each(data, function (index, element) {
                var found = false;
                extras.push({
                    id: element.id,
                    title: element.title,
                    price: element.price
                });
                if (inEdit === false) {
                    dualllistbox.append('<option value="' + element.id + '">' + element.title + '</option>');
                    dualllistbox.bootstrapDualListbox('refresh', true);
                } else {
                    $.each(editExtras, function (index, extra) {
                        if (element.id === extra.id) {
                            dualllistbox.append('<option value="' + element.id + '" selected="selected">' + element.title + '</option>');
                            dualllistbox.bootstrapDualListbox('refresh', true);
                            found = true;
                        }
                    })
                    if (found === false) {
                        dualllistbox.append('<option value="' + element.id + '">' + element.title + '</option>');
                        dualllistbox.bootstrapDualListbox('refresh', true);
                    }
                }

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
            if ($("#saveMeal").text() == "Update") {
                $('.selectpicker').selectpicker('val', editMeal.main.title);
            }


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
            console.log("in add extra :" + data.id);
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

function findExtra(extraId) {
    var found;
    $.each(extras, function (index, extra) {
        if (Number(extra.id) === Number(extraId)) {
            found = extra;
            return false; //break from loop
        }
    })
    return found;
}

function addNewMainToDB(mainTitle, callback) {
    var main;
    var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/addMain";
    var extra = {
        id: 0,
        title: mainTitle
    };

    $.ajax({
        type: "POST",
        url: urlAddress,
        data: JSON.stringify(extra),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            main = {
                id: data.id,
                title: data.title
            };
            callback(main);
        },
        failure: function (errMsg) {
            alert(errMsg);
        }
    });
}
