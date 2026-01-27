import React from "react";

export default function InventoryLogLayer() {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xxl-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-wrap align-items-center mb-3">
                  <h5 className="card-title me-2">Inventory Log</h5>
                  <div className="ms-auto">
                    <a href="download-link" download>
                      <button
                        type="button"
                        className="btn btn-success waves-effect waves-light"
                      >
                        <i className="fa fa-download font-size-16 align-middle me-2"></i>
                        Download
                      </button>
                    </a>
                  </div>
                </div>

                <div style={{ maxHeight: "332px", overflowY: "auto" }}>
                  <div className="table-responsive">
                    <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Log ID</th>
                          <th>Date & Time</th>
                          <th>Warehouse Name</th>
                          <th>Product Name</th>
                          <th>SKU</th>
                          <th>Previous Stock</th>
                          <th>Updated Stock</th>
                          <th>Update Type</th>
                          <th>Updated By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            id: 1,
                            logId: "LOG001",
                            date: "15-03-2024 10:30",
                            warehouse: "Warehouse A",
                            product: "Chocolate Bar",
                            sku: "CB001",
                            prevStock: 500,
                            updatedStock: 450,
                            updateType: "Import",
                            updatedBy: "Admin1",
                          },
                          {
                            id: 2,
                            logId: "LOG001",
                            date: "10-03-2024 14:20",
                            warehouse: "Warehouse A",
                            product: "Soft Drink",
                            sku: "SD002",
                            prevStock: 300,
                            updatedStock: 350,
                            updateType: "Import",
                            updatedBy: "User2",
                          },
                          {
                            id: 3,
                            logId: "LOG001",
                            date: "12-03-2024 09:45",
                            warehouse: "Warehouse A",
                            product: "Instant Noodles",
                            sku: "IN003",
                            prevStock: 250,
                            updatedStock: 200,
                            updateType: "Import",
                            updatedBy: "Admin2",
                          },
                          {
                            id: 4,
                            logId: "LOG001",
                            date: "28-02-2024 16:10",
                            warehouse: "Warehouse A",
                            product: "Cooking Oil",
                            sku: "CO004",
                            prevStock: 100,
                            updatedStock: 0,
                            updateType: "Import",
                            updatedBy: "Admin3",
                          },
                          {
                            id: 5,
                            logId: "LOG002",
                            date: "20-03-2024 12:00",
                            warehouse: "Warehouse B",
                            product: "Biscuits",
                            sku: "BC005",
                            prevStock: 600,
                            updatedStock: 550,
                            updateType: "Manual Update",
                            updatedBy: "User3",
                          },
                          {
                            id: 6,
                            logId: "LOG002",
                            date: "14-03-2024 08:30",
                            warehouse: "Warehouse B",
                            product: "Toothpaste",
                            sku: "TP006",
                            prevStock: 450,
                            updatedStock: 500,
                            updateType: "Manual Update",
                            updatedBy: "Admin1",
                          },
                          {
                            id: 7,
                            logId: "LOG002",
                            date: "05-03-2024 11:15",
                            warehouse: "Warehouse B",
                            product: "Laundry Detergent",
                            sku: "LD007",
                            prevStock: 200,
                            updatedStock: 180,
                            updateType: "Manual Update",
                            updatedBy: "Admin4",
                          },
                          {
                            id: 8,
                            logId: "LOG002",
                            date: "18-03-2024 17:25",
                            warehouse: "Warehouse B",
                            product: "Fruit Juice",
                            sku: "FJ008",
                            prevStock: 350,
                            updatedStock: 400,
                            updateType: "Manual Update",
                            updatedBy: "User1",
                          },
                          {
                            id: 9,
                            logId: "LOG003",
                            date: "08-03-2024 15:50",
                            warehouse: "Warehouse C",
                            product: "Rice (5kg)",
                            sku: "RC009",
                            prevStock: 150,
                            updatedStock: 100,
                            updateType: "Stock Transfer",
                            updatedBy: "Admin2",
                          },
                          {
                            id: 10,
                            logId: "LOG004",
                            date: "16-03-2024 13:40",
                            warehouse: "Warehouse D",
                            product: "Hand Wash",
                            sku: "HW010",
                            prevStock: 280,
                            updatedStock: 300,
                            updateType: "Manual Update",
                            updatedBy: "Admin3",
                          },
                        ].map((log, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}.</td>
                            <td>{log.logId}</td>
                            <td>{log.date}</td>
                            <td>{log.warehouse}</td>
                            <td>{log.product}</td>
                            <td>{log.sku}</td>
                            <td>{log.prevStock}</td>
                            <td>{log.updatedStock}</td>
                            <td>{log.updateType}</td>
                            <td>{log.updatedBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
