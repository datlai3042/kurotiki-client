import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import {
      GeolocationApi,
      WeatherData,
      convertUnixTimestampToString,
      getDataWeather,
      getGeoLocation,
} from '../../utils/weatherApi.util'
import { CloudRain, Droplets, Gauge, MapPin, Sunrise, Sunset, Wind } from 'lucide-react'

type TProps = {
      locationName: string
}

const BoxWeatherApi = ({ locationName }: TProps) => {
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

      const [notData, setNotData] = useState(false)

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

                  setNotData(false)
            },
            onError: () => {
                  setNotData(true)
            },
      })

      const geolocationApi = useMutation({
            mutationKey: ['weather-geolocation'],
            mutationFn: (name: string) => getGeoLocation<GeolocationApi>(name),
            onSuccess: (axiosResponse) => {
                  weatherAPI.mutate({
                        data: axiosResponse.data as unknown as {
                              lat: string
                              lon: string
                        }[],
                  })
            },
            onError: () => {
                  setNotData(true)
            },
      })

      useEffect(() => {
            geolocationApi.mutate(locationName)
      }, [locationName])

      const description = weatherData.weather?.[0]?.description || 'Không rõ'

      const countryLabel = useMemo(() => {
            if (weatherData.sys.country === 'VN') return 'Việt Nam'
            return weatherData.sys.country || 'Không rõ'
      }, [weatherData.sys.country])

      const isLoading = geolocationApi.isPending || weatherAPI.isPending
      const isSuccess = geolocationApi.isSuccess && weatherAPI.isSuccess && !notData

      if (isLoading) {
            return (
                  <div className='h-full min-h-[240px] w-full animate-pulse rounded-xl border border-[var(--border-color-input)] bg-slate-500/10 p-4'>
                        <div className='h-5 w-[42%] rounded bg-slate-500/15' />
                        <div className='mt-4 h-12 w-[34%] rounded bg-slate-500/15' />
                        <div className='mt-5 grid grid-cols-2 gap-3'>
                              <div className='h-[72px] rounded-xl bg-slate-500/10' />
                              <div className='h-[72px] rounded-xl bg-slate-500/10' />
                        </div>
                        <div className='mt-3 grid grid-cols-3 gap-2'>
                              <div className='h-[66px] rounded-xl bg-slate-500/10' />
                              <div className='h-[66px] rounded-xl bg-slate-500/10' />
                              <div className='h-[66px] rounded-xl bg-slate-500/10' />
                        </div>
                  </div>
            )
      }

      if (notData || geolocationApi.isError || weatherAPI.isError) {
            return (
                  <div className='flex h-full min-h-[240px] w-full items-center justify-center rounded-xl border border-[var(--border-color-input)] bg-color-section-theme p-6 text-center'>
                        <div className='flex flex-col items-center gap-3'>
                              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-slate-500/10 text-slate-400'>
                                    <CloudRain size={24} />
                              </div>
                              <div>
                                    <p className='text-sm font-semibold text-text-theme'>Không tìm thấy dữ liệu thời tiết</p>
                                    <p className='mt-1 text-xs text-slate-500'>Vui lòng thử lại với khu vực khác.</p>
                              </div>
                        </div>
                  </div>
            )
      }

      if (!isSuccess) return null

      return (
            <div className='h-full w-full overflow-hidden rounded-xl border border-[var(--border-color-input)] bg-color-section-theme text-text-theme'>
                  <div className='p-4 sm:p-5'>
                        {/* Header */}
                        <div className='flex items-start justify-between gap-3'>
                              <div className='min-w-0'>
                                    <div className='flex items-center gap-2 text-slate-400'>
                                          <MapPin size={14} />
                                          <span className='truncate text-[11px] font-medium uppercase tracking-[0.08em]'>
                                                {weatherData.name || locationName}
                                          </span>
                                    </div>

                                    <div className='mt-2 flex items-end gap-2'>
                                          <span className='text-[32px] font-bold leading-none text-blue-500 sm:text-[36px]'>
                                                {weatherData.main.temp}°C
                                          </span>
                                          <span className='pb-1 text-[12px] capitalize text-slate-500 sm:text-[13px]'>
                                                {description}
                                          </span>
                                    </div>

                                    <p className='mt-1 text-[11px] text-slate-500'>
                                          Cảm nhận như {weatherData.main.feels_like}°C
                                    </p>
                              </div>

                              <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                    <CloudRain size={22} />
                              </div>
                        </div>

                        {/* Sun time */}
                        <div className='mt-5 grid grid-cols-2 gap-3'>
                              <div className='rounded-xl border border-[var(--border-color-input)] bg-slate-500/[0.025] p-3'>
                                    <div className='flex items-center gap-2 text-amber-500'>
                                          <Sunrise size={17} />
                                          <span className='text-[11px] font-semibold uppercase tracking-[0.06em]'>Bình minh</span>
                                    </div>

                                    <p className='mt-2 text-[14px] font-semibold text-text-theme'>
                                          {convertUnixTimestampToString(weatherData.sys.sunrise)}
                                    </p>
                              </div>

                              <div className='rounded-xl border border-[var(--border-color-input)] bg-slate-500/[0.025] p-3'>
                                    <div className='flex items-center gap-2 text-orange-500'>
                                          <Sunset size={17} />
                                          <span className='text-[11px] font-semibold uppercase tracking-[0.06em]'>Hoàng hôn</span>
                                    </div>

                                    <p className='mt-2 text-[14px] font-semibold text-text-theme'>
                                          {convertUnixTimestampToString(weatherData.sys.sunset)}
                                    </p>
                              </div>
                        </div>

                        {/* Stats */}
                        <div className='mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3'>
                              <div className='rounded-xl border border-[var(--border-color-input)] p-3'>
                                    <div className='flex items-center gap-1.5 text-slate-400'>
                                          <Gauge size={14} />
                                          <span className='text-[10px] font-medium uppercase tracking-[0.06em]'>Trung bình</span>
                                    </div>

                                    <p className='mt-1.5 text-[13px] font-semibold text-text-theme'>
                                          {weatherData.main.temp}°C
                                    </p>
                              </div>

                              <div className='rounded-xl border border-[var(--border-color-input)] p-3'>
                                    <div className='flex items-center gap-1.5 text-slate-400'>
                                          <Gauge size={14} />
                                          <span className='text-[10px] font-medium uppercase tracking-[0.06em]'>Cao nhất</span>
                                    </div>

                                    <p className='mt-1.5 text-[13px] font-semibold text-text-theme'>
                                          {weatherData.main.temp_max}°C
                                    </p>
                              </div>

                              <div className='rounded-xl border border-[var(--border-color-input)] p-3'>
                                    <div className='flex items-center gap-1.5 text-slate-400'>
                                          <Gauge size={14} />
                                          <span className='text-[10px] font-medium uppercase tracking-[0.06em]'>Thấp nhất</span>
                                    </div>

                                    <p className='mt-1.5 text-[13px] font-semibold text-text-theme'>
                                          {weatherData.main.temp_min}°C
                                    </p>
                              </div>

                              <div className='rounded-xl border border-[var(--border-color-input)] p-3'>
                                    <div className='flex items-center gap-1.5 text-slate-400'>
                                          <Wind size={14} />
                                          <span className='text-[10px] font-medium uppercase tracking-[0.06em]'>Gió</span>
                                    </div>

                                    <p className='mt-1.5 text-[13px] font-semibold text-text-theme'>
                                          {weatherData.wind.speed} m/s
                                    </p>
                              </div>

                              <div className='rounded-xl border border-[var(--border-color-input)] p-3'>
                                    <div className='flex items-center gap-1.5 text-slate-400'>
                                          <Droplets size={14} />
                                          <span className='text-[10px] font-medium uppercase tracking-[0.06em]'>Độ ẩm</span>
                                    </div>

                                    <p className='mt-1.5 text-[13px] font-semibold text-text-theme'>
                                          {weatherData.main.humidity}%
                                    </p>
                              </div>

                              <div className='rounded-xl border border-[var(--border-color-input)] p-3'>
                                    <div className='flex items-center gap-1.5 text-slate-400'>
                                          <MapPin size={14} />
                                          <span className='text-[10px] font-medium uppercase tracking-[0.06em]'>Quốc gia</span>
                                    </div>

                                    <p className='mt-1.5 truncate text-[13px] font-semibold text-text-theme'>
                                          {countryLabel}
                                    </p>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default BoxWeatherApi