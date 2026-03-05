// main.js (tuzatilgan)

// dastlab currentUserId ni belgilaymiz — agar users database.js da bor bo'lsa,
// bu fayl HTML da database.js dan keyin yuklanishi kerak.
let currentUserId = null;

// DOM elementlar
const customersList = document.querySelector(".customers-list");
const foodsSelect = document.querySelector("#foodsSelect");
const ordersList = document.querySelector(".orders-list");
const userHeader = document.querySelector("#userHeader");
const userAddForm = document.querySelector("#userAdd");     // form
const foodsForm = document.querySelector("#foodsForm");     // TO'G'RI selector
const foodsCountInput = document.querySelector("#foodsCount");
const usernameInput = document.querySelector("#usernameInput");
const telephoneInput = document.querySelector("#telephoneInput");
const clientIdSpan = document.querySelector("#clientId");

// USER RENDER (ro'yhatni tozalab qayta chizish)
function UserRender() {
    customersList.innerHTML = ""; // muhim — takrorlanmasligi uchun

    for (const element of users) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        const a = document.createElement('a');

        li.classList.add('customer-item');
        span.classList.add('customer-name');
        a.classList.add('customer-phone');

        span.textContent = element.userName;
        a.textContent = element.userPhone;
        a.setAttribute('href', 'tel:' + element.userPhone);

        // bosilganda hozirgi userni o'rnatish va buyurtmalarni qayta chizish
        li.addEventListener('click', function () {
            currentUserId = element.userId;
            userHeader.textContent = element.userName;
            clientIdSpan.textContent = element.userId;
            renderOrders();
            // vizual indicator uchun active klass qo'shish (agar xohlasangiz)
            document.querySelectorAll('.customer-item').forEach(n => n.classList.remove('active'));
            li.classList.add('active');
        });

        li.append(span, a);
        customersList.append(li);
    }
}

// FOODS RENDER (option.value ni belgilaymiz)
function foodsRender() {
    foodsSelect.innerHTML = "";
    for (const element of foods) {
        const option = document.createElement('option');
        option.textContent = element.foodName;
        option.value = element.foodId; // muhim
        foodsSelect.append(option);
    }
}

// ORDERS RENDER
function renderOrders() {
    ordersList.innerHTML = "";

    if (currentUserId === null) {
        // agar currentUserId hali belgilanmagan bo'lsa, hech narsa chizmang
        return;
    }

    let userOrders = Filter.filter(item => item.userId === currentUserId);

    for (const order of userOrders) {
        let foodObj = foods.find(f => f.foodId === order.foodId);
        if (!foodObj) continue; // topilmasa davom etmaslik

        let li = document.createElement('li');
        let img = document.createElement('img');
        let div = document.createElement('div');
        let name = document.createElement('span');
        let count = document.createElement('span');

        li.classList.add('order-item');
        name.classList.add('order-name');
        count.classList.add('order-count');

        img.src = foodObj.ProductImg;
        img.alt = foodObj.foodName;
        name.textContent = foodObj.foodName;
        count.textContent = order.count;

        div.append(name, count);
        li.append(img, div);
        ordersList.append(li);
    }
}

// FOYDALANUVCHI QO'SHISH (form submit)
userAddForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let name = usernameInput.value.trim();
    let phone = telephoneInput.value.trim();

    if (!name || !phone) return;

    let newUser = {
        userId: Date.now(), // oddiy unique id
        userName: name,
        userPhone: phone
    };

    users.push(newUser);
    UserRender();
    // yangi qo'shilganni avtomatik tanlash
    currentUserId = newUser.userId;
    userHeader.textContent = newUser.userName;
    clientIdSpan.textContent = newUser.userId;
    renderOrders();

    usernameInput.value = "";
    telephoneInput.value = "";
});


//FOODS FROM submit
foodsForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let foodId = Number(foodsSelect.value);
    let countValue = Number(foodsCountInput.value);


    let exist = Filter.find(f => f.userId === currentUserId && f.foodId === foodId);

    if (exist) {




        exist.count += countValue;
    }else{
        Filter.push({
            userId: currentUserId,
            foodId,
            count: countValue
        });
    }

    foodsCountInput.value = "";

    renderOrders();
});

function init(){
    if (Array.isArray(users) && users.length > 0) {
        currentUserId = users[0].userId; 
        userHeader.textContent = users[0].userName;
        clientIdSpan.textContent = users[0].userId;
    }

    UserRender();
    foodsRender();
    renderOrders();
}

init();