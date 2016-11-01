    var icons = [];
    var items = [];
    var firstItem = true;
    var meals = new Array();
    var icon_index = 0;
    var firstMeal = true;
    var categoryEdit;
//    var localIcons = [
//            "icons/cafe_black.png"
//];
    $(document).ready(function () {
        meals = [];
        if (sessionStorage.getItem("meal") !== null) {
            var temp = JSON.parse(sessionStorage.getItem("meal"));
            alert("meal recieved");
            sessionStorage.removeItem("meal");
            if (sessionStorage.getItem("meals") === null) {
                alert("create meals");
                sessionStorage.setItem("meals", meals);
            } else {
                meals = JSON.parse(sessionStorage.getItem("meals"));
                alert("get meals");
            }
            meals.push(temp);
            sessionStorage.setItem("meals", JSON.stringify(meals));
        }

        if (sessionStorage.getItem("meals") !== null) {
            meals = JSON.parse(sessionStorage.getItem("meals"));
        }
        if (meals.length > 0) {
            initMealsTable();
        }
        if (sessionStorage.getItem("meal") !== undefined && sessionStorage.getItem("meal") !== null) {
            alert(JSON.parse(sessionStorage.getItem("meal")).title);
        }

        $("#backToCategories").click(function () {
            sessionStorage.removeItem("meal");
            sessionStorage.removeItem("meals");
            window.location.replace("/index.html");
        });

        $("#addMealBtn").click(function () {
            window.location.replace("/meal-details.html");
        });

        $("#addItem").click(function () {
            var itemTitle = $("#itemTitle").val();
            var itemPrice = $("#itemPrice").val();
            if (itemPrice.length < 1 || itemTitle.length < 1) {
                alert("you must fill all fields");
            } else {
                addItem(itemTitle, itemPrice);
                $("#itemTitle").val("");
                $("#itemPrice").val("");
            }
        });

        $("#saveCategory").click(function () {
            saveCategoryinDB();
            sessionStorage.removeItem("meals");
        });

        if (sessionStorage.getItem("categoryEdit") !== null) {
            categoryEdit = JSON.parse(sessionStorage.getItem("categoryEdit"));
            sessionStorage.removeItem("categoryEdit");
            //            alert(categoryEdit.title + " " + categoryEdit.icon);

            $("#categoryTitle").val(categoryEdit.title);
            $("#categoryDescription").val(categoryEdit.description);
            //            icon
            var itemsEdit = categoryEdit.items;
            if (itemsEdit.length > 0) {
                $.each(itemsEdit, function (index, element) {
                    $('#itemsTable').append($('<tr id="' + element.title + '"><td>' + element.title + '</td>' +
                        '<td>' + element.price + '</td>' +
                        '<td> <button type="button" class="btn btn-primary" id="editItem"> <span id="editText">Edit </span> <span' +
                        ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" id="deleteItem"' +
                        '>Delete    <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));
                })
                if (firstItem === true) {
                    addOnClickFunctions();
                    firstItem = false;
                }
            }
            var mealsEdit = categoryEdit.meals;

            if (mealsEdit.length > 0) {
                $.each(mealsEdit, function (index, element) {
                    $('#mealsTable').append($('<tr id="' + element.title + '"><td>' + element.title + '</td>' +
                        '<td> <button type="button" class="btn btn-primary" id="editMeal">Edit <span' +
                        ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" ' +
                        'id="deleteMeal">Delete    <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));
                })

                if (firstMeal === true) {
                    addMealOptions();
                    firstMeal = false;
                }
            }

            $("#saveCategory").text("Update");
            var temp =
                arrayBufferToBase64(categoryEdit.icon);
            var imgSrc = "data:image/png;base64," + temp;
            $('#theIcon').attr("src", imgSrc);

        }


    });


    function initIcons() {
        var editIndex;
        icons = [];
        var theUrl = "http://localhost:8080/CafeteriaServer/rest/web/getIcons";
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: theUrl,
            timeout: 5000,
            success: function (data, textStatus) {

                $.each(data, function (index, element) {

                    icons.push({
                        id: element.id,
                        icon: element.icon
                    });
                    var decoded = arrayBufferToBase64(element.icon);
                    $('.image-picker').append("<option data-img-src= data:image/png;base64," + decoded + " value=" + index + "> </option>");

                    if (categoryEdit === undefined) {

                    } else {
                        if (element.icon === categoryEdit.icon) {
                            editIndex = index;
                        }
                    }

                })
                $("select").imagepicker({
                    show_label: false,
                    selected: function () {
                        icon_index = this.val();
                        var temp = arrayBufferToBase64(icons[icon_index].icon);
                        var imgSrc = "data:image/png;base64," + temp;
                        $('#theIcon').attr("src", imgSrc);
                    }
                });

                if (categoryEdit === undefined) {
                    var temp =
                        arrayBufferToBase64(icons[0].icon);
                    var imgSrc = "data:image/png;base64," + temp;
//                    var test = localIcons[0];
                    $('#theIcon').attr("src", imgSrc);
//                    $('#theIcon').attr("src", test);
//                    var canvas = document.createElement("canvas");
//                    var imageElement = document.createElement("img");
//
//                    imageElement.setAttribute('src', test);
//
//                    canvas.width = imageElement.width;
//                    canvas.height = imageElement.height;
//                    var context = canvas.getContext("2d");
//                    context.drawImage(imageElement, 0, 0);
//                    var base64Image = canvas.toDataURL("image/png");

                } else {
                    $("select").val(-1);
                    $("select").data('picker').sync_picker_with_select();
                }


            },
            error: function (xhr, textStatus, errorThrown) {
                alert('request failed');
            }
        });
    }

    function addItem(title, price) {
        items.push({
            id: 0,
            title: title,
            price: price
        });

        $('#itemsTable').append($('<tr id="' + title + '"><td>' + title + '</td>' +
            '<td>' + price + '</td>' +
            '<td> <button type="button" class="btn btn-primary" id="editItem"> <span id="editText">Edit </span> <span' +
            ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" id="deleteItem"' +
            '>Delete    <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));

        if (firstItem === true) {
            addOnClickFunctions();
            firstItem = false;
        }


    }

    function addOnClickFunctions() {
        $(document).on("click", "#itemsTable #deleteItem", function (e) {
            var row = $(this).closest('tr');
            var index = row.index();
            var tableRowId = "#" + items[index].title;
            $(tableRowId).remove();
            items.splice(index, 1);
        });

        $(document).on("click", "#itemsTable #editItem", function (e) {

            var row = $(this).closest('tr');
            var index = row.index();
            var titleCell = $(this).closest('tr').find('td:first');
            var priceCell = $(this).closest('tr').find('td:eq(1)');

            if ($(this).closest('tr').find("#editText").text() === ("Edit ")) {
                titleCell.prop('contenteditable', true);
                priceCell.prop('contenteditable', true);
                titleCell.attr('contenteditable', true);
                titleCell.css("border", "0.5px solid blue");
                priceCell.css("border", "0.5px solid blue");
                $(this).closest('tr').find("#editText").text('Update ');

            } else if ($(this).closest('tr').find("#editText").text() === ("Update ")) {
                $(this).closest('tr').find("#editText").text("Edit ");
                titleCell.prop('contenteditable', false);
                priceCell.prop('contenteditable', false);
                titleCell.attr('contenteditable', false);
                titleCell.css("border", "none");
                priceCell.css("border", "none");
                editItem(index, titleCell, priceCell);
            }

        });
    }

    function editItem(index, titleCell, priceCell) {
        items[index].title = titleCell.text();
        items[index].price = priceCell.text();
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

    function initMealsTable() {

        $.each(meals, function (index, element) {
            $('#mealsTable').append($('<tr id="' + element.title + '"><td>' + element.title + '</td>' +
                '<td> <button type="button" class="btn btn-primary" id="editMeal">Edit <span' +
                ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" ' +
                'id="deleteMeal">Delete    <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));
        })

        if (firstMeal === true) {
            addMealOptions();
            firstMeal = false;
        }
    }

    function addMealOptions() {

        $(document).on("click", "#mealsTable #deleteMeal", function (e) {
            var row = $(this).closest('tr');
            var index = row.index();
            var tableRowId = "#" + meals[index].title;
            $(tableRowId).remove();
            meals.splice(index, 1);

        });

        $(document).on("click", "#mealsTable #editMeal", function (e) {
            var row = $(this).closest('tr');
            var index = row.index();
            var mealEdit = meals[index];
            sessionStorage.setItem("editMealIndex", index);
            sessionStorage.setItem("editMeal", JSON.stringify(mealEdit));
            alert("index and edit meal saved");
            alert(JSON.stringify(mealEdit));
            window.location.replace("/meal-details.html");

        });
    }

    function saveCategoryinDB() {
        var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/addCategory";

        var categoryTitle = $("#categoryTitle").val();
        var categoryDesc = $("#categoryDescription").val();
        var icon = icons[icon_index];
        var items = [];
        var item = {
            id: 0,
            title: "test",
            price: "5.5"
        };
        items.push(item);
        var decoded = arrayBufferToBase64(icon.icon);

        var category = {
            id: 0,
            title: categoryTitle,
            description: categoryDesc,
            items: items,
            meals: meals,
            icon: decoded
        };

        alert("category id: " + category.id + "\n" +
            "category title: " + category.title + "\n" +
            "category description: " + category.description + "\n" +
            "category items: " + items + "\n" +
            "cateory meals: " + category.meals + "\n"
        );

        $.ajax({
            type: "POST",
            url: urlAddress,
            data: JSON.stringify(category),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                alert(data);

            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });


        //                $.post(urlAddress, {
        //                    id: 0,
        //                    title: categoryTitle,
        //                    description: categoryDesc,
        //                    items: "df",
        //                    meals: JSON.stringify(meals),
        //                    icon : JSON.stringify(icon)
        //                }, function (data, status) {
        //                    alert("Data: " + data + "\nStatus: " + status);
        //                    if (data === null) {
        //                        alert("null");
        //                    } else {
        //
        //
        //                    }
        //                });
    }
