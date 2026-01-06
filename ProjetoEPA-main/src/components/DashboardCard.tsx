import { Card } from './ui/card';
import { Button } from './ui/button';

interface DashboardCardButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface DashboardCardProps {
  title: string;
  buttons: DashboardCardButton[];
}

export function DashboardCard({ title, buttons }: DashboardCardProps) {
  return (
    <Card className="border-2 border-[#000000] rounded-xl sm:rounded-2xl bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Título */}
        <h3 className="text-[#000000] text-base sm:text-lg">{title}</h3>

        {/* Botões */}
        <div className="space-y-2 sm:space-y-3">
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              className={`w-full border-2 border-[#000000] rounded-lg py-2.5 sm:py-3 text-sm sm:text-base transition-colors ${
                button.variant === 'primary'
                  ? 'bg-[#00DC30] hover:bg-[#00920C] text-[#000000] hover:text-white'
                  : 'bg-white hover:bg-[#EDFEE8] text-[#000000]'
              }`}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
