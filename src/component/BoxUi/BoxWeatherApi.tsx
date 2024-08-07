import { useMutation } from '@tanstack/react-query'
import { CloudHail, Sunrise, Sunset } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GeolocationApi, WeatherData, convertUnixTimestampToString, getDataWeather, getGeoLocation } from '../../utils/weatherApi.util'

type TProps = {
      locationName: string
}

const BoxWeatherApi = (props: TProps) => {
      const { locationName } = props

      const [height, setHeight] = useState<number>(0)
      const [weatherData, setWeatherData] = useState<WeatherData>({
            name: '',
            weather: [{ description: '' }],
            main: {
                  feels_like: 0,
                  humidity: 0,
                  temp: 0,
                  temp_max: 0,
                  temp_min: 0,
            },
            sys: {
                  country: '',
                  sunrise: 0,
                  sunset: 0,
            },
            wind: { speed: '' },
      })

      const [notData, setNotData] = useState<boolean>(false)

      const geolocationApi = useMutation({
            mutationKey: ['weather-geolocation'],
            mutationFn: (locationName: string) => getGeoLocation<GeolocationApi>(locationName),
            onSuccess: (axiosResponse) => {
                  // const data= axiosResponse.data[0].
                  weatherAPI.mutate({ data: axiosResponse.data as unknown as { lat: string; lon: string }[] })
                  //console.log(([^)]+))
            },
            onError: () => {
                  setNotData(true)
                  setHeight(1)
            },
      })

      const weatherAPI = useMutation({
            mutationKey: ['weather-data'],
            mutationFn: (geolocation: GeolocationApi) => getDataWeather<WeatherData>(geolocation),
            onSuccess: (axiosResponse) => {
                  const { main, sys, weather, wind, name } = axiosResponse.data
                  setWeatherData({
                        main,
                        sys,
                        wind,
                        weather,
                        name,
                  })
                  setHeight(1)
            },
            onError: () => {
                  setNotData(true)
                  setHeight(1)
            },
      })

     

      useEffect(() => {
            geolocationApi.mutate(locationName)
      }, [])

      return (
            <>
                  {geolocationApi.isSuccess && weatherAPI.isSuccess && (
                        <div
                              className={`${
                                    height > 0 ? 'h-full ' : 'h-0'
                              } bg-[#ffffff] relative overflow-x-hidden  w-full  transition-all duration-800 text-slate-800 `}
                        >
                              {!notData && geolocationApi.isSuccess && weatherAPI.isSuccess && (
                                    <div className='h-full border-[1px] border-blue-400 flex flex-col p-[20px_10px] xl:p-[12px_8px]'>
                                          <h4 className='w-full text-center'>Thời tiết tại {locationName}</h4>

                                          <div className='absolute z-[10] top-[20%] h-[6%] bg-[#ffffff] w-max left-[50%] translate-x-[-50%] mx-auto flex justify-center gap-[8px] items-center'>
                                                <span className='text-[20px] font-extrabold'>{weatherData.main.temp} &#8451;</span>
                                                <span>{weatherData.weather[0].description}</span>
                                          </div>
                                          <div className='mt-[70px]   h-[24%] px-[16%] hidden xl:flex items-center justify-between'>
                                                <div className='flex gap-[8px] items-center'>
                                                      <Sunrise />
                                                      <p className='flex flex-col'>
                                                            <span>Mặt trời mọc lúc</span>
                                                            <span>{convertUnixTimestampToString(weatherData.sys.sunrise)}</span>
                                                      </p>
                                                </div>

                                                <div className='flex gap-[8px] items-center'>
                                                      <Sunset />
                                                      <p className='flex flex-col'>
                                                            <span>Mặt trời lặn lúc</span>
                                                            <span>{convertUnixTimestampToString(weatherData.sys.sunset)}</span>
                                                      </p>
                                                </div>
                                          </div>
                                          <div className='flex-1 flex flex-col xl:flex-row gap-[8px] xl:gap-0 justify-between mt-[20px]'>
                                                <div className='w-full xl:w-[42%] gap-[16px] xl:gap-0 h-full  flex flex-col justify-between'>
                                                      <span>Nhiệt độ trung bình {weatherData.main.temp} &#8451;</span>
                                                      <span>Nhiệt độ cao nhất {weatherData.main.temp_max} &#8451;</span>
                                                      <span>Nhiệt độ thấp nhất {weatherData.main.temp_min} &#8451;</span>
                                                </div>
                                                <div className='w-full xl:w-[30%] h-full flex flex-col '>
                                                      <span>Sức gió: {weatherData.wind.speed}</span>
                                                </div>
                                                <div className='w-full xl:w-[30%] h-full '>
                                                      <span>Quốc gia: Việt Nam</span>
                                                </div>
                                          </div>
                                    </div>
                              )}
                              {/* h-[20px] overflow-y-hidden */}
                              <div className='animate-cloudFly absolute  w-max  '>
                                    <CloudHail size={28} />
                              </div>
                        </div>
                  )}

                  {geolocationApi.isPending || (weatherAPI.isPending && <div className='animate-pulse w-full h-full bg-slate-200'> </div>)}
                  {geolocationApi.isError ||
                        (weatherAPI.isError && notData && (
                              <div className='h-full flex items-center justify-center bg-white'>
                                    <p className='text-[24px] font-extrabold text-slate-900'>Không tìm thấy dữ liệu</p>
                              </div>
                        ))}
            </>
      )
}

//mây đen u ám
//mây cụm

export default BoxWeatherApi
