import { useNavigate } from '@tanstack/react-router'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

function TileCard({ to, icon, title, desc }: {to:string; icon:React.ReactNode; title:string; desc:string}) {
  const navigate = useNavigate();

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => navigate({ to })}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate({ to })}
      className="hover:shadow-md transition-shadow cursor-pointer h-full"
      aria-label={title}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
    </Card>
  );
}
export default TileCard;