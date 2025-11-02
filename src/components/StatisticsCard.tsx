
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export type StatisticsCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
};

function StatisticsCard({ icon, title, value }: StatisticsCardProps) {

    return (
        <Card key={title} className="w-60 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
  );
}
export default StatisticsCard;