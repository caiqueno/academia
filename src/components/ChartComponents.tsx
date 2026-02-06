import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/components/ui/utils";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}

/* =========================
   CONTAINER
========================= */
export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & { config: ChartConfig; children: React.ReactNode }) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/* =========================
   STYLE
========================= */
export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, c]) => c.color || c.theme);
  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color = item.theme?.[theme as keyof typeof item.theme] || item.color;
    return color ? `  --color-${key}: ${color};` : "";
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

/* =========================
   TOOLTIP
========================= */
export const ChartTooltip = RechartsPrimitive.Tooltip;

// ⚡ Corrigido: payload como readonly
export function ChartTooltipContent({
  active,
  payload,
  className,
  hideLabel,
}: {
  active?: boolean;
  payload?: readonly any[]; // ← aqui está a mudança principal
  className?: string;
  hideLabel?: boolean;
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div className={cn("rounded-lg border bg-background px-3 py-2 text-xs shadow", className)}>
      {!hideLabel && <div className="mb-1 font-medium">{payload[0]?.name}</div>}

      {payload.map((item, index) => {
        const itemConfig = config[item.dataKey as string];

        return (
          <div key={`${item.dataKey}-${index}`} className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
            {item.value !== undefined && <span className="font-mono">{item.value.toLocaleString()}</span>}
          </div>
        );
      })}
    </div>
  );
}

/* =========================
   LEGEND
========================= */
/* =========================
   LEGEND
========================= */
export const ChartLegend = RechartsPrimitive.Legend;

export type ChartLegendContentProps = {
  payload?: readonly RechartsPrimitive.LegendPayload[]; // ⚡ readonly corrigido
  className?: string;
};

export function ChartLegendContent({ payload, className }: ChartLegendContentProps) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div className={cn("flex gap-4", className)}>
      {payload.map((item) => {
        const itemConfig = config[item.dataKey as string];

        return (
          <div key={String(item.value)} className="flex items-center gap-2">
            {itemConfig?.icon ? (
              <itemConfig.icon className="h-3 w-3" />
            ) : (
              <span className="h-2 w-2 rounded" style={{ backgroundColor: item.color }} />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

