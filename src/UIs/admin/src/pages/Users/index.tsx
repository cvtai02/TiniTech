import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { User } from '../../types/user';
import { PaginatedList } from '../../types/paginated-list';
import { fetchUsers } from '../../services/user';

const UsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError } = useQuery<PaginatedList<User>>({
    queryKey: ['users', currentPage, searchTerm],
    queryFn: () => fetchUsers(currentPage, searchTerm),
  });

  if (isLoading) return <p className="text-gray-500">Loading users...</p>;
  if (isError) return <p className="text-red-500">Error loading users.</p>;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setSearchTerm(searchEmail);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <section className="container px-4 mx-auto">
      <div className="flex items-center justify-between mt-8 mb-6">
        <div className="flex items-center gap-x-3">
          <span className="px-3 py-1 text-2xl text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
            {data?.totalCount || 0}
          </span>
          <h2 className="text-2xl font-medium">Users</h2>
        </div>

        <div className="w-full md:w-1/2">
          <form className="flex items-center">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search user by name or email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              ></input>
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-col mt-6">
        <div className="inline-block min-w-full py-2 align-middle ">
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center gap-x-3">
                      <span>User Name</span>
                    </div>
                  </th>

                  <th
                    scope="col"
                    className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <button className="flex items-center gap-x-2">
                      <span>Email</span>
                    </button>
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    <span>Status</span>
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    Created Date
                  </th>

                  <th
                    scope="col"
                    className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                  >
                    Vai trò
                  </th>

                  <th scope="col" className="relative py-3.5 px-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                {data?.items.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                      <div className="inline-flex items-center gap-x-3">
                        <div className="flex items-center gap-x-2">
                          <img
                            className="object-cover w-10 h-10 rounded-full"
                            src={
                              user.imageUrl ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
                            }
                            alt={user.name}
                          />
                          <div>
                            <h2 className="font-medium text-gray-800 dark:text-white ">
                              {user.name}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {user.locked ? (
                        <p className=" text-xs w-fit text-red-500 ">Locked</p>
                      ) : (
                        <p className="  text-xs w-fit text-green-500 ">
                          Active
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-x-2">
                        <p
                          className={`px-3 py-1 text-xs rounded-full dark:bg-gray-800 
                            ${
                              user.role === 'admin'
                                ? 'text-purple-500 bg-purple-100/60'
                                : user.role === 'staff'
                                  ? 'text-blue-500 bg-blue-100/60'
                                  : 'text-green-500 bg-green-100/60'
                            }`}
                        >
                          {user.role}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-x-6">
                        <button className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                          {user.locked ? (
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
                                d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                              />
                            </svg>
                          ) : (
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
                                d="M18.364 5.636a9 9 0 11-12.728 12.728 9 9 0 0112.728-12.728zM16.97 7.03l-9.94 9.94"
                              />
                            </svg>
                          )}
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

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() =>
            data?.hasPreviousPage && handlePageChange(currentPage - 1)
          }
          disabled={!data?.hasPreviousPage}
          className={`flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 ${!data?.hasPreviousPage ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>

          <span>Previous</span>
        </button>

        <div className="items-center hidden lg:flex gap-x-3">
          {data &&
            Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-2 py-1 text-sm rounded-md ${
                    page === currentPage
                      ? 'text-blue-500 dark:bg-gray-800 bg-blue-100/60'
                      : 'text-gray-500 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ),
            )}
        </div>

        <button
          onClick={() => data?.hasNextPage && handlePageChange(currentPage + 1)}
          disabled={!data?.hasNextPage}
          className={`flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 ${!data?.hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>Next</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default UsersPage;
