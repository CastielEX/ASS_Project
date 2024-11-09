import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [bag, setBag] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedBag = localStorage.getItem("bag");
    if (savedBag) setBag(JSON.parse(savedBag));
  }, []);

  const handleCheckout = () => {
    // Clear the bag after checkout
    setBag([]);
    localStorage.removeItem("bag");
    alert("Purchase successful!");
    navigate("/Catalog");
  };

  return (
    <div className="checkoutContainer">
      <div className="checkoutMainContainer">

      <div className="rowPayment">
      <div className="col-75-Payment">
        <div>
          <form action="/action_page.php">
            <div className="rowPayment">
              <div className="col-50-Payment">
                <h3>Billing Address</h3>
                <label className="labelPayment" htmlFor="fname">
                  <i className="fa fa-user"></i> Full Name
                </label>
                <input className="inputPayment" type="text" id="fname" name="firstname" placeholder="Alex Mercer" />
                
                <label className="labelPayment" htmlFor="email">
                  <i className="fa fa-envelope"></i> Email
                </label>
                <input className="inputPayment" type="text" id="email" name="email" placeholder="alexmercer@example.com" />
                
                <label className="labelPayment" htmlFor="adr">
                  <i className="fa fa-address-card-o"></i> Address
                </label>
                <input className="inputPayment" type="text" id="adr" name="address" placeholder="str. Stefan Cel Mare 1/2" />
                
                <label className="labelPayment" htmlFor="city">
                  <i className="fa fa-institution"></i> City
                </label>
                <input className="inputPayment" type="text" id="city" name="city" placeholder="Chisinau" />

                <div className="rowPayment">
                  <div className="col-50-Payment">
                    <label className="labelPayment" htmlFor="state">State</label>
                    <input className="inputPayment" type="text" id="state" name="state" placeholder="Chisinau" />
                  </div>
                  <div className="col-50-Payment">
                    <label className="labelPayment" htmlFor="zip">Zip</label>
                    <input className="inputPayment" type="text" id="zip" name="zip" placeholder="2000" />
                  </div>
                </div>
              </div>

              <div className="col-50-Payment">
                <h3>Payment</h3>
                <label className="labelPayment" htmlFor="fname">Accepted Cards</label>
                <div className="icon-container">
                <i className="fa-brands fa-cc-visa logoSpace"></i>
                <i className="fa-brands fa-cc-mastercard logoSpace"></i>
                <i className="fa-brands fa-cc-paypal logoSpace"></i>
                <i className="fa-brands fa-cc-apple-pay logoSpace"></i>
                </div>
                
                <label className="labelPayment" htmlFor="cname">Name on Card</label>
                <input className="inputPayment" type="text" id="cname" name="cardname" placeholder="Alex Mercer" />
                
                <label className="labelPayment" htmlFor="ccnum">Credit card number</label>
                <input className="inputPayment" type="text" id="ccnum" name="cardnumber" placeholder="0000-0000-0000-0000" />
                
                <label className="labelPayment" htmlFor="expmonth">Exp Month</label>
                <input className="inputPayment" type="text" id="expmonth" name="expmonth" placeholder="September" />
                
                <div className="rowPayment">
                  <div className="col-50-Payment">
                    <label className="labelPayment" htmlFor="expyear">Exp Year</label>
                    <input className="inputPayment" type="text" id="expyear" name="expyear" placeholder="2030" />
                  </div>
                  <div className="col-50-Payment">
                    <label className="labelPayment" htmlFor="cvv">CVV</label>
                    <input className="inputPayment" type="text" id="cvv" name="cvv" placeholder="248" />
                  </div>
                </div>
              </div>
            </div>
            
            <button className="completePurchaseBtn" onClick={handleCheckout}>
          Complete Purchase
        </button>
          </form>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default Checkout;
