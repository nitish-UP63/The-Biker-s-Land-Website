import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/all";
import "./Home.css";
import ProductCard from "./ProductCard.js";

import { clearErrors, getProduct } from "../../actions/productActions";
import { useSelector, useDispatch } from "react-redux";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";

import { useAlert } from "react-alert";

const Home = () => {
  const alert = useAlert();

  const dispatch = useDispatch();
  const { loading, error, products} = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Ecommerce" />

          <div className="banner">
          <div className="banner-1" ></div>
          <div className="banner-2" >

          <div className="banner-text" >
          <span className="b-text-1" >The</span>
          <span className="b-text-1" >Biker's  Land</span>
          
          </div>
            

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>
          </div>
          

          <h2 className="homeHeading">Featured Product</h2>
          <div className="container" id="container">
            {products &&
              products.map((product) => <ProductCard product={product} /> )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
