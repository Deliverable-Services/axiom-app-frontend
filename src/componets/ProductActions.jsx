import { Button } from "@mui/joy";

import styles from "../app/page.module.css";

// - Render all the actions items for the product.
const ProductActions = () => {
    return (
        <>
            <div>
                <Button variant="contained" className={styles.buyButton}>
                    Buy this Item
                </Button>

                <Button variant="outlined" className={styles.addButton}>
                    Add to Bag
                </Button>
            </div>

            <div className={styles.footer}>
                <div className={styles.footerContent}>
                    <img src="/images/messages.svg" />
                    <span>Chat</span>
                </div>

                <div className={styles.footerContent}>
                    <img src="/images/heart.svg" />
                    <span>Wishlist</span>
                </div>
                
                <div className={styles.footerContent}>
                    <img src="/images/shareicon.svg" />
                    <span>Share</span>
                </div>
            </div>
        </>
    );
};

export default ProductActions;