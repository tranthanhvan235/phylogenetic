export const getBackgroundColor = (weatherCode: number) => {
  if (weatherCode >= 200 && weatherCode < 300) return '#3E4A89'
  if (weatherCode >= 300 && weatherCode < 600) return '#4A90E2'
  if (weatherCode >= 600 && weatherCode < 700) return '#D6E6F2'
  if (weatherCode >= 700 && weatherCode < 800) return '#A4A4A4'
  if (weatherCode === 800) return '#FFD700'
  if (weatherCode > 800) return '#87CEEB'
  return '#FFFFFF'
}
