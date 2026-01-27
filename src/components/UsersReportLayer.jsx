import React, { useEffect, useMemo, useState } from 'react';
import CustomerApi from "../apiProvider/userapi";
import ReactTableComponent from '../table/ReactTableComponent';
import apiProvider from '../apiProvider/wholesaleorderapi';

export default function UsersReportLayer() {
  const [customers, setCustomers] = useState([]);
  const [deactivepageIndex, setdeactivePageIndex] = useState(0);
  const [deactivetotalPages, setdeactiveTotalPages] = useState(1);
  const [deactivepageSize, setdeactivePageSize] = useState(10);
  const [deactiveUsers, setdeactiveUsers] = useState([]);
  
  // activity pages
  const [activitypageIndex, setactivityPageIndex] = useState(0);
  const [activitytotalPages, setactivitytotalPages] = useState(1);
  const [activitypageSize, setactivityPageSize] = useState(10);
  const [activityLogs, setActivityLogs] = useState([]);
  
  const [activeTab, setActiveTab] = useState("assign-1"); // Track active tab

  const deactivefetchData = async () => {
    try {
      const input = {
        page: deactivepageIndex,
        limit: deactivepageSize,
      };
      const response = await CustomerApi.getUserReportDeactiveList(input);
      if (response?.response?.data) {
        setdeactiveUsers(response.response.data);
        setdeactiveTotalPages(response.response.totalPages);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    if (activeTab === "generate-1") {
      deactivefetchData();
    }
  }, [deactivepageIndex, deactivepageSize, activeTab]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const deActiveUserscolumns = useMemo(
    () => [
      {
        header: 'S.No',
        id: 'sno',
        cell: info => deactivepageIndex * deactivepageSize + info.row.index + 1
      },
      {
        header: 'User ID',
        accessorKey: 'userId',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() ?? 'N/A'}
          </span>
        ),
      },
      {
        header: 'Full Name',
        accessorKey: 'name',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() ?? 'N/A'}
          </span>
        ),
      },
      {
        header: 'Email',
        accessorKey: 'email',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() ?? 'N/A'}
          </span>
        ),
      },
      {
        header: 'Phone',
        accessorKey: 'phoneNumber',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() ?? 'N/A'}
          </span>
        ),
      },
      {
        header: 'Role',
        accessorFn: row => row?.role?.roleName,
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() ?? 'N/A'}
          </span>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'isActive',
        cell: info => (
          <span
            className={`${info.getValue()
              ? 'bg-success-focus text-success-600 border border-success-border'
              : 'bg-danger-focus text-danger-600 border border-danger-main'
              } px-24 py-4 radius-4 fw-medium text-sm`}
          >
            {info.getValue() ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() ? formatDate(info.getValue()) : 'N/A'}
          </span>
        ),
      },
      {
        header: 'Updated At',
        accessorKey: 'updatedAt',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() ? formatDate(info.getValue()) : 'N/A'}
          </span>
        ),
      },
    ],
    [deactivepageIndex, deactivepageSize]
  );

  const deactivehandleNextPage = () => {
    if (deactivepageIndex + 1 < deactivetotalPages) {
      setdeactivePageIndex(prev => prev + 1);
    }
  };

  const deactivehandlePreviousPage = () => {
    if (deactivepageIndex > 0) {
      setdeactivePageIndex(prev => prev - 1);
    }
  };

  const activityFetchData = async () => {
    try {
      const input = {
        limit: activitypageSize,
        page: activitypageIndex + 1, // API expects 1-based index
      };

      const result = await apiProvider.getUserActivityLogs(input);
      console.log("API Response:", result);

      if (result?.status && result?.response?.data) {
        setActivityLogs(result.response.data);
        setactivitytotalPages(result.response.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching user activity logs:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "assign-1") {
      activityFetchData();
    }
  }, [activitypageIndex, activitypageSize, activeTab]);

  const activityLogColumns = useMemo(
    () => [
      {
        header: 'S.No',
        id: 'sno',
        cell: info => activitypageIndex * activitypageSize + info.row.index + 1,
        size: 80
      },
      {
        header: 'Action',
        accessorKey: 'actionPerformed',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() || 'N/A'}
          </span>
        ),
        size: 200
      },
      {
        header: 'User',
        accessorKey: 'name',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() || 'N/A'}
          </span>
        ),
        size: 150
      },
      {
        header: 'IP Address',
        accessorKey: 'ipAddress',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() || 'N/A'}
          </span>
        ),
        size: 150
      },
      {
        header: 'Device/Browser',
        accessorKey: 'deviceUsed',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() || 'N/A'}
          </span>
        ),
        size: 350
      },
      {
        header: 'Date & Time',
        accessorKey: 'createdAt',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() ? formatDateTime(info.getValue()) : 'N/A'}
          </span>
        ),
        size: 220
      },
    ],
    [activitypageIndex, activitypageSize]
  );

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const activityhandleNextPage = () => {
    if (activitypageIndex + 1 < activitytotalPages) {
      setactivityPageIndex(prev => prev + 1);
    }
  };

  const activityhandlePreviousPage = () => {
    if (activitypageIndex > 0) {
      setactivityPageIndex(prev => prev - 1);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Reset pagination when switching tabs
    if (tabId === "assign-1") {
      setactivityPageIndex(0);
    } else if (tabId === "generate-1") {
      setdeactivePageIndex(0);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              {/* Nav tabs */}
              <ul className="nav nav-pills rep nav-justified" role="tablist">
                <li className="nav-item waves-effect waves-light" role="presentation">
                  <a
                    className={`nav-link ${activeTab === "assign-1" ? "active" : ""}`}
                    data-bs-toggle="tab"
                    href="#assign-1"
                    role="tab"
                    aria-selected={activeTab === "assign-1"}
                    onClick={() => handleTabChange("assign-1")}
                  >
                    <span className="d-block d-sm-none"><i className="far fa-envelope"></i></span>
                    <span className="d-none d-sm-block">User Activity Report</span>
                  </a>
                </li>
                <li className="nav-item waves-effect waves-light" role="presentation">
                  <a
                    className={`nav-link ${activeTab === "generate-1" ? "active" : ""}`}
                    data-bs-toggle="tab"
                    href="#generate-1"
                    role="tab"
                    aria-selected={activeTab === "generate-1"}
                    onClick={() => handleTabChange("generate-1")}
                  >
                    <span className="d-block d-sm-none"><i className="fas fa-cog"></i></span>
                    <span className="d-none d-sm-block">Deactivated Users Report</span>
                  </a>
                </li>
              </ul>

              {/* Tab panes */}
              <div className="tab-content p-3 text-muted">
                <div className={`tab-pane ${activeTab === "assign-1" ? "active" : ""}`} id="assign-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Actions performed by users</h5>
                      </div>
                      <div className="">
                        <div className="table-responsive scroll-sm">
                          <ReactTableComponent
                            data={activityLogs}
                            columns={activityLogColumns}
                            pageIndex={activitypageIndex}
                            totalPages={activitytotalPages}
                            onNextPage={activityhandleNextPage}
                            onPreviousPage={activityhandlePreviousPage}
                            onPageSizeChange={setactivityPageSize}
                            pageSize={activitypageSize}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`tab-pane ${activeTab === "generate-1" ? "active" : ""}`} id="generate-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Users who have been deactivated</h5>
                      </div>
                      <div className="">
                        <div className="table-responsive scroll-sm">
                          <ReactTableComponent
                            data={deactiveUsers}
                            columns={deActiveUserscolumns}
                            pageIndex={deactivepageIndex}
                            totalPages={deactivetotalPages}
                            onNextPage={deactivehandleNextPage}
                            onPreviousPage={deactivehandlePreviousPage}
                            onPageSizeChange={setdeactivePageSize}
                            pageSize={deactivepageSize}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}