import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ProfileStats() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/profile/stats", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(({ lost, found, resolved }) => {
        // Build month-wise base structure
        const monthData = MONTHS.map((m, i) => ({
          month: m,
          lost: 0,
          found: 0,
          resolved: 0,
        }));

        lost.forEach(d => (monthData[d._id - 1].lost = d.count));
        found.forEach(d => (monthData[d._id - 1].found = d.count));
        resolved.forEach(d => (monthData[d._id - 1].resolved = d.count));

        setData(monthData);
      })
      .catch(err => console.error("Stats error:", err));
  }, []);

  if (data.length === 0) return <p>Loading activity...</p>;

  return (
    <div className="stats-graph-card">
      <h3>Monthly Activity</h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="lost"
            stroke="#ff7675"
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="found"
            stroke="#55efc4"
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="resolved"
            stroke="#74b9ff"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
