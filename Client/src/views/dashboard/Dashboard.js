import React from 'react';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react';
import Charts from '../charts/Charts';  // Import Charts component

const Dashboard = () => {
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardBody className="text-center">
              <h1>Dashboard Overview</h1>
              <p>
                Welcome to Netmx´s data visualization tool. Here you can explore youtbusiness performance through dynamic charts. Here, you can visualize sales trends, employee activity, and other key metrics that drive decision-making.
              </p>
              <p>
                This dashboard provides insights into different aspects of the business, helping you stay informed and make data-driven decisions. Dive into the graphs below to better understand how various factors contribute to overall success.
              </p>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Render the Charts component here */}
        <CCol xs={12}>
          <Charts />
        </CCol>
      </CRow>
    </div>
  );
};

export default Dashboard;

