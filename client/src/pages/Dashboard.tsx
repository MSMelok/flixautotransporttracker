import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Order, DashboardStats, TargetProgress, SalaryCalculation } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, User, LogOut, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OrderForm from "@/components/OrderForm";
import OrdersTable from "@/components/OrdersTable";
import DashboardStatsComponent from "@/components/DashboardStats";
import DateRangeFilter from "@/components/DateRangeFilter";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>();
  const [uniqueUsers, setUniqueUsers] = useState<{id: string, email: string}[]>([]);
  // No default date filters - show all data by default
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("all-users");

  useEffect(() => {
    if (!user) return;

    let q;
    if (isAdmin && selectedUserId && selectedUserId !== "all-users") {
      q = query(
        collection(db, "orders"),
        where("userId", "==", selectedUserId),
        orderBy("createdAt", "desc")
      );
    } else if (isAdmin) {
      q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    } else {
      q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];
      const userIds = new Set<string>();
      
      snapshot.forEach((doc) => {
        const orderData = { id: doc.id, ...doc.data() } as Order;
        ordersData.push(orderData);
        userIds.add(orderData.userId);
      });
      
      setOrders(ordersData);
      
      // Extract unique users with proper email identification
      const userEmailMap = new Map<string, string>();
      
      // Build a map of userId to userEmail from order data
      ordersData.forEach(order => {
        if (order.userEmail) {
          userEmailMap.set(order.userId, order.userEmail);
        }
      });
      
      // If current user is in the list, use their email
      if (user?.uid && userIds.has(user.uid)) {
        userEmailMap.set(user.uid, user.email || 'Current User');
      }
      
      const users = Array.from(userIds).map(userId => ({
        id: userId,
        email: userEmailMap.get(userId) || `User-${userId.slice(0, 8)}`
      }));
      setUniqueUsers(users);
      
      setLoading(false);
    });

    return unsubscribe;
  }, [user, isAdmin, selectedUserId]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Success",
        description: "Successfully signed out!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsOrderFormOpen(true);
  };

  const handleCloseOrderForm = () => {
    setIsOrderFormOpen(false);
    setEditingOrder(undefined);
  };

  const handleOrderSuccess = () => {
    // Orders will be updated via the real-time listener
  };

  const calculateDashboardStats = (): DashboardStats => {
    const postedCount = orders.filter(o => o.status === "Posted").length;
    const onHoldCount = orders.filter(o => o.status === "On Hold").length;
    const inProgressCount = orders.filter(o => o.status === "In Progress").length;
    const dispatchedCount = orders.filter(o => o.status === "Dispatched").length;
    const completedCount = orders.filter(o => o.status === "Completed").length;
    const canceledCount = orders.filter(o => o.status === "Canceled").length;
    const totalCount = orders.length;
    const cancellationRate = totalCount > 0 ? (canceledCount / totalCount) * 100 : 0;

    return {
      postedCount,
      onHoldCount,
      inProgressCount,
      dispatchedCount,
      completedCount,
      canceledCount,
      totalCount,
      cancellationRate,
    };
  };

  const calculateTargetProgress = (): TargetProgress => {
    const filteredOrders = orders.filter(order => {
      // Filter by status first
      if (order.status !== "Completed" && order.status !== "Dispatched") {
        return false;
      }
      
      // If no date filter is applied, include all orders
      if (!startDate || !endDate) {
        return true;
      }
      
      // Use dispatch day for filtering when date filters are applied
      const orderDate = order.dispatchDay;
      if (!orderDate) return false;
      
      return orderDate >= startDate && orderDate <= endDate;
    });

    const brokerFeeSum = filteredOrders.reduce((sum, order) => sum + (order.brokerFee || 0), 0);
    const target = 2300;
    const remaining = Math.max(0, target - brokerFeeSum);
    const percentageComplete = (brokerFeeSum / target) * 100;

    return {
      brokerFeeSum,
      remaining,
      percentageComplete,
    };
  };

  const calculateSalary = (): SalaryCalculation => {
    const targetProgress = calculateTargetProgress();
    const brokerFeeSum = targetProgress.brokerFeeSum;
    const target = 2300;

    let amount: number;
    let calculation: string;
    let targetAchieved: boolean;

    if (brokerFeeSum >= target) {
      amount = 250 + (0.10 * brokerFeeSum);
      calculation = "10% commission + $250 base (target achieved)";
      targetAchieved = true;
    } else {
      amount = 0.20 * brokerFeeSum;
      calculation = "20% commission (under $2,300 target)";
      targetAchieved = false;
    }

    return {
      amount,
      calculation,
      targetAchieved,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const dashboardStats = calculateDashboardStats();
  const targetProgress = calculateTargetProgress();
  const salaryCalculation = calculateSalary();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Flix AT Tracker</h1>
                <p className="text-sm text-gray-500">Professional Order Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">{isAdmin ? "Administrator" : "User"}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Range Filter */}
        <div className="mb-8">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>

        {/* Dashboard Statistics */}
        <div className="mb-8">
          <DashboardStatsComponent
            stats={dashboardStats}
            targetProgress={targetProgress}
            salaryCalculation={salaryCalculation}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {isAdmin && (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-users">All Users</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Button
              onClick={() => setIsOrderFormOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Order</span>
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable
          orders={orders}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleOrderSuccess}
        />
      </main>

      {/* Order Form Modal */}
      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={handleCloseOrderForm}
        order={editingOrder}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
}
