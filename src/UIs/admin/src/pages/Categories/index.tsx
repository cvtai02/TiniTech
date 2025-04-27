import { useState } from 'react';
import { FaInfoCircle, FaTrashRestore } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Category } from '../../types/category';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  updateCategoryStatus,
} from '../../services/category';

// Mock service functions - replace with your actual API calls

interface FormData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
}

const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isActivateModalOpen, setIsActivateModalOpen] =
    useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isParentCategory, setIsParentCategory] = useState<boolean>(true);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    parentId: '',
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsAddModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsEditModalOpen(false);
      resetForm();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (params: { id: string; status: 'Active' | 'Deleted' }) =>
      updateCategoryStatus(params.id, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onSettled: () => {
      setIsDeleteModalOpen(false);
      setIsActivateModalOpen(false);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      parentId: null,
    });
    setIsParentCategory(true);
    setSelectedParentId(null);
  };

  const handleOpenAddModal = (parentId: string | null = null) => {
    resetForm();
    if (parentId) {
      setIsParentCategory(false);
      setFormData((prev) => ({ ...prev, parentId }));
      setSelectedParentId(parentId);
    }
    setIsAddModalOpen(true);
  };

  const handleEdit = (category: Category, isSubcategory: boolean = false) => {
    setCurrentCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: isSubcategory ? category.parentId || null : null,
    });
    setIsParentCategory(!isSubcategory);
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    console.log('Delete category:', category);
    setCurrentCategory(category);
    setIsDeleteModalOpen(true);
  };
  const handleActivate = (category: Category) => {
    console.log('Activate category:', category);
    setCurrentCategory(category);
    setIsActivateModalOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      updateMutation.mutate(formData as Category);
    }
  };

  const handleConfirmDelete = () => {
    if (currentCategory?.id) {
      updateStatusMutation.mutate({
        id: currentCategory.id,
        status: 'Deleted',
      });
    }
  };

  const handleConfirmActivate = () => {
    if (currentCategory?.id) {
      updateStatusMutation.mutate({
        id: currentCategory.id,
        status: 'Active',
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const renderAddModal = () =>
    isAddModalOpen && (
      <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {isParentCategory ? 'Thêm danh mục gốc' : 'Thêm danh mục nhánh'}
            </h3>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmitAdd}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
              />
            </div>
            {!isParentCategory && selectedParentId && data && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Danh mục gốc:{' '}
                  {data.find((c) => c.id === selectedParentId)?.name}
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="mr-2 px-4 py-2 text-gray-600 rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                disabled={addMutation.isPending}
              >
                {addMutation.isPending ? 'Đang xử lý...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );

  if (isLoading)
    return (
      <p className="text-gray-500 dark:text-gray-300">Loading categories...</p>
    );
  if (isError) return <p className="text-red-500">Error loading categories.</p>;
  if (!data || data.length === 0)
    return (
      <div className="container p-8 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => handleOpenAddModal()}
          >
            Thêm danh mục gốc
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-300">No categories found.</p>
        {/* Add Modal */}
        {renderAddModal()}
      </div>
    );

  const renderEditModal = () =>
    isEditModalOpen && (
      <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {isParentCategory
                ? 'Chỉnh sửa danh mục'
                : 'Chỉnh sửa danh mục con'}
            </h3>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmitEdit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="mr-2 px-4 py-2 text-gray-600 rounded hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Đang xử lý...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );

  const renderDeleteModal = () =>
    isDeleteModalOpen &&
    currentCategory && (
      <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Xác nhận xóa</h3>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <p className="mb-4">
            Bạn có chắc chắn muốn xóa danh mục "{currentCategory.name}"?
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="mr-2 px-4 py-2 text-gray-600 rounded hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? 'Đang xử lý...' : 'Xóa'}
            </button>
          </div>
        </div>
      </div>
    );

  const renderActivateModal = () =>
    isActivateModalOpen &&
    currentCategory && (
      <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Kích hoạt danh mục</h3>
            <button
              onClick={() => setIsActivateModalOpen(false)}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <p className="mb-4">
            Bạn có muốn kích danh mục "{currentCategory.name}"?. Việc này cũng
            sẽ kích hoạt danh mục gốc.
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsActivateModalOpen(false)}
              className="mr-2 px-4 py-2 text-gray-600 rounded hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmActivate}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? 'Đang xử lý...' : 'Kích hoạt'}
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <section className="container p-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
        <button
          className="px-4 py-2 bg-white text-black hover:bg-gray-200 rounded dark:bg-black dark:text-white dark:hover:bg-black/80"
          onClick={() => handleOpenAddModal()}
        >
          Thêm danh mục gốc
        </button>
      </div>

      {data.map((category) => (
        <div key={category.id} className="mb-8">
          <div className="flex items-center gap-x-3 justify-between">
            <div
              className={`relative group grow flex items-center gap-x-3 ${category.status === 'Deleted' ? 'text-red-400' : ''}`}
            >
              <h2 className="text-lg font-bold">{category.name}</h2>
              <FaInfoCircle className="text-gray-500 dark:text-gray-300 hover:text-gray-700 cursor-pointer" />
              <div className="bg-gray-800 w-fit text-white text-sm px-2 py-1 rounded  opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <strong>Slug:</strong> {category.slug}
                <br />
                <strong>Mô tả:</strong> {category.description}
              </div>
            </div>
            <div className="flex items-center gap-x-6">
              {(category.subcategories === undefined ||
                category.subcategories === null ||
                category.subcategories?.every(
                  (item) => item.status === 'Deleted',
                ) ||
                category.subcategories.length === 0) &&
                category.status !== 'Deleted' && (
                  <button
                    className="text-gray-500  transition-colors duration-200 hover:text-red-500 focus:outline-none"
                    onClick={() => handleDelete(category)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                )}
              {category.status === 'Deleted' && (
                <button
                  className="text-gray-500 transition-colors duration-200 hover:text-blue-500 focus:outline-none"
                  onClick={() =>
                    handleActivate({
                      ...category,
                      parentId: category.id,
                    })
                  }
                >
                  <FaTrashRestore className="w-[1.175rem] h-[1.175rem]" />
                </button>
              )}

              <button
                className="text-gray-500  transition-colors duration-200 hover:text-yellow-500 focus:outline-none"
                onClick={() => handleEdit(category)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>

              {category.status === 'Active' && (
                <button
                  className="text-gray-500  transition-colors duration-200 hover:text-green-500 focus:outline-none"
                  onClick={() => handleOpenAddModal(category.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col mt-2">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200  dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 px-4 text-sm font-normal text-left text-gray-500 dark:text-gray-300 w-2/12 "
                        >
                          <div className="flex items-center gap-x-3">
                            <span>Danh mục</span>
                          </div>
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-300 w-2/12 "
                        >
                          <button className="flex items-center gap-x-2">
                            <span>Doanh thu/Đã bán</span>

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          </button>
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-300 w-5/12"
                        >
                          Mô tả
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-300 w-2/12"
                        >
                          Trạng thái
                        </th>

                        <th scope="col" className="relative py-3.5 px-4">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                      {(category.subcategories === undefined ||
                        category.subcategories === null ||
                        category.subcategories.length === 0) && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 text-center"
                          >
                            Không có danh mục con nào
                          </td>
                        </tr>
                      )}
                      {category.subcategories?.map((subcategory) => (
                        <tr key={subcategory.id}>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center gap-x-3">
                              <div className="flex items-center gap-x-2">
                                <div>
                                  <h2 className="font-medium text-gray-800 dark:text-white">
                                    {subcategory.name}
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            -
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {subcategory.description}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                subcategory.status === 'Active'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}
                            >
                              {subcategory.status || 'N/A'}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm whitespace-nowrap ">
                            <div className="flex items-center justify-end gap-x-6">
                              {subcategory.status == 'Deleted' ? (
                                <button
                                  className="text-gray-500 dark:text-gray-300 transition-colors duration-200 hover:text-blue-500 focus:outline-none"
                                  onClick={() =>
                                    handleActivate({
                                      ...subcategory,
                                      parentId: category.id,
                                    })
                                  }
                                >
                                  <FaTrashRestore className="w-[1.175rem] h-[1.175rem]" />
                                </button>
                              ) : (
                                <button
                                  className="text-gray-500 dark:text-gray-300 transition-colors duration-200 hover:text-red-500 focus:outline-none"
                                  onClick={() =>
                                    handleDelete({
                                      ...subcategory,
                                      parentId: category.id,
                                    })
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                  </svg>
                                </button>
                              )}

                              <button
                                className="text-gray-500 dark:text-gray-300 transition-colors duration-200 hover:text-yellow-500 focus:outline-none"
                                onClick={() =>
                                  handleEdit(
                                    { ...subcategory, parentId: category.id },
                                    true,
                                  )
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modals */}
      {renderAddModal()}
      {renderEditModal()}
      {renderDeleteModal()}
      {renderActivateModal()}
    </section>
  );
};

export default CategoriesPage;
