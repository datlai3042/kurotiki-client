import axios from 'axios'

export type GeolocationApi = {
      data: {
            lat: string
            lon: string
      }[]
}

export type WeatherData = {
      name: string
      weather: [{ description: string }]
      main: {
            temp: number
            feels_like: number
            temp_min: number
            temp_max: number
            humidity: number
      }
      wind: { speed: string }
      sys: { country: string; sunrise: number; sunset: number }
}

export const getGeoLocation = <T>(locationName: string) => {
      return axios.get<T>(
            `http://api.openweathermap.org/geo/1.0/direct?q=${locationName},vn&limit=5&appid=${process.env.REACT_APP_API_KEY_WEATHER}`,
      )
}

export const getDataWeather = <T>(geolocation: GeolocationApi) => {
      return axios.get<T>(
            `https://api.openweathermap.org/data/2.5/weather?lat=${geolocation.data[0].lat}&lon=${geolocation.data[0].lon}&appid=${process.env.REACT_APP_API_KEY_WEATHER}&lang=vi&units=metric`,
      )
}

export const convertUnixTimestampToString = (timestamp: number): string => {
      const date = new Date(timestamp * 1000) // Nhân 1000 để chuyển từ giây sang mili-giây

      // Lấy các thành phần của ngày
      let hours = date.getHours().toString()
      let minutes = date.getMinutes().toString()
      let seconds = date.getSeconds().toString()
      hours = Number(hours) > 9 ? hours : `0${hours}`
      minutes = Number(minutes) > 9 ? minutes : `0${minutes}`
      seconds = Number(seconds) > 9 ? seconds : `0${seconds}`

      const fullTime = `${hours} : ${minutes} : ${seconds}`
      return fullTime
}
