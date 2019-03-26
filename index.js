const getData = require("./data/yandex.js");
const dal = require("wtr-dal");
// const source = "yandex"
const id_source = 0
const dateNow = new Date()
dateNow.setHours(0, 0, 0, 000)

async function startDataСollection() {
    const id_forecast = await dal.saveForecast(id_source, dateNow);
    const masLocation = await dal.getAllLocationCoordsId()
    const url_api = await dal.getUrlApi(id_source)
    for (var i = 0; i < masLocation.length; i++) {
        let lat = masLocation[i].lat
        let lon = masLocation[i].lon
        let id_location = masLocation[i].id
        const dataAll = await getData.getforecast(url_api, lat, lon, id_source);
        await dataAll.map(forecast => dal.saveForecastData(forecast, id_forecast, id_location));
    }
}

startDataСollection();