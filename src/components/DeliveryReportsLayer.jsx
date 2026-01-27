import React, { useEffect, useMemo, useState } from 'react';
import apiProvider from '../apiProvider/adminuserapi';
import ReactTableComponent from '../table/ReactTableComponent';

export default function DeliveryReportsLayer() {
  // Delivery performance data
  const [performanceData, setPerformanceData] = useState([]);
  const performanceFilter = ["deliverymanName"]
  const [performancepageIndex, setperformancePageIndex] = useState(0);
  const [performancetotalPages, setperformanceTotalPages] = useState(1);
  const [performancepageSize, setperformancePageSize] = useState(10);
  const [performancefilters, setperformanceFilters] = useState([]);

  //Failed delivery data
  const [failedData, setfailedData] = useState([]);
  const failedFilter = ["orderCode", "customerName"]
  const [failedpageIndex, setfailedPageIndex] = useState(0);
  const [failedtotalPages, setfailedTotalPages] = useState(1);
  const [failedpageSize, setfailedPageSize] = useState(10);
  const [failedfilters, setfailedFilters] = useState([]);

  //Failed delivery data
  const [personalData, setpersonalData] = useState([]);
  const personalFilter = ["name", "values"]
  const [personalpageIndex, setpersonalPageIndex] = useState(0);
  const [personaltotalPages, setpersonalTotalPages] = useState(1);
  const [personalpageSize, setpersonalPageSize] = useState(10);
  const [personalfilters, setpersonalFilters] = useState([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deliveryMenOptions, setDeliveryMenOptions] = useState([]);
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState('');


  // Delivery performance function 

  const fetchPerformanceData = async () => {
    try {
      const input = {
        page: performancepageIndex,
        limit: performancepageSize,
        filters: performancefilters,
        startDate: startDate,
        endDate: endDate
      };
      // Convert filters array to filters object
      const response = await apiProvider.deliveryManPerformnaceList(input);
      if (response.status) {
        setPerformanceData(response.response.data || []);
        console.log(response, "response")
        setperformanceTotalPages(response.response.totalPages || 0);
      } else {
        console.error("Failed to fetch brand list");
      }
    } catch (error) {
      console.error("Error fetching brand list:", error);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, [performancepageIndex, performancepageSize, performancefilters, startDate, endDate]);
  const performancehandleNextPage = () => {
    if (performancepageIndex + 1 < performancetotalPages) setperformancePageIndex(prev => prev + 1);
  };

  const performancehandlePreviousPage = () => {
    if (performancepageIndex > 0) setperformancePageIndex(prev => prev - 1);
  };
  const Performancecolumns = useMemo(
    () => [
      {
        header: 'S.No',
        cell: info => info.row.index + 1,
      },
      {
        header: 'Deliveryman Name',
        accessorKey: 'deliverymanName',
        cell: info => info.getValue(),
      },
      {
        header: 'Total Delivered',
        accessorKey: 'totalDelivered',
        cell: info => info.getValue(),
      },
      {
        header: 'Total Orders',
        accessorKey: 'totalOrders',
        cell: info => info.getValue(),
      },
      {
        header: 'Delivery Rate',
        accessorKey: 'deliveryRate',
        cell: info => {
          const delivered = info.row.original.totalDelivered;
          const total = info.row.original.totalOrders;
          const rate = total > 0 ? ((delivered / total) * 100).toFixed(2) + '%' : '0%';
          return rate;
        },
      },
    ],
    []
  );
  // Failed delivery function 

  const fetchfailedData = async () => {
    try {
      const input = {
        page: failedpageIndex,
        limit: failedpageSize,
        filters: failedfilters,
        startDate: startDate,
        endDate: endDate
      };
      // Convert filters array to filters object
      const response = await apiProvider.deliveryFailedList(input);
      if (response.status) {
        setfailedData(response.response.data || []);
        console.log(response.response.data, "response")
        setfailedTotalPages(response.response.totalPages || 0);
      } else {
        console.error("Failed to fetch brand list");
      }
    } catch (error) {
      console.error("Error fetching brand list:", error);
    }
  };

  useEffect(() => {
    fetchfailedData();
  }, [failedpageIndex, failedpageSize, failedfilters]);
  const failedhandleNextPage = () => {
    if (failedpageIndex + 1 < failedtotalPages) setfailedPageIndex(prev => prev + 1);
  };

  const failedhandlePreviousPage = () => {
    if (failedpageIndex > 0) setfailedPageIndex(prev => prev - 1);
  };
  const FailedDliverycolumns = useMemo(
    () => [
      {
        header: 'S.No',
        cell: info => info.row.index + 1,
        size: 80,
      },
      {
        header: 'Order Code',
        accessorKey: 'orderCode',
        cell: info => info.getValue(),
      },
      {
        header: 'Customer',
        accessorFn: row => `${row.customerName} (${row.customerPhone})`,
        cell: info => info.getValue(),
      },
      {
        header: 'Deliveryman',
        accessorFn: row => row.deliveryman?.name || 'Unassigned',
        cell: info => info.getValue(),
      },
      {
        header: 'Shipping Address',
        accessorFn: row => {
          const addr = row.shippingAddress;
          return `${addr.street}, ${addr.city}, ${addr.state} - ${addr.postalCode}`;
        },
        cell: info => info.getValue(),
        size: 500,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: info => {
          const status = info.getValue();
          const statusColors = {
            cancelled: 'danger',
            pending: 'warning',
            completed: 'success',
            shipped: 'info',
            processing: 'primary'
          };

          return (
            <span className={`badge bg-${statusColors[status] || 'secondary'}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      },
      {
        header: 'Payment Status',
        accessorKey: 'paymentStatus',
        cell: info => {
          const status = info.getValue();
          return (
            <span className={`badge bg-${status === 'paid' ? 'success' : 'warning'}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      },
      {
        header: 'Order Date',
        accessorKey: 'createdAt',
        cell: info => new Date(info.getValue()).toLocaleDateString(),
      },
    ],
    []
  );
  const fetchpersonalData = async () => {
    try {
      const input = {
        page: personalpageIndex,
        limit: personalpageSize,
        filters: personalfilters,
        startDate: startDate,
        endDate: endDate
      };
      // Convert filters array to filters object
      const response = await apiProvider.deliveryManPersonalPerformanceList(input);
      if (response.status) {
        setpersonalData(response.response.data || []);
        console.log(response.response.data, "response")
        setpersonalTotalPages(response.response.totalPages || 0);
      } else {
        console.error("Failed to fetch brand list");
      }
    } catch (error) {
      console.error("Error fetching brand list:", error);
    }
  };

  useEffect(() => {
    fetchpersonalData();
  }, [failedpageIndex, personalpageSize, personalfilters]);
  const personalhandleNextPage = () => {
    if (personalpageIndex + 1 < personaltotalPages) setpersonalPageIndex(prev => prev + 1);
  };

  const personalhandlePreviousPage = () => {
    if (personalpageIndex > 0) setpersonalPageIndex(prev => prev - 1);
  };
  const Personalcolumns = useMemo(
    () => [
      {
        header: 'S.No',
        cell: info => info.row.index + 1,
      },
      {
        header: 'Deliveryman Name',
        accessorKey: 'deliverymanName',
        cell: info => info.getValue(),
      },
      {
        header: 'Total Delivered',
        accessorKey: 'totalDelivered',
        cell: info => info.getValue(),
      },
      {
        header: 'Total Orders',
        accessorKey: 'totalOrders',
        cell: info => info.getValue(),
      },
      {
        header: 'Delivery Rate',
        accessorKey: 'deliveryRate',
        cell: info => {
          const delivered = info.row.original.totalDelivered;
          const total = info.row.original.totalOrders;
          const rate = total > 0 ? ((delivered / total) * 100).toFixed(2) + '%' : '0%';
          return rate;
        },
      },
    ],
    []
  );
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <ul className="nav nav-pills rep nav-justified " role="tablist">
                <li className="nav-item waves-effect waves-light" role="presentation" style={{ backgroundColor: 'gainsboro', borderRadius: '5px' }}>
                  <a className="nav-link active" data-bs-toggle="tab" href="#updateorder-1" role="tab" aria-selected="true">
                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                    <span className="d-none d-sm-block">Delivery Performance <br />Report</span>
                  </a>
                </li>
                <li className="nav-item waves-effect waves-light" role="presentation" style={{ backgroundColor: 'gainsboro', borderRadius: '5px' }}>
                  <a className="nav-link" data-bs-toggle="tab" href="#updatepayment-1" role="tab" aria-selected="false">
                    <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                    <span className="d-none d-sm-block">Failed Deliveries <br />Report</span>
                  </a>
                </li>

                <li className="nav-item waves-effect waves-light" role="presentation" style={{ backgroundColor: 'gainsboro', borderRadius: '5px' }}>
                  <a className="nav-link" data-bs-toggle="tab" href="#generate-1" role="tab" aria-selected="false">
                    <span className="d-block d-sm-none"><i className="fas fa-cog"></i></span>
                    <span className="d-none d-sm-block">Top Performing Delivery <br />Personnel</span>
                  </a>
                </li>
              </ul>

              {/* Tab panes */}
              <div className="tab-content p-3 text-muted">
                <div className="tab-pane active" id="updateorder-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title me-2">Orders delivered on time vs delayed</h5>
                      <div className='col-12'>
                        <DateDeliveryFilter
                          startDate={startDate}
                          setStartDate={setStartDate}
                          endDate={endDate}
                          setEndDate={setEndDate}
                          deliveryMenOptions={deliveryMenOptions}
                          selectedDeliveryMan={selectedDeliveryMan}
                          setSelectedDeliveryMan={setSelectedDeliveryMan}
                        />
                        <div className='table-responsive'>
                          <ReactTableComponent
                            data={performanceData}
                            columns={Performancecolumns}
                            filterableColumns={performanceFilter}
                            pageIndex={performancepageIndex}
                            totalPages={performancetotalPages}
                            onNextPage={performancehandleNextPage}
                            onPreviousPage={performancehandlePreviousPage}
                            filters={performancefilters}
                            setFilters={setperformanceFilters}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-pane" id="updatepayment-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title me-2">Reasons for delivery failures</h5>
                      <DateDeliveryFilter
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        deliveryMenOptions={deliveryMenOptions}
                        selectedDeliveryMan={selectedDeliveryMan}
                        setSelectedDeliveryMan={setSelectedDeliveryMan}
                      />
                      <div className='table-responsive'>
                        <ReactTableComponent
                          data={failedData}
                          columns={FailedDliverycolumns}
                          filterableColumns={failedFilter}
                          pageIndex={failedpageIndex}
                          totalPages={failedtotalPages}
                          onNextPage={failedhandleNextPage}
                          onPreviousPage={failedhandlePreviousPage}
                          filters={failedfilters}
                          setFilters={setfailedFilters}
                        />
                      </div>
                    </div>
                  </div>
                </div>



                <div className="tab-pane" id="generate-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title me-2">Most efficient delivery staff based on success rate</h5>
                      <DateDeliveryFilter
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        deliveryMenOptions={deliveryMenOptions}
                        selectedDeliveryMan={selectedDeliveryMan}
                        setSelectedDeliveryMan={setSelectedDeliveryMan}
                      />
                      <div className='table-responsive'>
                        <ReactTableComponent
                          data={personalData}
                          columns={Performancecolumns}
                          // filterableColumns={attributeFilter}
                          pageIndex={personalpageIndex}
                          totalPages={personaltotalPages}
                          onNextPage={personalhandleNextPage}
                          onPreviousPage={personalhandlePreviousPage}
                        // filters={filters}
                        // setFilters={setFilters}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>{/* end card-body */}
          </div>{/* end card */}
        </div>{/* end col */}
      </div>
    </div>
  );
}

export const DateDeliveryFilter = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  deliveryMenOptions,
  selectedDeliveryMan,
  setSelectedDeliveryMan
}) => {
  return (
    <div className='row justify-content-between align-items-center'>
      <div className='col-md-3'>
        <div className="form-group mb-3">
          <label className="form-label">Start Date*</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
      </div>
      <div className='col-md-3'>
        <div className="form-group mb-3">
          <label className="form-label">End Date*</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      {/* <div className='col-md-3'>
        <div className="mb-3">
          <label className="form-label">Select Delivery Man</label>
          <select
            className="form-select"
            value={selectedDeliveryMan}
            onChange={(e) => setSelectedDeliveryMan(e.target.value)}
          >
            <option value="">Select delivery man</option>
            {deliveryMenOptions.map((deliveryMan) => (
              <option
                key={deliveryMan._id}
                value={deliveryMan._id}
              >
                {deliveryMan.name}
              </option>
            ))}
          </select>
        </div>
      </div> */}
    </div>
  );
};

