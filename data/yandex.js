const axios = require("axios");
const dal = require("wtr-dal");
const dateNow = new Date()
dateNow.setHours(0, 0, 0, 000)

function dateDay(amount_day) {
  return {
    now: dateNow,
    date_start: new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + amount_day, 12),
    date_end: new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + amount_day, 23, 59, 59, 999),
    type_day: "day"
  }
}

function dateNight(amount_day) {
  return {
    now: dateNow,
    date_start: new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + amount_day, 00),
    date_end: new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + amount_day, 11, 59, 59, 999),
    type_day: "night"
  }
}

function rainfall(weather1, weather2, wind, temperature, amount_rainfall) {  // не возвращает инфу о яп, только о дожде, снеге и снеге с дождем
  let weather = ""  // 3 снег, 1 дождь, 2 дождь со снегом
  if ((weather1 === 3 && weather2 !== 1 && weather2 !== 2) || (weather2 === 3 && weather1 !== 1 && weather1 !== 2))
    weather = "snow"
  if ((weather1 === 1 && weather2 !== 3 && weather2 !== 2) || (weather2 === 1 && weather1 !== 3 && weather1 !== 2))
    weather = "rain"
  if (weather1 === 2 || weather2 === 2 || (weather1 === 3 && weather2 === 1) || (weather1 === 1 && weather2 === 3))
    weather = "rainsnow"
  return {
    snow: weather === "snow" ? 1 : 0,
    rain: weather === "rain" ? 1 : 0,
    sand: null,
    squall: null,
    mist: null,
    storm: null,
    drizzle: null,
    rainsnow: weather === "rainsnow" ? 1 : 0,
    grad: null,
    hard_wind: wind >= 15 ? 1 : 0,
    hard_heat: (dateNow.getMonth() >= 3 && dateNow.getMonth() <= 8 && temperature >= 40) ? 1 : 0,
    hard_frost: ((dateNow.getMonth() >= 9 || dateNow.getMonth() <= 2) && temperature <= -35) ? 1 : 0,
    hard_rainfall: ((weather === "snow" && amount_rainfall >= 7) || amount_rainfall >= 15) ? 1 : 0 // если снега не менее 7 мм или осадков не менее 15 мм
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

async function analyzeData({ info, forecasts }, id_source) {
  let dataAll = [];
  const { lat, lon } = info;
  for (let dd = 1; dd < 6; dd += 2) {

    let temperature = Math.max(forecasts[dd].parts.day.temp_max, forecasts[dd].parts.evening.temp_max),
      wind_speed_from = Math.min(forecasts[dd].parts.day.wind_speed, forecasts[dd].parts.evening.wind_speed),
      wind_speed_to = Math.max(forecasts[dd].parts.day.wind_speed, forecasts[dd].parts.evening.wind_speed),
      wind_gust = Math.max(forecasts[dd].parts.day.wind_gust, forecasts[dd].parts.evening.wind_gust),
      amount_rainfall = forecasts[dd].parts.day.prec_mm + forecasts[dd].parts.evening.prec_mm

    dataAll.push(
      {
        id_source,
        lat,
        lon,
        depth_forecast: dd,
        date: dateDay(dd),
        temperature: temperature,
        wind_speed: {
          from: wind_speed_from,
          to: wind_speed_to
        },
        wind_gust: wind_gust,
        amount_rainfall: amount_rainfall,
        rainfall: rainfall(forecasts[dd].parts.day.prec_type, forecasts[dd].parts.evening.prec_type, Math.max(wind_speed_from, wind_speed_to, wind_gust), temperature, amount_rainfall)
      }
    )

    temperature = Math.min(forecasts[dd].parts.night.temp_min, forecasts[dd].parts.morning.temp_min)
    wind_speed_from = Math.min(forecasts[dd].parts.night.wind_speed, forecasts[dd].parts.morning.wind_speed)
    wind_speed_to = Math.max(forecasts[dd].parts.night.wind_speed, forecasts[dd].parts.morning.wind_speed)
    wind_gust = Math.max(forecasts[dd].parts.night.wind_gust, forecasts[dd].parts.morning.wind_gust)
    amount_rainfall = forecasts[dd].parts.night.prec_mm + forecasts[dd].parts.morning.prec_mm

    dataAll.push(
      {
        id_source,
        lat,
        lon,
        depth_forecast: dd,
        date: dateNight(dd),
        temperature: temperature,
        wind_speed: {
          from: wind_speed_from,
          to: wind_speed_to
        },
        wind_gust: wind_gust,
        amount_rainfall: amount_rainfall,
        rainfall: rainfall(forecasts[dd].parts.night.prec_type, forecasts[dd].parts.morning.prec_type, Math.max(wind_speed_from, wind_speed_to, wind_gust), temperature, amount_rainfall)
      }
    )

  }

  return dataAll
}

function getforecast(url_api, newlat, newlon, id_source) {
  return axios({
    method: "get",
    url: url_api,  //"https://api.weather.yandex.ru/v1/forecast"
    headers: {
      "X-Yandex-API-Key": "73f4d332-aa05-4bdf-a818-e73c157e8303"
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
      return analyzeData(res.data, id_source);
    })
    .catch(err => console.log(err));
}

module.exports.getforecast = getforecast;
