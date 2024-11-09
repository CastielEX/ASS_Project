import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Bag = () => {
  const [bag, setBag] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const savedBag = localStorage.getItem("bag");
    if (savedBag) {
      const parsedBag = JSON.parse(savedBag);
      setBag(parsedBag);

      // Calculate the total price
      const total = parsedBag.reduce((sum: number, item: any) => sum + item.price, 0);
      setTotalPrice(total);
    }
  }, []);

  return (
    <div className="bagContainer">
      <div className="bagMainContainer">
        {bag.length > 0 ? (
          <>
            {bag.map((item, index) => (
              <div className="productCardCatalog" key={index}>
                <div className="productImageSection">
                  <img src={item.imgSrc} alt="No Image Available!" />
                </div>
                <h1 className="productNameCatalog">{item.title}</h1>
                <h1 className="productPriceCatalog">{item.price} MDL</h1>
              </div>
            ))}
          </>
        ) : (
          <p>Your bag is empty</p>
        )}
      </div>
      {bag.length > 0 && (
        <div className="checkoutBtnContainer">
          <Link to="/Checkout">
            <button className="checkoutBtn">Checkout</button>
          </Link>
          <div className="totalPriceContainer">
            <h2>Total: {totalPrice} MDL</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bag;
