import { Box } from "@mui/joy";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "../app/page.module.css";

// - Configurations for the slider
const sliderConfig = {
    640: {
        slidesPerView: 1.4,
    },
    768: {
        slidesPerView: 2,
    },
    1024: {
        slidesPerView: 3.5,
    },
    1240: {
        slidesPerView: 3.5,
    },
};

// - Render the Product Galleries & Images
const ProductGallery = ({images, selectedImg, onImageChange}) => {
    return (
        <>   
            {/* Show the selected Image as big thumbnail */}
            <div className={styles.wrapperSliderImgChange}>
                {selectedImg ? (
                    <img
                        src={`https://newapi.axiomprint.com/uploads/${selectedImg?.image_name}`}
                        alt={selectedImg?.alt}
                    />
                ) : (
                    <Box sx={{ width: '100%', height: 300, backgroundColor: 'grey' }} />
                )}
            </div>

            {/* Slider to render all the images */}
            <Swiper
                spaceBetween={0}
                breakpoints={sliderConfig}
                pagination={{ clickable: true }}
                allowSlideNext={true}
                allowSlidePrev={true}
            >
                {images?.length ? images.map(image => (
                    // Render Single Swiper Slider
                    <SwiperSlide key={image.id}>
                        <div
                            className={`${selectedImg?.id === image?.id ? styles.selectedImg : ""} ${styles.SliderIcons}`}
                            onClick={() => onImageChange(image)}
                        >
                            <img src={`https://newapi.axiomprint.com/uploads/${image?.image_name}`} />
                        </div>
                    </SwiperSlide>
                )) : null} 
            </Swiper>
        </>
    );
}

export default ProductGallery;