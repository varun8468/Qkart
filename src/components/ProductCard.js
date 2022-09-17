import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";


const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
          component="img"
          height={300}
          image={product.image}
          alt="green iguana"
        />
        <CardContent>
          <Typography variant="h6" component="div">
            {product.name}
          </Typography>
          <Typography variant="h5">${product.cost}</Typography>

          <Rating name="read-only" value={product.rating} readOnly />
          
        </CardContent>
        <CardActions className="card-actions">
          <Button className="card-button" variant="contained" fullWidth startIcon={<AddShoppingCartOutlined/>}
          onClick={handleAddToCart}
         >
              ADD TO CART
          </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
