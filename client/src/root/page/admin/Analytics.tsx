import AnalyticsSkeleton from '@/utils/skeleton/AnalyticsSkeleton';
import { useGetAnalyticsDetails } from '../../../query/seller.queries';
import { BsThreeDots } from 'react-icons/bs';
import { PieChart, Pie, Cell } from 'recharts';
import { BarChart,ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Rectangle } from 'recharts';
import Meta from '@/utils/Meta';

const CategoryChart = ({topSellingCategory} : any) => {
const COLORS = ['#1e293b', '#475569', '#94a3b8', '#e2e8f0'];
    return (
      <>
       <div className="flex items-center justify-center mt-3">
       <PieChart className='bg-white' width={210} height={180}>
        <Pie
          data={topSellingCategory}
          cx={100}
          cy={80}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {topSellingCategory.map((_ : any, index :number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
        </div>
    <div className='w-full  px-2'>
    <ul className='flex items-center justify-between flex-col w-full'>
      {
        topSellingCategory.map((category :any,index : number) => (
          <li key={index} className='flex items-center  p-1  w-full justify-between'>{category.name} <span className='text-slate-100 bg-slate-800 rounded-xl p-1 text-sm font-bold'>{category.value}</span></li>
        ))
      }
    </ul>
    </div>
      </>
    );
}

const RevenueMarginChart = ({revenueMargin} : any) => {
  return (
    <div className="w-full lg:w-[72%] m-3 rounded-md p-4 bg-white -black">
      <h1 className='text-2xl text-center text-green-600'>Revenue & Margin Progress (2024)</h1>
      <ResponsiveContainer width="100%" height={330}>
        <BarChart
          data={revenueMargin}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {/* Bar for Revenue */}
          <Bar dataKey="revenue" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          {/* Bar for Margin */}
          <Bar dataKey="margin" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const WeeklyProgressChart = ({lastWeekOrders} : any) => {
  return (
    <div className="w-full lg:w-[45%] p-4 bg-white">
      <h1 className='text-2xl text-center text-green-600'>Your Weekly Progress</h1>
      <ResponsiveContainer width="100%" height={190}>
        <ComposedChart
          data={lastWeekOrders}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="orders" barSize={20} fill="#413ea0" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

const PaymentChart = ({paymentChart}: any) => {
  const COLORS = ['#4caf50', '#ff9800', '#f44336', '#2196f3'];
  return (
    <div className="w-full   flex items-center justify-center flex-col lg:w-[45%] h-fit bg-white p-4 rounded-md shadow-lg">
      <h1 className="text-center text-xl  font-semibold">Payment Methods</h1>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={paymentChart}
            cx="50%"
            cy="45%"
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
              const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
              return (
                <text
                  x={x}
                  y={y}
                  fill="black"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {paymentChart.map((_ : any, index : number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};


const ProductRatingChart = ({ selledProductRatings }: any) => {
  const averageRating = selledProductRatings.reduce((accumulator: any, currentValue: any) => {
    return accumulator + currentValue.name * currentValue.value;
  }, 0) / selledProductRatings.reduce((accumulator: any, currentValue: any) => {
    return accumulator + currentValue.value;
  }, 0);

  const RADIAN = Math.PI / 180;
  const cx = 100;
  const cy = 100;
  const iR = 50;
  const oR = 100;

  const renderNeedle = ({ averageRating, cx, cy, iR, oR, color }: any) => {
    const minRating = 1;
    const maxRating = 5;

    // Normalize the average rating and calculate angle
    const normalizedRating = Math.min(Math.max(averageRating, minRating), maxRating);
    const angle = 180 - ((normalizedRating - minRating) / (maxRating - minRating)) * 180;

    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(RADIAN * angle);
    const cos = Math.cos(RADIAN * angle);
    const r = 5;

    const x0 = cx;
    const y0 = cy;

    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 - length * sin;

    return (
      <>
        <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />
        <path d={`M${xba},${yba} L${xbb},${ybb} L${xp},${yp} Z`} fill={color} />
      </>
    );
  };

  return (
    <div className="flex flex-col max-w-[300px] items-center justify-center bg-white w-full lg:w-[45%] m-3 p-4">
      <h1 className="pb-2 text-xl flex flex-col">
        Your Products Ratings: <span className="text-center">{averageRating.toFixed(2)}</span>
      </h1>
      <PieChart width={220} height={120}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={selledProductRatings}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
        >
          {selledProductRatings.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <svg x={0} y={0} width={220} height={220}>
          {renderNeedle({ averageRating, cx, cy, iR, oR, color: '#d0d000' })}
        </svg>
      </PieChart>
    </div>
  );
};

const Analytics = () => {
  const {data : analyticsData,isLoading,isFetched} = useGetAnalyticsDetails();
  if(isLoading || !isFetched){
    return (
      <>
          <Meta
    title="Analytics - Seller Section | Sara-Ecommerce"
    description="Gain insights into your sales performance with detailed analytics in the Seller Section of Sara-Ecommerce. Track top-selling categories, revenue margins, weekly progress, payment methods, and product ratings."
    keywords="Analytics, Seller Section, Sales Performance, Top Selling Categories, Revenue Margins, Weekly Progress, Payment Methods, Product Ratings, Sara-Ecommerce, Seller Dashboard"
   />
    <AnalyticsSkeleton/>
      </>
  )
  }
  
  return (
  <>
    <Meta
    title="Analytics - Seller Section | Sara-Ecommerce"
    description="Gain insights into your sales performance with detailed analytics in the Seller Section of Sara-Ecommerce. Track top-selling categories, revenue margins, weekly progress, payment methods, and product ratings."
    keywords="Analytics, Seller Section, Sales Performance, Top Selling Categories, Revenue Margins, Weekly Progress, Payment Methods, Product Ratings, Sara-Ecommerce, Seller Dashboard"
   />
   <div className="flex flex-col w-full  items-center justify-around lg:flex-row lg:flex-wrap">
    <div className="recent-orders-chart  -black m-3 w-full max-w-[300px] lg:w-[25%] h-fit overfl  flex-1 bg-white rounded-lg shadow-md sm:p-5">
   <div className=" flex items-center justify-between mb-0 p-2">
   {/* recent orders category  */}
    <h1 className="sm:text-xl text-lg font-semibold">Top Selling Category</h1>
    <BsThreeDots />
   </div>
  <CategoryChart topSellingCategory={analyticsData.topSellingCategory}/>
  </div>
    <RevenueMarginChart revenueMargin={analyticsData.revenueMargin} />
   <WeeklyProgressChart lastWeekOrders={analyticsData.lastWeekOrders}/>
    <div className='flex flex-col items-center justify-around sm:flex-row w-full lg:w-[50%] '>
    <PaymentChart paymentChart={analyticsData.paymentChart}/>
    
    <ProductRatingChart selledProductRatings={analyticsData.selledProductRatings}/>
    </div>
   </div>
   </>
  );
};

export default Analytics;
