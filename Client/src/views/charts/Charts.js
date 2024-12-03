import { Line } from 'react-chartjs-2'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Doughnut } from 'react-chartjs-2'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook

import generateHmacSignature from '../../assets/generateHmacSignature'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

//IDIOMA
const lenguage = 'en-US'
const API_BASE_URL = 'http://34.238.138.8:5000'

const colorMap = {
  Rain: '#5C6BC0',
  Clear: '#FFEB3B',
  Clouds: '#B0BEC5',
  Snow: '#CFD8DC',
  Windy: '#81C784',
  Thunderstorm: '#9575CD',
  Atmosphera: '#FFA726',
}

const words_weather = [
  'Mist',
  'Smoke',
  'Haze',
  'Dust',
  'Fog',
  'Sand',
  'Dust',
  'Ash',
  'Squall',
  'Tornado',
]

const openMap = {
  0: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
}

const getDaysFromTodayLocalized = (locale) => {
  const today = new Date()
  const dayIndex = today.getDay()
  const daysLocalized = Array.from({ length: 7 }, (_, i) => {
    const tempDate = new Date()
    tempDate.setDate(today.getDate() - today.getDay() + i)
    return tempDate.toLocaleDateString(locale, { weekday: 'short' })
  })
  const orderedDays = [...daysLocalized.slice(dayIndex), ...daysLocalized.slice(0, dayIndex)]
  return orderedDays
}

const getDates = (locale, value) => {
  const today = new Date()
  const dateday = new Date(today)
  dateday.setDate(today.getDate() + value)
  const date = dateday.toLocaleDateString(locale)
  return date
}

const getColorByCategory = (category) => {
  return colorMap[category] || 'rgb(0, 0, 0)' // Color negro si la categoría no está en colorMap
}

const Charts = () => {
  const [DataPrediction, setPredictionData] = useState([])
  const [historical_data, setHistoricalData] = useState([])
  const [sales, setSales] = useState([])

  const fetchPredictionData = async () => {
    const method = 'GET'
    const endpoint = '/traffic_predictions_hourly'
    const timestamp = Math.floor(Date.now() / 1000).toString() // Current timestamp in seconds
    const body = '' // No body for GET requests

    // Generate the HMAC signature
    const signature = generateHmacSignature(method, endpoint, timestamp, body)
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'X-Signature': signature,
          'X-Timestamp': timestamp,
        },
      })
      setPredictionData(response.data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const fetchHistorical = async () => {
    const method = 'GET'
    const endpoint = '/historical_traffic_data'
    const timestamp = Math.floor(Date.now() / 1000).toString() // Current timestamp in seconds
    const body = '' // No body for GET requests

    // Generate the HMAC signature
    const signature = generateHmacSignature(method, endpoint, timestamp, body)
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'X-Signature': signature,
          'X-Timestamp': timestamp,
        },
      })
      setHistoricalData(response.data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const fetchClients = async () => {
    const method = 'GET'
    const endpoint = '/clients'
    const timestamp = Math.floor(Date.now() / 1000).toString() // Current timestamp in seconds
    const body = '' // No body for GET requests

    // Generate the HMAC signature
    const signature = generateHmacSignature(method, endpoint, timestamp, body)
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'X-Signature': signature,
          'X-Timestamp': timestamp,
        },
      })
      setSales(response.data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  useEffect(() => {
    fetchPredictionData()
    fetchHistorical()
    fetchClients()
  }, [])

  console.log(DataPrediction)
  //Predicciones Hoy antes mañana
  const label_hours = Array.from({ length: 24 }, (_, i) => i)

  const data = DataPrediction.slice(-48)
  const data_today = data.slice(0, 24).map((item) => item.predicted_traffic)
  const weather_today = data.slice(0, 24).map((item) => item.weather_condition)
  const color_points_today = data
    .slice(0, 24)
    .map((item) => getColorByCategory(item.weather_condition))

  const upWeather_today = weather_today.map((word) =>
    words_weather.includes(word) ? 'Atmosphera' : word,
  )

  const weatherCountsToday = upWeather_today.reduce((acc, weather) => {
    acc[weather] = (acc[weather] || 0) + 1
    return acc
  }, {})

  const dataT = DataPrediction.slice(-24)
  const data_tomorrow = dataT.slice(0, 24).map((item) => item.predicted_traffic)
  const weather_tomorrow = dataT.slice(0, 24).map((item) => item.weather_condition)
  const color_points_tomorrow = dataT
    .slice(0, 24)
    .map((item) => getColorByCategory(item.weather_condition))

  const upWeather_tomorrow = weather_tomorrow.map((word) =>
    words_weather.includes(word) ? 'Atmosphera' : word,
  )

  const weatherCountsTomorrow = upWeather_tomorrow.reduce((acc, weather) => {
    acc[weather] = (acc[weather] || 0) + 1
    return acc
  }, {})

  const today = new Date()
  const day = (today.getDay() + 0) % 7
  const day_tomorrow = (today.getDay() + 1) % 7
  const opens_today = openMap[day].map((value, index) => value * data_today[index])
  const opens_tomorrow = openMap[day_tomorrow].map((value, index) => value * data_tomorrow[index])

  //HISTORICAL
  const past_data = historical_data.slice(-28).map((item) => item.historical_traffic)
  const last_week = historical_data.slice(-7).map((item) => item.historical_traffic)
  const Avarage_4weeks = []
  for (let i = 0; i < 7; i = i + 1) {
    const grupo = []
    for (let j = 0; j < 4; j = j + 1) {
      const valor = past_data[j * 7 + i]
      grupo.push(valor)
    }
    const avarag = grupo.reduce((sum, value) => sum + value, 0) / grupo.length
    Avarage_4weeks.push(avarag)
  }

  //SALES
  const data_sales = sales.slice(-28)
  const sales_last_month = data_sales.slice(-28).map((item) => item.daily_sales)
  const Past_4week = data_sales.slice(0, 8).map((item) => item.daily_sales)
  const Past_3week = data_sales.slice(8, 15).map((item) => item.daily_sales)
  const Past_2week = data_sales.slice(15, 22).map((item) => item.daily_sales)
  const sales_last_week = data_sales.slice(-7).map((item) => item.daily_sales)
  const employees_last_week = data_sales.slice(-7).map((item) => item.employees)
  const opening_last_week = data_sales.slice(-7).map((item) => item.opening_time)
  const closing_last_week = data_sales.slice(-7).map((item) => item.closing_time)

  const timeToMilliseconds = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number)
    return hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000
  }

  const opening = opening_last_week.map(timeToMilliseconds)
  const closing = closing_last_week.map(timeToMilliseconds)

  const sales_avarage_4weeks = []
  for (let i = 0; i < 7; i = i + 1) {
    const grupo = []
    for (let j = 0; j < 4; j = j + 1) {
      const valor = parseFloat(sales_last_month[j * 7 + i])
      grupo.push(valor)
    }
    const avarag = grupo.reduce((sum, value) => sum + value, 0) / grupo.length
    sales_avarage_4weeks.push(avarag)
  }

  //Percentage Sales
  const sales_last_week_p = data_sales.slice(-7).map((item) => parseFloat(item.daily_sales) || 0)
  const total_sales_last_week = sales_last_week_p.reduce((sum, value) => sum + value, 0)
  const percentage_sales_last_week = []
  for (let i = 0; i < 7; i = i + 1) {
    const val = (sales_last_week[i] * 100) / total_sales_last_week
    percentage_sales_last_week.push(val)
  }

  const sales_employees = []
  const sales_visits = []
  const sales_time = []

  for (let i = 0; i < 7; i = i + 1) {
    const val1 = sales_last_week[i] / employees_last_week[i]
    const val2 = sales_last_week[i] / last_week[i]
    const val3 = (sales_last_week[i] / (opening[i] - closing[i])) * 1000 * 3600
    sales_employees.push(val1)
    sales_visits.push(val2)
    sales_time.push(val3)
  }

  const prediction_today = {
    labels: label_hours,
    datasets: [
      {
        label: 'Visits Today',
        data: data_today,
        fill: true,
        pointBackgroundColor: color_points_today,
        pointStyle: 'circle',
        pointRadius: 6,
        borderColor: '#42A5F5',
        backgroundColor: '#64B5F660',
      },
      {
        label: 'Open',
        data: opens_today,
        fill: 'start',
        backgroundColor: '#66BB6A90',
        borderColor: '#42A5F5',
        tension: 0,
      },
    ],
  }

  const data_weather_today = {
    labels: Object.keys(weatherCountsToday),
    datasets: [
      {
        label: 'Frecuency Weather',
        data: Object.values(weatherCountsToday),
        backgroundColor: Object.keys(weatherCountsToday).map(
          (condition) => colorMap[condition] || '#cccccc',
        ),
        hoverOffset: 4,
      },
    ],
  }

  const prediction_tomorrow = {
    labels: label_hours,
    datasets: [
      {
        label: 'Visits Tomorrow',
        data: data_tomorrow,
        fill: true,
        pointBackgroundColor: color_points_tomorrow,
        pointStyle: 'circle',
        pointRadius: 6,
        borderColor: '#42A5F5',
        backgroundColor: '#64B5F660',
      },
      {
        label: 'Open',
        data: opens_tomorrow,
        fill: 'start',
        backgroundColor: '#66BB6A90',
        borderColor: '#42A5F5',
        tension: 0,
      },
    ],
  }

  const data_weather_tomorrow = {
    labels: Object.keys(weatherCountsTomorrow),
    datasets: [
      {
        label: 'Frecuency Weather',
        data: Object.values(weatherCountsTomorrow),
        backgroundColor: Object.keys(weatherCountsTomorrow).map(
          (condition) => colorMap[condition] || '#cccccc',
        ),
        hoverOffset: 4,
      },
    ],
  }

  const visits_historical = {
    labels: getDaysFromTodayLocalized(lenguage),
    datasets: [
      {
        label: 'Avarage Visits Last Month',
        data: Avarage_4weeks,
        tension: 0,
        fill: true,
        borderColor: ' #00827e',
        backgroundColor: ' #00bbb460',
        pointRadius: 3,
        pointBorderColor: 'black',
        pointBackgroundColor: '#00827e',
      },
      {
        label: 'Visits Lask Week',
        data: last_week,
        tension: 0,
        fill: true,
        borderColor: '#e43d30',
        backgroundColor: ' #ee762360',
        pointRadius: 3,
        pointBorderColor: 'black',
        pointBackgroundColor: '#e43d30',
      },
    ],
  }

  const weekSales = {
    labels: getDaysFromTodayLocalized(lenguage),
    datasets: [
      {
        label: 'Avarage Sales Last Month',
        data: sales_avarage_4weeks,
        tension: 0,
        fill: true,
        borderColor: '#FB8C00',
        backgroundColor: '#FFA72633',
        pointRadius: 3,
        pointBorderColor: 'black',
        pointBackgroundColor: '#2A7F97',
      },
      {
        label: '4 weeks ago',
        data: Past_4week,
        tension: 0,
        fill: true,
        borderColor: '#1E88E5',
        backgroundColor: '#42A5F533',
        pointRadius: 3,
        pointBorderColor: 'black',
        pointBackgroundColor: '#497B4F',
      },
      {
        label: '3 weeks ago',
        data: Past_3week,
        tension: 0,
        fill: true,
        borderColor: '#8E24AA',
        backgroundColor: '#AB47BC33',
        pointRadius: 3,
        pointBorderColor: 'black',
        pointBackgroundColor: '#497B4F',
      },
      {
        label: '2 weeks ago',
        data: Past_2week,
        tension: 0,
        fill: true,
        borderColor: '#E53935',
        backgroundColor: '#EF535033',
        pointRadius: 3,
        pointBorderColor: 'black',
        pointBackgroundColor: '#497B4F',
      },
      {
        label: 'Sales Lask Week',
        data: sales_last_week,
        tension: 0,
        fill: true,
        borderColor: '#43A047',
        backgroundColor: '#66BB6A33',
        pointRadius: 3,
        pointBorderColor: 'black',
        pointBackgroundColor: '#497B4F',
      },
    ],
  }

  const percentageSalesLastWeek = {
    labels: getDaysFromTodayLocalized(lenguage),
    datasets: [
      {
        label: 'Percentajge Sales Lask Week',
        data: percentage_sales_last_week,
        backgroundColor: [
          'rgba(255, 167, 38, 0.5)',
          'rgba(102, 187, 106, 0.5)',
          'rgba(66, 165, 245, 0.5)',
          'rgba(171, 71, 188, 0.5)',
          'rgba(239, 83, 80, 0.5)',
          'rgba(255, 213, 79, 0.5)',
          'rgba(77, 182, 172, 0.5)',
        ],
        hoverOffset: 4,
      },
    ],
  }

  const data_sales_employes = {
    labels: getDaysFromTodayLocalized(lenguage),
    datasets: [
      {
        label: 'Sales/Employees',
        data: sales_employees,
        fill: true,
        borderColor: ' #ee7623',
        backgroundColor: ' #00bbb460',
      },
    ],
  }

  const data_sales_visits = {
    labels: getDaysFromTodayLocalized(lenguage),
    datasets: [
      {
        label: 'Sales/Visits',
        data: sales_visits,
        fill: true,
        borderColor: ' #00827e',
        backgroundColor: ' #00bbb460',
      },
    ],
  }

  const data_sales_time = {
    labels: getDaysFromTodayLocalized(lenguage),
    datasets: [
      {
        label: 'Sales/Visits',
        data: sales_time,
        fill: true,
        borderColor: '#e43d30',
        backgroundColor: ' #ee762360',
      },
    ],
  }

  const Dates_today = getDates(lenguage, 0)
  const Dates_tomorrow = getDates(lenguage, 1)
  const rangeDate = getDates(lenguage, -7) + ' - ' + getDates(lenguage, -1)
  const title1 = 'Predicted Visits Today - ' + Dates_today
  const title2 = 'Weather Today'
  const title3 = 'Predicted Visits Tomorrow - ' + Dates_tomorrow
  const title4 = 'Weather Tomorrow'
  const title5 = 'Past Visits: ' + rangeDate
  const title6 = 'Past Sales'
  const title7 = 'Last Week Sales (Percentage)'
  const title8 = 'Average sales per employes'
  const title9 = 'Average sales per Visit'
  const title10 = 'Average sales per Hour Worked'

  return (
    <CRow>
      <CCol xs={12}></CCol>

      <CCol xs={8}>
        <CCard className="mb-4">
          <CCardHeader>{title1}</CCardHeader>
          <CCardBody>
            <Line data={prediction_today} />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={4}>
        <CCard className="mb-4">
          <CCardHeader>{title2}</CCardHeader>
          <CCardBody>
            <Doughnut data={data_weather_today} />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={8}>
        <CCard className="mb-4">
          <CCardHeader>{title3}</CCardHeader>
          <CCardBody>
            <Line data={prediction_tomorrow} />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={4}>
        <CCard className="mb-4">
          <CCardHeader>{title4}</CCardHeader>
          <CCardBody>
            <Doughnut data={data_weather_tomorrow} />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>{title5}</CCardHeader>
          <CCardBody>
            <Line data={visits_historical} />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={8}>
        <CCard className="mb-4">
          <CCardHeader>{title6}</CCardHeader>
          <CCardBody>
            <Line data={weekSales} />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={4}>
        <CCard className="mb-4">
          <CCardHeader>{title7}</CCardHeader>
          <CCardBody>
            <Doughnut data={percentageSalesLastWeek} />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>{title8}</CCardHeader>
          <CCardBody>
            <Line data={data_sales_employes} />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>{title9}</CCardHeader>
          <CCardBody>
            <Line data={data_sales_visits} />
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>{title10}</CCardHeader>
          <CCardBody>
            <Line data={data_sales_time} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Charts
