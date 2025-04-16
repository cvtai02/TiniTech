import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  images: string[];
  status: 'active' | 'inactive';
  specifications: Record<string, string>;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API call
    const fetchProduct = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockProduct: Product = {
            id: id || '1',
            name: 'Product Name',
            description: 'Detailed description of the product goes here. This should explain all the features and benefits of the product to potential customers.',
            price: 99.99,
            stockQuantity: 50,
            category: 'Electronics',
            images: [
              'https://via.placeholder.com/600x400?text=Product+Image+1',
              'https://via.placeholder.com/600x400?text=Product+Image+2',
              'https://via.placeholder.com/600x400?text=Product+Image+3',
            ],
            status: 'active',
            specifications: {
              'Weight': '1.5 kg',
              'Dimensions': '10 x 5 x 3 inches',
              'Material': 'Aluminum',
              'Color': 'Silver'
            }
          };
          setProduct(mockProduct);
          setEditedProduct(mockProduct);
          setActiveImage(mockProduct.images[0]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedProduct(product);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editedProduct) {
      setEditedProduct({
        ...editedProduct,
        [name]: name === 'price' || name === 'stockQuantity' ? parseFloat(value) : value
      });
    }
  };

  const handleSpecificationChange = (key: string, value: string) => {
    if (editedProduct) {
      setEditedProduct({
        ...editedProduct,
        specifications: {
          ...editedProduct.specifications,
          [key]: value
        }
      });
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (editedProduct) {
      setEditedProduct({
        ...editedProduct,
        status: e.target.value as 'active' | 'inactive'
      });
    }
  };

  const handleSave = () => {
    // API call to save product changes would go here
    setProduct(editedProduct);
    setIsEditing(false);
    alert('Product changes saved!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Images Section */}
          <div className="md:w-1/2 p-4">
            <div className="mb-4">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <img 
                  key={index}
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer ${activeImage === image ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => setActiveImage(image)}
                />
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedProduct?.name || ''}
                    onChange={handleInputChange}
                    className="border rounded p-1 w-full"
                  />
                ) : (
                  product.name
                )}
              </h1>
              <div>
                <button 
                  onClick={handleEditToggle}
                  className={`px-4 py-2 rounded ${isEditing ? 'bg-gray-500 text-white' : 'bg-blue-500 text-white'}`}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
                {isEditing && (
                  <button 
                    onClick={handleSave}
                    className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Price:</p>
              {isEditing ? (
                <input
                  type="number"
                  name="price"
                  value={editedProduct?.price || 0}
                  onChange={handleInputChange}
                  className="border rounded p-1 w-32"
                  step="0.01"
                />
              ) : (
                <p className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
              )}
            </div>

            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Stock Quantity:</p>
              {isEditing ? (
                <input
                  type="number"
                  name="stockQuantity"
                  value={editedProduct?.stockQuantity || 0}
                  onChange={handleInputChange}
                  className="border rounded p-1 w-32"
                />
              ) : (
                <p className={`text-lg ${product.stockQuantity < 10 ? 'text-red-500' : 'text-green-500'}`}>
                  {product.stockQuantity} in stock
                </p>
              )}
            </div>

            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Status:</p>
              {isEditing ? (
                <select
                  value={editedProduct?.status}
                  onChange={handleStatusChange}
                  className="border rounded p-1 w-32"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              ) : (
                <p className={`inline-block px-2 py-1 rounded ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </p>
              )}
            </div>

            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Category:</p>
              {isEditing ? (
                <input
                  type="text"
                  name="category"
                  value={editedProduct?.category || ''}
                  onChange={handleInputChange}
                  className="border rounded p-1 w-full"
                />
              ) : (
                <p>{product.category}</p>
              )}
            </div>

            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Description:</p>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editedProduct?.description || ''}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full h-32"
                />
              ) : (
                <p className="text-gray-700 mt-1">{product.description}</p>
              )}
            </div>

            {/* Product Specifications */}
            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">Specifications</h2>
              <div className="bg-gray-50 p-4 rounded">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex border-b border-gray-200 py-2 last:border-b-0">
                    <span className="font-medium w-1/3">{key}:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProduct?.specifications[key] || ''}
                        onChange={(e) => handleSpecificationChange(key, e.target.value)}
                        className="border rounded p-1 flex-1"
                      />
                    ) : (
                      <span className="text-gray-600 flex-1">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
