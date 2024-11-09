import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ScrollUpButton from "../components/scrollUpButton";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [searchProductText, setSearchProductText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 25;
  const [bag, setBag] = useState<any[]>(() => {
    const savedBag = localStorage.getItem("bag");
    return savedBag ? JSON.parse(savedBag) : [];
  });

  useEffect(() => {
    // Fetch products from the server
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);


  const handleAddToBag = (product: any) => {
    const updatedBag = [...bag, product];
    setBag(updatedBag);
    localStorage.setItem("bag", JSON.stringify(updatedBag)); // Persist bag to localStorage
    alert(`${product.title} has been added to your bag.`);
  };

  const handleSearchChange = (e: any) => {
    setSearchProductText(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const filteredProducts = products.filter((product: any) =>
    product.title.toLowerCase().includes(searchProductText.toLowerCase())
  );

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="w-full flex justify-center">
      <div className="mainSearch">
        <div className="searchBarSection">
          <div className="searchBarContainer">
            <input
              type="search"
              value={searchProductText}
              onChange={handleSearchChange}
              className="searchBarInput"
              placeholder="Search any product..."
              autoComplete="off"
            />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="cardSectionCatalog">
            {currentProducts.map((product: any, index: any) => (
              <div className="productCardCatalog" key={index} id={product.logo}>
                <Link to={`/products/${product.id}`} className="productNameCatalog">
                  <div className="productImageSection">
                    <img src={product.imgSrc} alt="No Image Available!" />
                  </div>
                  <h1 className="productNameCatalog">{product.title}</h1>
                </Link>
                <h1 className="productPriceCatalog">{product.price} MDL</h1>
                <div className="productBuySection">
                  <a href={product.link} target="_blank" rel="noopener noreferrer">
                    <button className="productBuyBtn" onClick={() => handleAddToBag(product)}>BUY</button>
                  </a>
                </div>
                <div className="storeLogoContainer">

                </div>
              </div>
            ))}
            <div className="paginationContainer">
              {filteredProducts.length > productsPerPage && (
                <ReactPaginate
                  pageCount={Math.ceil(filteredProducts.length / productsPerPage)}
                  onPageChange={({ selected }) => setCurrentPage(selected + 1)}
                  forcePage={currentPage - 1}
                  containerClassName="pagination"
                  activeClassName="active"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="loadingSpinnerContainerCatalog">
            <div className="lds-dual-ring"></div>
            <h1 className="loadingText">No products found</h1>
          </div>
        )}
      </div>
      <ScrollUpButton />
    </div>
  );
};

export default Catalog;
