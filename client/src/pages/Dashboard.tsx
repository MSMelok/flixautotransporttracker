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

  // Filter orders based on date range
  const getFilteredOrders = () => {
    if (!startDate || !endDate) {
      return orders;
    }
    
    return orders.filter(order => {
      const orderDate = order.dispatchDay;
      if (!orderDate) return false;
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const calculateDashboardStats = (): DashboardStats => {
    const filteredOrders = getFilteredOrders();
    const postedCount = filteredOrders.filter(o => o.status === "Posted").length;
    const onHoldCount = filteredOrders.filter(o => o.status === "On Hold").length;
    const inProgressCount = filteredOrders.filter(o => o.status === "In Progress").length;
    const dispatchedCount = filteredOrders.filter(o => o.status === "Dispatched").length;
    const completedCount = filteredOrders.filter(o => o.status === "Completed").length;
    const canceledCount = filteredOrders.filter(o => o.status === "Canceled").length;
    const totalCount = filteredOrders.length;
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
    const filteredOrders = getFilteredOrders().filter(order => {
      // Filter by status - only completed and dispatched orders count towards target
      return order.status === "Completed" || order.status === "Dispatched";
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Flix AT Tracker</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Professional Order Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-32">{user?.email}</p>
                  <p className="text-xs text-gray-500">{isAdmin ? "Administrator" : "User"}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-2 sm:px-4"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            {isAdmin && (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-users">All Users</SelectItem>
                  {/* Show all unique users from all orders, not just filtered ones */}
                  {Array.from(new Set(orders.map(order => order.userId))).map(userId => {
                    const userEmail = orders.find(order => order.userId === userId)?.userEmail || 
                                    (userId === user?.uid ? user?.email : null) || 
                                    `User-${userId.slice(0, 8)}`;
                    return (
                      <SelectItem key={userId} value={userId}>
                        {userEmail}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
            
            <Button
              onClick={() => setIsOrderFormOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Order</span>
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable
          orders={getFilteredOrders()}
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
