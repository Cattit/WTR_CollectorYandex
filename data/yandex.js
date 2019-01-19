const axios = require("axios")

function analyzeData(newdata){

  dd = 1
  for (i = 2; i<24; i+=3){
    console.log(newdata.forecasts[dd].date);
    console.log(newdata.forecasts[dd].hours[i].hour);
    console.log(newdata.forecasts[dd].hours[i].temp);
    console.log(newdata.forecasts[dd].hours[i].wind_speed);
    console.log(newdata.forecasts[dd].hours[i].wind_dir);
    console.log(newdata.forecasts[dd].hours[i].pressure_mm); //можно изменить на гектопаскали 
    console.log(newdata.forecasts[dd].hours[i].prec_type);
    console.log(newdata.forecasts[dd].hours[i].prec_strength);
    console.log(newdata.forecasts[dd].hours[i].cloudness);
    console.log(newdata.forecasts[dd].hours[i].humidity);
  }

  for (dd = 3; dd<6; dd+=2){
    console.log(newdata.forecasts[dd].date);  
    console.log(newdata.forecasts[dd].parts.night._source); //ночь
    console.log(newdata.forecasts[dd].parts.night.temp_avg);
    console.log(newdata.forecasts[dd].parts.night.wind_speed);
    console.log(newdata.forecasts[dd].parts.night.wind_dir);
    console.log(newdata.forecasts[dd].parts.night.pressure_mm); //можно изменить на гектопаскали 
    console.log(newdata.forecasts[dd].parts.night.prec_type);
    console.log(newdata.forecasts[dd].parts.night.prec_strength);
    console.log(newdata.forecasts[dd].parts.night.cloudness);
    console.log(newdata.forecasts[dd].parts.night.humidity);

    console.log(newdata.forecasts[dd].parts.morning._source);  //утро
    console.log(newdata.forecasts[dd].parts.morning.temp_avg);
    console.log(newdata.forecasts[dd].parts.morning.wind_speed);
    console.log(newdata.forecasts[dd].parts.morning.wind_dir);
    console.log(newdata.forecasts[dd].parts.morning.pressure_mm); //можно изменить на гектопаскали 
    console.log(newdata.forecasts[dd].parts.morning.prec_type);
    console.log(newdata.forecasts[dd].parts.morning.prec_strength);
    console.log(newdata.forecasts[dd].parts.morning.cloudness);
    console.log(newdata.forecasts[dd].parts.morning.humidity);

    console.log(newdata.forecasts[dd].parts.day._source);  //день
    console.log(newdata.forecasts[dd].parts.day.temp_avg);
    console.log(newdata.forecasts[dd].parts.day.wind_speed);
    console.log(newdata.forecasts[dd].parts.day.wind_dir);
    console.log(newdata.forecasts[dd].parts.day.pressure_mm); //можно изменить на гектопаскали 
    console.log(newdata.forecasts[dd].parts.day.prec_type);
    console.log(newdata.forecasts[dd].parts.day.prec_strength);
    console.log(newdata.forecasts[dd].parts.day.cloudness);
    console.log(newdata.forecasts[dd].parts.day.humidity);

    console.log(newdata.forecasts[dd].parts.evening._source);  //вечер
    console.log(newdata.forecasts[dd].parts.evening.temp_avg);
    console.log(newdata.forecasts[dd].parts.evening.wind_speed);
    console.log(newdata.forecasts[dd].parts.evening.wind_dir);
    console.log(newdata.forecasts[dd].parts.evening.pressure_mm); //можно изменить на гектопаскали 
    console.log(newdata.forecasts[dd].parts.evening.prec_type);
    console.log(newdata.forecasts[dd].parts.evening.prec_strength);
    console.log(newdata.forecasts[dd].parts.evening.cloudness);
    console.log(newdata.forecasts[dd].parts.evening.humidity);
  }
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
      //console.log(res.data);
      analyzeData(res.data);
    })
    .catch(err => console.log('err'));


}

module.exports.getforecast = getforecast;