<<<<<<< HEAD
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

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

// ДАННЫЕ ПРИЛОЖЕНИЯ
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

const tripsData = {
    "Тула": "Тула — это один из старейших и красивейших городов России, славящийся своими уникальными ремесленными традициями. Здесь вы сможете посетить величественный Тульский кремль...",
    "Гжель": "Гжель — это удивительный и живописный подмосковный край, ставший всемирно известной колыбелью традиционной русской керамики..."
};

const foodCategories = {
    "Японская": ['Ramen', 'Якитория', 'СушиМастер', 'Чифанька'],
    "Кавказская": ['Про Кавказ', 'Джон Джоли', 'Старик Хинкалыч', 'The Хинкал'],
    "Американская": ['Вкусно и точка', 'Rostics'],
    "Рыбная": ['FishPoint', 'Моремания'],
    "Итальянская": ['Papa Johns', 'Додо', 'Pasta Qween'],
    "Русская": ['The Bык', 'NicePriceCoffee', 'Теремок']
};

// Исправлено: пути теперь ведут строго в твою локальную папку "images"
const flowersData = [
    { 
        id: 1, 
        name: "Кустовая роза", 
        shortDesc: "Изящные гроздья бутонов", 
        longDesc: "Пышные кустовые розы с множеством небольших аккуратных бутонов на одной веточке, создающие объемный и нежный вид.", 
        image: "images/flower_1.jpg", 
        colors: [{hex: "#F8BBD0", name: "Розовый"}, {hex: "#D32F2F", name: "Красный"}, {hex: "#FAFAFA", name: "Белый"}] 
    },
    { 
        id: 2, 
        name: "Гвоздика", 
        shortDesc: "Классическая стойкость и стиль", 
        longDesc: "Стойкие и изящные цветы с гофрированными лепестками. Современные сорта диантусов выглядят невероятно стильно.", 
        image: "images/flower_2.jpg", 
        colors: [{hex: "#C62828", name: "Красный"}, {hex: "#FF8A80", name: "Розовый"}, {hex: "#FAFAFA", name: "Белый"}] 
    },
    { 
        id: 3, 
        name: "Пион", 
        shortDesc: "Нежность и королевская пышность", 
        longDesc: "Роскошные объемные пионы с неповторимым сладким ароматом и огромным количеством нежных тонких лепестков.", 
        image: "images/flower_3.jpg", 
        colors: [{hex: "#F48FB1", name: "Розовый"}, {hex: "#FFFFFF", name: "Белый"}, {hex: "#880E4F", name: "Бордовый"}] 
    },
    { 
        id: 4, 
        name: "Тюльпан", 
        shortDesc: "Весеннее вдохновение", 
        longDesc: "Яркие и свежие тюльпаны — главный символ наступающего тепла, обновления природы и весенних праздников.", 
        image: "images/flower_4.jpg", 
        colors: [{hex: "#FFEB3B", name: "Желтый"}, {hex: "#E53935", name: "Красный"}, {hex: "#F06292", name: "Розовый"}] 
    },
    { 
        id: 5, 
        name: "Лилия", 
        shortDesc: "Грация и утонченный силуэт", 
        longDesc: "Величественные лилии с крупными раскрывающимися бутонами и сильным, благородным шлейфовым ароматом.", 
        image: "images/flower_5.jpg", 
        colors: [{hex: "#FFFFFF", name: "Белый"}, {hex: "#FFF176", name: "Желтый"}, {hex: "#F48FB1", name: "Розовый"}] 
    },
    { 
        id: 6, 
        name: "Мимоза", 
        shortDesc: "Солнечные пушистые соцветия", 
        longDesc: "Ярко-желтые бархатистые шарики мимозы, дарящие искреннюю радость, весеннее настроение и тонкий свежий аромат.", 
        image: "images/flower_6.jpg", 
        colors: [{hex: "#FFEB3B", name: "Желтый"}, {hex: "#FFF59D", name: "Лимонный"}] 
    },
    { 
        id: 7, 
        name: "Ромашка", 
        shortDesc: "Полевая свежесть и простота", 
        longDesc: "Милые, простые и искренние крупные ромашки, напоминающие о теплом солнечном лете и загородных прогулках.", 
        image: "images/flower_7.jpg", 
        colors: [{hex: "#FFFFFF", name: "Белый"}, {hex: "#FFFDD0", name: "Кремовый"}] 
    },
    { 
        id: 8, 
        name: "Альстромерия", 
        shortDesc: "Яркие экзотические штрихи", 
        longDesc: "Перуанские лилии с необычными пестрыми узорами на лепестках. Отличаются феноменальной стойкостью в вазе.", 
        image: "images/flower_8.jpg", 
        colors: [{hex: "#F06292", name: "Розовый"}, {hex: "#BA68C8", name: "Сиреневый"}, {hex: "#FFFFFF", name: "Белый"}] 
    },
    { 
        id: 9, 
        name: "Сирень", 
        shortDesc: "Ароматное майское чудо", 
        longDesc: "Пышные и душистые грозди сирени, наполняющие всё пространство вокруг незабываемым сладким благоуханием.", 
        image: "images/flower_9.jpg", 
        colors: [{hex: "#CE93D8", name: "Сиреневый"}, {hex: "#8E24AA", name: "Фиолетовый"}, {hex: "#FFFFFF", name: "Белый"}] 
    },
    { 
        id: 10, 
        name: "Протея", 
        shortDesc: "Экзотический королевский акцент", 
        longDesc: "Необычный африканский цветок с жесткими лепестками и уникальной текстурой, способный удивить любого ценителя.", 
        image: "images/flower_10.jpg", 
        colors: [{hex: "#EC407A", name: "Розовый"}, {hex: "#FFAB91", name: "Персиковый"}] 
    },
    { 
        id: 11, 
        name: "Подсолнух", 
        shortDesc: "Маленькое солнце в букете", 
        longDesc: "Яркие декоративные подсолнухи, которые мгновенно вызывают улыбку, заряжают позитивом и согревают интерьер.", 
        image: "images/flower_11.jpg", 
        colors: [{hex: "#FFC107", name: "Желтый"}, {hex: "#FF9800", name: "Оранжевый"}] 
    },
    { 
        id: 12, 
        name: "Гортензия", 
        shortDesc: "Воздушное зефирное облако", 
        longDesc: "Огромные, невесомые соцветия кудрявой гортензии, напоминающие пышные цветные облака.", 
        image: "images/flower_12.jpg", 
        colors: [{hex: "#03A9F4", name: "Голубой"}, {hex: "#F48FB1", name: "Розовый"}, {hex: "#FFFFFF", name: "Белый"}] 
    },
    { 
        id: 13, 
        name: "Георгин", 
        shortDesc: "Геометрическое совершенство", 
        longDesc: "Пышные георгины с идеальной многослойной структурой лепестков и глубокими, насыщенными градиентами.", 
        image: "images/flower_13.jpg", 
        colors: [{hex: "#AD1457", name: "Бордовый"}, {hex: "#F48FB1", name: "Розовый"}, {hex: "#FAFAFA", name: "Белый"}] 
    },
    { 
        id: 14, 
        name: "Одноголовая роза", 
        shortDesc: "Классическая элегантность", 
        longDesc: "Крупная благородная роза на высоком стебле с идеальным бокалом — безупречный и проверенный временем символ чувств.", 
        image: "images/flower_14.jpg", 
        colors: [{hex: "#D32F2F", name: "Красный"}, {hex: "#FFFFFF", name: "Белый"}, {hex: "#F8BBD0", name: "Нежно-розовый"}] 
    },
    { 
        id: 15, 
        name: "Хризантема", 
        shortDesc: "Пышное осеннее изобилие", 
        longDesc: "Многолепестковые стойкие хризантемы, которые прекрасно держат форму и долго радуют своей первозданной свежестью.", 
        image: "images/flower_15.jpg", 
        colors: [{hex: "#FFFFFF", name: "Белый"}, {hex: "#FFEB3B", name: "Желтый"}, {hex: "#F48FB1", name: "Розовый"}] 
    },
    { 
        id: 16, 
        name: "Ранункулюс", 
        shortDesc: "Французская сказка лепестков", 
        longDesc: "Азиатские лютики, напоминающие закрытый бутон розы и пион одновременно. Символ утонченности и нежности.", 
        image: "images/flower_16.jpg", 
        colors: [{hex: "#FFCDD2", name: "Нежно-розовый"}, {hex: "#FFFFFF", name: "Белый"}, {hex: "#FFE0B2", name: "Персиковый"}] 
    },
    { 
        id: 17, 
        name: "Пионовидная роза", 
        shortDesc: "Премиальная роскошь и пиала", 
        longDesc: "Особый сорт роз с пионовидным раскрытием бутона. Сочетает в себе стойкость розы и изысканную эстетику пиона.", 
        image: "images/flower_17.jpg", 
        colors: [{hex: "#F48FB1", name: "Розовый"}, {hex: "#FFCC80", name: "Персиковый"}, {hex: "#C2185B", name: "Малиновый"}] 
    },
    { 
        id: 18, 
        name: "Экзотика", 
        shortDesc: "Необычные тропические растения", 
        longDesc: "Авторская подборка редких, фактурных сухоцветов и зелени для любителей нестандартных флористических решений.", 
        image: "images/flower_18.jpg", 
        colors: [] 
    }
];

// СОСТОЯНИЕ ПРИЛОЖЕНИЯ
let historyStack = [];
let toastTimer = null; 
let selectedContextItem = ""; 
let selectedFlowerColor = null; 
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDay = null; 
let currentCalendarMode = 'view'; 
let rangeStart = null; 
let rangeEnd = null;

// =========================================================================
// 1. ЭКСПОРТ В WINDOW ДЛЯ ONCLICK В HTML
// =========================================================================
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
window.openFlowerModal = openFlowerModal;
window.closeFlowerModal = closeFlowerModal;
window.selectFlowerColor = selectFlowerColor;
window.chooseFlowerAndGoToDate = chooseFlowerAndGoToDate;
window.openTripModal = openTripModal;
window.closeModal = closeModal;
window.openStandardCalendar = openStandardCalendar;
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

// =========================================================================
// 2. ИНИЦИАЛИЗАЦИЯ
// =========================================================================
try {
    checkUserSession();
    renderAllSections();
    setupAdminRealtimeSync();
} catch (error) {
    console.error("Ошибка при инициализации интерфейса:", error);
}

// =========================================================================
// 3. РЕАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ
// =========================================================================

// НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ
function navigate(targetScreenId) {
    const currentScreen = document.querySelector('.screen:not(.hidden)');
    if (currentScreen) { 
        historyStack.push(currentScreen.id); 
        currentScreen.classList.add('hidden'); 
    }
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
    if (currentScreenId === 'screen-main' || currentScreenId === 'screen-finish') {
        btnBack.classList.add('hidden');
    } else {
        btnBack.classList.remove('hidden');
    }
}

function showToast(message) {
    const toast = document.getElementById('toast-notification');
    toast.innerText = message; 
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 4000);
}

// УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ
function closeModal(modalId) { document.getElementById(modalId).classList.add('hidden'); }
function closeFlowerModal(event) { if (event.target.id === 'flower-modal') closeModal('flower-modal'); }

// ОТРИСОВКА ДИНАМИЧЕСКИХ СПИСКОВ
function renderAllSections() {
    document.getElementById('walk-container').innerHTML = walkPlaces.map(place => `<div class="list-item"><button class="name-btn">${place}</button><button class="choose-btn" onclick="openStandardCalendar('Прогулка: ${place}')">Выбрать</button></div>`).join('');
    document.getElementById('malls-container').innerHTML = mallsList.map(mall => `<div class="list-item"><button class="mall-name-btn"><span class="mall-title">${mall.name}</span><span class="mall-address">${mall.address}</span></button><button class="choose-btn" onclick="openStandardCalendar('ТЦ: ${mall.name}')">Выбрать</button></div>`).join('');
    document.getElementById('trips-container').innerHTML = Object.keys(tripsData).map(city => `<button class="trip-main-btn" onclick="openTripModal('${city}')">${city}</button>`).join('');
}

function openFoodCategory(category) {
    document.getElementById('food-category-title').innerText = category;
    document.getElementById('food-list-container').innerHTML = foodCategories[category].map(restaurant => `<div class="list-item"><button class="name-btn">${restaurant}</button><button class="choose-btn" onclick="openStandardCalendar('Ресторан: ${restaurant}')">Выбрать</button></div>`).join('');
    navigate('screen-food-list');
}

function openTripModal(city) {
    selectedContextItem = city;
    document.getElementById('trip-title').innerText = city;
    document.getElementById('trip-desc').innerText = tripsData[city];
    document.getElementById('trip-modal-img').src = `images/${city === 'Тула' ? 19 : 20}.jpg`; 
    document.getElementById('trip-info-modal').classList.remove('hidden');
}

// РАБОТА С ГАЛЕРЕЕЙ ЦВЕТОВ
function openFlowersSection() {
    navigate('screen-flowers');
    document.getElementById('flowers-gallery').innerHTML = flowersData.map(flower => `
        <div class="flower-card" style="background-image: url('${flower.image}')" onclick="openFlowerModal(${flower.id})">
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
    
    document.getElementById('flower-modal-img').style.backgroundImage = `url('${flower.image}')`;
    
    document.getElementById('flower-modal-title').innerText = flower.name;
    document.getElementById('flower-modal-desc').innerText = flower.longDesc;
    
    const palette = document.getElementById('flower-color-palette');
    const colorsSection = document.getElementById('flower-colors-section');
    
    if (flower.colors && flower.colors.length > 0) {
        palette.innerHTML = flower.colors.map(c => 
            `<div class="color-box" style="background-color: ${c.hex};" title="${c.name}" onclick="selectFlowerColor('${c.name}', this, event)"></div>`
        ).join('');
        colorsSection.classList.remove('hidden');
    } else {
        colorsSection.classList.add('hidden');
    }

    document.getElementById('flower-modal').classList.remove('hidden');
}

function selectFlowerColor(colorName, element, event) {
    event.stopPropagation();
    selectedFlowerColor = colorName;
    document.querySelectorAll('.color-box').forEach(b => b.classList.remove('selected'));
    element.classList.add('selected');
}

function chooseFlowerAndGoToDate() {
    if (selectedFlowerColor) selectedContextItem += ` (${selectedFlowerColor})`;
    closeModal('flower-modal');
    openCalendar('edit'); 
}

// РАБОТА С FIREBASE REALTIME DATABASE
async function getUsersDB() {
    try {
        const snapshot = await get(ref(db, 'users'));
        return snapshot.exists() ? snapshot.val() : [];
    } catch (e) { console.error(e); return []; }
}

async function saveUsersDB(usersArray) {
    try { await set(ref(db, 'users'), usersArray); } 
    catch (e) { console.error(e); }
}

function getCurrentUser() {
    const u = localStorage.getItem('currentUser');
    return u ? JSON.parse(u) : null;
}

// СЕССИИ И АВТОРИЗАЦИЯ
function checkUserSession() {
    const user = getCurrentUser();
    const label = document.getElementById('profile-label');
    const adminLink = document.getElementById('btn-admin-panel-link');
    if (user) {
        label.innerText = user.name;
        label.classList.remove('hidden');
        if (user.username === 'admin' && adminLink) adminLink.classList.remove('hidden');
    } else {
        label.classList.add('hidden');
        if (adminLink) adminLink.classList.add('hidden');
    }
}

function openAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
    if (getCurrentUser()) switchAuthView('profile'); else switchAuthView('login');
}

function closeAuthOverlay(event) { if (event.target.id === 'auth-modal') closeModal('auth-modal'); }

function switchAuthView(viewName) {
    document.getElementById('auth-view-login').classList.add('hidden');
    document.getElementById('auth-view-register').classList.add('hidden');
    document.getElementById('auth-view-profile').classList.add('hidden');
    
    if (viewName === 'login') document.getElementById('auth-view-login').classList.remove('hidden');
    if (viewName === 'register') document.getElementById('auth-view-register').classList.remove('hidden');
    if (viewName === 'profile') {
        const user = getCurrentUser();
        document.getElementById('profile-greeting').innerText = `Привет, ${user ? user.name : ''}!`;
        document.getElementById('auth-view-profile').classList.remove('hidden');
    }
}

async function handleLoginSubmit() {
    const userInp = document.getElementById('login-username').value.trim();
    const passInp = document.getElementById('login-password').value;
    const users = await getUsersDB();
    const foundUser = users.find(u => u && u.username.toLowerCase() === userInp.toLowerCase() && u.password === passInp);
    
    if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify(foundUser)); checkUserSession();
        showToast(`Добро пожаловать, ${foundUser.name}!`); closeModal('auth-modal');
    } else { showToast("Неверный логин или пароль"); }
}

async function handleRegisterSubmit() {
    const userInp = document.getElementById('reg-username').value.trim();
    const passInp = document.getElementById('reg-password').value;
    const nameInp = document.getElementById('reg-name').value.trim();
    if (!userInp || !passInp || !nameInp) return showToast("Заполните все поля!");
    
    const users = await getUsersDB();
    if (users.some(u => u && u.username.toLowerCase() === userInp.toLowerCase())) return showToast("Логин уже занят.");
    
    const newUser = { username: userInp, password: passInp, name: nameInp, savedDates: {} };
    users.push(newUser); await saveUsersDB(users);
    
    localStorage.setItem('currentUser', JSON.stringify(newUser)); checkUserSession();
    showToast("Регистрация успешна!"); closeModal('auth-modal');
}

function handleLogout() { 
    localStorage.removeItem('currentUser'); 
    checkUserSession(); 
    showToast("Вы вышли из системы"); 
    closeModal('auth-modal'); 
}

// СТАНДАРТНЫЙ ОДНОДНЕВНЫЙ КАЛЕНДАРЬ
function openStandardCalendar(itemName) { selectedContextItem = itemName; openCalendar('edit'); }

async function openCalendar(mode = 'view') {
    currentCalendarMode = mode; 
    selectedDay = null;
    document.getElementById('calendar-modal').classList.remove('hidden');
    
    if (mode === 'edit') {
        document.getElementById('calendar-edit-mode').classList.remove('hidden'); 
        document.getElementById('calendar-view-mode').classList.add('hidden');
        
        const inputH = document.getElementById('input-hours');
        const inputM = document.getElementById('input-minutes');
        if (inputH) inputH.value = "12";
        if (inputM) inputM.value = "00";
    } else {
        document.getElementById('calendar-edit-mode').classList.add('hidden'); 
        document.getElementById('calendar-view-mode').classList.remove('hidden');
        document.getElementById('event-details-text').innerHTML = "Выберите день, чтобы посмотреть планы.";
    }
    
    await renderCalendar();
}

function closeCalendarOverlay(e) { if (e.target.id === 'calendar-modal') closeModal('calendar-modal'); }

async function renderCalendar() {
    const monthsRuTitle = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    document.getElementById('calendar-month-year').innerText = `${monthsRuTitle[currentMonth]} ${currentYear}`;
    const daysContainer = document.getElementById('calendar-days'); daysContainer.innerHTML = '';
    
    let startDay = new Date(currentYear, currentMonth, 1).getDay(); startDay = startDay === 0 ? 6 : startDay - 1;
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let i = 0; i < startDay; i++) daysContainer.appendChild(Object.assign(document.createElement('div'), {className: 'empty'}));

    const user = getCurrentUser();
    let userDates = user && user.savedDates ? user.savedDates : {};
    if (user) {
        const users = await getUsersDB();
        const dbUser = users.find(u => u && u.username === user.username);
        if (dbUser && dbUser.savedDates) userDates = dbUser.savedDates;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div'); dayCell.innerText = day;
        const dateKey = `${currentYear}-${currentMonth}-${day}`;
        
        if (userDates[dateKey] && userDates[dateKey].length > 0) dayCell.classList.add('saved-date');
        else if (day === selectedDay && currentCalendarMode === 'edit') dayCell.classList.add('selected-date');

        dayCell.onclick = () => {
            selectedDay = day; 
            document.querySelectorAll('#calendar-days div').forEach(d => d.classList.remove('selected-date')); 
            dayCell.classList.add('selected-date');
            if (currentCalendarMode === 'view') {
                if (userDates[dateKey] && userDates[dateKey].length > 0) {
                    document.getElementById('event-details-text').innerHTML = `<strong>${day} число</strong><br>` + userDates[dateKey].map(e => `• ${e}`).join('<br>');
                } else document.getElementById('event-details-text').innerHTML = `<strong>${day} число</strong><br>Планов нет.`;
            }
        };
        daysContainer.appendChild(dayCell);
    }
}

async function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; } else if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    
    if (!document.getElementById('calendar-modal').classList.contains('hidden')) await renderCalendar();
    else renderMultiCalendarGrid();
}

// СОХРАНЕНИЕ ДАТЫ И ВВЕДЕННОГО ВРУЧНУЮ ВРЕМЕНИ
async function saveDateSelection() {
    if (selectedDay === null) return showToast("Сначала выберите день!");
    const user = getCurrentUser(); 
    if (!user) { showToast("Войдите для сохранения"); openAuthModal(); return; }

    const inputH = document.getElementById('input-hours');
    const inputM = document.getElementById('input-minutes');
    
    let hVal = parseInt(inputH ? inputH.value : 12);
    let mVal = parseInt(inputM ? inputM.value : 0);

    if (isNaN(hVal) || hVal < 0 || hVal > 23) hVal = 12;
    if (isNaN(mVal) || mVal < 0 || mVal > 59) mVal = 0;

    const hStr = hVal < 10 ? '0' + hVal : '' + hVal;
    const mStr = mVal < 10 ? '0' + mVal : '' + mVal;
    
    const timeStr = `${hStr}:${mStr}`;
    const dateKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    const eventName = selectedContextItem ? `${selectedContextItem} в ${timeStr}` : `Событие в ${timeStr}`;

    const users = await getUsersDB();
    const dbUserIdx = users.findIndex(u => u && u.username === user.username);
    if (dbUserIdx !== -1) {
        if (!users[dbUserIdx].savedDates) users[dbUserIdx].savedDates = {};
        if (!users[dbUserIdx].savedDates[dateKey]) users[dbUserIdx].savedDates[dateKey] = [];
        users[dbUserIdx].savedDates[dateKey].push(eventName);
        
        await saveUsersDB(users);
        localStorage.setItem('currentUser', JSON.stringify(users[dbUserIdx]));
        showToast("Сохранено!"); closeModal('calendar-modal'); navigate('screen-main');
    }
}

async function resetDateSelection() {
    if (selectedDay === null) return showToast("Выберите день для очистки");
    const user = getCurrentUser(); if (!user) return;
    const dateKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    
    const users = await getUsersDB();
    const dbUserIdx = users.findIndex(u => u && u.username === user.username);
    if (dbUserIdx !== -1 && users[dbUserIdx].savedDates && users[dbUserIdx].savedDates[dateKey]) {
        delete users[dbUserIdx].savedDates[dateKey];
        await saveUsersDB(users);
        localStorage.setItem('currentUser', JSON.stringify(users[dbUserIdx]));
        showToast("Событие удалено"); renderCalendar();
    } else showToast("Событий нет");
}

// МНОГОДНЕВНЫЙ КАЛЕНДАРЬ (ДИАПАЗОН ДАТ)
function openMultiCalendar() { 
    closeModal('trip-info-modal'); 
    rangeStart = null; 
    rangeEnd = null; 
    document.getElementById('multi-calendar-modal').classList.remove('hidden'); 
    renderMultiCalendarGrid(); 
}

function renderMultiCalendarGrid() {
    const grid = document.getElementById('multi-calendar-grid'); grid.innerHTML = '';
    let startDay = new Date(currentYear, currentMonth, 1).getDay(); startDay = startDay === 0 ? 6 : startDay - 1;
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 0; i < startDay; i++) grid.appendChild(Object.assign(document.createElement('div'), {className: 'empty'}));
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div'); dayCell.className = 'day-cell'; dayCell.innerText = day;
        const ts = new Date(currentYear, currentMonth, day).getTime();
        if (rangeStart === ts || rangeEnd === ts) dayCell.classList.add('selected-date');
        if (rangeStart && rangeEnd && ts > rangeStart && ts < rangeEnd) dayCell.classList.add('in-range');
        
        dayCell.onclick = () => {
            if (!rangeStart || (rangeStart && rangeEnd)) { rangeStart = ts; rangeEnd = null; }
            else if (ts >= rangeStart) rangeEnd = ts; else rangeStart = ts;
            renderMultiCalendarGrid();
        };
        grid.appendChild(dayCell);
    }
}

async function confirmMultiDateSelection() {
    if (!rangeStart) return showToast("Выберите даты!");
    const user = getCurrentUser(); if (!user) { showToast("Войдите для сохранения"); openAuthModal(); return; }
    if (!rangeEnd) rangeEnd = rangeStart;
    
    const users = await getUsersDB();
    const dbUserIdx = users.findIndex(u => u && u.username === user.username);
    if (dbUserIdx !== -1) {
        if (!users[dbUserIdx].savedDates) users[dbUserIdx].savedDates = {};
        let s = new Date(rangeStart), e = new Date(rangeEnd);
        while(s <= e) {
            const keyStr = `${s.getFullYear()}-${s.getMonth()}-${s.getDate()}`;
            if (!users[dbUserIdx].savedDates[keyStr]) users[dbUserIdx].savedDates[keyStr] = [];
            users[dbUserIdx].savedDates[keyStr].push(`Поездка: ${selectedContextItem}`);
            s.setDate(s.getDate() + 1);
        }
        await saveUsersDB(users);
        localStorage.setItem('currentUser', JSON.stringify(users[dbUserIdx]));
        showToast("Поездка сохранена!"); closeModal('multi-calendar-modal'); navigate('screen-main');
    }
}

// ПАНЕЛЬ АДМИНИСТРАТОРА
function setupAdminRealtimeSync() {
    onValue(ref(db, 'users'), (snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val() || [];
            const modal = document.getElementById('admin-modal');
            if (modal && !modal.classList.contains('hidden')) updateAdminPanelUI(users);
        }
    });
}

async function openAdminPanel() {
    document.getElementById('auth-modal').classList.add('hidden');
    const users = await getUsersDB(); updateAdminPanelUI(users);
    document.getElementById('admin-search-input').value = ""; document.getElementById('admin-modal').classList.remove('hidden');
}

function updateAdminPanelUI(usersList) {
    let totalEvents = 0; const validUsers = usersList.filter(Boolean);
    validUsers.forEach(u => { if (u.savedDates) Object.keys(u.savedDates).forEach(d => totalEvents += Array.isArray(u.savedDates[d]) ? u.savedDates[d].length : 0); });
    document.getElementById('stat-total-users').innerText = validUsers.length; document.getElementById('stat-total-events').innerText = totalEvents;
    
    const container = document.getElementById('admin-data-container'); container.innerHTML = '';
    if (validUsers.length === 0) return container.innerHTML = '<div style="text-align:center; padding:20px; color:#fff;">Пользователи отсутствуют</div>';
    
    const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

    validUsers.forEach(user => {
        const card = document.createElement('div'); card.className = 'admin-user-card'; card.setAttribute('data-search', `${user.name} ${user.username}`.toLowerCase());
        let datesHtml = '';
        if (user.savedDates) {
            Object.keys(user.savedDates).forEach(d => {
                if (user.savedDates[d] && user.savedDates[d].length > 0) {
                    let displayDate = d;
                    const parts = d.split('-'); 
                    if (parts.length === 3) {
                        displayDate = `${parts[2]} ${monthNames[parseInt(parts[1])]}`;
                    }
                    datesHtml += `<div class="admin-date-group"><div class="admin-date-title">${displayDate}</div>${user.savedDates[d].map(ev => `<div class="admin-event-bullet">• ${ev}</div>`).join('')}</div>`;
                }
            });
        }
        if (!datesHtml) datesHtml = '<div style="color:#aaa; font-size:14px;">Нет событий</div>';
        
        card.innerHTML = `<div class="admin-user-info" style="color:#E8E0A5; font-weight:bold; margin-bottom:10px;">${user.name} <span style="color:#95B5A1;">(@${user.username})</span></div><button onclick="deleteUser('${user.username}')" style="position:absolute; top:15px; right:15px; background:#8E3B3B; color:#fff; border:none; padding:8px 12px; border-radius:8px; cursor:pointer; transition:0.2s;">Удалить</button>${datesHtml}`;
        container.appendChild(card);
    });
}

function filterAdminUsers() {
    const query = document.getElementById('admin-search-input').value.toLowerCase().trim();
    document.querySelectorAll('.admin-user-card').forEach(card => {
        if (card.getAttribute('data-search').includes(query)) card.classList.remove('hidden'); else card.classList.add('hidden');
    });
}

async function deleteUser(username) {
    if (!confirm(`Удалить пользователя @${username}?`)) return;
    let users = await getUsersDB(); users = users.filter(u => u && u.username !== username); await saveUsersDB(users);
    const session = getCurrentUser(); if (session && session.username === username) { localStorage.removeItem('currentUser'); checkUserSession(); }
}
=======
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

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

// ДАННЫЕ ПРИЛОЖЕНИЯ
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

const tripsData = {
    "Тула": "Тула — это один из старейших и красивейших городов России, славящийся своими уникальными ремесленными традициями. Здесь вы сможете посетить величественный Тульский кремль... (описание)",
    "Гжель": "Гжель — это удивительный и живописный подмосковный край, ставший всемирно известной колыбелью традиционной русской керамики... (описание)"
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
    { id: 1, name: "Кустовая роза", shortDesc: "Изящное соцветие", longDesc: "Пышные кустовые розы.", colors: [{hex: "#D32F2F", name: "Красный"}, {hex: "#FAFAFA", name: "Белый"}] },
    { id: 2, name: "Гвоздика", shortDesc: "Классическая стойкость", longDesc: "Стойкие и изящные цветы.", colors: [{hex: "#C62828", name: "Красный"}, {hex: "#FAFAFA", name: "Белый"}] }
];

// СОСТОЯНИЕ ПРИЛОЖЕНИЯ
let historyStack = [];
let toastTimer = null; 
let selectedContextItem = ""; 
let selectedMultiDays = []; 
let selectedFlowerColor = null; 
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDay = null; 
let currentCalendarMode = 'view'; 
let rangeStart = null; 
let rangeEnd = null;

// =========================================================================
// 1. ЭКСПОРТ В WINDOW (Выполняется сразу, чтобы кнопки HTML заработали)
// =========================================================================
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
window.openFlowerModal = openFlowerModal;
window.closeFlowerModal = closeFlowerModal;
window.selectFlowerColor = selectFlowerColor;
window.chooseFlowerAndGoToDate = chooseFlowerAndGoToDate;
window.openTripModal = openTripModal;
window.closeModal = closeModal;
window.openStandardCalendar = openStandardCalendar;
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

// =========================================================================
// 2. ИНИЦИАЛИЗАЦИЯ (В безопасном блоке try-catch)
// =========================================================================
try {
    checkUserSession();
    renderAllSections();
    buildInfiniteWheels();
    setupAdminRealtimeSync();
} catch (error) {
    console.error("Ошибка при инициализации интерфейса:", error);
}

// =========================================================================
// 3. РЕАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ
// =========================================================================

// НАВИГАЦИЯ
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

function showToast(message) {
    const toast = document.getElementById('toast-notification');
    toast.innerText = message; 
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 5000);
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function closeFlowerModal(event) { 
    if (event.target.id === 'flower-modal') closeModal('flower-modal'); 
}

// ОТРИСОВКА ИНТЕРФЕЙСА
function renderAllSections() {
    document.getElementById('walk-container').innerHTML = walkPlaces.map(place => `<div class="list-item"><button class="name-btn">${place}</button><button class="choose-btn" onclick="openStandardCalendar('Прогулка: ${place}')">Выбрать</button></div>`).join('');
    document.getElementById('malls-container').innerHTML = mallsList.map(mall => `<div class="list-item"><button class="mall-name-btn"><span class="mall-title">${mall.name}</span><span class="mall-address">${mall.address}</span></button><button class="choose-btn" onclick="openStandardCalendar('ТЦ: ${mall.name}')">Выбрать</button></div>`).join('');
    document.getElementById('trips-container').innerHTML = Object.keys(tripsData).map(city => `<button class="trip-main-btn" onclick="openTripModal('${city}')">${city}</button>`).join('');
}

function openFoodCategory(category) {
    document.getElementById('food-category-title').innerText = category;
    document.getElementById('food-list-container').innerHTML = foodCategories[category].map(restaurant => `<div class="list-item"><button class="name-btn">${restaurant}</button><button class="choose-btn" onclick="openStandardCalendar('Ресторан: ${restaurant}')">Выбрать</button></div>`).join('');
    navigate('screen-food-list');
}

function openTripModal(city) {
    selectedContextItem = city;
    document.getElementById('trip-title').innerText = city;
    document.getElementById('trip-desc').innerText = tripsData[city];
    document.getElementById('trip-modal-img').src = `images/${city === 'Тула' ? 19 : 20}.jpg`; 
    document.getElementById('trip-info-modal').classList.remove('hidden');
}

function openFlowersSection() {
    navigate('screen-flowers');
    document.getElementById('flowers-gallery').innerHTML = flowersData.map(flower => `<div class="flower-card" onclick="openFlowerModal(${flower.id})"><div class="flower-overlay"><h3>${flower.name}</h3><p>${flower.shortDesc}</p></div></div>`).join('');
}

function openFlowerModal(flowerId) {
    const flower = flowersData.find(f => f.id === flowerId);
    if (!flower) return;
    
    selectedFlowerColor = null; 
    selectedContextItem = flower.name;
    document.getElementById('flower-modal-title').innerText = flower.name;
    document.getElementById('flower-modal-desc').innerText = flower.longDesc;
    
    const palette = document.getElementById('flower-color-palette');
    const colorsSection = document.getElementById('flower-colors-section');
    
    if (flower.colors && flower.colors.length > 0) {
        palette.innerHTML = flower.colors.map(c => 
            `<div class="color-box" style="background-color: ${c.hex};" title="${c.name}" onclick="selectFlowerColor('${c.name}', this, event)"></div>`
        ).join('');
        colorsSection.classList.remove('hidden');
    } else {
        colorsSection.classList.add('hidden');
    }

    document.getElementById('flower-modal').classList.remove('hidden');
}

function selectFlowerColor(colorName, element, event) {
    event.stopPropagation();
    selectedFlowerColor = colorName;
    document.querySelectorAll('.color-box').forEach(b => b.classList.remove('selected'));
    element.classList.add('selected');
}

function chooseFlowerAndGoToDate() {
    if (selectedFlowerColor) selectedContextItem += ` (${selectedFlowerColor})`;
    closeModal('flower-modal');
    openCalendar('edit');
}

// БД ФУНКЦИИ (FIREBASE)
async function getUsersDB() {
    try {
        const snapshot = await get(ref(db, 'users'));
        return snapshot.exists() ? snapshot.val() : [];
    } catch (e) { console.error(e); return []; }
}

async function saveUsersDB(usersArray) {
    try { await set(ref(db, 'users'), usersArray); } 
    catch (e) { console.error(e); }
}

function getCurrentUser() {
    const u = localStorage.getItem('currentUser');
    return u ? JSON.parse(u) : null;
}

// АВТОРИЗАЦИЯ
function checkUserSession() {
    const user = getCurrentUser();
    const label = document.getElementById('profile-label');
    const adminLink = document.getElementById('btn-admin-panel-link');
    if (user) {
        label.innerText = user.name;
        label.classList.remove('hidden');
        if (user.username === 'admin' && adminLink) adminLink.classList.remove('hidden');
    } else {
        label.classList.add('hidden');
        if (adminLink) adminLink.classList.add('hidden');
    }
}

function openAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
    if (getCurrentUser()) switchAuthView('profile'); else switchAuthView('login');
}

function closeAuthOverlay(event) { if (event.target.id === 'auth-modal') closeModal('auth-modal'); }

function switchAuthView(viewName) {
    document.getElementById('auth-view-login').classList.add('hidden');
    document.getElementById('auth-view-register').classList.add('hidden');
    document.getElementById('auth-view-profile').classList.add('hidden');
    
    if (viewName === 'login') document.getElementById('auth-view-login').classList.remove('hidden');
    if (viewName === 'register') document.getElementById('auth-view-register').classList.remove('hidden');
    if (viewName === 'profile') {
        const user = getCurrentUser();
        document.getElementById('profile-greeting').innerText = `Привет, ${user ? user.name : ''}!`;
        document.getElementById('auth-view-profile').classList.remove('hidden');
    }
}

async function handleLoginSubmit() {
    const userInp = document.getElementById('login-username').value.trim();
    const passInp = document.getElementById('login-password').value;
    const users = await getUsersDB();
    const foundUser = users.find(u => u && u.username.toLowerCase() === userInp.toLowerCase() && u.password === passInp);
    
    if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify(foundUser)); checkUserSession();
        showToast(`Добро пожаловать, ${foundUser.name}!`); closeModal('auth-modal');
    } else { showToast("Неверный логин или пароль"); }
}

async function handleRegisterSubmit() {
    const userInp = document.getElementById('reg-username').value.trim();
    const passInp = document.getElementById('reg-password').value;
    const nameInp = document.getElementById('reg-name').value.trim();
    if (!userInp || !passInp || !nameInp) return showToast("Заполните все поля!");
    
    const users = await getUsersDB();
    if (users.some(u => u && u.username.toLowerCase() === userInp.toLowerCase())) return showToast("Логин уже занят.");
    
    const newUser = { username: userInp, password: passInp, name: nameInp, savedDates: {} };
    users.push(newUser); await saveUsersDB(users);
    
    localStorage.setItem('currentUser', JSON.stringify(newUser)); checkUserSession();
    showToast("Регистрация успешна!"); closeModal('auth-modal');
}

function handleLogout() { localStorage.removeItem('currentUser'); checkUserSession(); showToast("Вы вышли из системы"); closeModal('auth-modal'); }

// КАЛЕНДАРЬ
function openStandardCalendar(itemName) { selectedContextItem = itemName; openCalendar('edit'); }

async function openCalendar(mode = 'view') {
    currentCalendarMode = mode; selectedDay = null;
    document.getElementById('calendar-modal').classList.remove('hidden');
    
    if (mode === 'edit') {
        document.getElementById('calendar-edit-mode').classList.remove('hidden'); 
        document.getElementById('calendar-view-mode').classList.add('hidden');
        setTimeout(centerTimeWheels, 50);
    } else {
        document.getElementById('calendar-edit-mode').classList.add('hidden'); 
        document.getElementById('calendar-view-mode').classList.remove('hidden');
        document.getElementById('event-details-text').innerHTML = "Выберите день, чтобы посмотреть планы.";
    }
    
    await renderCalendar();
}

function closeCalendarOverlay(e) { if (e.target.id === 'calendar-modal') closeModal('calendar-modal'); }

async function renderCalendar() {
    const monthsRuTitle = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    document.getElementById('calendar-month-year').innerText = `${monthsRuTitle[currentMonth]} ${currentYear}`;
    const daysContainer = document.getElementById('calendar-days'); daysContainer.innerHTML = '';
    
    let startDay = new Date(currentYear, currentMonth, 1).getDay(); startDay = startDay === 0 ? 6 : startDay - 1;
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let i = 0; i < startDay; i++) daysContainer.appendChild(Object.assign(document.createElement('div'), {className: 'empty'}));

    const user = getCurrentUser();
    let userDates = user && user.savedDates ? user.savedDates : {};
    if (user) {
        const users = await getUsersDB();
        const dbUser = users.find(u => u && u.username === user.username);
        if (dbUser && dbUser.savedDates) userDates = dbUser.savedDates;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div'); dayCell.innerText = day;
        const dateKey = `${currentYear}-${currentMonth}-${day}`;
        
        if (userDates[dateKey] && userDates[dateKey].length > 0) dayCell.classList.add('saved-date');
        else if (day === selectedDay && currentCalendarMode === 'edit') dayCell.classList.add('selected-date');

        dayCell.onclick = () => {
            selectedDay = day; document.querySelectorAll('#calendar-days div').forEach(d => d.classList.remove('selected-date')); dayCell.classList.add('selected-date');
            if (currentCalendarMode === 'view') {
                if (userDates[dateKey] && userDates[dateKey].length > 0) {
                    document.getElementById('event-details-text').innerHTML = `<strong>${day} число</strong><br>` + userDates[dateKey].map(e => `• ${e}`).join('<br>');
                } else document.getElementById('event-details-text').innerHTML = `<strong>${day} число</strong><br>Планов нет.`;
            }
        };
        daysContainer.appendChild(dayCell);
    }
}

async function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; } else if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    
    if (!document.getElementById('calendar-modal').classList.contains('hidden')) await renderCalendar();
    else renderMultiCalendarGrid();
}

async function saveDateSelection() {
    if (selectedDay === null) return showToast("Сначала выберите день!");
    const user = getCurrentUser(); if (!user) { showToast("Войдите для сохранения"); openAuthModal(); return; }
    
    const hEl = document.querySelector('#wheel-hours .active-time'); const mEl = document.querySelector('#wheel-minutes .active-time');
    const timeStr = `${hEl ? hEl.innerText : "00"}:${mEl ? mEl.innerText : "00"}`;
    const dateKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    const eventName = selectedContextItem ? `${selectedContextItem} в ${timeStr}` : `Событие в ${timeStr}`;

    const users = await getUsersDB();
    const dbUserIdx = users.findIndex(u => u && u.username === user.username);
    if (dbUserIdx !== -1) {
        if (!users[dbUserIdx].savedDates) users[dbUserIdx].savedDates = {};
        if (!users[dbUserIdx].savedDates[dateKey]) users[dbUserIdx].savedDates[dateKey] = [];
        users[dbUserIdx].savedDates[dateKey].push(eventName);
        
        await saveUsersDB(users);
        localStorage.setItem('currentUser', JSON.stringify(users[dbUserIdx]));
        showToast("Сохранено!"); closeModal('calendar-modal'); navigate('screen-main');
    }
}

async function resetDateSelection() {
    if (selectedDay === null) return showToast("Выберите день для очистки");
    const user = getCurrentUser(); if (!user) return;
    const dateKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    
    const users = await getUsersDB();
    const dbUserIdx = users.findIndex(u => u && u.username === user.username);
    if (dbUserIdx !== -1 && users[dbUserIdx].savedDates && users[dbUserIdx].savedDates[dateKey]) {
        delete users[dbUserIdx].savedDates[dateKey];
        await saveUsersDB(users);
        localStorage.setItem('currentUser', JSON.stringify(users[dbUserIdx]));
        showToast("Событие удалено"); renderCalendar();
    } else showToast("Событий нет");
}

// МНОГОДНЕВНЫЙ КАЛЕНДАРЬ
function openMultiCalendar() { closeModal('trip-info-modal'); rangeStart = null; rangeEnd = null; document.getElementById('multi-calendar-modal').classList.remove('hidden'); renderMultiCalendarGrid(); }

function renderMultiCalendarGrid() {
    const grid = document.getElementById('multi-calendar-grid'); grid.innerHTML = '';
    let startDay = new Date(currentYear, currentMonth, 1).getDay(); startDay = startDay === 0 ? 6 : startDay - 1;
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 0; i < startDay; i++) grid.appendChild(Object.assign(document.createElement('div'), {className: 'empty'}));
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div'); dayCell.className = 'day-cell'; dayCell.innerText = day;
        const ts = new Date(currentYear, currentMonth, day).getTime();
        if (rangeStart === ts || rangeEnd === ts) dayCell.classList.add('selected-date');
        if (rangeStart && rangeEnd && ts > rangeStart && ts < rangeEnd) dayCell.classList.add('in-range');
        
        dayCell.onclick = () => {
            if (!rangeStart || (rangeStart && rangeEnd)) { rangeStart = ts; rangeEnd = null; }
            else if (ts >= rangeStart) rangeEnd = ts; else rangeStart = ts;
            renderMultiCalendarGrid();
        };
        grid.appendChild(dayCell);
    }
}

async function confirmMultiDateSelection() {
    if (!rangeStart) return showToast("Выберите даты!");
    const user = getCurrentUser(); if (!user) { showToast("Войдите для сохранения"); openAuthModal(); return; }
    if (!rangeEnd) rangeEnd = rangeStart;
    
    const users = await getUsersDB();
    const dbUserIdx = users.findIndex(u => u && u.username === user.username);
    if (dbUserIdx !== -1) {
        if (!users[dbUserIdx].savedDates) users[dbUserIdx].savedDates = {};
        let s = new Date(rangeStart), e = new Date(rangeEnd);
        while(s <= e) {
            const keyStr = `${s.getFullYear()}-${s.getMonth()}-${s.getDate()}`;
            if (!users[dbUserIdx].savedDates[keyStr]) users[dbUserIdx].savedDates[keyStr] = [];
            users[dbUserIdx].savedDates[keyStr].push(`Поездка: ${selectedContextItem}`);
            s.setDate(s.getDate() + 1);
        }
        await saveUsersDB(users);
        localStorage.setItem('currentUser', JSON.stringify(users[dbUserIdx]));
        showToast("Поездка сохранена!"); closeModal('multi-calendar-modal'); navigate('screen-main');
    }
}

// ПАНЕЛЬ АДМИНА
function setupAdminRealtimeSync() {
    onValue(ref(db, 'users'), (snapshot) => {
        if (snapshot.exists()) {
            const users = snapshot.val() || [];
            const modal = document.getElementById('admin-modal');
            if (modal && !modal.classList.contains('hidden')) updateAdminPanelUI(users);
        }
    });
}

async function openAdminPanel() {
    document.getElementById('auth-modal').classList.add('hidden');
    const users = await getUsersDB(); updateAdminPanelUI(users);
    document.getElementById('admin-search-input').value = ""; document.getElementById('admin-modal').classList.remove('hidden');
}

function updateAdminPanelUI(usersList) {
    let totalEvents = 0; const validUsers = usersList.filter(Boolean);
    validUsers.forEach(u => { if (u.savedDates) Object.keys(u.savedDates).forEach(d => totalEvents += Array.isArray(u.savedDates[d]) ? u.savedDates[d].length : 0); });
    document.getElementById('stat-total-users').innerText = validUsers.length; document.getElementById('stat-total-events').innerText = totalEvents;
    
    const container = document.getElementById('admin-data-container'); container.innerHTML = '';
    if (validUsers.length === 0) return container.innerHTML = '<div style="text-align:center; padding:20px; color:#fff;">Пользователи отсутствуют</div>';
    
    validUsers.forEach(user => {
        const card = document.createElement('div'); card.className = 'admin-user-card'; card.setAttribute('data-search', `${user.name} ${user.username}`.toLowerCase());
        let datesHtml = '';
        if (user.savedDates) {
            Object.keys(user.savedDates).forEach(d => {
                if (user.savedDates[d] && user.savedDates[d].length > 0) {
                    datesHtml += `<div class="admin-date-group"><div class="admin-date-title">${d}</div>${user.savedDates[d].map(ev => `<div class="admin-event-bullet">• ${ev}</div>`).join('')}</div>`;
                }
            });
        }
        if (!datesHtml) datesHtml = '<div style="color:#aaa; font-size:14px;">Нет событий</div>';
        
        card.innerHTML = `<div class="admin-user-info" style="color:#FAF0A5; font-weight:bold; margin-bottom:10px;">${user.name} <span style="color:#7D9C87;">(@${user.username})</span></div><button onclick="deleteUser('${user.username}')" style="position:absolute; top:15px; right:15px; background:#8E3B3B; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Удалить</button>${datesHtml}`;
        container.appendChild(card);
    });
}

function filterAdminUsers() {
    const query = document.getElementById('admin-search-input').value.toLowerCase().trim();
    document.querySelectorAll('.admin-user-card').forEach(card => {
        if (card.getAttribute('data-search').includes(query)) card.classList.remove('hidden'); else card.classList.add('hidden');
    });
}

async function deleteUser(username) {
    if (!confirm(`Удалить пользователя @${username}?`)) return;
    let users = await getUsersDB(); users = users.filter(u => u && u.username !== username); await saveUsersDB(users);
    const session = getCurrentUser(); if (session && session.username === username) { localStorage.removeItem('currentUser'); checkUserSession(); }
}

// КОЛЕСА ВРЕМЕНИ
const wheelHours = document.getElementById('wheel-hours'), wheelMinutes = document.getElementById('wheel-minutes');
function buildInfiniteWheels() {
    let hHTML = '<div></div>', mHTML = '<div></div>';
    for (let loop=0; loop<3; loop++) { for (let i=0; i<24; i++) hHTML += `<div data-val="${i}">${i<10?'0'+i:i}</div>`; } hHTML += '<div></div>'; wheelHours.innerHTML = hHTML;
    for (let loop=0; loop<3; loop++) { for (let i=0; i<60; i++) mHTML += `<div data-val="${i}">${i<10?'0'+i:i}</div>`; } mHTML += '<div></div>'; wheelMinutes.innerHTML = mHTML;
    
    wheelHours.onscroll = () => handleActiveHighlight(wheelHours); wheelMinutes.onscroll = () => handleActiveHighlight(wheelMinutes);
}

function handleActiveHighlight(wheel) {
    const items = wheel.querySelectorAll('div[data-val]'), center = wheel.getBoundingClientRect().top + wheel.getBoundingClientRect().height / 2;
    let closest = null, minDist = Infinity;
    items.forEach(item => { item.classList.remove('active-time'); const d = Math.abs(center - (item.getBoundingClientRect().top + item.getBoundingClientRect().height / 2)); if (d < minDist) { minDist = d; closest = item; } });
    if (closest) closest.classList.add('active-time');
}
function centerTimeWheels() { wheelHours.scrollTop = 24 * 30; wheelMinutes.scrollTop = 60 * 30; setTimeout(() => { handleActiveHighlight(wheelHours); handleActiveHighlight(wheelMinutes); }, 100); }
>>>>>>> 1351efdc6efa84cb9a56cdf955bbf08d19b25d60
