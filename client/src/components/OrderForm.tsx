import { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Order, OrderFormData } from "@/types/order";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order;
  onSuccess: () => void;
}

export default function OrderForm({ isOpen, onClose, order, onSuccess }: OrderFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    orderId: "",
    status: "",
    customerName: "",
    phoneNumber: "",
    pickupStart: "",
    pickupEnd: "",
    dispatchDay: "",
    bookingDate: "",
    brokerFee: 0,
    totalPrice: 0,
  });

  // Update form data when order prop changes
  useEffect(() => {
    if (order) {
      setFormData({
        orderId: order.orderId || "",
        status: order.status || "",
        customerName: order.customerName || "",
        phoneNumber: order.phoneNumber || "",
        pickupStart: order.pickupStart || "",
        pickupEnd: order.pickupEnd || "",
        dispatchDay: order.dispatchDay || "",
        bookingDate: order.bookingDate || "",
        brokerFee: order.brokerFee || 0,
        totalPrice: order.totalPrice || 0,
      });
    } else {
      // Reset form for new order
      setFormData({
        orderId: "",
        status: "",
        customerName: "",
        phoneNumber: "",
        pickupStart: "",
        pickupEnd: "",
        dispatchDay: "",
        bookingDate: "",
        brokerFee: 0,
        totalPrice: 0,
      });
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (order) {
        // Update existing order
        await updateDoc(doc(db, "orders", order.id), {
          ...formData,
          brokerFee: Number(formData.brokerFee),
          totalPrice: Number(formData.totalPrice),
        });
        toast({
          title: "Success",
          description: "Order updated successfully!",
        });
      } else {
        // Create new order
        await addDoc(collection(db, "orders"), {
          ...formData,
          brokerFee: Number(formData.brokerFee),
          totalPrice: Number(formData.totalPrice),
          userId: user.uid,
          userEmail: user.email,
          createdAt: new Date().toISOString().split('T')[0],
        });
        toast({
          title: "Success",
          description: "Order created successfully!",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof OrderFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl" aria-describedby="order-form-description">
        <DialogHeader>
          <DialogTitle>
            {order ? "Edit Order" : "Add New Order"}
          </DialogTitle>
          <div id="order-form-description" className="sr-only">
            {order ? "Edit the details of an existing order" : "Create a new auto transport order"}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="status">Order Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Posted">Posted</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Dispatched">Dispatched</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                value={formData.orderId}
                onChange={(e) => handleInputChange("orderId", e.target.value)}
                placeholder="ORD-2024-001"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                placeholder="John Doe"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="(555) 123-4567"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="pickupStart">Pickup Start</Label>
              <Input
                id="pickupStart"
                type="date"
                value={formData.pickupStart}
                onChange={(e) => handleInputChange("pickupStart", e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="pickupEnd">Pickup End</Label>
              <Input
                id="pickupEnd"
                type="date"
                value={formData.pickupEnd}
                onChange={(e) => handleInputChange("pickupEnd", e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="dispatchDay">Dispatch Day</Label>
              <Input
                id="dispatchDay"
                type="date"
                value={formData.dispatchDay}
                onChange={(e) => handleInputChange("dispatchDay", e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="bookingDate">Booking Date</Label>
              <Input
                id="bookingDate"
                type="date"
                value={formData.bookingDate}
                onChange={(e) => handleInputChange("bookingDate", e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="brokerFee">Broker Fee</Label>
              <Input
                id="brokerFee"
                type="number"
                step="0.01"
                value={formData.brokerFee}
                onChange={(e) => handleInputChange("brokerFee", Number(e.target.value))}
                placeholder="0.00"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="totalPrice">Total Price</Label>
              <Input
                id="totalPrice"
                type="number"
                step="0.01"
                value={formData.totalPrice}
                onChange={(e) => handleInputChange("totalPrice", Number(e.target.value))}
                placeholder="0.00"
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Order"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
