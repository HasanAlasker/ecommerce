import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../constants/baseUrl";
import Card from "../components/Card";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { token, user } = useAuth();
  const { cart, loading, clearCart, checkout } = useCart();

  const handleCheckout = async () => {
    const result = await checkout(user._id);
    
    if (result.success) {
      alert("Order placed successfully!");
    } else {
      // Show detailed out of stock message
      if (result.outOfStockItems && result.outOfStockItems.length > 0) {
        const itemsList = result.outOfStockItems
          .map(item => {
            if (item.available !== undefined) {
              return `${item.name}: Only ${item.available} left (you requested ${item.requested})`;
            }
            return `${item.name}: ${item.reason}`;
          })
          .join('\n');
        
        alert(`${result.message}\n\n${itemsList}`);
      } else {
        alert(result.message || "Checkout failed");
      }
    }
  };

  if (!token) {
    return <h1 className="xLarge center alone">Please login first!</h1>;
  }

  if (loading) {
    return <h1 className="xLarge center alone">Loading cart...</h1>;
  }

  return (
    <div>
      <div className="check-container">
        <h1 className="xLarge ">My Cart</h1>
      </div>

      {cart && cart.items && cart.items.length > 0 ? (
        <>
          <div className="check-container">
            <p className="mid gray" style={{ marginTop: "1rem" }}>
              Total Items: {cart.totalItems}
            </p>
          </div>

          <div className="card-cont">
            {cart.items.map((item) => (
              <Card
                key={item._id}
                id={item.productId?._id || item.productId}
                name={item.productId?.name || item.name}
                image={item.productId?.image || item.image}
                price={item.productId?.price || item.price}
                discountedPrice={
                  item.productId?.discountedPrice || item.discountedPrice
                }
                stock={item.productId?.stock || item.stock}
                quantity={item.quantity}
                cartPage={true}
                isAdmin={false}
              />
            ))}
          </div>
          <div className="check-container marginBo">
            <div className="cart-checkout-box ">
              <p className="mid gray">Total Items: {cart.totalItems}</p>
              <p className="large priColor bold">
                Total Price: {cart.totalAmount} JD
              </p>
            </div>
            <div className="ctaCard" style={{width:'100%'}}>
              <button className="square mid" onClick={handleCheckout}>
                Confirm
              </button>
              <button className="square secSq mid" onClick={clearCart}>
                Clear cart
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="center alone">Your cart is empty</p>
      )}
    </div>
  );
}
