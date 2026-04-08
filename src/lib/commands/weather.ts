import type { OutputLine } from './core'

// WMO Weather Codes → description + emoji
const WMO_CODES: Record<number, { desc: string; emoji: string }> = {
  0:  { desc: 'Clear sky',              emoji: '☀️'  },
  1:  { desc: 'Mainly clear',           emoji: '🌤️' },
  2:  { desc: 'Partly cloudy',          emoji: '⛅'  },
  3:  { desc: 'Overcast',               emoji: '☁️'  },
  45: { desc: 'Foggy',                  emoji: '🌫️' },
  48: { desc: 'Icy fog',                emoji: '🌫️' },
  51: { desc: 'Light drizzle',          emoji: '🌦️' },
  53: { desc: 'Moderate drizzle',       emoji: '🌦️' },
  55: { desc: 'Dense drizzle',          emoji: '🌧️' },
  61: { desc: 'Slight rain',            emoji: '🌧️' },
  63: { desc: 'Moderate rain',          emoji: '🌧️' },
  65: { desc: 'Heavy rain',             emoji: '🌧️' },
  71: { desc: 'Slight snow',            emoji: '🌨️' },
  73: { desc: 'Moderate snow',          emoji: '❄️'  },
  75: { desc: 'Heavy snow',             emoji: '❄️'  },
  80: { desc: 'Slight showers',         emoji: '🌦️' },
  81: { desc: 'Moderate showers',       emoji: '🌧️' },
  82: { desc: 'Violent showers',        emoji: '⛈️'  },
  95: { desc: 'Thunderstorm',           emoji: '⛈️'  },
  99: { desc: 'Thunderstorm w/ hail',   emoji: '⛈️'  },
}

function wmo(code: number) {
  return WMO_CODES[code] ?? { desc: 'Unknown', emoji: '🌡️' }
}

export async function weatherCommand(args: string[]): Promise<OutputLine[]> {
  const city = args.join(' ').trim()
  if (!city) {
    return [
      { type: 'error',  content: 'Usage: weather <city>' },
      { type: 'muted',  content: 'Examples: weather London  |  weather "New York"  |  weather Tokyo' },
    ]
  }

  try {
    // Step 1: Geocode via Nominatim
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`
    const geoRes = await fetch(geoUrl, { headers: { 'Accept-Language': 'en' } })
    const geoData = await geoRes.json()
    if (!geoData?.length) {
      return [{ type: 'error', content: `City not found: "${city}". Try a more specific name.` }]
    }
    const loc = geoData[0]
    const lat = parseFloat(loc.lat)
    const lon = parseFloat(loc.lon)
    const displayName = loc.display_name.split(',').slice(0, 2).join(',').trim()

    // Step 2: Fetch weather from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`
    const wRes = await fetch(weatherUrl)
    const wData = await wRes.json()

    const curr = wData.current
    const daily = wData.daily
    const { desc, emoji } = wmo(curr.weather_code)

    const days = ['Today', 'Tomorrow', ...daily.time.slice(2, 4).map((d: string) =>
      new Date(d).toLocaleDateString('en', { weekday: 'long' })
    )]
    const forecastRows = days.map((day, i) => {
      const { emoji: de, desc: dd } = wmo(daily.weather_code[i])
      return `<tr style="line-height: 1.5;">
        <td style="color:var(--muted); min-width: 100px;">${day}</td>
        <td style="padding-right: 12px;">${de}</td>
        <td style="color:var(--accent2); text-align: left; padding-right: 12px;">${Math.round(daily.temperature_2m_max[i])}°C</td>
        <td style="color:var(--muted); text-align: left; padding-right: 12px;">${Math.round(daily.temperature_2m_min[i])}°C</td>
        <td style="color:var(--muted); font-size: 0.9em;">${dd}</td>
      </tr>`
    }).join('')

    return [
      {
        type: 'html',
        content: `
<div class="weather-city" style="margin: 0;">📍 ${displayName}</div>
<div class="weather-main" style="margin: 0;">${emoji} ${Math.round(curr.temperature_2m)}°C · ${desc}</div>
<div class="weather-details" style="margin: 0;">Feels like ${Math.round(curr.apparent_temperature)}°C · Humidity ${curr.relative_humidity_2m}% · Wind ${Math.round(curr.wind_speed_10m)} km/h</div>
<table class="weather-forecast-table" style="margin: 0;">${forecastRows}</table>`.trim(),
      },
    ]
  } catch (err) {
    return [
      { type: 'error', content: 'Failed to fetch weather data. Check your internet connection.' },
      { type: 'muted', content: String(err) },
    ]
  }
}
