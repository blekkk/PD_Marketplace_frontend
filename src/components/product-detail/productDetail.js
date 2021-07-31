import './productDetail.css'
import { useState, useEffect } from 'react'
import { IoPersonCircle } from 'react-icons/io5'
import { useParams, withRouter } from 'react-router'
import ReactStars from "react-rating-stars-component";
import axios from 'axios'

const ProductDetail = (props) => {
  const { token, history } = props
  const [review, setReview] = useState([])
  const [product, setProduct] = useState({})
  const [user, setUser] = useState(null)
  const { id } = useParams()
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  });

  useEffect(() => {
    axios.get(`http://localhost:8080/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((e) => console.log(e.message))

    axios.get('http://localhost:8080/users')
      .then((res) => setReview(res.data))
      .catch((e) => console.log(e.message))

    axios.get('http://localhost:8080/user', {
      headers: {
        'auth-token': token
      }
    }).then((res) =>
      setUser(res.data)
    ).catch(e => console.log(e.message));
  }, [])

  const handleAddToCart = () => {
    alert("Added to Cart")
    if (window.confirm("Go to cart now?")) {
      history.push('/cart');
    }
  }

  const handleCartNotLoggedIn = () => {
    alert("Please sign in to continue")
    history.push('/signin');
  }

  const handleAddToWishlist = async () => {
    const wishlistObject = {
      productId: id,
      product_name: product.product_name,
      price: product.price,
      average_rating: product.average_rating
    };
    try {
      await axios.put('http://localhost:8080/user/wishlist/add', wishlistObject, {
        headers: {
          'auth-token': token
        }
      });
      alert('Added to wishlist!')
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleRemoveFromWishlist = async () => {
    const productId = {
      productId: id
    };
    try {
      await axios.put('http://localhost:8080/user/wishlist/remove', productId, {
        headers: {
          'auth-token': token
        }
      });
      alert('Removed from wishlist!')
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  }

  const checkWishlistExist = () => {
    let status = false;
    if (user.wishlist.length === 0)
      return status

    Array.prototype.forEach.call(user.wishlist, (elem) => {
      console.log(elem.productId === id);
      if (elem.productId === id) 
        status = true;
    })

    return status;
  }

  const wishListButton = () => {
    if (token) {
      if (checkWishlistExist()) {
        return (
          <button onClick={() => handleRemoveFromWishlist()} className="cart-btn"> <span>REMOVE FROM WISHLIST</span></button>
        )
      }
      else {
        return (
          <button onClick={() => handleAddToWishlist()} className="cart-btn"> <span>ADD TO WISHLIST</span></button>
        )
      }
    }
    return;
  }

  const addToCart = () => {
    if (token) {
      return (
        handleAddToCart()
      )
    } else {
      return (
        handleCartNotLoggedIn()
      )
    }
  }

  return (
    <div>
      <div className="detail-product">
        <img src={process.env.PUBLIC_URL + '/images/product/gambar_belum_ada.jpg'} alt="" />
        <div className="detail-description">
          <h2>{product.product_name}</h2>
          <div>
            <h3>{formatter.format(product.price)}</h3>
            <ReactStars
              count={5}
              size={24}
              activeColor="#ffd700"
              value={product.avgRating}
              edit={false}
            />
          </div>
          <p>Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi Deskripsi </p>
          <ul>
            <li>
              <p>Category     : {product.category?.main_category}</p>
            </li>
            <li>
              <p>Sub-Category : {product.category?.secondary_category}</p>
            </li>
            <li>
              <p>Brand        : {product.brand}</p>
            </li>
            <li>
              <p>Blabla       :</p>
            </li>
          </ul>
          <div className="detail-product-buttons">
            <button onClick={() => addToCart()} className="cart-btn"> <span>ADD TO CART</span></button>
            {user !== null? wishListButton() : ''}
          </div>
          {/* {user.cart.push(product)} */}
        </div>
      </div>
      <h3 style={{ margin: "50px 10px 10px 10px" }}>Reviews</h3>
      <div className="review-list-container">
        {review.map((elem) => {
          return (
            <div key={elem._id} className="user-review">
              <aside className="user-review-avatar"><IoPersonCircle /></aside>
              <p>{elem.first_name} {elem.last_name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

}

export default withRouter(ProductDetail);