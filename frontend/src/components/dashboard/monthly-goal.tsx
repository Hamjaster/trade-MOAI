import { Progress } from "@/components/ui/progress";

export function MonthlyGoal() {
  const currentValue = 6200000;
  const goalValue = 8100000;
  const percentage = (currentValue / goalValue) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Monthly Goal</h2>
      <div className="text-3xl font-bold mb-2">
        ${(currentValue / 1000000).toFixed(1)}M
      </div>
      <Progress value={percentage} className="mb-2" />
      <div className="text-sm text-gray-500">
        Goal ${(goalValue / 1000000).toFixed(1)}M
      </div>
    </div>
  );
}
