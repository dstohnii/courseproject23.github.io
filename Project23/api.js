const API_KEY = "u0Xtp2lFiRPEFDJIy2ShMK43f4YsZyAA";

function getHolidaysFromAPI(country, year) {
    return fetch(`https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${country}&year=${year}`)
        .then(response => response.json())
}