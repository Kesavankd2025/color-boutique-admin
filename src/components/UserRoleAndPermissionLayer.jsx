import { PlusCircle } from '@phosphor-icons/react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import rolesApiProvider from '../apiProvider/adminuserroleapi';
import { Icon } from '@iconify/react/dist/iconify.js';
import ReactTableComponent from '../table/ReactTableComponent';

export default function UserRoleAndPermissionLayer() {
  const [roles, setRoles] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(prev => prev - 1);
    }
  };
  useEffect(() => {
    fetchData();

  }, [pageIndex, pageSize, search]);

  const fetchData = async () => {
    try {
      const result = await rolesApiProvider.getUserRoleList({
        page: pageIndex,
        limit: pageSize,
        search: search.trim()
      });

      console.log("Fetched userRoleList Response:", result.response);

      if (result && result.status) {
        const items = result.response?.data || [];
        setRoles(items);
        console.log('setuserRole :', items)
        setTotalPages(result.response?.totalPages || 1);
        setTotal(result.response?.total || 0);
      } else {
        if (result && result.response?.message === "Invalid token") {
          console.warn("Token invalid. Redirecting to login...");
          // localStorage.removeItem("authToken");
          // window.location.href = "/login";
          return;
        }
        console.error("Failed to fetch categories. Result is invalid or missing expected response:", result);
      }
    } catch (error) {
      console.error("Error fetching category data:", error);

      if (error.response) {
        console.error("API Error Response Status:", error.response.status);
        console.error("API Error Response Data:", error.response.data);
      }
    }
  };

  const handleDeleteRole = async (role) => {
    if (!window.confirm(`Are you sure you want to delete the role "${role.roleName}"?`)) return;

    try {
      const updatedRole = {
        ...role,
        isDelete: true,
      };
      console.log("updatedRole:", updatedRole);

      const response = await rolesApiProvider.deleteRole(role._id, updatedRole);

      if (response && response.status === 200) {
        toast.success("Role deleted successfully");
        fetchData();
      } else {
        toast.error("Failed to delete role");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("An error occurred while deleting role");
    }
  };


  const columns = useMemo(() => [
    {
      header: "S.No",
      cell: (info) => info.row.index + 1,
      size: 50,
    },
    {
      header: "Role",
      accessorKey: "roleName",
    },
    {
      header: "Actions",
      size: 120,
      cell: (info) => {
        const role = info.row.original;
        return (
          <div className="d-flex gap-2">
            <Link
              to="/create-role"
              state={{ editRole: role }}
              className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
              title="Edit"
            >
              <Icon icon="lucide:edit" />
            </Link>
            <button
              className="bg-danger-focus text-danger-600 bg-hover-danger-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
              title="Delete"
              onClick={() => handleDeleteRole(role)}
            >
              <Icon icon="fluent:delete-24-regular" />
            </button>

          </div>
        );
      },
    },
  ], []);


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xxl-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center mb-3">
                {/* <h5 className="card-title me-2">User Role Permission</h5> */}
              </div>
              <div className="border-bottom bg-base py-16 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="form-control"
                    style={{ maxWidth: 350, minWidth: 200 }}
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPageIndex(0);
                    }}
                  />
                  <div className="search-icon" style={{ position: "absolute", right: "10px", top: "8px" }}>
                    <Icon
                      icon="ic:baseline-search"
                      className="icon text-xl line-height-1"

                    />
                  </div>
                </div>
                <div className="ms-auto">
                  <Link to="/create-role" className="btn btn-success waves-effect waves-light d-inline-flex justify-content-center align-items-center">
                    <PlusCircle size={18} weight="fill" className="me-2" />
                    Create Role
                  </Link>
                </div>
              </div>
              <div className="table-responsive">
                <ReactTableComponent
                  data={roles}
                  columns={columns}
                  pageIndex={pageIndex}
                  totalPages={totalPages}
                  onNextPage={handleNextPage}
                  onPreviousPage={handlePreviousPage}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  loading={loading}
                  totalRecords={total}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}