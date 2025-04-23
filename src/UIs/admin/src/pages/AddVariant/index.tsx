import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FaSearch, FaPlus, FaTrash } from 'react-icons/fa';
import { fetchAttributes } from '../../services/attribute';
import { formatVND } from '../../utils/formatCurrency';
import { toVariantSku } from '../../utils/to-sku';
import { getProductsFn, getProductAttribute } from '../../services/product';
import {
  createVariant,
  createProductAttribute,
  deleteProductAttributeValue,
  addProductAttributeValue,
  deleteProductAttribute,
} from '../../services/product';
import { CreateVariantDto, ProductBriefDto } from '../../types';
import { validateVariant } from './validateVariant';

import ProductStore from './ProductPicking';

const AddVariant = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Product Variant</h1>
      <ProductStore onProductSelect={() => {}} />
    </div>
  );
};

export default AddVariant;
