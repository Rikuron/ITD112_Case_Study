import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import AgeCharts from '../components/charts/ageCharts'
import CivilStatusCharts from '../components/charts/civilStatusCharts'
import DestinationCharts from '../components/charts/destinationCharts'
import EducationCharts from '../components/charts/educationCharts'
import OccupationCharts from '../components/charts/occupationCharts'
import SexCharts from '../components/charts/sexCharts'
import OriginCharts from '../components/charts/originCharts'
import ChartTabs from '../components/chartTabs'
import type { ChartKey } from '../components/chartTabs'

export const Route = createFileRoute('/')({
  component: Index,
})

const chartComponents = {
  age: <AgeCharts />,
  civil_status: <CivilStatusCharts />,
  destination: <DestinationCharts />,
  education: <EducationCharts />,
  occupation: <OccupationCharts />,
  sex: <SexCharts />,
  origin: <OriginCharts />,
}

function Index() {
  const [selectedChart, setSelectedChart] = useState<ChartKey>('age')

  return (
    <div className="p-6 bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Tabs Navigation */}
        <ChartTabs
          selectedChart={selectedChart}
          onChartChange={setSelectedChart}
          chartKeys={Object.keys(chartComponents) as ChartKey[]}
        />

        {/* Tab Content */}
        <div role="tabpanel" className="mt-4">
          {chartComponents[selectedChart]}
        </div>
      </div>
    </div>
  );
}