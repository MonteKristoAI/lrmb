import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { time: 0, delta9: 0, hydroxy: 0 },
  { time: 15, delta9: 18, hydroxy: 1.2 },
  { time: 30, delta9: 27, hydroxy: 1.5 },
  { time: 45, delta9: 23, hydroxy: 1.3 },
  { time: 60, delta9: 16, hydroxy: 1.2 },
  { time: 75, delta9: 15, hydroxy: 1.0 },
  { time: 90, delta9: 14, hydroxy: 1.0 },
  { time: 120, delta9: 14, hydroxy: 0.8 },
  { time: 150, delta9: 8, hydroxy: 0.7 },
  { time: 180, delta9: 6, hydroxy: 0.5 },
  { time: 210, delta9: 5, hydroxy: 0.4 },
  { time: 240, delta9: 3, hydroxy: 0.3 },
];

const PKChart = () => (
  <div>
    <h3 className="text-center text-sm font-bold text-foreground mb-6">
      Delta-9-THC vs. 11-Hydroxy-THC in TiME INFUSION Gummy
    </h3>
    <ResponsiveContainer width="100%" height={340}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="time"
          label={{ value: "Minutes After Administration", position: "insideBottom", offset: -12, style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          stroke="hsl(var(--border))"
        />
        <YAxis
          label={{ value: "Mean Plasma Concentration (ng/mL)", angle: -90, position: "insideLeft", offset: 4, style: { fontSize: 11, fill: "hsl(var(--muted-foreground))", textAnchor: "middle" } }}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          stroke="hsl(var(--border))"
          domain={[0, 30]}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
          labelFormatter={(v) => `${v} min`}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Line type="monotone" dataKey="delta9" name="Delta-9-THC" stroke="#E53E6B" strokeWidth={2.5} dot={{ r: 4, fill: "#E53E6B" }} />
        <Line type="monotone" dataKey="hydroxy" name="11-Hydroxy-THC" stroke="#4FC3F7" strokeWidth={2.5} dot={{ r: 4, fill: "#4FC3F7" }} />
      </LineChart>
    </ResponsiveContainer>
    <p className="text-[0.625rem] text-muted-foreground leading-relaxed mt-6">
      This study was organized and conducted by an independent contract research organization, ESEV. A preparation of a TiME INFUSION gummy was administered orally to 6 naive rats, and blood draws were done at time points over the course of 5-hours. Plasma concentrations for D-9-THC and 11-OH-THC were determined for each blood draw and plotted. Acute safety was also analyzed with no detectable issues.
    </p>
  </div>
);

export default PKChart;
