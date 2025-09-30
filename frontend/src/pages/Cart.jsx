import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../constants/baseUrl";
import Card from "../components/Card";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { token } = useAuth();
  const { cart, loading } = useCart()

  if (!token) {
    return <h1 className="xLarge center alone">Please login first!</h1>;
  }

  if (loading) {
    return <h1 className="xLarge center alone">Loading cart...</h1>;
  }

  return (
    <div>
      <h1 className="xLarge center">My Cart</h1>
      
      {cart && cart.items && cart.items.length > 0 ? (
        <>
          <div className="cart-summary center">
            <p className="mid gray">Total Items: {cart.totalItems}</p>
            <p className="large priColor bold">Total: {cart.totalAmount} JD</p>
          </div>
          
          <div className="card-cont">
            {cart.items.map((item) => (
              <Card 
                key={item._id} 
                id={item.productId?._id || item.productId}
                name={item.productId?.name || item.name}
                image={item.productId?.image || item.image}
                price={item.productId?.price || item.price}
                discountedPrice={item.productId?.discountedPrice || item.discountedPrice}
                stock={item.productId?.stock || item.stock}
                quantity={item.quantity}
                cartPage={true}
                isAdmin={false}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="center alone">Your cart is empty</p>
      )}
    </div>
  );
}