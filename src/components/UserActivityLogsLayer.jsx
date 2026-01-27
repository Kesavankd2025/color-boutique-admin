import React, { useEffect, useMemo, useState } from 'react';
import apiProvider from '../apiProvider/wholesaleorderapi';
import ReactTableComponent from '../table/ReactTableComponent';
import { Icon } from '@iconify/react/dist/iconify.js';

export default function UserActivityLogsLayer() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [activityLogs, setActivityLogs] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const input = {
        limit: pageSize,
        page: pageIndex,
        search: search.trim() || ''
      };
      const result = await apiProvider.getUserActivityLogs(input);
      console.log("API Response:", result);
      if (result?.status && result?.response?.data) {
        setActivityLogs(result.response.data);
        setTotalRecords(result.response.total || 0);
      } else {
        setActivityLogs([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error fetching user activity logs:", error);
      setActivityLogs([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'S.No',
        id: 'sno',
        size: 70,
        cell: ({ row }) => row.index + 1 + (pageIndex * pageSize),
        enableSorting: false
      },
      {
        header: 'Username',
        accessorKey: 'name',
        cell: ({ row }) => <span>{row.original.name || 'N/A'}</span>,
        size: 150
      },
      {
        header: 'Action',
        accessorKey: 'actionPerformed',
        cell: ({ row }) => (
          <span className="text-capitalize">
            {row.original.actionPerformed || 'N/A'}
          </span>
        ),
        size: 200
      },
      {
        header: 'Device',
        accessorKey: 'deviceUsed',
        cell: ({ row }) => row.original.deviceUsed || 'Unknown',
        size: 180
      },
      {
        header: 'IP Address',
        accessorKey: 'ipAddress',
        cell: ({ row }) => <span>{row.original.ipAddress || 'N/A'}</span>,
        size: 180
      },
      {
        header: 'Date & Time',
        accessorKey: 'createdAt',
        cell: ({ row }) => {
          if (!row.original.createdAt) return 'N/A';
          const date = new Date(row.original.createdAt);
          return date.toLocaleString();
        },
        size: 180
      },
    ],
    [pageIndex, pageSize]
  );

  const handleNextPage = () => {
    if ((pageIndex + 1) * pageSize < totalRecords) {
      setPageIndex(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(prev => prev - 1);
    }
  };
  const totalPages = Math.ceil(totalRecords / pageSize);
  console.log(activityLogs, "activityLogs");

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xxl-12">
            <div className="card">
              <div className="card-body">
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
                    <div className="search-icon" style={{ position: "absolute", right: "10px", top: "8px", color: "#6c757d" }}>
                      <Icon icon="mdi:magnify"
                        className="icon text-xl line-height-1"
                      />
                    </div>
                  </div>

                </div>
                <div className="table-responsive">
                  <ReactTableComponent
                    data={activityLogs}
                    columns={columns}
                    pageIndex={pageIndex}
                    totalPages={totalPages}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    loading={loading}
                    totalRecords={totalRecords}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}