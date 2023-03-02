import { Search, SentimentDissatisfied, SettingsRemoteTwoTone } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const [loading, setLoading] = useState("false");
  const [products, setProducts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);
  const [items, setItems] = useState([]);


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setLoading(true);
    try {
      const response = await axios.get(config.endpoint + "/products");
      setLoading(false);
      setProducts(response.data);
      return response.data;
      
    }
    catch ( e ) {
      setLoading(false);
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
      }
    }
  };
  useEffect(() => {
    performAPICall();
    fetchCart(localStorage.getItem("token"))

  }, []);

  useEffect(() => {
    fetchCart(localStorage.getItem("token"))
    .then((cartData)=> generateCartItemsFrom(cartData, products))
    .then((cartProducts)=> setCartProducts(cartProducts));
  }, [products]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProducts(response.data);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          // enqueueSnackbar(e.response.data.message, {variant : "error"})
          setProducts([]);
        }
        if (e.response.status === 500) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
          setProducts(products);
        }
      } else {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
      }
    }
  };

  
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeOut = setTimeout(async () => {
      await performSearch(value);
    }, 500);
    setDebounceTimeout(timeOut);
  };


  const product = {
    "name":"Tan Leatherette Weekender Duffle",
    "category":"Fashion",
    "cost":150,
    "rating":4,
    "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
    "_id":"PmInA797xJhMIPti"
  }


  const searchBox = () => {
      return (
        <div className="searchBox">
          <TextField
            className="search-desktop"
            fullWidth
            size="small"
            onChange={(e)=> debounceSearch(e, debounceTimeout)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
          />
        </div>
      )
  }

  const noProducts=()=>{
    return (
      <Box fullWidth height={450} display='flex' flexDirection="column" alignItems="center" justifyContent="center">
        <SentimentDissatisfied/>
        <br/>
        <Typography>No products found</Typography>
      </Box>
    )
  }


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return [];
    let url = config.endpoint+"/cart";
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const res = await axios.get(url, {headers:{'Authorization': `Bearer ${token}`}});
      setItems(res.data); 
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    return items.findIndex((item) => item.productId === productId) !== -1;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    
    if (!token) {
      console.log("in add to cart");
      enqueueSnackbar("Please login to add into the cart", {
        variant: "warning",
      });
      return;
    }
    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar("item already in cart", { variant: "warning" });
      return;
    }
    try {
      // TODO: CRIO_TASK_MODULE_CART -  Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      const cartItems = generateCartItemsFrom(response.data, products);
      setCartProducts(cartItems);
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fech prodcuts. Check that the backend is running, reachable and returns valid JSON",
          { variant: "error" }
        );
      }
    }
  };

  const render = () => {
    if(localStorage.getItem("token")){
      return (
        <Grid container>
          <Grid item container className="grid-container" spacing={2} md={9}>
            {products.map((product)=>{
              return(
                <Grid item key={product._id} className="product-grid" xs={6} md={3}>
                  <ProductCard product={product}
                    handleAddToCart={async () =>
                      await addToCart(localStorage.getItem('token'), items, products, product._id, 1, {
                        preventDuplicate: true,
                      })
                    }
                  />
                </Grid>
              )})}
          </Grid>
          <Grid item className="cart" md={3} xs={12} >
            <Cart products={products} items={cartProducts} handleQuantity={addToCart} cartData={items}/>
          </Grid>
        </Grid>
      )
    }else return (
      <Grid container className="grid-container" spacing={2}>
            {products.map((product)=>{
              return(
                <Grid item key={product._id} className="product-grid" xs={6} md={3}>
                  <ProductCard product={product}/>
                </Grid>
              )})}
      </Grid>
    )
  }
  return (
    <div>
      <Header children={searchBox()}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

      </Header>
      <h1>Products</h1>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        onChange={(e)=> debounceSearch(e, debounceTimeout)}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
       <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
       </Grid>
       {/* {(products.length!=0)? render(): noProducts()} */}
       {loading? (<div className="loading">
        <CircularProgress/>
        <Typography>loading products</Typography>
      </div>) : (
        products.length !== 0 ? render() : noProducts()
      )} 
        {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
      <Footer />
    </div>
  )
}

export default Products;
