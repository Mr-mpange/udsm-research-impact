import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const hIndexData = [
  { year: '2018', hIndex: 8, benchmark: 10 },
  { year: '2019', hIndex: 10, benchmark: 12 },
  { year: '2020', hIndex: 13, benchmark: 14 },
  { year: '2021', hIndex: 17, benchmark: 16 },
  { year: '2022', hIndex: 21, benchmark: 18 },
  { year: '2023', hIndex: 26, benchmark: 20 },
  { year: '2024', hIndex: 29, benchmark: 22 },
];

export default function HIndexChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={hIndexData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="hIndexGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--cyan))" />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="year" 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 'auto']}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Line 
          type="monotone" 
          dataKey="benchmark" 
          stroke="hsl(var(--muted-foreground))" 
          strokeWidth={1}
          strokeDasharray="5 5"
          dot={false}
          name="Field Average"
        />
        <Line 
          type="monotone" 
          dataKey="hIndex" 
          stroke="url(#hIndexGradient)" 
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
          name="Your H-Index"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
