import ProductList from '../../../components/products/ProductList';

const products = [
  {
    name: 'Thức ăn hạt',
    price: '100.000 VND',
    rating: 5,
    reviews: 100,
    image: 'image_url_1',
  },
  {
    name: 'Cát đậu nành',
    price: '100.000 VND',
    rating: 5,
    reviews: 100,
    image: 'image_url_2',
  },
  {
    name: 'Pate',
    price: '100.000 VND',
    rating: 5,
    reviews: 100,
    image: 'image_url_3',
  },
  {
    name: 'Cỏ bạc hà',
    price: '100.000 VND',
    rating: 5,
    reviews: 100,
    image: 'image_url_4',
  },
  {
    name: 'Bàn cào móng',
    price: '100.000 VND',
    rating: 5,
    reviews: 100,
    image: 'image_url_5',
  },
];

const FeaturedProduct = () => {
  return (
    <div className=" shadow-md rounded-lg p-4 mb-4 grow bg-transparent">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm nổi bật</h2>
    </div>
  );
};

export default FeaturedProduct;
