import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Area, Tooltip } from 'recharts';
import { BsThreeDots } from "react-icons/bs";


interface YearReportProps {
  yearReport: { name: string; value: number }[];
}

const YearReport = ({ yearReport }: YearReportProps) => {
    const handleResize = () => {
        let screenWidth = window.innerWidth;
        let chartHeight = 300; 
    
        if (screenWidth > 640 && screenWidth < 1024) {
          screenWidth = screenWidth * 65 / 100;
          chartHeight = 350;
        } else if (screenWidth >= 1024) {
          screenWidth = (screenWidth - (screenWidth * 20 / 100)) / 2;
          chartHeight = 400;
        }
    
        return { chartWidth: screenWidth - 40, chartHeight };
      };
    const [{ chartWidth, chartHeight }, setChartSize] = useState(handleResize());
  
    useEffect(() => {
      const resizeListener = () => {
        setChartSize(handleResize());
      };
      window.addEventListener('resize', resizeListener);
      return () => {
        window.removeEventListener('resize', resizeListener);
      };
    }, []);
  return (
    <div className="recent-orders-chart  flex-1 bg-white rounded-lg shadow-md sm:p-5">
    <div className=" flex items-center justify-between mb-0 p-2">
      <h1 className="sm:text-xl text-lg font-semibold">Recent Orders</h1>
      <BsThreeDots />
    </div>
    <div className="flex items-center justify-center w-full h-full">
      <LineChart width={chartWidth} height={chartHeight} data={yearReport}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="value" stroke="#003366" fill="#e0f0ff" />
    <Line type="monotone" dataKey="value" stroke="#003366" strokeWidth={3} />
  </LineChart>
      </div>
  </div>
  )
}

export default YearReport
