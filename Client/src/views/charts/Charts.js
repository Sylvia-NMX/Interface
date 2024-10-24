import React from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'


const Charts = () => {
  const random = () => Math.round(Math.random() * 100)

  return (
    <CRow>
      <CCol xs={12}>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Monthly Sales</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Number of sales',
                    backgroundColor: '#f87979',
                    data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                  },
                ],
              }}
              labels="months"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Monlthly Predictions</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Predictions',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()],
                  },
                  {
                    label: 'Actual values',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Employees per month</CCardHeader>
          <CCardBody>
            <CChartDoughnut
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    backgroundColor: ['#E0BBE4', '#D291BC', '#957DAD', '#685E9A', '#5E548E', '#4A3C73', '#3A2C61'],
                    data: [8, 3, 8, 4, 6, 2, 3],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Weekly sales</CCardHeader>
          <CCardBody>
            <CChartPie
              data={{
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                datasets: [
                  {
                    data: [18, 10, 15, 25, 30],
                    backgroundColor: ['#B3E5FC', '#81D4FA', '#4FC3F7', '#039BE5', '#0288D1'],
                    hoverBackgroundColor: ['#FFCE56', '#FFCE56', '#FFCE56', '#FFCE56', '#FFCE56'],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Events by category</CCardHeader>
          <CCardBody>
            <CChartPolarArea
              data={{
                labels: [
                  'Music',
                  'Family',
                  'Sports',
                  'Holiday',
                  'Religious',
                  'Ecological',
                  'Other',
                ],
                datasets: [
                  {
                    data: [3, 8, 4, 1, 6, 2, 2],
                    backgroundColor: ['#FFE0B2', '#FFCC80', '#FFB74D', '#FF9800', '#FB8C00', '#F57C00', '#EF6C00'],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Future events by category</CCardHeader>
          <CCardBody>
            <CChartRadar
              data={{
                labels: [
                  'Music',
                  'Family',
                  'Sports',
                  'Holiday',
                  'Religious',
                  'Ecological',
                  'Other',
                ],
                datasets: [
                  {
                    label: 'Events',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151, 187, 205, 1)',
                    data: [3, 2, 4, 1, 6, 2, 8],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Charts
