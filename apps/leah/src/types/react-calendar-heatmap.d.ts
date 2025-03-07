declare module 'react-calendar-heatmap' {
  interface Value {
    date: Date;
    count: number;
  }

  interface Props {
    startDate: Date;
    endDate: Date;
    values: Value[];
    classForValue?: (value: Value | null) => string;
    tooltipDataAttrs?: (value: Value | null) => Record<string, string>;
  }

  const ReactCalendarHeatmap: React.FC<Props>;
  export default ReactCalendarHeatmap;
}
