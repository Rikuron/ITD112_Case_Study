import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { addEmigrant, getEmigrants, updateEmigrant, deleteEmigrant } from '../services/emigrantsService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import '../styles.css'
import { FaEdit, FaTrash } from 'react-icons/fa'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [emigrants, setEmigrants] = useState([]);
  const [form, setForm] = useState({
    year: "",
    single: "",
    married: "",
    widower: "",
    separated: "",
    divorced: "",
    notReported: ""
  });

  // Fetch data
  const fetchData = async () => {
    const data = await getEmigrants();
    setEmigrants(data as any);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    await addEmigrant({
      year: Number(form.year) || 0,
      single: Number(form.single) || 0,
      married: Number(form.married) || 0,
      widower: Number(form.widower) || 0,
      separated: Number(form.separated) || 0,
      divorced: Number(form.divorced) || 0,
      notReported: Number(form.notReported) || 0
    });
    setForm({ year: "", single: "", married: "", widower: "", separated: "", divorced: "", notReported: "" });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await deleteEmigrant(id);
    fetchData();
  };

  const handleUpdate = async (id: string) => {
    const newYear = prompt("Enter new year:");
    if (newYear) {
      await updateEmigrant(id, { year: Number(newYear) });
      fetchData();
    }
  };

  // Compute totals for bar chart
  const totals = emigrants.reduce((acc: any, cur: any) => {
    acc.single += cur.single as number || 0;
    acc.married += cur.married as number || 0;
    acc.widower += cur.widower as number || 0;
    acc.separated += cur.separated as number || 0;
    acc.divorced += cur.divorced as number || 0;
    acc.notReported += cur.notReported as number || 0;
    return acc;
  }, { single: 0, married: 0, widower: 0, separated: 0, divorced: 0, notReported: 0 });

  const chartData = [
    { category: "Single", count: totals.single },
    { category: "Married", count: totals.married },
    { category: "Widower", count: totals.widower },
    { category: "Separated", count: totals.separated },
    { category: "Divorced", count: totals.divorced },
    { category: "Not Reported", count: totals.notReported },
  ];

  return (
    <div className="p-5">
      <h1 className="font-bold text-2xl">Filipino Emigrants CRUD</h1>

      <div className="flex w-full justify-center gap-4">
        <div className="w-[33%] mx-auto bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Emigrant Data</h2>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Year field - give it special treatment */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                name="year"
                type="number"
                placeholder="Enter year (e.g., 2024)"
                value={form.year}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-center text-lg font-medium"
              />
            </div>
          
            {/* Marital status fields */}
            {Object.keys(form).filter(key => key !== 'year').map(key => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key === 'notReported' ? 'Not Reported' : key}
                </label>
                <input
                  name={key}
                  type="number"
                  placeholder="0"
                  value={form[key as keyof typeof form]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 hover:border-gray-400"
                />
              </div>
            ))}
          </div>
        
          <div className="flex justify-center">
            <button 
              onClick={handleAdd}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Record</span>
              </span>
            </button>
          </div>
        </div>

        <div className="w-[67%] mx-auto bg-white rounded-xl shadow-lg py-8 px-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Records</h2>
          <table className="border-2 w-full mx-auto my-4 text-center">
            <thead className="border-2">
              <tr>
                <th>Year</th>
                <th>Single</th>
                <th>Married</th>
                <th>Widower</th>
                <th>Separated</th>
                <th>Divorced</th>
                <th>Not Reported</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="border-2">
              {emigrants.map((e: any) => (
                <tr key={e.id}>
                  <td>{e.year || 0}</td>
                  <td>{e.single || 0}</td>
                  <td>{e.married || 0}</td>
                  <td>{e.widower || 0}</td>
                  <td>{e.separated || 0}</td>
                  <td>{e.divorced || 0}</td>
                  <td>{e.notReported || 0}</td>
                  <td className="flex justify-center items-center my-auto gap-2">
                    <button onClick={() => handleUpdate(e.id)}><FaEdit /></button>
                    <button onClick={() => handleDelete(e.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <h2>Total Emigrants by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} className="my-4 w-[75%] mx-auto">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}