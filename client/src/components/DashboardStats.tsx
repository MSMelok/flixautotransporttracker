import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Target, DollarSign, Info, Package, Clock, TrendingUp, Truck, CheckCircle, XCircle } from "lucide-react";
import { DashboardStats, TargetProgress, SalaryCalculation } from "@/types/order";

interface DashboardStatsProps {
  stats: DashboardStats;
  targetProgress: TargetProgress;
  salaryCalculation: SalaryCalculation;
}

export default function DashboardStatsComponent({ stats, targetProgress, salaryCalculation }: DashboardStatsProps) {
  return (
    <div className="space-y-6">
      {/* Status Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Posted */}
        <Card className="shadow-lg border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4 text-center">
            <div className="bg-blue-100 p-2 rounded-lg w-fit mx-auto mb-2">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.postedCount}</div>
            <div className="text-xs font-medium text-gray-600">Posted</div>
          </CardContent>
        </Card>

        {/* On Hold */}
        <Card className="shadow-lg border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4 text-center">
            <div className="bg-gray-100 p-2 rounded-lg w-fit mx-auto mb-2">
              <Clock className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-600 mb-1">{stats.onHoldCount}</div>
            <div className="text-xs font-medium text-gray-600">On Hold</div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="shadow-lg border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4 text-center">
            <div className="bg-orange-100 p-2 rounded-lg w-fit mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-1">{stats.inProgressCount}</div>
            <div className="text-xs font-medium text-gray-600">In Progress</div>
          </CardContent>
        </Card>

        {/* Dispatched */}
        <Card className="shadow-lg border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4 text-center">
            <div className="bg-purple-100 p-2 rounded-lg w-fit mx-auto mb-2">
              <Truck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">{stats.dispatchedCount}</div>
            <div className="text-xs font-medium text-gray-600">Dispatched</div>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card className="shadow-lg border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4 text-center">
            <div className="bg-green-100 p-2 rounded-lg w-fit mx-auto mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.completedCount}</div>
            <div className="text-xs font-medium text-gray-600">Completed</div>
          </CardContent>
        </Card>

        {/* Canceled */}
        <Card className="shadow-lg border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4 text-center">
            <div className="bg-red-100 p-2 rounded-lg w-fit mx-auto mb-2">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600 mb-1">{stats.canceledCount}</div>
            <div className="text-xs font-medium text-gray-600">Canceled</div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Orders Summary */}
        <Card className="shadow-lg border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Orders</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <ClipboardList className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{stats.totalCount}</div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Cancellation Rate:</span>{" "}
              <span className="font-bold text-red-600">{stats.cancellationRate.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Target Progress */}
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

        {/* Salary Calculation */}
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
    </div>
  );
}