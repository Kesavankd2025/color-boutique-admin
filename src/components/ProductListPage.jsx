import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import "./styles/productListPage.css";
import ProductDetailsModal from "./productDetailsModal";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "@phosphor-icons/react";
import apiProvider from "../apiProvider/product";
import { useDispatch } from "react-redux";
import { handleFormProduct } from "../redux/slices/product";
import ReactTableComponent from "../table/ReactTableComponent";
import Swal from "sweetalert2";
import usePermission from "../hook/usePermission";

export default function ProductListPage() {
  const canAdd = usePermission("products", "add");
  const canView = usePermission("products", "view");
  const canEdit = usePermission("products", "edit");
  const canDelete = usePermission("products", "delete");
  const havePermissions = canView || canEdit || canDelete;
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const filterableColumns = [
    "productCode",
    "productName",
    "categoryName",
    "subCategoryName",
    "brandName",
  ];
  const [search, setSearch] = useState("");
  const searchDebounceRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, filters, sorting, search]);

  const fetchData = async () => {
    try {
      const input = {
        page: pageIndex,
        limit: pageSize,
        filters: filters,
        search: search || "", // pass the search term
      };

      const response = await apiProvider.productList(input);

      if (response.status) {
        setProducts(response.response.data || []);
        setTotalPages(response.response.totalPages || 0);
        setTotal(response.response.total || 0);
      } else {
        console.error("Failed to fetch product list");
      }
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPageIndex(0); // reset to first page

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(() => {
      fetchData(); // call API after debounce
    }, 300); // 300ms debounce
  };

  const columns = React.useMemo(
    () => [
      {
        header: "S.No",
        id: "sno",
        size: 80,
        cell: (info) => pageIndex * pageSize + info.row.index + 1 + ".",
      },
      {
        header: "Product ID",
        accessorKey: "productCode",
        size: 120,
      },
      {
        header: "Product Name",
        accessorKey: "productName",
        size: 300,
      },
      {
        header: "Category",
        accessorKey: "categoryName",
        size: 150,
      },
      {
        header: "Sub Category",
        accessorKey: "subCategoryName",
        size: 200,
      },
      {
        header: "Child Category",
        accessorKey: "childCategoryName",
        size: 150,
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Brand",
        accessorKey: "brandName",
        size: 120,
      },
      {
        header: "Status",
        size: 100,
        cell: ({ row }) => {
          const status = row.original.productStatus; // boolean true/false

          return (
            <span
              className={
                status
                  ? "bg-success-focus text-success-600 border border-success-border px-24 py-4 radius-4 fw-medium text-sm"
                  : "bg-danger-focus text-danger-600 border border-danger-main px-24 py-4 radius-4 fw-medium text-sm"
              }
            >
              {status ? "Active" : "Inactive"}
            </span>
          );
        },
      },

      ...(havePermissions
        ? [
            {
              header: "Actions",
              size: 160,
              cell: (info) => {
                const productId = info.row.original._id;
                return (
                  <div className="d-flex align-items-center gap-10">
                    {canView && (
                      <button
                        type="button"
                        className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                        onClick={() => {
                          setSelectedProduct(info.row.original);
                          setModalOpen(true);
                        }}
                      >
                        <Icon
                          icon="majesticons:eye-line"
                          className="icon text-xl"
                        />
                      </button>
                    )}
                    {canEdit && (
                      <button
                        type="button"
                        className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                        onClick={() => handleEdit(productId)}
                      >
                        <Icon icon="lucide:edit" className="menu-icon" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                        onClick={() => handleRemoveRow(productId)}
                      >
                        <Icon
                          icon="fluent:delete-24-regular"
                          className="menu-icon"
                        />
                      </button>
                    )}
                  </div>
                );
              },
            },
          ]
        : []),
    ],
    [pageIndex, pageSize]
  );

  const handleRemoveRow = async (id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    // If user confirms deletion
    if (result.isConfirmed) {
      try {
        const response = await apiProvider.deleteProduct(id);
        if (response.status) {
          // Show success message
          await Swal.fire(
            "Deleted!",
            "Your product has been deleted.",
            "success"
          );
          fetchData(); // Refresh the data
        } else {
          throw new Error(response.message || "Failed to delete product");
        }
      } catch (error) {
        // Show error message
        await Swal.fire(
          "Error!",
          error.message || "Something went wrong while deleting the product.",
          "error"
        );
      }
    }
  };

  const handleEdit = async (id) => {
    console.log(id, "==================");

    dispatch(
      handleFormProduct({
        view: false,
        isEdit: true,
        id: id,
      })
    );
    navigate("/create-product");
  };

  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) setPageIndex(pageIndex + 1);
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header d-flex justify-content-between py-16 px-24">
        <div style={{ position: "relative" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            style={{ maxWidth: 350 }}
            value={search}
            onChange={handleSearchChange}
          />
          <Icon
            icon="ic:baseline-search"
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              fontSize: 20,
            }}
          />
        </div>
        {canAdd && (
          <button
            type="button"
            className="btn btn-success d-flex align-items-center gap-2"
            onClick={() => {
              dispatch(
                handleFormProduct({
                  view: false,
                  isEdit: false,
                  id: null,
                })
              );
              navigate("/create-product");
            }}
          >
            <Icon
              icon="ic:baseline-plus"
              className="icon text-xl line-height-1"
            />
            Add Product
          </button>
        )}
      </div>

      <div className="table-responsive">
        {/* <div className="d-flex justify-content-end align-items-center mb-3"></div> */}

        <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check d-none">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Child Category</th>
              <th>Brand</th>
              {/* <th>Price</th> */}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id}>
                {/* <td>{(page) * limit + index + 1}.</td> */}
                <td>{product.productCode}</td>
                <td>{product.productName}</td>
                <td>{product.categoryName}</td>
                <td>{product.subCategoryName}</td>
                <td>{product.childCategoryName || "-"}</td>
                <td>{product.brandName}</td>
                {/* <td>{product.price}</td> */}
                <td>
                  <span className="bg-success-focus text-success-600 border border-success-border px-24 py-4 radius-4 fw-medium text-sm">
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-10 ">
                    <button
                      type="button"
                      className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                      onClick={() => {
                        setSelectedProduct(product);
                        setModalOpen(true);
                      }}
                    >
                      <Icon
                        icon="majesticons:eye-line"
                        className="icon text-xl"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEdit(product._id)}
                      className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                    >
                      <Icon icon="lucide:edit" className="menu-icon" />
                    </button>
                    <button
                      type="button"
                      className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                      onClick={() => handleRemoveRow(product._id)}
                    >
                      <Icon
                        icon="fluent:delete-24-regular"
                        className="menu-icon"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="table-responsive scroll-sm">
          <ReactTableComponent
            data={products}
            columns={columns}
            filterableColumns={filterableColumns}
            pageIndex={pageIndex} // should be a number like 0, 1, 2...
            totalPages={totalPages}
            totalRecords={total} // should be a number like 5, 10, etc.
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            filters={filters}
            setFilters={setFilters}
            sorting={sorting}
            setSorting={setSorting}
          />
        </div>
        <ProductDetailsModal
          show={modalOpen}
          onHide={() => setModalOpen(false)}
          product={selectedProduct}
        />
      </div>
      {/* Pagination buttons */}
      {/* <div className="d-flex align-items-center mt-4 gap-3 d-none">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="btn btn-primary"
        >
          Previous
        </button>

        <div className="d-flex align-items-center gap-2">
          <div>
            <span>Page {page + 1}</span>
          </div>
          <div>
            <select
              className="form-select"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(0); // Reset page when limit changes
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={(page + 1) * limit >= total} // Optional check
          className="btn btn-primary"
        >
          Next
        </button>
      </div> */}
    </div>
  );
}
