import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

// ДОБАВЛЕНО: Импортируем инструменты для анонимной авторизации
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDVztUxNE1qlfwZBOvDdn8fkyEDz8zUdU",
  authDomain: "my-calendar-db.firebaseapp.com",
  databaseURL: "https://my-calendar-db-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-calendar-db",
  storageBucket: "my-calendar-db.firebasestorage.app",
  messagingSenderId: "363953092541",
  appId: "1:363953092541:web:a03a7566e6a939a1a144d4",
  measurementId: "G-KZQ58XP264"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app); // Инициализируем авторизацию
const btnBack = document.getElementById('btn-back');
const toast = document.getElementById('toast-notification');
let historyStack = [];
let toastTimer = null; 
let selectedContextItem = ""; 
let selectedMultiDays = []; // Для мульти-выбора (развлечения)

// --- 1. БАЗЫ ДАННЫХ ---
const walkPlaces = [
    "Красная площадь", "Аптекарский огород", "Парк Горького", "ВДНХ", 
    "Парк Зарядье", "Чистые пруды", "Старый Арбат", "Парк Музеон", 
    "Царицыно", "Парк Сокольники"
];

const mallsList = [
    { name: "Авиапарк", address: "Ходынский бульвар, 4" },
    { name: "Хорошо!", address: "Хорошёвское шоссе, 27" },
    { name: "Европейский", address: "пл. Киевского Вокзала, 2" },
    { name: "Метрополис", address: "Ленинградское шоссе, 16А стр 4" },
    { name: "Афимолл Сити", address: "Пресненская набережная, 2" },
    { name: "Охотный ряд", address: "Манежная площадь, 1 стр 2" }
];

// 1. Следим за тем, авторизовался ли пользователь
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Пользователь успешно получил анонимный паспорт!
        console.log("Авторизован анонимно. Уникальный ID пользователя:", user.uid);
        
        // 2. ТОЛЬКО ТЕПЕРЬ можно безопасно читать данные из базы
        const calendarRef = ref(db, 'calendarData'); // укажите ваш путь к данным в базе
        
        onValue(calendarRef, (snapshot) => {
            const data = snapshot.val();
            // Вызываем вашу функцию отрисовки календаря
            // renderCalendar(data); 
        });

    } else {
        console.log("Пользователь не авторизован. Выполняем вход...");
        // 3. Если паспорта еще нет, запрашиваем его у Firebase
        signInAnonymously(auth)
            .catch((error) => {
                console.error("Ошибка анонимного входа:", error.code, error.message);
            });
    }
});

// Развернутые художественные описания на 7-10 предложений
const tripsData = {
    "Тула": "Тула — это один из старейших и красивейших городов России, славящийся своими уникальными ремесленными традициями. Здесь вы сможете посетить величественный Тульский кремль, который полностью сохранил свой первозданный исторический облик. В знаменитом Музее оружия вас ждет уникальная интерактивная экспозиция, рассказывающая о многовековой истории русского оружейного мастерства. Не забудьте заглянуть в уютный Музей тульского пряника, где можно не только узнать секреты его приготовления, но и попробовать свежайшую выпечку с ароматным чаем. Набережная реки Упы предлагает прекрасные зоны для неспешных пеших прогулок в любое время суток. Современное творческое пространство «Октава» порадует любителей искусства своими выставками, лекциями и стильными кафе. А всего в нескольких километрах от города находится Ясная Поляна — живописная усадьба, где жил и создавал свои шедевры великий писатель Лев Толстой. Это идеальное направление для насыщенных и запоминающихся выходных.",
    "Гжель": "Гжель — это удивительный и живописный подмосковный край, ставший всемирно известной колыбелью традиционной русской керамики. Сюда отправляются ради того, чтобы воочию увидеть процесс создания знаменитого бело-синего фарфора. Во время экскурсии на действующее производство вы познакомитесь с потомственными мастерами и узнаете все тонкости уникальной ручной росписи. В местном музее представлена богатейшая коллекция исторических изделий, завораживающих своей тонкой детализацией и изяществом. Каждый желающий может принять участие в увлекательном мастер-классе и расписать собственный сувенир на память. Помимо ремесленной эстетики, Гжель славится своей тихой, умиротворяющей загородной природой и старинными святыми источниками. Прогулки по местным улочкам с деревянной архитектурой позволяют полностью отвлечься от суеты мегаполиса. Здесь царит неповторимая атмосфера душевного тепла, уюта и искреннего гостеприимства. Это путешествие подарит вам массу ярких впечатлений, вдохновения и красивых памятных фотографий."
};

const foodCategories = {
    "Японская": ['Ramen', 'Якитория', 'СушиМастер', 'Чифанька'],
    "Кавказская": ['Про Кавказ', 'Джон Джоли', 'Старик Хинкалыч', 'The Хинкал'],
    "Американская": ['Вкусно и точка', 'Rostics'],
    "Рыбная": ['FishPoint', 'Моремания'],
    "Итальянская": ['Papa Johns', 'Додо', 'Pasta Qween'],
    "Русская": ['The Bык', 'NicePriceCoffee', 'Теремок']
};

const flowersData = [
    { id: 1, name: "Кустовая роза", shortDesc: "Изящное соцветие", longDesc: "Пышные кустовые розы, создающие ощущение праздничной лёгкости.", colors: [{hex: "#D32F2F", name: "Красный"}, {hex: "#FAFAFA", name: "Белый"}, {hex: "#F48FB1", name: "Нежно-розовый"}, {hex: "#FBC02D", name: "Желтый"}, {hex: "#FFAB91", name: "Персиковый"}] },
    { id: 2, name: "Гвоздика", shortDesc: "Классическая стойкость", longDesc: "Стойкие и изящные цветы с богатой палитрой оттенков.", colors: [{hex: "#C62828", name: "Красный"}, {hex: "#FAFAFA", name: "Белый"}, {hex: "#F06292", name: "Розовый"}, {hex: "#880E4F", name: "Бордовый"}, {hex: "#FFF176", name: "Светло-желтый"}] },
    { id: 3, name: "Альстромерия", shortDesc: "Перуанская лилия", longDesc: "Яркие и нежные лепестки, которые долго сохраняют свежесть.", colors: [{hex: "#FAFAFA", name: "Белый"}, {hex: "#EC407A", name: "Малиновый"}, {hex: "#FFEE58", name: "Желтый"}, {hex: "#FFA726", name: "Оранжевый"}, {hex: "#AB47BC", name: "Фиолетовый"}] },
    { id: 4, name: "Георгин", shortDesc: "Осеннее великолепие", longDesc: "Крупные, геометрически идеальные бутоны.", colors: [{hex: "#880E4F", name: "Темно-бордовый"}, {hex: "#D32F2F", name: "Красный"}, {hex: "#FF4081", name: "Ярко-розовый"}, {hex: "#FFEB3B", name: "Желтый"}, {hex: "#FAFAFA", name: "Белый"}] },
    { id: 5, name: "Гортензия", shortDesc: "Облако нежности", longDesc: "Объемное соцветие, напоминающее лёгкое воздушное облако.", colors: [{hex: "#64B5F6", name: "Небесно-голубой"}, {hex: "#F48FB1", name: "Розовый"}, {hex: "#FAFAFA", name: "Белый"}, {hex: "#CE93D8", name: "Сиреневый"}] },
    { id: 6, name: "Лилия", shortDesc: "Королевский шарм", longDesc: "Благородный цветок с утончённым силуэтом и глубоким ароматом.", colors: [{hex: "#FAFAFA", name: "Белый"}, {hex: "#F48FB1", name: "Розовый"}, {hex: "#FFF176", name: "Желтый"}, {hex: "#FFB74D", name: "Оранжевый"}, {hex: "#B71C1C", name: "Темно-красный"}] },
    { id: 7, name: "Мимоза", shortDesc: "Весеннее солнце", longDesc: "Яркие пушистые соцветия, дарящие весеннее тепло.", colors: [{hex: "#FFEA00", name: "Ярко-желтый"}, {hex: "#FFEE58", name: "Светло-желтый"}, {hex: "#FFC107", name: "Золотистый"}] },
    { id: 8, name: "Пионы", shortDesc: "Пышный шик", longDesc: "Невероятно востребованные и ароматные многослойные бутоны.", colors: [{hex: "#F8BBD0", name: "Нежно-розовый"}, {hex: "#FAFAFA", name: "Белый"}, {hex: "#D81B60", name: "Малиновый"}, {hex: "#FF8A65", name: "Коралловый"}, {hex: "#880E4F", name: "Винный"}] },
    { id: 9, name: "Подсолнух", shortDesc: "Энергия солнца", longDesc: "Яркий, жизнерадостный цветок, привносящий позитив.", colors: [{hex: "#FFEB3B", name: "Классический желтый"}, {hex: "#FFC107", name: "Оранжево-желтый"}, {hex: "#5D4037", name: "Коричнево-красный"}] },
    { id: 10, name: "Протея", shortDesc: "Экзотический центр", longDesc: "Уникальный доминантный цветок для ценителей высокой флористики.", colors: [{hex: "#F8BBD0", name: "Светло-розовый"}, {hex: "#F06292", name: "Насыщенно-розовый"}, {hex: "#880E4F", name: "Бордовый"}, {hex: "#FAFAFA", name: "Белый"}] },
    { id: 11, name: "Одноголовая роза", shortDesc: "Классический выбор", longDesc: "Идеальный крупный бутон на высоком элегантном стебле.", colors: [{hex: "#D32F2F", name: "Красный"}, {hex: "#FAFAFA", name: "Белый"}, {hex: "#F06292", name: "Розовый"}, {hex: "#880E4F", name: "Бордовый"}, {hex: "#FFCCBC", name: "Персиковый"}] },
    { id: 12, name: "Пионовидная роза", shortDesc: "Французский стиль", longDesc: "Изысканное сочетание классической розы и пышной текстуры пиона.", colors: [{hex: "#F8BBD0", name: "Пудрово-розовый"}, {hex: "#FFE0B2", name: "Кремово-персиковый"}, {hex: "#E91E63", name: "Малиновый"}, {hex: "#FAFAFA", name: "Белый"}, {hex: "#D32F2F", name: "Красный"}] },
    { id: 13, name: "Ромашка", shortDesc: "Полевая искренность", longDesc: "Милые садовые ромашки, создающие атмосферу тепла и уюта.", colors: [{hex: "#FAFAFA", name: "Белая"}, {hex: "#FFEB3B", name: "Желтая"}, {hex: "#F48FB1", name: "Светло-розовая"}] },
    { id: 14, name: "Сирень", shortDesc: "Весенний шлейф", longDesc: "Пышные ароматные веточки с незабываемым ностальгическим запахом.", colors: [{hex: "#E1BEE7", name: "Светло-сиреневый"}, {hex: "#AB47BC", name: "Насыщенный сиреневый"}, {hex: "#7B1FA2", name: "Пурпурный"}, {hex: "#FAFAFA", name: "Белый"}] },
    { id: 15, name: "Тюльпан", shortDesc: "Свежесть утра", longDesc: "Хрустящие сочные стебли и нежные классические бутоны.", colors: [{hex: "#D32F2F", name: "Красный"}, {hex: "#FFEB3B", name: "Желтый"}, {hex: "#FAFAFA", name: "Белый"}, {hex: "#F06292", name: "Розовый"}, {hex: "#8E24AA", name: "Фиолетовый"}, {hex: "#FF9800", name: "Оранжевый"}] },
    { id: 16, name: "Хризантема", shortDesc: "Абсолютная стойкость", longDesc: "Пышный цветок, способный оставаться свежим в вазе рекордное время.", colors: [{hex: "#FAFAFA", name: "Белый"}, {hex: "#FFEB3B", name: "Желтый"}, {hex: "#AED581", name: "Светло-зеленый"}, {hex: "#F06292", name: "Розовый"}, {hex: "#880E4F", name: "Бордовый"}, {hex: "#CE93D8", name: "Сиреневый"}] },
    { id: 17, name: "Экзотика", shortDesc: "Тропический микс", longDesc: "Редкие декоративные растения для самых необычных букетов." },
    { id: 18, name: "Букет", shortDesc: "Авторская сборка", longDesc: "Гармоничная композиция, собранная профессиональным флористом." }
];

// --- 2. ГЕНЕРАЦИЯ ИНТЕРФЕЙСА ПРИ ЗАГРУЗКЕ ---
window.addEventListener('DOMContentLoaded', () => {
    renderAllSections();
    buildInfiniteWheels();
    updateProfileUI(); 
    setupWheelDragAndType(wheelHours, inputHours, 24);
    setupWheelDragAndType(wheelMinutes, inputMinutes, 60);
});

function renderAllSections() {
    const walkContainer = document.getElementById('walk-container');
    walkContainer.innerHTML = walkPlaces.map(place => `
        <div class="list-item">
            <button class="name-btn">${place}</button>
            <button class="choose-btn" onclick="openStandardCalendar('${place}')">Выбрать</button>
        </div>`).join('');

    const mallsContainer = document.getElementById('malls-container');
    mallsContainer.innerHTML = mallsList.map(mall => `
        <div class="list-item">
            <button class="mall-name-btn">
                <span class="mall-title">${mall.name}</span>
                <span class="mall-address">${mall.address}</span>
            </button>
            <button class="choose-btn" onclick="openStandardCalendar('${mall.name}')">Выбрать</button>
        </div>`).join('');

    const tripsContainer = document.getElementById('trips-container');
    tripsContainer.innerHTML = Object.keys(tripsData).map(city => 
        `<button class="trip-main-btn" onclick="openTripModal('${city}')">${city}</button>`
    ).join('');
}

function openFoodCategory(category) {
    document.getElementById('food-category-title').innerText = category;
    const container = document.getElementById('food-list-container');
    container.innerHTML = foodCategories[category].map(restaurant => `
        <div class="list-item">
            <button class="name-btn">${restaurant}</button>
            <button class="choose-btn" onclick="openStandardCalendar('${restaurant}')">Выбрать</button>
        </div>`).join('');
    navigate('screen-food-list');
}

// --- 3. НАВИГАЦИЯ ---
function navigate(targetScreenId) {
    const currentScreen = document.querySelector('.screen:not(.hidden)');
    if (currentScreen) { historyStack.push(currentScreen.id); currentScreen.classList.add('hidden'); }
    document.getElementById(targetScreenId).classList.remove('hidden');
    updateBackButton(targetScreenId);
}

function goBack() {
    if (historyStack.length === 0) return;
    const currentScreen = document.querySelector('.screen:not(.hidden)');
    if (currentScreen) currentScreen.classList.add('hidden');
    const previousScreenId = historyStack.pop();
    document.getElementById(previousScreenId).classList.remove('hidden');
    updateBackButton(previousScreenId);
}

function updateBackButton(currentScreenId) {
    const btnBack = document.getElementById('btn-back');
    if (currentScreenId === 'screen-main' || currentScreenId === 'screen-finish') btnBack.classList.add('hidden');
    else btnBack.classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// --- 4. МОДАЛКИ И КАЛЕНДАРИ ---
function openStandardCalendar(itemName) {
    selectedContextItem = itemName; 
    openCalendar('edit');
}

// Динамическое заполнение обновленного окна поездки
function openTripModal(city) {
    selectedContextItem = city;
    document.getElementById('trip-title').innerText = city;
    document.getElementById('trip-desc').innerText = tripsData[city];
    document.getElementById('trip-modal-img').src = `images/${city === 'Тула' ? 19 : 20}.jpg`;
    document.getElementById('trip-info-modal').classList.remove('hidden');
}

/* Цветы */
let selectedFlowerColor = null; 
function openFlowersSection() {
    navigate('screen-flowers');
    const galleryContainer = document.getElementById('flowers-gallery');
    galleryContainer.innerHTML = flowersData.map(flower => `
        <div class="flower-card" onclick="openFlowerModal(${flower.id})">
            <img src="images/${flower.id}.jpg" alt="${flower.name}" class="flower-img">
            <div class="flower-overlay">
                <h3>${flower.name}</h3>
                <p>${flower.shortDesc}</p>
            </div>
        </div>
    `).join('');
}

function openFlowerModal(flowerId) {
    const flower = flowersData.find(f => f.id === flowerId);
    if (!flower) return;
    
    selectedFlowerColor = null; 
    selectedContextItem = flower.name;
    document.getElementById('flower-modal-img').src = `images/${flower.id}.jpg`;
    document.getElementById('flower-modal-title').innerText = flower.name;
    document.getElementById('flower-modal-desc').innerText = flower.longDesc;

    const colorsSection = document.getElementById('flower-colors-section');
    const paletteContainer = document.getElementById('flower-color-palette');
    
    if (flower.colors && flower.colors.length > 0) {
        colorsSection.classList.remove('hidden');
        paletteContainer.innerHTML = ''; 
        flower.colors.forEach((colorObj, index) => {
            const colorBox = document.createElement('div');
            colorBox.classList.add('color-box');
            colorBox.style.backgroundColor = colorObj.hex;
            colorBox.title = colorObj.name; 
            if (index === 0) { colorBox.classList.add('selected'); selectedFlowerColor = colorObj.name; }
            colorBox.onclick = function() {
                document.querySelectorAll('.color-box').forEach(box => box.classList.remove('selected'));
                this.classList.add('selected');
                selectedFlowerColor = colorObj.name; 
            };
            paletteContainer.appendChild(colorBox);
        });
    } else {
        colorsSection.classList.add('hidden');
        paletteContainer.innerHTML = '';
    }
    document.getElementById('flower-modal').classList.remove('hidden');
}

function chooseFlowerAndGoToDate() {
    if (selectedFlowerColor) selectedContextItem += ` (${selectedFlowerColor})`;
    closeModal('flower-modal');
    openCalendar('edit');
}

/* Многодневный календарь с ограничением до 7 дней */
let rangeStart = null;
let rangeEnd = null;

function openMultiCalendar() {
    closeModal('trip-info-modal');
    const grid = document.getElementById('multi-calendar-grid');
    grid.innerHTML = '';
    rangeStart = null; rangeEnd = null;

    for (let i = 1; i <= 30; i++) {
        const day = document.createElement('div');
        day.classList.add('day-cell');
        day.innerText = i;
        day.dataset.day = i;
        day.onclick = () => handleMultiDayClick(i);
        grid.appendChild(day);
    }
    document.getElementById('multi-calendar-modal').classList.remove('hidden');
}

// 1. ИСПРАВЛЕНИЕ: Выделение любого количества дней в календаре 'Развлечения'
function handleMultiDayClick(dayNum) {
    const index = selectedMultiDays.indexOf(dayNum);
    if (index > -1) {
        selectedMultiDays.splice(index, 1); // Убираем, если кликнули повторно
    } else {
        selectedMultiDays.push(dayNum); // Добавляем в массив
    }
    updateMultiCalendarVisuals();
}

function updateMultiCalendarVisuals() {
    document.querySelectorAll('.day-cell').forEach(cell => {
        const d = parseInt(cell.dataset.day);
        cell.classList.toggle('confirmed', selectedMultiDays.includes(d));
    });
}

function confirmMultiDateSelection() {
    if (!rangeStart) return showToast("Сначала выберите даты поездки!");
    if (!rangeEnd) rangeEnd = rangeStart; 
    updateMultiCalendarVisuals(true); 
    
    const user = getCurrentUser();
    if (user) {
        if (!user.savedDates) user.savedDates = {};
        const eventStr = `Поездка: ${selectedContextItem} (с ${rangeStart} по ${rangeEnd})`;
        user.savedDates[`trip-${Date.now()}`] = eventStr; 
        setCurrentUser(user);
        const db = getUsersDB(); const uIdx = db.findIndex(u => u.username.toLowerCase() === user.username.toLowerCase());
        if (uIdx !== -1) { db[uIdx].savedDates = user.savedDates; saveUsersDB(db); }
        showToast(`Поездка сохранена! (с ${rangeStart} по ${rangeEnd} числа)`);
    } else {
        showToast(`Даты выбраны: с ${rangeStart} по ${rangeEnd}. Войдите, чтобы сохранить!`);
    }
    
    setTimeout(() => closeModal('multi-calendar-modal'), 1000);
}

// --- 5. АВТОРИЗАЦИЯ, ЛОКАЛЬНАЯ БД, ОБЫЧНЫЙ КАЛЕНДАРЬ ---
const authModal = document.getElementById('auth-modal');
const viewLogin = document.getElementById('auth-view-login');
const viewRegister = document.getElementById('auth-view-register');
const viewProfile = document.getElementById('auth-view-profile');
const profileLabel = document.getElementById('profile-label');
const profileGreeting = document.getElementById('profile-greeting');

function getUsersDB() { return JSON.parse(localStorage.getItem('users_db')) || []; }
function saveUsersDB(db) { localStorage.setItem('users_db', JSON.stringify(db)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('current_user')) || null; }
function setCurrentUser(user) { localStorage.setItem('current_user', JSON.stringify(user)); }

function openAuthModal() {
    authModal.classList.remove('hidden');
    const user = getCurrentUser();
    if (user) switchAuthView('profile'); else switchAuthView('login');
}
function closeAuthOverlay(event) { if (event.target === authModal) closeModal('auth-modal'); }

function switchAuthView(viewName) {
    viewLogin.classList.add('hidden'); viewRegister.classList.add('hidden'); viewProfile.classList.add('hidden');
    if (viewName === 'login') viewLogin.classList.remove('hidden');
    if (viewName === 'register') viewRegister.classList.remove('hidden');
    if (viewName === 'profile') {
        const user = getCurrentUser();
        profileGreeting.innerText = `Привет, ${user ? user.name : 'Пользователь'}!`;
        viewProfile.classList.remove('hidden');
    }
}

function updateProfileUI() {
    const user = getCurrentUser();
    if (user) { profileLabel.innerText = user.name; profileLabel.classList.remove('hidden'); } 
    else { profileLabel.classList.add('hidden'); }
}

function handleLoginSubmit() {
    const userInp = document.getElementById('login-username').value.trim();
    const passInp = document.getElementById('login-password').value;
    const db = getUsersDB();
    const foundUser = db.find(u => u.username.toLowerCase() === userInp.toLowerCase() && u.password === passInp);
    if (foundUser) {
        setCurrentUser(foundUser); updateProfileUI(); showToast(`Добро пожаловать, ${foundUser.name}!`);
        closeModal('auth-modal'); document.getElementById('login-username').value = ''; document.getElementById('login-password').value = '';
    } else {
        const activeBox = document.getElementById('auth-view-login');
        document.body.classList.add('error-bg'); activeBox.classList.add('shake-animation');
        setTimeout(() => { document.body.classList.remove('error-bg'); activeBox.classList.remove('shake-animation'); }, 1000);
    }
}

function handleRegisterSubmit() {
    const userInp = document.getElementById('reg-username').value.trim();
    const passInp = document.getElementById('reg-password').value;
    const nameInp = document.getElementById('reg-name').value.trim();
    if (!userInp || !passInp || !nameInp) return showToast("Заполните все поля!");
    const db = getUsersDB();
    if (db.some(u => u.username.toLowerCase() === userInp.toLowerCase())) return showToast("Логин уже занят.");
    const newUser = { username: userInp, password: passInp, name: nameInp, savedDates: {} };
    db.push(newUser); saveUsersDB(db); setCurrentUser(newUser); updateProfileUI();
    showToast("Регистрация успешна!"); closeModal('auth-modal');
    document.getElementById('reg-username').value = ''; document.getElementById('reg-password').value = ''; document.getElementById('reg-name').value = '';
}

function handleLogout() { localStorage.removeItem('current_user'); updateProfileUI(); showToast("Вы вышли из системы"); closeModal('auth-modal'); }

const calendarModal = document.getElementById('calendar-modal');
const calendarMonthYear = document.getElementById('calendar-month-year');
const calendarDaysContainer = document.getElementById('calendar-days');
const calendarViewModeEl = document.getElementById('calendar-view-mode');
const calendarEditModeEl = document.getElementById('calendar-edit-mode');
const eventDetailsText = document.getElementById('event-details-text');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDay = null; 
let currentCalendarMode = 'view'; 

const monthsRu = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
const monthsRuTitle = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

function openCalendar(mode = 'view') {
    currentCalendarMode = mode;
    calendarModal.classList.remove('hidden');
    closeModal('auth-modal');
    if (mode === 'edit') {
        calendarEditModeEl.classList.remove('hidden'); calendarViewModeEl.classList.add('hidden');
        setTimeout(centerTimeWheels, 50);
    } else {
        calendarEditModeEl.classList.add('hidden'); calendarViewModeEl.classList.remove('hidden');
        eventDetailsText.innerHTML = "Выберите день, чтобы посмотреть планы.";
    }
    selectedDay = null; renderCalendar();
}

function closeCalendarOverlay(event) { if (event.target === calendarModal) closeModal('calendar-modal'); }

function renderCalendar() {
    calendarMonthYear.innerText = `${monthsRuTitle[currentMonth]} ${currentYear}`;
    calendarDaysContainer.innerHTML = '';
    let firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    let startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const user = getCurrentUser();

    for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div'); emptyCell.classList.add('empty'); calendarDaysContainer.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div'); dayCell.innerText = day;
        const dateKey = `${currentYear}-${currentMonth}-${day}`;
        if (user && user.savedDates && user.savedDates[dateKey]) dayCell.classList.add('saved-date');
        else if (day === selectedDay && currentCalendarMode === 'edit') dayCell.classList.add('selected-date');

        dayCell.onclick = () => {
            selectedDay = day; renderCalendar(); 
            if (currentCalendarMode === 'view') {
                if (user && user.savedDates && user.savedDates[dateKey]) {
                    eventDetailsText.innerHTML = `<strong>${day} ${monthsRu[currentMonth]}</strong>Событие: ${user.savedDates[dateKey]}`;
                } else {
                    eventDetailsText.innerHTML = `<strong>${day} ${monthsRu[currentMonth]}</strong>Свободный день! Планов нет.`;
                }
            }
        };
        calendarDaysContainer.appendChild(dayCell);
    }

    let totalCells = startDay + daysInMonth;
    for (let i = 0; i < (42 - totalCells); i++) {
        const emptyCell = document.createElement('div'); emptyCell.classList.add('empty'); calendarDaysContainer.appendChild(emptyCell);
    }
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; } else if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    selectedDay = null; 
    if (currentCalendarMode === 'view') eventDetailsText.innerHTML = "Выберите день, чтобы посмотреть планы.";
    renderCalendar();
}

function resetDateSelection() {
    if (selectedDay === null) return showToast("Выберите конкретный день для очистки");
    const user = getCurrentUser(); const dateKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    if (user && user.savedDates && user.savedDates[dateKey]) {
        delete user.savedDates[dateKey]; setCurrentUser(user);
        const db = getUsersDB(); const uIdx = db.findIndex(u => u.username.toLowerCase() === user.username.toLowerCase());
        if (uIdx !== -1) { db[uIdx].savedDates = user.savedDates; saveUsersDB(db); }
        showToast("Событие удалено из календаря");
    } else { showToast("На этот день нет событий"); }
    selectedDay = null; renderCalendar(); closeModal('calendar-modal');
}

function saveDateSelection() {
    // ИСПРАВЛЕНИЕ: Теперь если день не выбран, мы явно говорим об этом пользователю
    if (selectedDay === null) {
        if (typeof showToast === 'function') {
            showToast("Ошибка: Сначала выберите день на календаре!");
        } else {
            alert("Пожалуйста, выберите день на календаре перед сохранением.");
        }
        return; 
    }

    const hEl = document.querySelector('#wheel-hours .active-time'); 
    const mEl = document.querySelector('#wheel-minutes .active-time');
    const timeStr = `${hEl ? hEl.innerText : "00"}:${mEl ? mEl.innerText : "00"}`;
    const user = getCurrentUser(); 
    const dateKey = `${currentYear}-${currentMonth}-${selectedDay}`;

    const eventName = selectedContextItem ? `${selectedContextItem} в ${timeStr}` : `Событие в ${timeStr}`;

    if (user) {
        if (!user.savedDates) user.savedDates = {};
        if (!user.savedDates[dateKey]) user.savedDates[dateKey] = [];
        
        user.savedDates[dateKey].push(eventName);
        setCurrentUser(user);
        
        const db = getUsersDB(); 
        const uIdx = db.findIndex(u => u.username.toLowerCase() === user.username.toLowerCase());
        if (uIdx !== -1) { 
            db[uIdx].savedDates = user.savedDates; 
            saveUsersDB(db); 
        }
        
        if (typeof showToast === 'function') showToast("Событие успешно сохранено!");
    } else { 
        if (typeof showToast === 'function') showToast("Войдите в аккаунт для сохранения!"); 
    }
    
    selectedContextItem = ""; 
    selectedDay = null; 
    renderCalendar(); 
    closeModal('calendar-modal');
}

function showToast(message) {
    toast.innerText = message; toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 5000);
}

// --- 6. КОЛЕСИКИ ВРЕМЕНИ ---
const wheelHours = document.getElementById('wheel-hours');
const wheelMinutes = document.getElementById('wheel-minutes');
const inputHours = document.getElementById('input-hours');
const inputMinutes = document.getElementById('input-minutes');
let hoursResetTimeout = null; let minutesResetTimeout = null;

function buildInfiniteWheels() {
    let hoursHTML = '<div></div>';
    for (let loop = 0; loop < 3; loop++) { for (let i = 0; i < 24; i++) { let str = i < 10 ? '0' + i : i; hoursHTML += `<div data-val="${i}">${str}</div>`; } }
    hoursHTML += '<div></div>'; wheelHours.innerHTML = hoursHTML;
    let minutesHTML = '<div></div>';
    for (let loop = 0; loop < 3; loop++) { for (let i = 0; i < 60; i++) { let str = i < 10 ? '0' + i : i; minutesHTML += `<div data-val="${i}">${str}</div>`; } }
    minutesHTML += '<div></div>'; wheelMinutes.innerHTML = minutesHTML;

    wheelHours.onscroll = () => { handleActiveHighlight(wheelHours); clearTimeout(hoursResetTimeout); hoursResetTimeout = setTimeout(() => { handleInfiniteScrollLoop(wheelHours, 24); }, 100); };
    wheelMinutes.onscroll = () => { handleActiveHighlight(wheelMinutes); clearTimeout(minutesResetTimeout); minutesResetTimeout = setTimeout(() => { handleInfiniteScrollLoop(wheelMinutes, 60); }, 100); };
}

function handleInfiniteScrollLoop(wheel, maxVal) {
    const itemHeight = 30; const currentScroll = wheel.scrollTop; const midSectionStart = maxVal * itemHeight;
    if (currentScroll < itemHeight * 4) { wheel.scrollTop = currentScroll + midSectionStart; }
    else if (currentScroll > midSectionStart * 2) { wheel.scrollTop = currentScroll - midSectionStart; }
}

function handleActiveHighlight(wheel) {
    const items = wheel.querySelectorAll('div[data-val]');
    const wheelCenter = wheel.getBoundingClientRect().top + wheel.getBoundingClientRect().height / 2;
    let closestItem = null; let minDistance = Infinity;
    items.forEach(item => {
        const distance = Math.abs(wheelCenter - (item.getBoundingClientRect().top + item.getBoundingClientRect().height / 2));
        item.classList.remove('active-time');
        if (distance < minDistance) { minDistance = distance; closestItem = item; }
    });
    if (closestItem) closestItem.classList.add('active-time');
}

function centerTimeWheels() {
    const itemHeight = 30; wheelHours.scrollTop = 24 * itemHeight; wheelMinutes.scrollTop = 60 * itemHeight;
    handleActiveHighlight(wheelHours); handleActiveHighlight(wheelMinutes);
}

function setupWheelDragAndType(wheel, input, maxVal) {
    let isDown = false; let startY, scrollTop, hasDragged = false;
    wheel.addEventListener('mousedown', (e) => { isDown = true; hasDragged = false; wheel.style.scrollSnapType = 'none'; startY = e.pageY - wheel.offsetTop; scrollTop = wheel.scrollTop; });
    wheel.addEventListener('mouseleave', () => { if (isDown) { isDown = false; wheel.style.scrollSnapType = 'y mandatory'; } });
    wheel.addEventListener('mouseup', () => { if (isDown) { isDown = false; wheel.style.scrollSnapType = 'y mandatory'; const current = wheel.scrollTop; wheel.scrollTop = current + 1; wheel.scrollTop = current; } });
    wheel.addEventListener('mousemove', (e) => { if (!isDown) return; e.preventDefault(); const y = e.pageY - wheel.offsetTop; const walk = (y - startY) * 1.5; if (Math.abs(walk) > 3) hasDragged = true; wheel.scrollTop = scrollTop - walk; });
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

// КОНФИГУРАЦИЯ FIREBASE (Замените своими данными из Project Settings)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ДАННЫЕ ПРИЛОЖЕНИЯ ДЛЯ ЗАПОЛНЕНИЯ ИНТЕРФЕЙСА
const walkData = [
    { name: "Центральный парк культуры", desc: "Уютные аллеи и красивые пруды для тихих прогулок." },
    { name: "Парк Набережная", desc: "Прекрасный вид на реку и благоустроенные дорожки." }
];

const mallsData = [
    { name: "ТЦ Плаза", address: "ул. Ленина, д. 45" },
    { name: "ТРЦ Атриум", address: "пр. Мира, д. 12" }
];

const tripsData = [
    { name: "Поездка в Тулу", desc: "Знакомство с древним Кремлем, дегустация традиционных пряников и посещение музеев оружия.", img: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=600" },
    { name: "Поездка в Гжель", desc: "Экскурсия на производство знаменитого фарфора, участие в мастер-классе по росписи.", img: "https://images.unsplash.com/photo-1576016770956-debb63d900ee?w=600" }
];

const foodData = {
    "Кавказская": [{ name: "Ресторан Очаг" }, { name: "Кафе Кинза" }],
    "Русская": [{ name: "Трактир Изба" }, { name: "Кафе Блины" }],
    "Японская": [{ name: "Суши Бар" }, { name: "Тануки Оазис" }],
    "Итальянская": [{ name: "Пиццерия Марио" }, { name: "Паста Классик" }],
    "Американская": [{ name: "Бургер Хаус" }, { name: "Гриль Бар" }],
    "Рыбная": [{ name: "Волна и Невод" }, { name: "Порт Ресторан" }]
};

const flowersData = [
    { name: "Красные розы", desc: "Классические розы премиум качества.", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500", colors: ["#FF0000", "#990000", "#E60000"] },
    { name: "Белые Лилии", desc: "Нежные ароматные лилии для особого случая.", img: "https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?w=500", colors: ["#FFFFFF", "#F5F5DC"] },
    { name: "Весенние Тюльпаны", desc: "Яркий букет свежих разноцветных тюльпанов.", img: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500", colors: ["#FFD700", "#FF69B4", "#FF4500"] }
];

// СОСТОЯНИЕ ПРИЛОЖЕНИЯ
let screenHistory = ['screen-main'];
let currentSelectionText = ""; 
let currentSelectedColor = null;
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDateStr = null;
let calendarMode = 'view'; 

// Состояния для многодневного календаря
let multiSelectStart = null;
let multiSelectEnd = null;

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    checkUserSession();
    renderWalkList();
    renderMallsList();
    renderTripsList();
    initTimeWheels();
    setupAdminRealtimeSync();
});

// НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ
function navigate(screenId) {
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen === screenId) return;

    document.getElementById(currentScreen).classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
    screenHistory.push(screenId);

    const backBtn = document.getElementById('btn-back');
    if (screenHistory.length > 1) {
        backBtn.classList.remove('hidden');
    } else {
        backBtn.classList.add('hidden');
    }
}

function goBack() {
    if (screenHistory.length <= 1) return;
    const currentScreen = screenHistory.pop();
    const prevScreen = screenHistory[screenHistory.length - 1];

    document.getElementById(currentScreen).classList.add('hidden');
    document.getElementById(prevScreen).classList.remove('hidden');

    const backBtn = document.getElementById('btn-back');
    if (screenHistory.length > 1) {
        backBtn.classList.remove('hidden');
    } else {
        backBtn.classList.add('hidden');
    }
}

// УВЕДОМЛЕНИЯ
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// РАБОТА С БАЗОЙ ДАННЫХ FIREBASE (АСИНХРОННО)
async function getUsersDB() {
    const dbRef = ref(db, 'users');
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val() || [];
        }
        return [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function saveUsersDB(usersArray) {
    const dbRef = ref(db, 'users');
    try {
        await set(dbRef, usersArray);
    } catch (e) {
        console.error(e);
    }
}

function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// АВТОРИЗАЦИЯ И СЕССИИ
function checkUserSession() {
    const user = getCurrentUser();
    const label = document.getElementById('profile-label');
    const adminLink = document.getElementById('btn-admin-panel-link');
    if (user) {
        label.innerText = user.name;
        label.classList.remove('hidden');
        if (user.username === 'admin') {
            adminLink.classList.remove('hidden');
        } else {
            adminLink.classList.add('hidden');
        }
    } else {
        label.classList.add('hidden');
        adminLink.classList.add('hidden');
    }
}

function openAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
    const user = getCurrentUser();
    if (user) {
        switchAuthView('profile');
        document.getElementById('profile-greeting').innerText = `Привет, ${user.name}!`;
    } else {
        switchAuthView('login');
    }
}

function closeAuthOverlay(event) {
    if (event.target.id === 'auth-modal') {
        document.getElementById('auth-modal').classList.add('hidden');
    }
}

function switchAuthView(view) {
    document.getElementById('auth-view-login').classList.add('hidden');
    document.getElementById('auth-view-register').classList.add('hidden');
    document.getElementById('auth-view-profile').classList.add('hidden');

    if (view === 'login') document.getElementById('auth-view-login').remove('hidden');
    if (view === 'register') document.getElementById('auth-view-register').remove('hidden');
    if (view === 'profile') document.getElementById('auth-view-profile').remove('hidden');
}

async function handleLoginSubmit() {
    const userInp = document.getElementById('login-username').value.trim();
    const passInp = document.getElementById('login-password').value;

    if (!userInp || !passInp) {
        showToast("Заполните все поля");
        return;
    }

    const users = await getUsersDB();
    const found = users.find(u => u && u.username.toLowerCase() === userInp.toLowerCase() && u.password === passInp);

    if (found) {
        localStorage.setItem('currentUser', JSON.stringify(found));
        checkUserSession();
        document.getElementById('auth-modal').classList.add('hidden');
        showToast(`Успешный вход! Рады видеть, ${found.name}`);
    } else {
        showToast("Неверный логин или пароль");
    }
}

async function handleRegisterSubmit() {
    const userInp = document.getElementById('reg-username').value.trim();
    const passInp = document.getElementById('reg-password').value;
    const nameInp = document.getElementById('reg-name').value.trim();

    if (!userInp || !passInp || !nameInp) {
        showToast("Заполните все поля");
        return;
    }

    const users = await getUsersDB();
    if (users.some(u => u && u.username.toLowerCase() === userInp.toLowerCase())) {
        showToast("Этот логин уже занят");
        return;
    }

    const newUser = {
        username: userInp,
        password: passInp,
        name: nameInp,
        savedDates: {}
    };

    users.push(newUser);
    await saveUsersDB(users);
    
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    checkUserSession();
    document.getElementById('auth-modal').classList.add('hidden');
    showToast("Успешная регистрация!");
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    checkUserSession();
    document.getElementById('auth-modal').classList.add('hidden');
    showToast("Вы вышли из системы");
}

// ОТРИСОВКА СПИСКОВ И ГАЛЕРЕЙ
function renderWalkList() {
    const container = document.getElementById('walk-container');
    container.innerHTML = walkData.map(item => `
        <div class="list-item">
            <button class="name-btn">${item.name}<br><span style="font-size:13px; font-weight:500; color:#7D9C87;">${item.desc}</span></button>
            <button class="choose-btn" onclick="selectDirectItem('Прогулка: ${item.name}')">Выбрать</button>
        </div>
    `).join('');
}

function renderMallsList() {
    const container = document.getElementById('malls-container');
    container.innerHTML = mallsData.map(item => `
        <div class="list-item">
            <div class="mall-name-btn">
                <span class="mall-title">${item.name}</span>
                <span class="mall-address">${item.address}</span>
            </div>
            <button class="choose-btn" onclick="selectDirectItem('ТЦ: ${item.name}')">Выбрать</button>
        </div>
    `).join('');
}

function renderTripsList() {
    const container = document.getElementById('trips-container');
    container.innerHTML = tripsData.map(item => `
        <button class="trip-main-btn" onclick="openTripDetails('${item.name}')">${item.name}</button>
    `).join('');
}

function openFoodCategory(category) {
    document.getElementById('food-category-title').innerText = `${category} кухня`;
    const container = document.getElementById('food-list-container');
    const items = foodData[category] || [];
    
    container.innerHTML = items.map(item => `
        <div class="list-item">
            <button class="name-btn">${item.name}</button>
            <button class="choose-btn" onclick="selectDirectItem('Ресторан (${category}): ${item.name}')">Выбрать</button>
        </div>
    `).join('');
    navigate('screen-food-list');
}

function openFlowersSection() {
    const container = document.getElementById('flowers-gallery');
    container.innerHTML = flowersData.map((item, index) => `
        <div class="flower-card" onclick="openFlowerDetails(${index})">
            <img src="${item.img}" class="flower-img" alt="${item.name}">
            <div class="flower-overlay">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
            </div>
        </div>
    `).join('');
    navigate('screen-flowers');
}

// Окна деталей объектов
function selectDirectItem(text) {
    currentSelectionText = text;
    navigate('screen-finish');
}

let activeFlower = null;
function openFlowerDetails(index) {
    const flower = flowersData[index];
    activeFlower = flower;
    document.getElementById('flower-modal-img').src = flower.img;
    document.getElementById('flower-modal-title').innerText = flower.name;
    document.getElementById('flower-modal-desc').innerText = flower.desc;

    const colorsSection = document.getElementById('flower-colors-section');
    const palette = document.getElementById('flower-color-palette');
    
    palette.innerHTML = '';
    currentSelectedColor = null;

    if (flower.colors && flower.colors.length > 0) {
        colorsSection.classList.remove('hidden');
        flower.colors.forEach((color, i) => {
            const box = document.createElement('div');
            box.className = 'color-box';
            box.style.backgroundColor = color;
            box.onclick = () => {
                document.querySelectorAll('.color-box').forEach(b => b.classList.remove('selected'));
                box.classList.add('selected');
                currentSelectedColor = color;
            };
            if (i === 0) {
                box.classList.add('selected');
                currentSelectedColor = color;
            }
            palette.appendChild(box);
        });
    } else {
        colorsSection.classList.add('hidden');
    }

    document.getElementById('flower-modal').classList.remove('hidden');
}

function closeFlowerModal(e) {
    document.getElementById('flower-modal').classList.add('hidden');
}

function chooseFlowerAndGoToDate() {
    if (!activeFlower) return;
    let text = `Подарок: ${activeFlower.name}`;
    if (currentSelectedColor) {
        text += ` (Оттенок: ${currentSelectedColor})`;
    }
    currentSelectionText = text;
    document.getElementById('flower-modal').classList.add('hidden');
    navigate('screen-finish');
}

let activeTrip = null;
function openTripDetails(name) {
    const trip = tripsData.find(t => t.name === name);
    if (!trip) return;
    activeTrip = trip;
    document.getElementById('trip-modal-img').src = trip.img;
    document.getElementById('trip-title').innerText = trip.name;
    document.getElementById('trip-desc').innerText = trip.desc;
    document.getElementById('trip-info-modal').classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// ОБЫЧНЫЙ КАЛЕНДАРЬ (ОДИН ДЕНЬ)
function openCalendar(mode) {
    calendarMode = mode;
    selectedDateStr = null;
    document.getElementById('calendar-modal').classList.remove('hidden');

    if (mode === 'edit') {
        document.getElementById('calendar-edit-mode').classList.remove('hidden');
        document.getElementById('calendar-view-mode').classList.add('hidden');
    } else {
        document.getElementById('calendar-edit-mode').classList.add('hidden');
        document.getElementById('calendar-view-mode').classList.remove('hidden');
        document.getElementById('event-details-text').innerText = "Выберите день для просмотра планов.";
    }
    renderCalendar();
}

function closeCalendarOverlay(e) {
    if (e.target.id === 'calendar-modal') {
        document.getElementById('calendar-modal').classList.add('hidden');
    }
}

function changeMonth(dir) {
    currentMonth += dir;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (!document.getElementById('calendar-modal').classList.contains('hidden')) {
        renderCalendar();
    } else if (!document.getElementById('multi-calendar-modal').classList.contains('hidden')) {
        renderMultiCalendarGrid();
    }
}

async function renderCalendar() {
    const monthYearLabel = document.getElementById('calendar-month-year');
    const daysContainer = document.getElementById('calendar-days');
    daysContainer.innerHTML = '';

    const months = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
    monthYearLabel.innerText = `${months[currentMonth]} ${currentYear}`;

    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const shift = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < shift; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty';
        daysContainer.appendChild(emptyDiv);
    }

    const user = getCurrentUser();
    let userDates = (user && user.savedDates) ? user.savedDates : {};

    if (user) {
        const users = await getUsersDB();
        const freshUser = users.find(u => u && u.username.toLowerCase() === user.username.toLowerCase());
        if (freshUser && freshUser.savedDates) userDates = freshUser.savedDates;
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.innerText = day;
        
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (userDates[dateStr] && userDates[dateStr].length > 0) {
            dayDiv.classList.add('saved-date');
        }

        if (selectedDateStr === dateStr) {
            dayDiv.classList.add('selected-date');
        }

        dayDiv.onclick = () => {
            selectedDateStr = dateStr;
            document.querySelectorAll('#calendar-days div').forEach(d => d.classList.remove('selected-date'));
            dayDiv.classList.add('selected-date');

            if (calendarMode === 'view') {
                const plans = userDates[dateStr];
                const viewText = document.getElementById('event-details-text');
                if (plans && plans.length > 0) {
                    viewText.innerHTML = `<strong>Планы на ${day}.${currentMonth+1}:</strong>` + plans.map(p => `<p style="font-size:14px; margin:4px 0;">• ${p}</p>`).join('');
                } else {
                    viewText.innerText = "На этот день планов нет.";
                }
            }
        };

        daysContainer.appendChild(dayDiv);
    }
}

// КОЛЕСИКИ ВРЕМЕНИ
function initTimeWheels() {
    const hoursWheel = document.getElementById('wheel-hours');
    const minutesWheel = document.getElementById('wheel-minutes');

    hoursWheel.innerHTML = Array.from({ length: 24 }, (_, i) => `<div data-val="${i}">${String(i).padStart(2, '0')}</div>`).join('');
    minutesWheel.innerHTML = Array.from({ length: 60 }, (_, i) => `<div data-val="${i}">${String(i).padStart(2, '0')}</div>`).join('');

    [hoursWheel, minutesWheel].forEach(wheel => {
        wheel.addEventListener('scroll', () => {
            const index = Math.round(wheel.scrollTop / 30);
            const items = wheel.querySelectorAll('div');
            items.forEach((item, idx) => {
                if (idx === index) item.classList.add('active-time');
                else item.classList.remove('active-time');
            });
        });
        setTimeout(() => {
            const item = wheel.querySelector('div');
            if (item) item.classList.add('active-time');
        }, 100);
    });
}

function getSelectedTime() {
    const activeHour = document.querySelector('#wheel-hours .active-time');
    const activeMinute = document.querySelector('#wheel-minutes .active-time');
    const h = activeHour ? activeHour.getAttribute('data-val').padStart(2, '0') : "00";
    const m = activeMinute ? activeMinute.getAttribute('data-val').padStart(2, '0') : "00";
    return `${h}:${m}`;
}

function resetDateSelection() {
    selectedDateStr = null;
    renderCalendar();
}

async function saveDateSelection() {
    const user = getCurrentUser();
    if (!user) {
        showToast("Для сохранения авторизуйтесь в системе.");
        openAuthModal();
        return;
    }

    if (!selectedDateStr) {
        showToast("Пожалуйста, выберите дату на календаре");
        return;
    }

    const time = getSelectedTime();
    const fullEventDescription = `${time} - ${currentSelectionText || "Пользовательское событие"}`;

    const users = await getUsersDB();
    const dbUserIdx = users.findIndex(u => u && u.username.toLowerCase() === user.username.toLowerCase());

    if (dbUserIdx !== -1) {
        if (!users[dbUserIdx].savedDates) users[dbUserIdx].savedDates = {};
        if (!users[dbUserIdx].savedDates[selectedDateStr]) users[dbUserIdx].savedDates[selectedDateStr] = [];
        
        users[dbUserIdx].savedDates[selectedDateStr].push(fullEventDescription);
        
        await saveUsersDB(users);
        localStorage.setItem('currentUser', JSON.stringify(users[dbUserIdx]));
        
        showToast("Событие успешно запланировано!");
        document.getElementById('calendar-modal').classList.add('hidden');
        navigate('screen-main');
    } else {
        showToast("Ошибка сохранения сессии.");
    }
}

// МНОГОДНЕВНЫЙ КАЛЕНДАРЬ ДЛЯ ПОЕЗДОК
function openMultiCalendar() {
    document.getElementById('trip-info-modal').classList.add('hidden');
    multiSelectStart = null;
    multiSelectEnd = null;
    document.getElementById('multi-calendar-modal').classList.remove('hidden');
    renderMultiCalendarGrid();
}

function renderMultiCalendarGrid() {
    const grid = document.getElementById('multi-calendar-grid');
    grid.innerHTML = '';

    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const shift = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < shift; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty';
        grid.appendChild(emptyDiv);
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-cell';
        dayDiv.innerText = day;

        const currentTimestamp = new Date(currentYear, currentMonth, day).getTime();

        if (multiSelectStart && currentTimestamp === multiSelectStart) dayDiv.classList.add('selected-date');
        if (multiSelectEnd && currentTimestamp === multiSelectEnd) dayDiv.classList.add('selected-date');
        if (multiSelectStart && multiSelectEnd && currentTimestamp > multiSelectStart && currentTimestamp < multiSelectEnd) {
            dayDiv.classList.add('in-range');
        }

        dayDiv.onclick = () => {
            if (!multiSelectStart || (multiSelectStart && multiSelectEnd)) {
                multiSelectStart = currentTimestamp;
                multiSelectEnd = null;
            } else if (currentTimestamp >= multiSelectStart) {
                const diffTime = Math.abs(currentTimestamp - multiSelectStart);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 7) {
                    showToast("Максимальная длительность поездки — 7 дней");
                    return;
                }
                multiSelectEnd = currentTimestamp;
            } else {
                multiSelectStart = currentTimestamp;
            }
            renderMultiCalendarGrid();
        };

        grid.appendChild(dayDiv);
    }
}

async function confirmMultiDateSelection() {
    const user = getCurrentUser();
    if (!user) {
        showToast("Авторизуйтесь для бронирования");
        openAuthModal();
        return;
    }

    if (!multiSelectStart || !multiSelectEnd) {
        showToast("Выберите диапазон дат (начало и конец)");
        return;
    }

    const users = await getUsersDB();
    const dbUserIdx = users.findIndex(u => u && u.username.toLowerCase() === user.username.toLowerCase());

    if (dbUserIdx !== -1) {
        if (!users[dbUserIdx].savedDates) users[dbUserIdx].savedDates = {};

        let start = new Date(multiSelectStart);
        const end = new Date(multiSelectEnd);

        while (start <= end) {
            const y = start.getFullYear();
            const m = String(start.getMonth() + 1).padStart(2, '0');
            const d = String(start.getDate()).padStart(2, '0');
            const keyStr = `${y}-${m}-${d}`;

            if (!users[dbUserIdx].savedDates[keyStr]) users[dbUserIdx].savedDates[keyStr] = [];
            users[dbUserIdx].savedDates[keyStr].push(`Весь день - Многодневный выезд: ${activeTrip ? activeTrip.name : "Поездка"}`);

            start.setDate(start.getDate() + 1);
        }

        await saveUsersDB(users);
        localStorage.setItem('currentUser', JSON.stringify(users[dbUserIdx]));

        showToast("Поездка успешно забронирована!");
        document.getElementById('multi-calendar-modal').classList.add('hidden');
        navigate('screen-main');
    }
}

// ПАНЕЛЬ АДМИНИСТРАТОРА (РЕАЛЬНОЕ ВРЕМЯ / СИНХРОНИЗАЦИЯ)
function setupAdminRealtimeSync() {
    const dbRef = ref(db, 'users');
    // Метод onValue постоянно отслеживает изменения в Firebase и сразу обновляет UI
    onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val() || [];
            // Обновляем UI только если окно панели администратора открыто
            const modal = document.getElementById('admin-modal');
            if (modal && !modal.classList.contains('hidden')) {
                updateAdminPanelUI(users);
            }
        }
    });
}

async function openAdminPanel() {
    document.getElementById('auth-modal').classList.add('hidden');
    const users = await getUsersDB();
    updateAdminPanelUI(users);
    document.getElementById('admin-search-input').value = "";
    document.getElementById('admin-modal').classList.remove('hidden');
}

function updateAdminPanelUI(usersList) {
    let totalUsers = usersList.filter(Boolean).length;
    let totalEvents = 0;

    usersList.forEach(u => {
        if (u && u.savedDates) {
            Object.keys(u.savedDates).forEach(date => {
                if (Array.isArray(u.savedDates[date])) {
                    totalEvents += u.savedDates[date].length;
                }
            });
        }
    });

    document.getElementById('stat-total-users').innerText = totalUsers;
    document.getElementById('stat-total-events').innerText = totalEvents;

    renderAdminUsersList(usersList);
}

function renderAdminUsersList(usersList) {
    const container = document.getElementById('admin-data-container');
    container.innerHTML = '';

    const validUsers = usersList.filter(Boolean);

    if (validUsers.length === 0) {
        container.innerHTML = '<div class="no-events-text" style="text-align:center; padding:20px;">Пользователи отсутствуют</div>';
        return;
    }

    validUsers.forEach(user => {
        const card = document.createElement('div');
        card.className = 'admin-user-card';
        card.setAttribute('data-username', user.username || '');
        card.setAttribute('data-name', user.name || '');

        let datesHtml = '';
        if (user.savedDates && Object.keys(user.savedDates).length > 0) {
            Object.keys(user.savedDates).forEach(date => {
                const events = user.savedDates[date];
                if (events && events.length > 0) {
                    datesHtml += `
                        <div class="admin-date-group">
                            <div class="admin-date-title">${date}</div>
                            ${events.map(ev => `<div class="admin-event-bullet">• ${ev}</div>`).join('')}
                        </div>
                    `;
                }
            });
        }

        if (!datesHtml) {
            datesHtml = '<div class="no-events-text">Нет запланированных событий</div>';
        }

        card.innerHTML = `
            <div class="admin-user-info">
                ${user.name} <span>(@${user.username})</span>
            </div>
            <button class="btn-delete-user" onclick="deleteUser('${user.username}')">Удалить</button>
            ${datesHtml}
        `;
        container.appendChild(card);
    });
}

function filterAdminUsers() {
    const query = document.getElementById('admin-search-input').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.admin-user-card');

    cards.forEach(card => {
        const u = card.getAttribute('data-username').toLowerCase();
        const n = card.getAttribute('data-name').toLowerCase();
        if (u.includes(query) || n.includes(query)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

async function deleteUser(username) {
    if (!confirm(`Вы действительно хотите удалить пользователя @${username} и все его записи?`)) return;

    let users = await getUsersDB();
    users = users.filter(u => u && u.username.toLowerCase() !== username.toLowerCase());
    
    await saveUsersDB(users);

    const session = getCurrentUser();
    if (session && session.username.toLowerCase() === username.toLowerCase()) {
        localStorage.removeItem('currentUser');
        checkUserSession();
    }
    
    showToast("Пользователь удален");
    // Списку администратора обновится автоматически благодаря подписке onValue
}

// ЭКСПОРТ ВСЕХ ФУНКЦИЙ В WINDOW ДЛЯ ОДНОРОДНОЙ РАБОТЫ ONCLICK В HTML
window.navigate = navigate;
window.goBack = goBack;
window.openAuthModal = openAuthModal;
window.closeAuthOverlay = closeAuthOverlay;
window.switchAuthView = switchAuthView;
window.handleLoginSubmit = handleLoginSubmit;
window.handleRegisterSubmit = handleRegisterSubmit;
window.handleLogout = handleLogout;
window.openFoodCategory = openFoodCategory;
window.openFlowersSection = openFlowersSection;
window.selectDirectItem = selectDirectItem;
window.openFlowerDetails = openFlowerDetails;
window.closeFlowerModal = closeFlowerModal;
window.chooseFlowerAndGoToDate = chooseFlowerAndGoToDate;
window.openTripDetails = openTripDetails;
window.closeModal = closeModal;
window.openCalendar = openCalendar;
window.closeCalendarOverlay = closeCalendarOverlay;
window.changeMonth = changeMonth;
window.resetDateSelection = resetDateSelection;
window.saveDateSelection = saveDateSelection;
window.openMultiCalendar = openMultiCalendar;
window.confirmMultiDateSelection = confirmMultiDateSelection;
window.openAdminPanel = openAdminPanel;
window.filterAdminUsers = filterAdminUsers;
window.deleteUser = deleteUser;