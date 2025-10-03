import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import AgeCharts from '../components/charts/ageCharts';
import CivilStatusCharts from '../components/charts/civilStatusCharts';
// import DestinationCharts from '../components/charts/DestinationCharts';
import EducationCharts from '../components/charts/educationCharts';
// import OccupationCharts from '../components/charts/OccupationCharts';
// import SexCharts from '../components/charts/SexCharts';

export const Route = createFileRoute('/')({
  component: Index,
});

const chartComponents = {
  age: <AgeCharts />,
  civil_status: <CivilStatusCharts />,
  // destination: <DestinationCharts />,
  education: <EducationCharts />,
  // occupation: <OccupationCharts />,
  // sex: <SexCharts />,
};

type ChartKey = keyof typeof chartComponents;

function Index() {
  const [selectedChart, setSelectedChart] = useState<ChartKey>('age');

  return (
    <div className="p-6 bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <select
            id="chart-selector"
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value as ChartKey)}
            className="block w-full max-w-xs p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white"
          >
            {Object.keys(chartComponents).map((key) => (
              <option key={key} value={key}>
                {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          {chartComponents[selectedChart]}
        </div>


      </div>
    </div>
  );
}