let getData = require("./data/yandex.js");
let dal = require("wtr-dal");
// let dataForecast = getData.getforecast(52.29778, 104.29639);

async function startDataСollection() {
    let lat = 52.29778
    let lon = 104.29639
    const dataAll = await getData.getforecast(lat, lon);
    const forecastId = await dal.saveForecast(dataAll[0].source, dataAll[0].date.now);
    const locationId = await dal.getIdLocationByCoords(lat, lon)
    // console.log(dataAll)
    await dataAll.map(forecast => dal.saveForecastData(forecast, forecastId, locationId));
}

startDataСollection();