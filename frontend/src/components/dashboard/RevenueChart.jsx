// components/dashboard/RevenueChart.jsx - Responsive
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const RevenueChart = ({ data = [] }) => {
  return (
    <div className="card card-glass rounded-3xl p-4 sm:p-6 h-full bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Revenue Trend
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
            Last 6 months • Monthly revenue
          </p>
        </div>
        
        {data.length > 0 && (
          <div className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
            ↑ Trending
          </div>
        )}
      </div>

      {/* ✅ Responsive height */}
      <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[380px] -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#334155" 
              vertical={false}
            />

            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              tickLine={{ stroke: '#475569' }}
              axisLine={{ stroke: '#475569' }}
            />

            <YAxis 
              stroke="#9CA3AF"
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              tickLine={{ stroke: '#475569' }}
              axisLine={{ stroke: '#475569' }}
              width={50}
            />

            <Tooltip 
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "1px solid #475569",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                padding: "8px 12px",
              }}
              labelStyle={{ color: "#E2E8F0", fontWeight: 600, fontSize: 12 }}
              formatter={(value) => [
                `₹${Number(value).toLocaleString()}`,
                "Revenue"
              ]}
              cursor={{ stroke: '#3B82F6', strokeWidth: 2, strokeOpacity: 0.4 }}
            />

            <Line
              type="natural"
              dataKey="revenue"
              stroke="#60A5FA"
              strokeWidth={3}
              dot={{ 
                fill: "#3B82F6", 
                stroke: "#1E293B", 
                strokeWidth: 2, 
                r: 4 
              }}
              activeDot={{ 
                r: 6, 
                fill: "#60A5FA", 
                stroke: "#fff", 
                strokeWidth: 2 
              }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;