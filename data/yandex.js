const axios = require("axios")
let dal = require ('wtr-dal') 

function rainfall(type){
  switch(type) {
    case 0:  // if (x type=== 0)
      return "not"
      break
    case 1:  
      return "rain"
      break
    case 2:  
      return "rain/snow"
      break
    case 3:  
      return "snow"
      break 

    default:
      console.log("ERROR rainfall yandex")
      return "error"
      break
  }
}

function rainfall_strength(type){
  switch(type) {
    case 0:  // if (x type=== 0)
      return "not"
      break
    case 0.25:  
      return "light"
      break
    case 0.5:  
      return "norm"
      break
    case 0.75:  
    case 1: 
      return "heavy"
      break 

    default:
      console.log("ERROR rainfall_strength yandex")
      return "error"
      break
  }
}

function cloudness(type){
  switch(type) {
    case 0:  // if (x type=== 0)
      return "not"
      break
    case 0.25: 
    case 0.5:  
    case 0.75: 
      return "light"
      break  
    case 1: 
      return "heavy"
      break 

    default:
      console.log("ERROR cloudness yandex")
      return "error"
      break
  }
}

function analyzeData(newdata, newlat, newlon){
  let dataAll = new Map();

  for (let dd = 1, i = 0; dd<6; dd+=2, i++){
    let data1 = new Object(); 
    data1.lat = newlat;
    data1.lon = newlon;
    data1.date = newdata.forecasts[dd].date;
    data1.daytime = "day";
    data1.temperature = newdata.forecasts[dd].parts.day_short.temp;
    data1.wind_speed = newdata.forecasts[dd].parts.day_short.wind_speed;
    data1.wind_gust = newdata.forecasts[dd].parts.day_short.wind_gust;
    // data1.wind_direction = newdata.forecasts[dd].parts.day_short.wind_dir;
    // data1.pressure = newdata.forecasts[dd].parts.day_short.pressure_mm;
    data1.rainfall = rainfall(newdata.forecasts[dd].parts.day_short.prec_type);
    data1.rainfall_mm = newdata.forecasts[dd].parts.day_short.prec_mm;
    // data1.rainfall_strength = rainfall_strength(newdata.forecasts[dd].parts.day_short.prec_strength); 
    // data1.cloudness = cloudness(newdata.forecasts[dd].parts.day_short.cloudness); 
    // data1.humidity = newdata.forecasts[dd].parts.day_short.humidity;
    dataAll.set(i, data1); 
    i++;

    let data2 = new Object(); 
    data2.lat = newlat;
    data2.lon = newlon;
    data2.date = newdata.forecasts[dd].date;
    data2.daytime = "night";
    data2.temperature = newdata.forecasts[dd].parts.night_short.temp;
    data2.wind_speed = newdata.forecasts[dd].parts.night_short.wind_speed;
    data2.wind_gust = newdata.forecasts[dd].parts.night_short.wind_gust;
    // data2.wind_direction = newdata.forecasts[dd].parts.night_short.wind_dir;
    // data2.pressure = newdata.forecasts[dd].parts.night_short.pressure_mm;
    data2.rainfall = rainfall(newdata.forecasts[dd].parts.night_short.prec_type);
    data2.rainfall_mm = newdata.forecasts[dd].parts.night_short.prec_mm;
    // data2.rainfall_strength = rainfall_strength(newdata.forecasts[dd].parts.night_short.prec_strength); 
    // data2.cloudness = cloudness(newdata.forecasts[dd].parts.night_short.cloudness); 
    // data2.humidity = newdata.forecasts[dd].parts.night_short.humidity;
    dataAll.set(i, data2);
  }
  //  console.log(dataAll)

  dal.saveMeteoData(dataAll) 
  // .then((result)=> { // !
  //     console.log("Successfully sent data from Yandex")
  // }, (error)=> {
  //     console.log("Error sending data from Yandex")  
  // });
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
      analyzeData(res.data, newlat, newlon);
    })
    .catch(err => console.log(err));
}

module.exports.getforecast = getforecast;