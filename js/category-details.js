    var icons = [];
    var items = [];
    var firstItem = true;
    var meals = new Array();
    var icon_index = 0;
    var firstMeal = true;
    var categoryEdit;
    var localIcons = [
"https://s16.postimg.org/urynzolp1/hot_Drink.png",
"https://s12.postimg.org/a8gpmsa3x/cold_Drink.png",
"https://s17.postimg.org/o2sbc63db/meat.png",
"https://s12.postimg.org/hm4bghu2l/salad.png",
"https://s15.postimg.org/qwzer7nqz/snacks.png",
"https://s15.postimg.org/rqd5vzuwb/cafe_black.png",
"https://s13.postimg.org/ob8agi99z/cafe_white.png",
"https://s18.postimg.org/xjimiz9ix/pizza_black.png"
];
    $(document).ready(function () {
        meals = [];
        //if we returned from add meal
        if (sessionStorage.getItem("meal") !== null) {
            var temp = JSON.parse(sessionStorage.getItem("meal"));
            sessionStorage.removeItem("meal");
            // if this is the first meal
            if (sessionStorage.getItem("meals") === null) {
                sessionStorage.setItem("meals", meals);
            } else {
                //if we have more meals
                meals = JSON.parse(sessionStorage.getItem("meals"));
            }
            //add the new meal
            meals.push(temp);
            //save the meals
            sessionStorage.setItem("meals", JSON.stringify(meals));
        }

        // if there wasn't a meal in storage
        if (sessionStorage.getItem("inEdit") !== null) {
            meals = JSON.parse(sessionStorage.getItem("meals"));
            $("#categoryDescription").val(sessionStorage.getItem("categoryDescription"));
            $("#categoryTitle").val(sessionStorage.getItem("categoryTitle"));
        }

        // if we get out from this page remove all
        // session storage variables
        $("#backToCategories").click(function () {
            sessionStorage.removeItem("meal");
            sessionStorage.removeItem("meals");
            sessionStorage.removeItem("inEdit")
            window.location.replace("/index.html");
        });

        // before moving to meal details page, save title
        // and description. to-do: add icon.
        $("#addMealBtn").click(function () {
            var title = $("#categoryTitle").val();
            sessionStorage.setItem("categoryTitle", title);
            var desc = $("#categoryDescription").val();
            sessionStorage.setItem("categoryDescription", desc);
            var icon = $('#theIcon').attr("src");
            sessionStorage.setItem("categoryIcon", icon_index);
            window.location.replace("/meal-details.html");
        });

        //check if all fileds are filled
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


        $("#categoryDetailsForm").submit(function () {
            $("#saveCategory").attr("disabled", true);
            if ($("#saveCategory").text() === "Update") {
                updateCategoryinDB();
            } else {
                saveCategoryinDB();
            }
            sessionStorage.removeItem("meals");
            return false;
        });


        // if we are in edit category
        if (sessionStorage.getItem("categoryEdit") !== null) {
            categoryEdit = JSON.parse(sessionStorage.getItem("categoryEdit"));
            sessionStorage.removeItem("categoryEdit");
            sessionStorage.setItem("inEdit", true);

            $("#categoryTitle").val(categoryEdit.title);
            $("#categoryDescription").val(categoryEdit.description);
            items = categoryEdit.items;
            if (items.length > 0) {
                $.each(items, function (index, element) {
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
            meals = categoryEdit.meals;
            sessionStorage.setItem("meals", JSON.stringify(meals));

            $("#saveCategory").text("Update");
            var temp =
                arrayBufferToBase64(categoryEdit.icon);
            var imgSrc = "data:image/png;base64," + temp;
            $('#theIcon').attr("src", imgSrc);
            sessionStorage.setItem("categoryIcon", temp);
            sessionStorage.setItem("categoryId", categoryEdit.id);

        }

        // to cover a case that we was in edit category,
        // and then moved to meal details
        if (sessionStorage.getItem("inEdit") !== null) {
            $("#saveCategory").text("Update");

        }

        if (meals.length > 0) {
            initMealsTable();
        }



    });


    function initIcons() {
        var editIndex;
        icons = [];
        $.each(localIcons, function (index, element) {

            icons.push({
                id: element.id,
                icon: element.icon
            });
            $('.image-picker').append("<option data-img-src= " + element + " value=" + index + "> </option>");

            if (sessionStorage.getItem("inEdit") === undefined) {
                if (categoryEdit !== undefined) {
                    if (element.icon === categoryEdit.icon) {
                        editIndex = index;
                    }
                }
            }

        })

        $("select").imagepicker({
            show_label: false,
            selected: function () {
                icon_index = this.val();
                $('#theIcon').attr("src", localIcons[icon_index]);
            }
        });

        if (categoryEdit === undefined) {
            var firstIcon = localIcons[0];
            $('#theIcon').attr("src", firstIcon);
            var canvas = document.createElement("canvas");
            var imageElement = document.createElement("img");

            imageElement.setAttribute('src', firstIcon);

            if (sessionStorage.getItem("inEdit") !== null) {
                var indx = sessionStorage.getItem("categoryIcon");
                sessionStorage.removeItem("categoryIcon");
                $('#theIcon').attr("src", localIcons[indx]);
            }

        } else {
            $("select").val(-1);
            $("select").data('picker').sync_picker_with_select();
        }

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

    function initMealsTable() {

        $.each(meals, function (index, element) {
            $('#mealsTable').append($('<tr id="' + element.id + '"><td>' + element.title + '</td>' +
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
            var tableRowId = "#" + meals[index].id;
            $(tableRowId).remove();
            meals.splice(index, 1);

        });

        $(document).on("click", "#mealsTable #editMeal", function (e) {
            var row = $(this).closest('tr');
            var index = row.index();
            var mealEdit = meals[index];
            alert("meals[" + index + "]" + ": " + meals[index]);
            sessionStorage.setItem("editMealIndex", index);
            sessionStorage.setItem("editMeal", JSON.stringify(mealEdit));
            var title = $("#categoryTitle").val();
            sessionStorage.setItem("categoryTitle", title);
            var desc = $("#categoryDescription").val();
            sessionStorage.setItem("categoryDescription", desc);
            window.location.replace("/meal-details.html");
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


    function base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    function saveCategoryinDB() {
        var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/addCategory";

        var categoryTitle = $("#categoryTitle").val();
        var categoryDesc = $("#categoryDescription").val();
        var icon = localIcons[icon_index];

        $.post(urlAddress, {
            id: 0,
            title: categoryTitle,
            description: categoryDesc,
            items: JSON.stringify(items),
            meals: JSON.stringify(meals),
            icon: icon
        }, function (data, status) {
            alert("Data: " + data + "\nStatus: " + status);
            window.location.replace("/home.html");

            if (data === null) {
                alert("null");
            } else {


            }
        });

    }

    function updateCategoryinDB() {
        var urlAddress = "http://localhost:8080/CafeteriaServer/rest/web/updateCategory";

        var categoryTitle = $("#categoryTitle").val();
        var categoryDesc = $("#categoryDescription").val();
        var icon = localIcons[icon_index];
        var id = sessionStorage.getItem("categoryId");

        var category = {
            id: id,
            title: categoryTitle,
            description: categoryDesc,
            items: JSON.stringify(items),
            meals: JSON.stringify(meals),
            icon: icon
        };

        alert("category id: " + category.id + "\n" +
            "category title: " + category.title + "\n" +
            "category description: " + category.description + "\n" +
            "category items: " + items + "\n" +
            "cateory meals: " + category.meals + "\n" +
            "cateory icon: " + icon + "\n"

        );

        $.post(urlAddress, {
            id: id,
            title: categoryTitle,
            description: categoryDesc,
            items: JSON.stringify(items),
            meals: JSON.stringify(meals),
            icon: icon
        }, function (data, status) {
            alert("Data: " + data + "\nStatus: " + status);
            window.location.replace("/home.html");

            if (data === null) {
                alert("null");
            } else {


            }
        });

    }
