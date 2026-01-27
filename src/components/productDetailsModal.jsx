import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './styles/productDetailsModal.css';

export default function ProductDetailsModal({ show, onHide, product }) {
  if (!product) return null;

  // Enhanced helper function to find attribute value by ID
  const findAttributeValue = (id, attributeDetails) => {
    if (!attributeDetails || !Array.isArray(attributeDetails)) return id;

    for (const attr of attributeDetails) {
      // Check if value exists and is an array
      if (attr.value && Array.isArray(attr.value)) {
        const found = attr.value.find(val => val._id === id);
        if (found) return found.value;
      }
    }
    return id; // Return ID itself if value not found
  };
  console.log(product, "product")
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold">Product Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        <div className="container-fluid">
          {/* Basic Product Info */}
          {[
            { label: 'Product Name', value: product.productName || '-' },
            { label: 'Product Code', value: product.productCode || '-' },
            { label: 'Short Description', value: product.shortDescription || '-' },
            { label: 'Brand', value: product.brandName || '-' },
            { label: 'Category', value: product.categoryName || '-' },
            { label: 'Sub Category', value: product.subCategoryName || '-' },
            { label: 'Child Category', value: product.childCategoryName || '-' },
            // { label: 'Vendor', value: product.vendorName || '-' },
            { label: 'Status', value: product.productStatus ? 'Active' : 'Inactive' },
            // { label: 'Delivery', value: product.delivery || '-' },
            { label: 'Refundable', value: product.refundable ? 'Yes' : 'No' },
            { label: 'Tag / Label', value: product.tagAndLabel || '-' },
            { label: 'Low Stock Alert', value: product.lowStockAlert ? 'Yes' : 'No' },
            { label: 'Low Stock Quantity', value: product.lowStockQuantity || '-' },
            // ... other basic fields ...
          ].map((item, idx) => (
            <div className="row mb-2" key={idx}>
              <div className="col-md-4 text-muted fw-semibold">{item.label}</div>
              <div className="col-md-8">{item.value}</div>
            </div>
          ))}

          {/* Attributes Section */}
          {['wholesaler', 'customer'].map((type) => {
            const attributeDetails = product[`${type}AttributeDetails`] || [];
            const attributeData = product[`${type}Attribute`] || {};
            const rowData = attributeData.rowData || [];

            if (rowData.length === 0) return null;

            return (
              <div className="mt-4" key={type}>
                <h6 className="text-muted text-uppercase fw-bold">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Attributes
                </h6>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        {/* Dynamically create headers based on attribute names */}
                        {attributeDetails.map((attr) => (
                          <th key={attr.attributeId}>{attr.name || 'Attribute'}</th>
                        ))}

                        {type === 'wholesaler' ? (
                          <>
                            <th>SKU</th>
                            <th>Stock</th>
                            <th>Max Limit</th>
                            <th>Shipping Weight</th>
                            <th>MRP</th>
                            <th>Silver Price</th>
                            <th>Gold Price</th>
                            <th>Platinum Price</th>
                          </>
                        ) : (
                          <>
                            <th>SKU</th>
                            <th>Stock</th>
                            <th>Max Limit</th>
                            <th>Shipping Weight</th>
                             <th>MRP</th>
                             <th>Price</th>
                            <th>Silver Price</th>
                            <th>Gold Price</th>
                            <th>Platinum Price</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {rowData.map((row, i) => (
                        <tr key={i}>
                          {/* Dynamically create cells for each attribute */}
                          {attributeDetails.map((attr) => {
                            // Try to find the attribute value by name first, then by ID
                            const attrValue = row[attr.name] || row[attr.attributeId];
                            return (
                              <td key={`${attr.attributeId}-${i}`}>
                                {attrValue ? findAttributeValue(attrValue, attributeDetails) : '-'}
                              </td>
                            );
                          })}

                          {type === 'wholesaler' ? (
                            <>
                              <td>{row.sku || '-'}</td>
                              <td>{row.stock || '-'}</td>
                              <td>{row.maxLimit || '-'}</td>
                              <td>{row.shippingWeight || '-'}</td>
                              <td>{row.wholesalermrp || '-'}</td>
                              <td>{row.silver || '-'}</td>
                              <td>{row.gold || '-'}</td>
                              <td>{row.platinum || '-'}</td>
                            </>
                          ) : (
                            <>
                              <td>{row.sku || '-'}</td>
                              <td>{row.stock || '-'}</td>
                              <td>{row.maxLimit || '-'}</td>
                              <td>{row.shippingWeight || '-'}</td>
                              <td>{row.customermrp || '-'}</td>
                              <td>{row.price || '-'}</td>
                              <td>{row.silver || '-'}</td>
                              <td>{row.gold || '-'}</td>
                              <td>{row.platinum || '-'}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}