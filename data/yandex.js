const axios = require("axios");
let dal = require("wtr-dal");
let source = "yandex"
const dateNow = new Date()

function dateDay(amount_day) {
  return {
    now: dateNow,
    date_start: new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + amount_day, 12),
    date_end: new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + amount_day, 23, 59, 59, 999),
    type: "day"
  }
}

function dateNight(amount_day) {
  return {
    now: dateNow,
    date_start: new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + amount_day, 00),
    date_end: new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + amount_day, 11, 59, 59, 999),
    type: "night"
  }
}

function rainfall(weather) {  // не возвоащает инфу о яп, только о дожде, снеге и снеге с дождем
  return {
    snow: weather === 3 ? 1 : 0,
    rain: weather === 1 ? 1 : 0,
    sand: 0,
    squall: 0,
    mist: 0,
    storm: 0,
    drizzle: 0,
    rainsnow: weather === 2 ? 1 : 0
  }
}

function rainfall_strength(type) {
  switch (type) {
    case 0: // if (x type=== 0)
      return "not";
      break;
    case 0.25:
      return "light";
      break;
    case 0.5:
      return "norm";
      break;
    case 0.75:
    case 1:
      return "heavy";
      break;

    default:
      console.log("ERROR rainfall_strength yandex");
      return "error";
      break;
  }
}

function cloudness(type) {
  switch (type) {
    case 0: // if (x type=== 0)
      return "not";
      break;
    case 0.25:
    case 0.5:
    case 0.75:
      return "light";
      break;
    case 1:
      return "heavy";
      break;

    default:
      console.log("ERROR cloudness yandex");
      return "error";
      break;
  }
}

async function analyzeData({ info, forecasts }) {
  let dataAll = [];
  const { lat, lon } = info;
  for (let dd = 1, i = 0; dd < 6; dd += 2, i++) {
    dataAll.push(
      {
        source,
        lat,
        lon,
        depth_forecast: dd,
        date: dateDay(dd),
        temperature: forecasts[dd].parts.day_short.temp,
        wind_speed: {
          from: forecasts[dd].parts.day_short.wind_speed,
          to: forecasts[dd].parts.day_short.wind_speed
        },
        wind_gust: forecasts[dd].parts.day_short.wind_gust,
        rainfall: rainfall(forecasts[dd].parts.day_short.prec_type),
        amount_rainfall: forecasts[dd].parts.day_short.prec_mm
      }
    )

    dataAll.push(
      {
        source,
        lat,
        lon,
        depth_forecast: dd,
        date: dateNight(dd),
        temperature: forecasts[dd].parts.night_short.temp,
        wind_speed: {
          from: forecasts[dd].parts.night_short.wind_speed,
          to: forecasts[dd].parts.night_short.wind_speed
        },
        wind_gust: forecasts[dd].parts.night_short.wind_gust,
        rainfall: rainfall(forecasts[dd].parts.night_short.prec_type),
        amount_rainfall: forecasts[dd].parts.night_short.prec_mm
      }
    )

  }
  // console.log(dataAll)
  await dal.saveForecast(source, dateNow);
  Promise.all(dataAll.map(forecast => dal.saveMeteoData(forecast)))
    .then(() => console.log("Successfully sent data from Yandex"))
    .catch(error => console.log("Error sending data from Yandex"))

}

function getforecast(newlat, newlon) {
  axios({
    method: "get",
    url: "https://api.weather.yandex.ru/v1/forecast",
    headers: {
      "X-Yandex-API-Key": "5e758c97-9f5b-4f63-a72b-b5c4e0624e90"
    },
    params: {
      lat: newlat,
      lon: newlon,
      lang: "ru_RU",
      limit: 7,
      hours: true,
      extra: true
    }
  })
    .then(res => {
      // console.log(res.data);
      analyzeData(res.data);
    })
    .catch(err => console.log(err));
}

module.exports.getforecast = getforecast;
