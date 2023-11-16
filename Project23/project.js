const history = [];
const MAX_HISTORY_ITEMS = 10;
const STORAGE_KEY = "taskStorage";

function openTab(tabName) {
    const tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

// Tab1 functionality
const buttonWeekPeriod = document.getElementById('weekPeriod'); 
const buttonMonthPeriod = document.getElementById('monthPeriod'); 
const startDate = document.getElementById('start-date');
const endDate = document.getElementById('end-date');

buttonWeekPeriod.addEventListener('click', () => { 
    calculateEndDate(7);
});

buttonMonthPeriod.addEventListener('click', () => { 
    let currentDate = new Date(startDate.value);
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let daysInMonth = new Date(year, month, 0).getDate();
    calculateEndDate(daysInMonth);
});

function calculateEndDate(daysToAdd) {
    const currentDate = new Date(startDate.value);
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    endDate.value = currentDate.toISOString().slice(0, 10);
}

// Функція для додавання нового результату до історії та оновлення `localStorage`
function addToHistory(item) {
    history.push(item);

    if (history.length > MAX_HISTORY_ITEMS) {
        history.shift();
    }

    updateHistoryTable();
}

// При запуску сторінки
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
  });

// Завжди повертає масив
function getResultFromStorage() {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return results;
};

function setResultToStorage(result) {
    const results = getResultFromStorage();
    if (!exceedsPropertiesLengthLimit(results)) {
        results.push(result);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    }
};

function getDataFromLocalStorage() {
    const results = getResultFromStorage();
    const historyBody = document.getElementById("history-body");
    historyBody.innerHTML = "";

    for (const result of results) {
        const row = historyBody.insertRow();
        const startDateCell = row.insertCell(0);
        const endDateCell = row.insertCell(1);
        const resultCell = row.insertCell(2);

        startDateCell.textContent = result.startDate;
        endDateCell.textContent = result.endDate;
        resultCell.textContent = result.result;
    }
}

function fillInResultsTable() {
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);
    const dayOptions = document.getElementById("day-options").value;
    const timeOptions = document.getElementById("time-options").value;

    result = calculateTimeDifference(startDate, endDate, dayOptions, timeOptions);

    const resultText = `Result: ${result} ${timeOptions}`;
    document.getElementById("time-range-result").textContent = resultText;

    addResultToHistory(startDate, endDate, resultText);
}

function calculateTimeDifference(startDate, endDate, dayOptions, timeOptions) {
    let result;
    if (startDate && endDate) {
        const diff = endDate - startDate;
        const days = diff / (1000 * 60 * 60 * 24);

        if (dayOptions === "weekdays") {
            result = Math.floor(days / 7) * 5;
        } else if (dayOptions === "weekends") {
            result = Math.floor(days / 7) * 2;
        } else {
            result = days;
        }

        if (timeOptions === "hours") {
            result *= 24;
        } else if (timeOptions === "minutes") {
            result *= 24 * 60;
        } else if (timeOptions === "seconds") {
            result *= 24 * 60 * 60;
        }
    }
    return result;
}

function addResultToHistory(startDate, endDate, resultText) {
    let historyItem = {
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
        result: resultText,
    };

    addToHistory(historyItem);
    setResultToStorage(historyItem);
    updateHistoryTable();
}

function updateHistoryTable() {
    const historyBody = document.getElementById("history-body");
    historyBody.innerHTML = "";

    for (const item of history) {
        const row = historyBody.insertRow();
        const startDateCell = row.insertCell(0);
        const endDateCell = row.insertCell(1);
        const resultCell = row.insertCell(2);

        startDateCell.textContent = item.startDate;
        endDateCell.textContent = item.endDate;
        resultCell.textContent = item.result;
    }
}

// Tab2 functionality
function getHolidays() {
    let country = document.getElementById("country-select").value;
    let year = document.getElementById("year-select").value;
    let holidaysTable = document.getElementById("holidays-table");
    let holidaysBody = document.getElementById("holidays-body");
    let holidaysError = document.getElementById("holidays-error");

    getHolidaysFromAPI(country, year).then(data => {
            if (data.response && data.response.holidays) {
                holidaysError.textContent = "";
                holidaysTable.style.display = "table";
                holidaysBody.innerHTML = "";

                const holidays = data.response.holidays;

                holidays.sort((a, b) => {
                    return a.date.iso.localeCompare(b.date.iso);
                });

                for (const holiday of holidays) {
                    const row = holidaysBody.insertRow();
                    const dateCell = row.insertCell(0);
                    const nameCell = row.insertCell(1);

                    dateCell.textContent = holiday.date.iso;
                    nameCell.textContent = holiday.name;
                }
            } else {
                holidaysTable.style.display = "none";
                holidaysError.textContent = "Something went wrong.";
            }
        })
        .catch(error => {
            holidaysTable.style.display = "none";
            holidaysError.textContent = "Something went wrong";
        });

}

function initializeYearSelect() {

    let countrySelect = document.getElementById("country-select")
    const yearSelect = document.getElementById("year-select");

    countrySelect.addEventListener('change', () => {
        yearSelect.removeAttribute("disabled");
    });

    for (let year = 2001; year <= 2049; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.text = year;
        yearSelect.appendChild(option);
    }
}

function enableIntervalInputs() {
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const intervalSelect = document.getElementById("time-interval");
    const dayOptionsSelect = document.getElementById("day-options");
    const timeOptionsSelect = document.getElementById("time-options");

    startDateInput.addEventListener("change", function () {
        endDateInput.removeAttribute("disabled");
        endDateInput.min = startDateInput.value;
        intervalSelect.removeAttribute("disabled");
        dayOptionsSelect.removeAttribute("disabled");
        timeOptionsSelect.removeAttribute("disabled");
    });

    endDateInput.addEventListener("change", function () {
        startDateInput.max = endDateInput.value;
    });
}

// За замовчуванням відкриємо першу вкладку
openTab('tab1');

//Ініціалізація даних разрахунку часових інтервалів з Local Storage
getDataFromLocalStorage();
// Ініціалізація вибору країн і років та інших функцій
initializeYearSelect();
enableIntervalInputs();