import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Target, DollarSign, Info } from "lucide-react";
import { DashboardStats, TargetProgress, SalaryCalculation } from "@/types/order";

interface DashboardStatsProps {
  stats: DashboardStats;
  targetProgress: TargetProgress;
  salaryCalculation: SalaryCalculation;
}

export default function DashboardStatsComponent({ stats, targetProgress, salaryCalculation }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Section A: Orders Overview */}
      <Card className="shadow-lg border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Orders Overview</h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Posted</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {stats.postedCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                {stats.inProgressCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                {stats.completedCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Canceled</span>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                {stats.canceledCount}
              </span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Cancellation Rate</span>
                <span className="text-sm font-bold text-red-600">{stats.cancellationRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section B: Target Progress */}
      <Card className="shadow-lg border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Target Progress</h3>
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">${targetProgress.brokerFeeSum.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Broker Fees</div>
            </div>
            
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(targetProgress.percentageComplete, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Target: $2,300</span>
              <span className="text-sm font-medium text-indigo-600">
                ${targetProgress.remaining.toFixed(2)} remaining
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section C: Salary Calculation */}
      <Card className="shadow-lg border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Salary Calculation</h3>
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-gray-900">${salaryCalculation.amount.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Current Period Salary</div>
            </div>
            
            <div className={`p-3 rounded-lg ${salaryCalculation.targetAchieved ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className="flex items-center space-x-2">
                <Info className={`w-4 h-4 ${salaryCalculation.targetAchieved ? 'text-green-600' : 'text-yellow-600'}`} />
                <span className={`text-sm font-medium ${salaryCalculation.targetAchieved ? 'text-green-800' : 'text-yellow-800'}`}>
                  {salaryCalculation.targetAchieved ? 'Target Achieved' : 'Below Target'}
                </span>
              </div>
              <div className={`text-xs mt-1 ${salaryCalculation.targetAchieved ? 'text-green-700' : 'text-yellow-700'}`}>
                {salaryCalculation.calculation}
              </div>
            </div>
            
            {!salaryCalculation.targetAchieved && (
              <div className="text-xs text-gray-500">
                Target achieved: 10% commission + $250 base
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
