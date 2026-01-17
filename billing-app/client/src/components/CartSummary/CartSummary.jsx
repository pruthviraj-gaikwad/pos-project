import './CartSummary.css'
import { AppContext } from '../../context/AppContext'
import { useContext, useState,useRef } from 'react'
import ReceivedPopup from '../ReceivedPopup/ReceivedPopup.jsx'
import { createRazorpayOrder, verifyPayment } from '../../service/PaymentService.js'
import toast from 'react-hot-toast'
import { createOrder, deleteOrder } from '../../service/OrderService.js'
import { AppConstants } from '../../util/constants.js'
const CartSummary = ({ customerName, mobileNumber, setCustomerName, setMobileNumber }) => {
    const { cartItems, clearCart } = useContext(AppContext);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);
    const [isPaymentDone,setIsPaymentDone] = useState(false);
    const popupRef = useRef();
    const totalAmount = cartItems.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
    );
    const tax = totalAmount * 0.18;
    const grandTotal = totalAmount + tax;
    const clearAll = () => {
        setCustomerName("");
        setMobileNumber("");
        clearCart();
    }

    const placeOrder = () => {
        if(!isPaymentDone){
            toast.error("Please do payment");
            return;
        }
        setShowPopUp(true);
        // handlePrintReceipt();
        // clearAll();
    }

 const handlePrintReceipt = () => {
        const printContent = popupRef.current;
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <div>
                    <h1 className='text-center'>DMART SUPER MARKET </h1>
                    </div>
                    <title>Order Receipt</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .no-print { display: none; }
                        .receipt-popup {
                            max-width: 600px;
                            margin: auto;
                            padding: 20px;
                            border: 1px solid #ccc;
                            border-radius: 8px;
                        }
                        .store-title {
                            text-align: center;
                            font-size: 24px;
                            font-weight: bold;
                            margin-bottom: 20px;
                        }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    if (cartItems.length === 0) {
        return null;
    }

    const loadRazopayScript = async () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        })

    }
    const completePayment = async (paymentMode) => {
        if (!customerName || !mobileNumber) {
            toast.error("Please Enter Customer Details");
            return;
        }
        if (cartItems.length === 0) {
            toast.error("Your Cart is Empty");
            return;
        }

        const orderData = {
            customerName: customerName,
            phoneNumber: mobileNumber,
            cartItems,
            tax,
            subTotal: totalAmount,
            grandTotal: grandTotal,
            paymentMethod: paymentMode.toUpperCase()
        }
        setIsProcessing(true);
        try {
            console.log(orderData);
            const response = await createOrder(orderData);
            const savedData = response.data;
            console.log("res : ",response.data);
            if (response.status === 201 && paymentMode === 'CASH') {
                toast.success("Cash Received...!!!");
                setIsPaymentDone(true);
                setOrderDetails(response.data);
            } else if (response.status == 201 && paymentMode === 'UPI') {
                const razorpayLoad = await loadRazopayScript()
                if (!razorpayLoad) {
                    toast.error("Unable to load Razorpay.");
                    console.log(savedData);
                    await deleteOrderOnFailure(savedData.orderId);
                    return;
                }

                const roundedAmount = Math.round(grandTotal*100);
                const razorpayRes = await createRazorpayOrder({ amount: roundedAmount, currency: 'INR' })
                const options = {
                    key: AppConstants.RAZORPAY_KEY_ID,
                    amount: razorpayRes.data.amount,
                    currency: razorpayRes.data.currency,
                    orderId: razorpayRes.data.id,
                    name: "GANESH MANE RETAILED SHOP.",
                    handler: async function (response) {
                        //TODO Verify Payment.
                        await verifyPaymentHandler(response, savedData);
                    },
                    prefill: {
                        name: customerName,
                        contact: mobileNumber
                    },
                    theme: {
                        color: '#3399CC'
                    },
                    modal: {
                        ondismiss: async () => {
                            deleteOrderOnFailure(savedData.orderId);
                            toast.error("Payment Cancelled.");
                        }
                    }

                }

                const rzp = new window.Razorpay(options);
                rzp.on("payment.failed", async (response) => {
                    await deleteOrderOnFailure(savedData.orderId);
                    toast.error("Payment Failed.");
                    console.error(response.error.description);
                });
                rzp.open();
            }
        } catch (error) {
            toast.error("Payment Processing Failedd")
            setIsPaymentDone(false);
        } finally {
            setIsProcessing(false)
            
        }
    }

    const verifyPaymentHandler = async (response, savedOrder) => {
        const paymentData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: savedOrder.orderId
        }
        try {
            const paymentResponse = await verifyPayment(paymentData);
            toast.success("Payment is Verified.");
            if (paymentResponse.status === 200) {
                setIsPaymentDone(true);
                setOrderDetails({
                    ...savedOrder,
                    paymentDetails: {
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                    },

                })
            } else {
                toast.error("Payment Processing Failed.");
            }
        } catch (error) {
            toast.error("Payment Failed.", {
                duration: 3000,
            });
            setIsProcessing(false)

        }
    }
    const deleteOrderOnFailure = async (orderId) => {
        try {
            const response = await deleteOrder(orderId);
            toast.success("order deleted.");
        } catch (error) {
            toast.error("Error while deleting.");
        }
    }

    return (
        <div className="mt-2">
            <div className="cart-summary-details">
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Items Price : </span>
                    <span className="text-light">{totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">
                        Tax(18%) :
                    </span>
                    <span className='text-light'>
                        &#8377;{tax.toFixed(2)}
                    </span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                    <span className="text-light">
                        Total :
                    </span>
                    <span className='text-light'>
                        &#8377;{grandTotal.toFixed(2)}
                    </span>
                </div>
            </div>
            <div className="d-flex gap-3">
                <button className="btn btn-success flex-grow-1" onClick={() => completePayment("CASH")}
                    disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "CASH"}
                </button>
                <button className="btn btn-primary flex-grow-1" onClick={() => completePayment("UPI")}
                    disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "UPI"}
                </button>
            </div>
            <div className="d-flex gap-3 mt-3">
                <button className="btn btn-warning flex-grow-1" onClick={placeOrder}
                    disabled={isProcessing}>
                    {isProcessing ? "Processing..." : " Place Order"}
                </button>
            </div>
            {
                showPopUp && (
                    <ReceivedPopup 
                        ref={popupRef}
                        orderDetails={{
                            ...orderDetails,
                            razorpayOrderId : orderDetails.paymentDetails?.razorpayOrderId,
                            razorpayPaymentId:orderDetails.paymentDetails?.razorpayPaymentId
                        }}

                        onClose={() => setShowPopUp(false)}

                        onPrint={handlePrintReceipt}
                    
                    />
                )
            }
        </div>
    )
}

export default CartSummary;