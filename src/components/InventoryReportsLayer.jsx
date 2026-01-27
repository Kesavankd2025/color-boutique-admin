import React, { useEffect, useState, useMemo } from 'react';
import ProductApi from '../apiProvider/product';
import ReactTableComponent from '../table/ReactTableComponent';

export default function InventoryReportsLayer() {
  const [activeTab, setActiveTab] = useState('current-stock');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [activeTab, pageIndex, pageSize]);

  const fetchData = async () => {
    setLoading(true);
    const input = {
      page: pageIndex,
      limit: pageSize,
      stockType: activeTab,
    };
    const response = await ProductApi.getProductStockList(input);
    console.log('fetchData', input, response);
    if (response.status && response.response && Array.isArray(response.response.data)) {
      setData(response.response.data);
      setTotalPages(Math.ceil((response.response.total || 0) / pageSize) || 1);
    } else {
      setData([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const columns = useMemo(() => [
    {
      header: 'S.No',
      id: 'sno',
      cell: info => (pageIndex * pageSize + info.row.index + 1) + '.',
    },
    {
      header: 'Product Name',
      accessorKey: 'productName',
    },
    {
      header: 'SKU',
      accessorKey: 'variant.sku',
      cell: info => info.row.original.variant?.sku || '-',
    },
    {
      header: 'Stock',
      accessorKey: 'variant.stock',
      cell: info => info.row.original.variant?.stock || '-',
    },
    {
      header: 'Category',
      accessorKey: 'categoryName',
    },
    {
      header: 'Sub Category',
      accessorKey: 'subCategoryName',
    },
    {
      header: 'Brand',
      accessorKey: 'brandName',
    },
    {
      header: 'Price',
      accessorKey: 'variant.price',
      cell: info => info.row.original.variant?.price || '-',
    },
  ], [pageIndex, pageSize]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setPageIndex(0);
    // setFilters({});
    // setSorting([]); 
  };
console.log(data,"ddddddddddddd")
console.log(activeTab,"activeTab");

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              {/* Nav tabs */}
              <ul className="nav nav-pills rep nav-justified" role="tablist">
                <li className="nav-item waves-effect waves-light" role="presentation" style={{ backgroundColor: 'gainsboro', borderRadius: '5px' }}>
                  <a
                    className={`nav-link${activeTab === 'current-stock' ? ' active' : ''}`}
                    data-bs-toggle="tab"
                    // href="#updateorder-1"
                    role="tab"
                    aria-selected={activeTab === 'current-stock'}
                    onClick={() => handleTabClick('current-stock')}
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">Current Stock Report</span>
                  </a>
                </li>
                <li className="nav-item waves-effect waves-light" role="presentation" style={{ backgroundColor: 'gainsboro', borderRadius: '5px' }}>
                  <a
                    className={`nav-link${activeTab === 'low-stock' ? ' active' : ''}`}
                    data-bs-toggle="tab"
                    // href="#updatepayment-1"
                    role="tab"
                    aria-selected={activeTab === 'low-stock'}
                    onClick={() => handleTabClick('low-stock')}
                  >
                    <span className="d-block d-sm-none">
                      <i className="far fa-user"></i>
                    </span>
                    <span className="d-none d-sm-block">Low Stock Report</span>
                  </a>
                </li>
                {/* <li className="nav-item waves-effect waves-light" role="presentation"style={{ backgroundColor: 'gainsboro',borderRadius: '5px'  }}>
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#assign-1"
                    role="tab"
                    aria-selected="false"
                  >
                    <span className="d-block d-sm-none">
                      <i className="far fa-envelope"></i>
                    </span>
                    <span className="d-none d-sm-block">Stock Movement Report</span>
                  </a>
                </li> */}
                <li className="nav-item waves-effect waves-light" role="presentation" style={{ backgroundColor: 'gainsboro', borderRadius: '5px' }}>
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    // href="#generate-1"
                    role="tab"
                    aria-selected="false"
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-cog"></i>
                    </span>
                    <span className="d-none d-sm-block">Expiry Report</span>
                  </a>
                </li>
              </ul>

              {/* Tab panes */}
              <div className="tab-content p-3 text-muted">
                {/* Current Stock Report & Low Stock Report (dynamic) */}
                {(activeTab === 'current-stock' || activeTab === 'low-stock') && (
                  <div className="tab-pane active" id={activeTab === 'current-stock' ? 'updateorder-1' : 'updatepayment-1'} role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                          <h5 className="card-title me-2">
                            {activeTab === 'current-stock' ? 'Current Stock Report' : 'Low Stock Report'}
                          </h5>
                        </div>
                        {loading ? (
                          <div className="text-center py-5">Loading...</div>
                        ) : (
                          <ReactTableComponent
                            data={data}
                            columns={columns}
                            pageIndex={pageIndex}
                            totalPages={totalPages}
                            onNextPage={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
                            onPreviousPage={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                            filterableColumns={[]}
                            filters={filters}
                            setFilters={setFilters}
                            sorting={sorting}
                            setSorting={setSorting}
                          />
                        )}
                        {!loading && data.length === 0 && (
                          <div className="text-center py-5">No data found.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Stock Movement Report */}
                <div className="tab-pane" id="assign-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Stock Movement Report</h5>
                        <div className="ms-auto">
                          <div className="dropdown">
                            <a
                              className="dropdown-toggle text-reset"
                              href="#"
                              id="dropdownMenuButton2"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <span className="text-muted font-size-12">Filter </span>
                              <span className="fw-medium">
                                Select<i className="mdi mdi-chevron-down ms-1"></i>
                              </span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton2">
                              <a className="dropdown-item" href="#">Date Range</a>
                              <a className="dropdown-item" href="#">Product</a>
                              <a className="dropdown-item" href="#">Supplier</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expiry Report (static for now) */}
                {activeTab === 'expiry-report' && (
                  <div className="tab-pane active" id="generate-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Expiry Report</h5>
                        <div className="ms-auto">
                          <label htmlFor="example-date-input" className="col-form-label">Range</label>
                          <div className="col-md-10">
                            <input className="form-control" type="date" id="example-date-input" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
    </div>
  );
}
