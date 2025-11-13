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
import { useIsMobile } from '../hooks/useIsMobile'

export const Route = createFileRoute('/')({
  component: Index
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
  const isMobile = useIsMobile()

  return (
    <div className="p-6 bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Tabs Navigation */}
        {!isMobile ? (
          <ChartTabs
            selectedChart={selectedChart}
            onChartChange={setSelectedChart}
            chartKeys={Object.keys(chartComponents) as ChartKey[]}
          />
        ) : (
          /* Mobile Dropdown Navigation */
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value as ChartKey)}
            className="w-full px-4 py-3 rounded-lg border border-highlights/20 bg-secondary text-gray-300 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-highlights focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200"
          >
            <option value="age" className="bg-secondary text-gray-300">Age Distribution</option>
            <option value="civil_status" className="bg-secondary text-gray-300">Civil Status</option>
            <option value="destination" className="bg-secondary text-gray-300">Destination</option>
            <option value="education" className="bg-secondary text-gray-300">Education Level</option>
            <option value="occupation" className="bg-secondary text-gray-300">Occupation</option>
            <option value="sex" className="bg-secondary text-gray-300">Sex Distribution</option>
            <option value="origin" className="bg-secondary text-gray-300">Origin</option>
          </select>
        )}

        {/* Tab Content */}
        <div role="tabpanel" className="mt-4">
          {chartComponents[selectedChart]}
        </div>
      </div>
    </div>
  );
}