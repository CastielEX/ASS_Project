CREATE DATABASE products;

CREATE TABLE allProducts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    price INTEGER,
    imgSrc TEXT
);


CREATE TABLE allReviews(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    username VARCHAR(255),
    product_id UUID REFERENCES allProducts(id),
    rating INTEGER,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
