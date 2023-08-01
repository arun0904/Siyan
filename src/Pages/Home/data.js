import image1 from "../../Assets/images/home/Screenshot 2023-06-09 at 10.55.34 AM.png";
import image2 from "../../Assets/images/home/Screenshot 2023-06-09 at 10.56.05 AM.png";
import image3 from "../../Assets/images/home/Screenshot 2023-06-09 at 10.56.25 AM.png";
import image4 from "../../Assets/images/home/Screenshot 2023-06-09 at 10.56.39 AM.png";
import image5 from "../../Assets/images/home/Screenshot 2023-06-09 at 11.01.42 AM.png";
import image6 from "../../Assets/images/home/double_height_hero_card_sobe-TopStore._CB445191053_.jpg";
import image7 from "../../Assets/images/home/mensfashionbanner1572434751640png.webp";
import image8 from "../../Assets/images/home/61Q8wK2nE-L._UX466_.jpg";
import image9 from "../../Assets/images/home/Men__unselected._SS300_QL85_FMpng_.png";
import image10 from "../../Assets/images/home/Women__unselected._SS300_QL85_FMpng_.png";
import image11 from "../../Assets/images/home/3xl-13-lstr-wine-vtexx-original-imagnzbummhkgr7p.webp";
import image12 from "../../Assets/images/home/available-in-various-color-men-plain-cotton-trouser-for-formal-wear-148.jpeg";
import image13 from "../../Assets/images/home/kibo_maroon_fitted_crop_wrap_top_.webp";
import image14 from "../../Assets/images/home/imagesaskdjfklajs.jpeg";
import image15 from "../../Assets/images/logo/logo.png";
import image16 from "../../Assets/images/home/bally-001-1366.webp"

const data1 = [
  {
    id: 1,
    image_src: image1,
    brand_name: "Inkast Denim co",
    offer1: "BUY 2",
    offer2: "Get 1 free",
  },
  {
    id: 2,
    image_src: image2,
    brand_name: "Jam & Honey",
    offer1: "Min. 60% off",
    offer2: "+ Extra 5% off using coupens",
  },
  {
    id: 3,
    image_src: image3,
    brand_name: "Calvin Klein",
    offer1: "BUY 3",
    offer2: "Get Extra 7% off",
  },
  {
    id: 4,
    image_src: image4,
    brand_name: "GANT",
    offer1: "Min. 60% off",
    offer2: "+ Extra 5% off using coupens",
  },
  {
    id: 5,
    image_src: image5,
    brand_name: "Adidas",
    offer1: "BUY 3",
    offer2: "Get Extra 7% off",
  },
  {
    id: 6,
    image_src: image6,
    brand_name: "Tommy Hilfiger",
    offer1: "BUY 2",
    offer2: "Get 1 free",
  },
  {
    id: 7,
    image_src: image7,
    brand_name: "Columbia",
    offer1: "BUY 3",
    offer2: "Get Extra 7% off",
  },
];

const categories_image = {
  man_image: image9,
  woman_image: image10,
};

const clothing_types = [
  { image: image11, text: "Men's Topwear", category:"men", subCategory:'topwear' },
  { image: image12, text: "Men's Bottomwear",category:"men", subCategory:'bottomwear' },
  { image: image13, text: "Women's Topwear", category:"women", subCategory:'topwear' },
  { image: image14, text: "Women's Bottomwear",category:"women", subCategory:'bottomwear' }
];

const carddata = {
  card_image: image8,
  name: "Alan Jones Clothing",
  description: "Mens Cotton Sleeveless T-Shirt",
  price: "329",
  quantity: 3,
  size:"L",
  color:"white"
};
export { data1, carddata, categories_image, clothing_types, image15, image16 };
