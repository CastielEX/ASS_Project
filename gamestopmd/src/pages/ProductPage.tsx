import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  price: number;
  imgsrc: string;
}

interface SubmittedReview {
  rating: string | number;
  comment: string;
}

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");
  const [submittedReview, setSubmittedReview] =
    useState<SubmittedReview | null>(null);
  const [rating, setRating] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/products/${productId}`
        );
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/products/${productId}/reviews`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleRatingChange = (event: any) => {
    const selectedRating = parseInt(event.target.value);
    setRating(selectedRating);
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };

  const handleSubmitReviewComment = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return; // Return if user is not authenticated
    }
    console.log(token);
    console.log(productId);
    console.log(rating);
    console.log(comment);
    try {
      const response = await axios.post(
        `http://localhost:4000/products/${productId}/reviews`, // Modify endpoint as per your API
        { rating, comment },
        { headers: { Authorization: token } } // Send authentication token in headers
      );
      console.log("Review submitted:", response.data);
      setSubmittedReview({ rating, comment });
      // Fetch updated reviews data
      const updatedResponse = await axios.get(
        `http://localhost:4000/products/${productId}/reviews`
      );
      setReviews(updatedResponse.data); // Update reviews state with the new data
      setComment("");
      setRating(1);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="productPageContainer">
      <div className="productCardCatalog" key={product.id}>
        <div className="productImageSection">
          <img src={product.imgsrc} alt={product.title} />
        </div>
        <div className="bottomCardSection">
          <h1 className="productNameCatalog">{product.title}</h1>
          <h1 className="productPriceCatalog">{product.price} MDL</h1>
          <div className="productBuySection">

          </div>
          <div className="storeLogoContainer">
          
          </div>
        </div>
      </div>
      <div className="reviewComment">
        <h1 className="reviewMainText">Review</h1>
        <form onSubmit={handleSubmitReviewComment}>
          <div className="select_review" tabIndex={1}>
            <input
              className="selectopt input_review"
              name="rating"
              type="radio"
              id="opt1"
              value={1}
              checked={rating === 1}
              onChange={handleRatingChange}
            />
            <label htmlFor="opt1" className="option_review label_review">
              <FontAwesomeIcon icon={faStar} />
            </label>
            <input
              className="selectopt input_review"
              name="rating"
              type="radio"
              id="opt2"
              value={2}
              checked={rating === 2}
              onChange={handleRatingChange}
            />
            <label htmlFor="opt2" className="option_review label_review">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </label>
            <input
              className="selectopt input_review"
              name="rating"
              type="radio"
              id="opt3"
              value={3}
              checked={rating === 3}
              onChange={handleRatingChange}
            />
            <label htmlFor="opt3" className="option_review label_review">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </label>
            <input
              className="selectopt input_review"
              name="rating"
              type="radio"
              id="opt4"
              value={4}
              checked={rating === 4}
              onChange={handleRatingChange}
            />
            <label htmlFor="opt4" className="option_review label_review">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </label>
            <input
              className="selectopt input_review"
              name="rating"
              type="radio"
              id="opt5"
              value={5}
              checked={rating === 5}
              onChange={handleRatingChange}
            />
            <label htmlFor="opt5" className="option_review label_review">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
            </label>
          </div>

          <div>
            <textarea
              className="textaAreaProductPage"
              id="comment"
              name="comment"
              value={comment}
              placeholder="Leave a comment..."
              onChange={handleCommentChange}
              required
              maxLength={300}
            ></textarea>
          </div>
          <button className="productReviewtBtn" type="submit">
            SUBMIT
          </button>
        </form>
      </div>
      <div className="submittedReview">
        {reviews.map((review) => (
          <div className="submittedReviewBlockContainer" key={review.id}>
            <div className="submittedReviewBlockUpper">
              <p className="submittedReviewText">Username: {review.username}</p>
              {/* <p className="submittedReviewText">Rating: {review.rating}</p> */}
              <div className="submittedReviewRating">
                <p className="submittedReviewText">
                  Rating :   
                  {[...Array(parseInt(review.rating))].map((_, index) => (
                    <FontAwesomeIcon icon={faStar} key={index} />
                  ))}
                </p>
              </div>
              <p className="submittedReviewText">
                Created Date: {review.created_at}
              </p>
            </div>
            <div className="submittedReviewBlockLower">
              <p className="submittedReviewText">Comment: {review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
