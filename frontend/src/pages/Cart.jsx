import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../constants/baseUrl";
import Card from "../components/Card";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { token, user } = useAuth();
  const { cart, loading, clearCart, checkout } = useCart();

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
              <button className="square mid" onClick={() => checkout(user._id)}>
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
