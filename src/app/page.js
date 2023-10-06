"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Grid } from "@mui/joy";

import orderBy from "axiom/helpers/orderBy";
import ProductGallery from "axiom/componets/ProductGallery";
import ProductVariations from "axiom/componets/ProductVariations";
import ProductActions from "axiom/componets/ProductActions";

import "swiper/css";
import "swiper/css/navigation";
import styles from "./page.module.css";


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  // - States only for displaying the product images
  const [productGallery, setProductGallery] = useState([]);
  const [selectedProductGallery, setSelectedProductGallery] = useState(null);
  // - States for only storing products related data
  const [productInfo, setProductInfo] = useState(null);
  const [productVariables, setProductVariables] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  // This is for later stage. We're not calling this api for now. 
  // const fetchSiteConfig = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `https://newapi.axiomprint.com/v1/site-configs`
  //     );

  //     if (data.status === 200) {
  //       setSiteConfig(data.data);
  //     }
  //   } 
  // };

  // - Fetch the Product Info from the Data.
  const fetchProductDetails = async (productID = 419) => {
    try {
      setIsLoading(true);

      const { data: { status, data } } = await axios.get(
        `https://newapi.axiomprint.com/v1/product/${productID}`
      );
      
      if (status === 200 && Object.keys(data).length > 1) {
        // - Setting Product Gallery Information.
        if (data.productgallery?.length) {
          const orderedImages = orderBy(data.productgallery, 'order');
          setProductGallery(orderedImages);
          setSelectedProductGallery(orderedImages[0]);
        }

        // - Setting Product Information.
        if (Object.keys(data.product).length > 0) {
          if (data.product?.variables?.length) {
            setProductVariables(data.product.variables);
          }

          // - Removing unnessary long data from main state.
          const tempRemoval = structuredClone(data.product);
          delete tempRemoval.variables 
          setProductInfo(tempRemoval);
        }
      }
    } catch (err) {
      console.error('Err while fetching products', { err });
    } finally {
      setIsLoading(false);
    }
  };

  // - Fetch product api on each page load.
  useEffect(() => {
    fetchProductDetails();
  }, []);

  // - Change the selected product gallery image.
  const handleSliderChange = (item) => setSelectedProductGallery(item);

  return (
    <main className={styles.main}>
      {(() => {
        // - Only render the UI once we've the product data with us. 
        // - Later we will change it with Skeleton Loading
        if (!isLoading && productVariables.length > 0) {
          return (
            <Grid container spacing={8} sx={{ flexGrow: 1 }}>
              <Grid xs={12} md={5}>
                <ProductGallery 
                  images={productGallery} 
                  selectedImg={selectedProductGallery} 
                  onImageChange={handleSliderChange} 
                />
              </Grid>
  
              <Grid xs={12} md={7}>
                <h2 className={styles.title}>{productInfo?.title} </h2>
  
                <ProductVariations variations={productVariables} formula={productInfo?.formula} />
                <ProductActions />
              </Grid>
            </Grid>
          )
        }

        return (
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </div>
        )
      })()}
    </main>
  );
}
