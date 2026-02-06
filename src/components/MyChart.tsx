import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ChartComponents"; // caminho relativo para o ChartComponents

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/* =========================
   DADOS DE EXEMPLO
========================= */
const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 200 },
];

const config = {
  value: { label: "Vendas" }, // Configuração para tooltip e legend
};

/* =========================
   COMPONENTE
========================= */
export default function MyChart() {
  return (
    <ChartContainer config={config} className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          
          {/* Tooltip customizado usando ChartTooltipContent */}
          <ChartTooltip
            content={(props) => <ChartTooltipContent {...props} hideLabel={false} />}
          />

          {/* Legend customizado usando ChartLegendContent */}
          <ChartLegend
            content={(props) => <ChartLegendContent {...props} />}
          />

          {/* Linha do gráfico */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
