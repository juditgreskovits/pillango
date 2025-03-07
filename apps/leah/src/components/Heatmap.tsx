import { format } from 'date-fns';
import { ResponsiveCalendar } from '@nivo/calendar';

interface HeatmapProps {
  dates: string[];
}

interface DateStats {
  counts: Record<string, number>;
  startDate: Date | null;
  endDate: Date | null;
}

interface CalendarDatum {
  day: string;
  value: number;
}

export function Heatmap({ dates }: HeatmapProps) {
  // Aggregate dates and count occurrences per day, while tracking min/max dates
  const { counts, startDate, endDate } = dates.reduce(
    (acc, dateStr) => {
      // Convert to date and strip time
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);

      // Use ISO date string as key for consistent comparison
      const dateKey = date.toISOString().split('T')[0];

      // Update min/max dates
      if (!acc.startDate || date < acc.startDate) {
        acc.startDate = date;
      }
      if (!acc.endDate || date > acc.endDate) {
        acc.endDate = date;
      }

      // Increment count for this date
      acc.counts[dateKey] = (acc.counts[dateKey] || 0) + 1;

      return acc;
    },
    { counts: {}, startDate: null, endDate: null } as DateStats
  );

  // Transform into format expected by Nivo calendar
  const data: CalendarDatum[] = Object.entries(counts).map(([date, value]) => ({
    day: format(new Date(date), 'yyyy-MM-dd'),
    value,
  }));

  // If no dates, use current year as default range
  const displayStartDate =
    startDate || new Date(new Date().getFullYear(), 0, 1);
  const displayEndDate = endDate || new Date(new Date().getFullYear(), 11, 31);

  console.log('*** displayStartDate = ', displayStartDate);
  console.log('*** displayEndDate = ', displayEndDate);

  console.log('*** data = ', data);

  return (
    <div className="heatmap-container">
      <ResponsiveCalendar
        data={data}
        from={displayStartDate}
        to={displayEndDate}
        emptyColor="#ebedf0"
        colors={['#9be9a8', '#40c463', '#30a14e', '#216e39']}
        minValue={0}
        maxValue={4}
        margin={{ top: 40, right: 40, bottom: 50, left: 40 }}
        yearSpacing={40}
        monthBorderColor="#ffffff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        /* tooltip={({ day, value }: TooltipProps) => (
          <div className="bg-white p-2 shadow-lg rounded border">
            <strong>{new Date(day).toLocaleDateString()}</strong>
            <br />
            {value
              ? `${value} headache${value > 1 ? 's' : ''} recorded`
              : 'No headache recorded'}
          </div>
        )}*/
      />
    </div>
  );
}
