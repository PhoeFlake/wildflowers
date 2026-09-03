/**
 * Real-time Astronomical, Clock & Seasonal Engine
 */

/**
 * Returns time of day based on the user's real 24-hour clock
 * Dawn: 05:00 to 07:30
 * Day:  07:30 to 17:30
 * Dusk: 17:30 to 19:30
 * Night: 19:30 to 05:00
 */
export function getTimeOfDayFromDate(date = new Date()) {
  const hours = date.getHours() + date.getMinutes() / 60

  if (hours >= 5.0 && hours < 7.5) {
    return 'dawn'
  }
  if (hours >= 7.5 && hours < 17.5) {
    return 'day'
  }
  if (hours >= 17.5 && hours < 19.5) {
    return 'dusk'
  }
  return 'night'
}

/**
 * Auto-detects if current date falls within Winter (Mid-November to Mid-February)
 * November 15 to February 15, regardless of the year.
 */
export function isWinterSeason(date = new Date()) {
  const month = date.getMonth() // 0 = Jan, 1 = Feb, 10 = Nov, 11 = Dec
  const day = date.getDate()

  // Nov 15 to Nov 30
  if (month === 10 && day >= 15) return true
  // December (all month)
  if (month === 11) return true
  // January (all month)
  if (month === 0) return true
  // Feb 1 to Feb 15
  if (month === 1 && day <= 15) return true

  return false
}

/**
 * Returns sun elevation angle, azimuth, and lighting colors based on time of day
 */
export function getSunPosition(timeOfDay) {
  switch (timeOfDay) {
    case 'dawn':
      return {
        elevation: 0.22,
        azimuth: 0.85,
        sunColor: '#ffd8aa',
        ambientColor: '#f3d5ca',
        lightIntensity: 1.4,
      }
    case 'day':
      return {
        elevation: 0.95,
        azimuth: 0.4,
        sunColor: '#fff9e6',
        ambientColor: '#d6ecff',
        lightIntensity: 1.8,
      }
    case 'dusk':
      return {
        elevation: 0.15,
        azimuth: 0.92,
        sunColor: '#ff8a3d',
        ambientColor: '#d48a70',
        lightIntensity: 1.5,
      }
    case 'night':
    default:
      return {
        elevation: 0.55,
        azimuth: 0.78,
        sunColor: '#cce6ff',
        ambientColor: '#0b162c',
        lightIntensity: 0.9,
      }
  }
}
