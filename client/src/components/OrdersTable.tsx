import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/types/order";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Package, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrdersTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  onDeleteOrder: () => void;
}

export default function OrdersTable({ orders, onEditOrder, onDeleteOrder }: OrdersTableProps) {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      toast({
        title: "Success",
        description: "Order deleted successfully!",
      });
      onDeleteOrder();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Posted":
        return "bg-blue-100 text-blue-800";
      case "On Hold":
        return "bg-gray-100 text-gray-800";
      case "In Progress":
        return "bg-orange-100 text-orange-800";
      case "Dispatched":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (orders.length === 0) {
    return (
      <Card className="shadow-lg border-gray-100">
        <CardContent className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Get started by creating your first order.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card className="shadow-lg border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Financials
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
                          <div className="text-sm text-gray-500">Created: {formatDate(order.createdAt)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.userEmail ? order.userEmail.split('@')[0] : `User-${order.userId.slice(0, 8)}`}
                      </div>
                      <div className="text-sm text-gray-500">ID: {order.userId.slice(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>
                          <span className="font-medium">Pickup:</span> {formatDate(order.pickupStart)} - {formatDate(order.pickupEnd)}
                        </div>
                        <div>
                          <span className="font-medium">Dispatch:</span> {formatDate(order.dispatchDay)}
                        </div>
                        <div>
                          <span className="font-medium">Booked:</span> {formatDate(order.bookingDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>
                          <span className="font-medium">Broker:</span>{" "}
                          <span className="text-blue-600 font-semibold">${order.brokerFee.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>{" "}
                          <span className="text-gray-900 font-semibold">${order.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditOrder(order)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the order.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteOrder(order.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="shadow-lg border-gray-100 hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
                    <div className="text-xs text-gray-500">Created: {formatDate(order.createdAt)}</div>
                  </div>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-4">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Customer</div>
                  <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                  <div className="text-sm text-gray-500">{order.phoneNumber}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Created By</div>
                  <div className="text-sm font-medium text-gray-900">
                    {order.userEmail ? order.userEmail.split('@')[0] : `User-${order.userId.slice(0, 8)}`}
                  </div>
                  <div className="text-sm text-gray-500">ID: {order.userId.slice(0, 8)}...</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Dates</div>
                  <div className="text-sm text-gray-900 space-y-1">
                    <div><span className="font-medium">Pickup:</span> {formatDate(order.pickupStart)} - {formatDate(order.pickupEnd)}</div>
                    <div><span className="font-medium">Dispatch:</span> {formatDate(order.dispatchDay)}</div>
                    <div><span className="font-medium">Booked:</span> {formatDate(order.bookingDate)}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Financials</div>
                  <div className="text-sm text-gray-900 space-y-1">
                    <div>
                      <span className="font-medium">Broker:</span>{" "}
                      <span className="text-blue-600 font-semibold">${order.brokerFee.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Total:</span>{" "}
                      <span className="text-gray-900 font-semibold">${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditOrder(order)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the order.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteOrder(order.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}