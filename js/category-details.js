    var icons = [];
    var items = [];
    var firstItem = true;
    var meals = new Array();
    var icon_index = 0;
    $(document).ready(function () {
        meals = [];
        if (sessionStorage.getItem("meal") !== null) {
            var temp = JSON.parse(sessionStorage.getItem("meal"));
            sessionStorage.removeItem("meal");
            if (sessionStorage.getItem("meals") === null) {
                sessionStorage.setItem("meals", meals);
            } else {
                meals = JSON.parse(sessionStorage.getItem("meals"));
            }
            meals.push(temp);
            sessionStorage.setItem("meals", JSON.stringify(meals));
        }

        if (meals.length > 0) {
            initMealsTable();
        }
        if (sessionStorage.getItem("meal") !== undefined && sessionStorage.getItem("meal") !== null) {
            alert(JSON.parse(sessionStorage.getItem("meal")).title);
        }

        $("#backToCategories").click(function () {
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

    });

    function initIcons() {
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

                })
                $("select").imagepicker({
                    show_label: false,
                    selected: function () {
                        icon_index = this.val();
                    }
                });


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

        $('#itemsTable').append($('<tr><td>' + title + '</td>' +
            '<td>' + price + '</td>' +
            '<td> <button type="button" class="btn btn-primary" id="editItem"> <span id="editText">Edit </span> <span' +
            ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" id="deleteItem"' +
            '>Delete    <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));

        if (firstItem === true) {
            addOnClickFunctions();
            firstItem = false;
        }
        addItemToDB(items[items.length - 1]); //the last



    }

    function addOnClickFunctions() {
        $(document).on("click", "#itemsTable #deleteItem", function (e) {
            var row = $(this).closest('tr');
            var index = row.index();
            deleteItem(items[index]);
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
                editItem(items[index]);
            }

        });
    }

    function addItemToDB(item) {

    }

    function editItem(item) {

    }

    function deleteItem(item) {

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
            $('#mealsTable').append($('<tr><td>' + element.title + '</td>' +
                '<td> <button type="button" class="btn btn-primary" (click)="onEdit(category)">Edit <span' +
                ' class="glyphicon glyphicon-pencil"></span></button> <button type="button" class="btn btn-primary" ' +
                '(click)="onDelete(category)">Delete    <span class="glyphicon glyphicon-remove"></span></button></td></tr>'));
        })
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
