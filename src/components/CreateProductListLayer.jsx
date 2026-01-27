import React, { useEffect, useState } from "react";
import "./styles/createProductListLayer.css";
import "@mdi/font/css/materialdesignicons.min.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import catetgoryProvider from "../apiProvider/categoryapi";
import subCategory from "../apiProvider/subcategoryapi";
import childCategory from "../apiProvider/childcategoryapi";
import BrandApi from "../apiProvider/brand";
import Attribute from "../apiProvider/attribute";
import {
  MultiSelect,
  Select,
  TextInput,
  Button,
  ActionIcon,
  Text,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import vendorApi from "../apiProvider/vendor";
import productApi from "../apiProvider/product";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleFormProduct } from "../redux/slices/product";
import { IMAGE_BASE_URL } from "../network/apiClient";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const CreateProductListLayer = () => {
  const dispatch = useDispatch();

  const [isMetaTagsOpen, setIsMetaTagsOpen] = useState(false);
  const [isAttributesOpen, setIsAttributesOpen] = useState(false);
  const [isDeliveryOptionOpen, setIsDeliveryOptionOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const [isExpanded, setIsExpanded] = useState(true);

  const [errors, setErrors] = useState({});
  const selector = useSelector((state) => state.product);
  const [columnsCustomer, setColumnsCustomer] = useState([]);
  const [cutomerDynamicColum, setCustomerDynamicColum] = useState([]);

  const [columns, setColumns] = useState([]);
  const [wholesalerDynamicColum, setwholesalerDynamicColum] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [initialData] = useState({
    category: "",
    subCategory: "",
    childCategory: "",
    brand: "",
    productName: "",
    productImage: [],
    additionalImages: [],
    shortDescription: "",
    slug: "",
    lowStockAlert: false,
    tagsLabel: "Select",
    refundable: "Yes",
    productStatus: "active",
    description: "",
    hsn: "",
    customerDiscunt: "",
    customerTax: "",

    wholeSalerDiscunt: "",
    wholeSalerTax: "",

    wholesalerAttribute: {
      attributeId: [],
      rowData: [],
    },
    customerAttribute: {
      attributeId: [],
      rowData: [],
    },

    metaTitle: "",
    metaKey: "",
    metaDescription: "",

    selectDeliveryOption: "",

    vendorNameSelect: "",

    isApplicableToCustomer: false,
    isApplicableToWholesaler: false,
    lowStockQuantity: 0,
    quantityPerPack: 0,
    packingType: "",
    isIncentive: false,
    showToLineman: false,
  });
  const [formData, setFormData] = useState(initialData);
  const [categoryData, setCategories] = useState([]);
  const [subCategoryData, setSubCategory] = useState([]);
  const [childCategoryData, setchldCategory] = useState([]);
  const [brandData, setBrand] = useState([]);
  const [attributeData, setAttribute] = useState([]);
  const [vendorData, setVendor] = useState([]);

  const [taxes, setTaxes] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const productResult = await productApi.getTax();

    if (productResult.status) {
      setTaxes(productResult.response.data);
    }
  };
  const categoryDtls = async () => {
    const response = await catetgoryProvider.getCategory();

    if (response) {
      setCategories(response?.data?.data?.items);
    }
  };

  useEffect(() => {
    const slug = formData.productName
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/\-+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({ ...prev, slug }));
  }, [formData.productName]);

  useEffect(() => {
    subCategoryDtls();
  }, [formData?.category]);
  const subCategoryDtls = async () => {
    if (!formData?.category) {
      setSubCategory([]);
      return;
    }

    setLoading(true);
    try {
      const input = {
        categoryId: formData.category,
        limit: 100,
        page: 0,
      };
      const response = await subCategory.getSubCategorys(input);

      if (response?.status) {
        setSubCategory(response.response?.data?.data?.items || []);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    childCategoryDtls();
  }, [formData?.subCategory]);
  const childCategoryDtls = async () => {
    try {
      const input = {
        subcategoryId: formData.subCategory,
        limit: 100,
        page: 0,
      };
      const response = await childCategory.getChildCategorys(input);

      if (response?.status) {
        const items = response.response?.data?.items || [];
        setchldCategory(items);
      }
    } catch (error) {
      console.error("Error in childCategoryDtls:", error);
      setchldCategory([]);
    }
  };
  useEffect(() => {
    brandsDtls();
  }, [formData?.brandsDtls]);
  const brandsDtls = async () => {
    const input = {
      type: "all",
      page: 0,
      limit: 100,
    };
    const response = await BrandApi.brandList(input);

    if (response?.status) {
      setBrand(response.response.data);
    }
  };

  const attributeDtls = async () => {
    const input = {
      type: "all",
    };
    const response = await Attribute.attributeList(input);

    if (response?.status) {
      setAttribute(response.response.data);
    }
  };

  const vendorDtls = async () => {
    const input = {
      type: "all",
    };
    const response = await vendorApi.vendorList(input);

    if (response?.status) {
      setVendor(response.response.data);
    }
  };

  const getImageUrl = (img) =>
    `${IMAGE_BASE_URL}/${img.docPath}/${img.docName}`;
  const urlToFile = async (url, fileName, mimeType) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], fileName, { type: mimeType });
  };

  const setUpdatedData = async () => {
    setLoading(true);

    const response = await productApi.productDetails(selector.id);

    if (response.status) {
      const resp = response.response.data;

      const existingImages = await Promise.all(
        (resp.productImage || []).map(async (img) => {
          const url = `${IMAGE_BASE_URL}/${img.docPath}/${img.docName}`;
          return await urlToFile(
            url,
            img.originalName || img.docName,
            "image/png"
          );
        })
      );

      const additinalImag = await Promise.all(
        (resp.additionalImage || []).map(async (img) => {
          const url = `${IMAGE_BASE_URL}/${img.docPath}/${img.docName}`;
          return await urlToFile(
            url,
            img.originalName || img.docName,
            "image/png"
          );
        })
      );

      setFormData({
        category: resp.categoryId || "",
        subCategory: resp.subCategory || "",
        childCategory: resp.childCategory || "",
        brand: resp.brand || "",
        productName: resp.productName || "",
        hsn: resp.hsn || "",
        productImage: existingImages || [],
        additionalImages: additinalImag || [],
        shortDescription: resp.shortDescription || "",
        slug: resp.slug || "",
        lowStockAlert: resp.lowStockAlert || false,
        tagsLabel: resp.tagAndLabel || "Select",
        refundable: resp.refundable ? "Yes" : "No",
        productStatus: resp.productStatus ? "active" : "inactive",
        description: resp.description || "",
        lowStockQuantity: resp.lowStockQuantity || "",
        customerDiscunt: resp.customerDiscount?.toString() || "",
        customerTax: resp.customerTax?.toString() || "",
        wholeSalerDiscunt: resp.wholesalerDiscount?.toString() || "",
        wholeSalerTax: resp.wholesalerTax?.toString() || "",

        wholesalerAttribute: {
          attributeId: resp.wholesalerAttribute?.attributeId || [],
          rowData: resp.wholesalerAttribute?.rowData.map((row) => ({
            ...row,
            shippingWeight: row.shippingWeight || "",
            wholesalermrp: row.wholesalermrp || "",
            silver: row.silver || "",
            gold: row.gold || "",
            platinum: row.platinum || "",
          })) || [],
        },

        customerAttribute: {
          attributeId: resp.customerAttribute?.attributeId || [],
          rowData:
            resp.customerAttribute?.rowData.map((row) => ({
              ...row,
              shippingWeight: row.shippingWeight || "",
              customermrp: row.customermrp || "",
              price: row.price || "",
            })) || [],
        },

        metaTitle: resp.metaTitle || "",
        metaKey: resp.metaKeyword || "",
        metaDescription: resp.metaDesc || "",

        selectDeliveryOption: resp.delivery || "",
        vendorNameSelect: resp.vendorId || "",

        isApplicableToCustomer: resp.applicableForCustomer || false,
        isApplicableToWholesaler: resp.applicableForWholesale || false,
        quantityPerPack: resp.quantityPerPack || 0,
        packingType: resp.packingType || "",
        isIncentive: resp.isIncentive || false,
        showToLineman: resp.showToLineman || false,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          categoryDtls(),
          brandsDtls(),
          attributeDtls(),
          vendorDtls(),
          selector.isEdit ? setUpdatedData() : Promise.resolve(),
        ]);

        if (selector.isEdit) {
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error while fetching initial data:", error);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (
      selector.isEdit &&
      attributeData.length > 0 &&
      formData.customerAttribute.attributeId.length > 0
    ) {
      generateTableDataCustomer();
    }

    if (
      selector.isEdit &&
      attributeData.length > 0 &&
      formData.wholesalerAttribute.attributeId.length > 0
    ) {
      generateTableData();
    }
  }, [
    attributeData,
    formData.customerAttribute.attributeId,
    selector.isEdit,
    formData.wholesalerAttribute.attributeId,
  ]);

  const getAttributeOptions = (attributeName) => {
    const attr = attributeData.find((a) => a.name === attributeName);
    return attr?.value.map((v) => ({ value: v._id, label: v.value })) || [];
  };

  const cartesian = (arrays) =>
    arrays.reduce(
      (acc, curr) =>
        acc.flatMap((a) => curr.map((b) => ({ ...a, ...b }))),
      [{}]
    );

  const generateAttributeTable = (
    attributeKey,
    setDynamicColum,
    setColumns,
    defaultRow,
    staticCols
  ) => {
    const selectedAttributes = formData[attributeKey].attributeId
      .map((id) =>
        attributeData.find((attr) => attr._id.toString() === id.toString())
      )
      .filter(Boolean);

    const attributeValues = selectedAttributes.map((attr) =>
      attr.value.map((v) => ({ [attr.name]: v._id }))
    );

    const combinations = cartesian(attributeValues);

    const shouldPreserve =
      attributeKey === "wholesalerAttribute"
        ? formData.wholesalerAttribute.rowData.length > 0 && selector.isEdit
        : formData.customerAttribute.rowData.length > 0;

    const tableRows = shouldPreserve
      ? formData[attributeKey].rowData
      : combinations.slice(0, 1).map((combo) => ({
        ...combo,
        ...defaultRow,
      }));

    const dynamicNames = selectedAttributes.map((a) => a.name);
    setDynamicColum(dynamicNames);
    setColumns([...dynamicNames, ...staticCols]);

    setFormData((prev) => ({
      ...prev,
      [attributeKey]: {
        ...prev[attributeKey],
        rowData: tableRows,
      },
    }));
  };

  const generateTableData = () => {
    generateAttributeTable(
      "wholesalerAttribute",
      setwholesalerDynamicColum,
      setColumns,
      {
        sku: "",
        stock: "",
        maxLimit: "",
        shippingWeight: "",
        wholesalermrp: "",
        silver: "",
        gold: "",
        platinum: "",
      },
      [
        "sku",
        "stock",
        "maxLimit",
        "shippingWeight",
        "wholesalermrp",
        "silver",
        "gold",
        "platinum",
      ]
    );
  };

  const handleRowChange = (rowIndex, key, value) => {
    const updated = [...formData.wholesalerAttribute.rowData];
    updated[rowIndex][key] = value;

    const rowAttrs = wholesalerDynamicColum
      .map((k) => {
        return updated[rowIndex][k];
      })
      .join("_");

    let hasConflict = false;

    for (let i = 0; i < updated.length; i++) {
      if (i !== rowIndex) {
        const compareAttrs = wholesalerDynamicColum
          .map((k) => updated[i][k])
          .join("_");

        if (
          rowAttrs === compareAttrs &&
          updated[i]["sku"] !== updated[rowIndex]["sku"]
        ) {
          hasConflict = true;
          break;
        }
      }
    }

    if (hasConflict) {
      setErrors((prev) => ({
        ...prev,
        [rowIndex]: `Duplicate combination with different SKU found.`,
      }));
    } else {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[rowIndex];
        return updatedErrors;
      });
    }

    setFormData((prev) => ({
      ...prev,
      wholesalerAttribute: {
        ...prev.wholesalerAttribute,
        rowData: updated,
      },
    }));
  };

  const handleAddRow = () => {
    const newRow = {
      sku: "",
      stock: "",
      maxLimit: "",
      shippingWeight: "",
      wholesalermrp: "",
      silver: "",
      gold: "",
      platinum: "",
    };

    setFormData((prev) => ({
      ...prev,
      wholesalerAttribute: {
        ...prev.wholesalerAttribute,
        rowData: [...prev.wholesalerAttribute.rowData, newRow],
      },
    }));
  };

  const handleRemoveRow = (rowIndex) => {
    const updatedRows = formData.wholesalerAttribute.rowData.filter(
      (_, index) => index !== rowIndex
    );
    setFormData((prev) => ({
      ...prev,
      wholesalerAttribute: {
        ...prev.wholesalerAttribute,
        rowData: updatedRows,
      },
    }));
  };

  const getAttributeOptionsCustomer = (attributeName) => {
    const attr = attributeData.find((a) => a.name === attributeName);
    return attr?.value.map((v) => ({ value: v._id, label: v.value })) || [];
  };

  const generateTableDataCustomer = () => {
    generateAttributeTable(
      "customerAttribute",
      setCustomerDynamicColum,
      setColumnsCustomer,
      {
        sku: "",
        stock: "",
        maxLimit: "",
        shippingWeight: "",
        customermrp: "",
        price: "",
      },

      [
        "sku",
        "stock",
        "maxLimit",
        "shippingWeight",
        "customermrp",
        "price",
      ]
    );
  };

  const handleRowChangeCustomer = (rowIndex, key, value) => {
    const updated = [...formData.customerAttribute.rowData];
    updated[rowIndex][key] = value;

    const rowAttrs = cutomerDynamicColum
      .map((k) => {
        return updated[rowIndex][k];
      })
      .join("_");

    let hasConflict = false;

    for (let i = 0; i < updated.length; i++) {
      if (i !== rowIndex) {
        const compareAttrs = cutomerDynamicColum
          .map((k) => updated[i][k])
          .join("_");

        if (
          rowAttrs === compareAttrs &&
          updated[i]["sku"] !== updated[rowIndex]["sku"]
        ) {
          hasConflict = true;
          break;
        }
      }
    }

    if (hasConflict) {
      setErrors((prev) => ({
        ...prev,
        [rowIndex]: `Duplicate combination with different SKU found.`,
      }));
    } else {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[rowIndex];
        return updatedErrors;
      });
    }

    setFormData((prev) => ({
      ...prev,
      customerAttribute: {
        ...prev.customerAttribute,
        rowData: updated,
      },
    }));
  };

  const handleAddRowCustomer = () => {
    const newRow = {
      sku: "",
      stock: "",
      maxLimit: "",
      shippingWeight: "",
      customermrp: "",
      price: "",
      silver: "",
      gold: "",
      platinum: "",
    };


    setFormData((prev) => ({
      ...prev,
      customerAttribute: {
        ...prev.customerAttribute,
        rowData: [...prev.customerAttribute.rowData, newRow],
      },
    }));
  };

  const handleRemoveRowCustomer = (rowIndex) => {
    const updatedRows = formData.customerAttribute.rowData.filter(
      (_, index) => index !== rowIndex
    );
    setFormData((prev) => ({
      ...prev,
      customerAttribute: {
        ...prev.customerAttribute,
        rowData: updatedRows,
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeCheckBox = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, key) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png"];

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a valid JPG or PNG image.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setFormData((prev) => ({
      ...prev,
      [key]:
        key === "productImage"
          ? [validFiles[0]]
          : [...(prev[key] || []), ...validFiles],
    }));
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();

    setFormData((prev) => ({
      ...prev,
      description: data,
    }));
  };

  const Validate = () => {
    const newErrors = {};

    const checkRequired = (val, key, msg) => {
      if (
        !val ||
        (typeof val === "string" && !val.trim()) ||
        (Array.isArray(val) && val.length === 0)
      ) {
        newErrors[key] = msg;
      }
    };


    // Basic validations
    checkRequired(formData.category, "category", "Category is Required");
    checkRequired(
      formData.subCategory,
      "subCategory",
      "Sub Category is Required"
    );
    // checkRequired(
    //   formData.childCategory,
    //   "childCategory",
    //   "Child Category is Required"
    // );
    checkRequired(formData.brand, "brand", "Brand is Required");
    checkRequired(
      formData.productName,
      "productName",
      "Product Name is Required"
    );
    checkRequired(formData.slug, "slug", "Slug is Required");

    // Check if at least one attribute is selected
    if (
      formData.isApplicableToWholesaler &&
      formData.wholesalerAttribute.attributeId.length === 0
    ) {
      newErrors["wholesalerAttribute"] =
        "Please select at least one wholesaler attribute";
    }

    if (
      formData.isApplicableToCustomer &&
      formData.customerAttribute.attributeId.length === 0
    ) {
      newErrors["customerAttribute"] =
        "Please select at least one customer attribute";
    }

    // Product image validation
    if (!formData.productImage || formData.productImage.length === 0) {
      newErrors["productImage"] = "At least one product image is required";
    }

    // HSN validation
    if (!formData.hsn) {
      newErrors.hsn = "HSN code is required";
    } else if (!/^\d+$/.test(formData.hsn)) {
      newErrors.hsn = "HSN code must be numeric";
    } else if (![4, 6, 8].includes(formData.hsn.length)) {
      newErrors.hsn = "HSN code must be 4, 6, or 8 digits";
    }

    // Packing info validation
    checkRequired(
      formData.packingType,
      "packingType",
      "Packing Type is Required"
    );

    if (!formData.quantityPerPack) {
      newErrors.quantityPerPack = "Quantity Per Pack is Required";
    } else {
      const qty = Number(formData.quantityPerPack);
      if (isNaN(qty)) {
        newErrors.quantityPerPack = "Quantity must be a number";
      } else if (qty <= 0) {
        newErrors.quantityPerPack = "Quantity must be greater than 0";
      }
    }

    if (
      formData.isApplicableToWholesaler &&
      formData.wholesalerAttribute.rowData.length > 0
    ) {
      const wholesalerFields = [
        { field: "sku", label: "SKU" },
        { field: "stock", label: "Stock", isNum: true },
        { field: "maxLimit", label: "Max Limit", isNum: true },
        { field: "shippingWeight", label: "Shipping Weight", isNum: true },
        { field: "wholesalermrp", label: "MRP", isNum: true },
        { field: "silver", label: "Silver price", isNum: true },
        { field: "gold", label: "Gold price", isNum: true },
        { field: "platinum", label: "Platinum price", isNum: true },
      ];

      formData.wholesalerAttribute.rowData.forEach((row, rowIndex) => {
        // Validate all fields
        wholesalerFields.forEach(({ field, label, isNum }) => {
          const value = row[field];
          if (!value || value.toString().trim() === "") {
            newErrors[`wholesaler_${field}_${rowIndex}`] = `${label} is required`;
          } else if (isNum && isNaN(Number(value))) {
            newErrors[`wholesaler_${field}_${rowIndex}`] = `${label} must be a number`;
          } else if (isNum && Number(value) < 0) {
            newErrors[`wholesaler_${field}_${rowIndex}`] = `${label} cannot be negative`;
          }
        });

        // Validate dynamic attribute columns
        wholesalerDynamicColum.forEach((col) => {
          if (!row[col] || row[col].toString().trim() === "") {
            newErrors[`wholesaler_${col}_${rowIndex}`] = `${col} is required`;
          }
        });
      });
    } else if (formData.isApplicableToWholesaler) {
      newErrors["wholesalerAttributeTable"] =
        "Please generate and fill wholesaler attribute table";
    }

    // Customer attribute table validation
    if (
      formData.isApplicableToCustomer &&
      formData.customerAttribute.rowData.length > 0
    ) {
      const customerFields = [
        { field: "sku", label: "SKU" },
        { field: "stock", label: "Stock", isNum: true },
        { field: "maxLimit", label: "Max Limit", isNum: true },
        { field: "shippingWeight", label: "Shipping Weight", isNum: true },
        { field: "customermrp", label: "Customer MRP", isNum: true },
        { field: "price", label: "Price", isNum: true },
      ];

      formData.customerAttribute.rowData.forEach((row, rowIndex) => {
        // Validate all fields
        customerFields.forEach(({ field, label, isNum }) => {
          const value = row[field];
          if (!value || value.toString().trim() === "") {
            newErrors[`customer_${field}_${rowIndex}`] = `${label} is required`;
          } else if (isNum && isNaN(Number(value))) {
            newErrors[`customer_${field}_${rowIndex}`] = `${label} must be a number`;
          } else if (isNum && Number(value) < 0) {
            newErrors[`customer_${field}_${rowIndex}`] = `${label} cannot be negative`;
          }
        });

        // Specific MRP check
        if (
          row.customermrp &&
          row.price &&
          Number(row.customermrp) <= Number(row.price)
        ) {
          newErrors[`customer_mrp_${rowIndex}`] = `Customer MRP must be greater than Price`;
        }

        // Validate dynamic attribute columns
        cutomerDynamicColum.forEach((col) => {
          if (!row[col] || row[col].toString().trim() === "") {
            newErrors[`customer_${col}_${rowIndex}`] = `${col} is required`;
          }
        });
      });
    } else if (formData.isApplicableToCustomer) {
      newErrors["customerAttributeTable"] =
        "Please generate and fill customer attribute table";
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    dispatch(
      handleFormProduct({
        view: false,
        isEdit: false,
        id: "",
      })
    );
    setFormData({
      category: "",
      subCategory: "",
      childCategory: "",
      brand: "",
      productName: "",
      productImage: [],
      additionalImages: [],
      shortDescription: "",
      slug: "",
      hsn: "",
      lowStockAlert: false,
      tagsLabel: "Select",
      refundable: "Yes",
      productStatus: "Active",
      description: "",
      customerDiscunt: "",
      customerTax: "",

      wholeSalerDiscunt: "",
      wholeSalerTax: "",

      quantityPerPack: 0,
      packingType: "",

      wholesalerAttribute: {
        attributeId: [],
        rowData: [],
      },
      customerAttribute: {
        attributeId: [],
        rowData: [],
      },

      metaTitle: "",
      metaKey: "",
      metaDescription: "",

      selectDeliveryOption: "",

      vendorNameSelect: "",

      isApplicableToCustomer: false,
      isApplicableToWholesaler: false,
      lowStockQuantity: 0,
    });
    setTimeout(() => {
      navigate("/product");
    }, 1000);
  };

  const handleSubmit = async (e) => {
    console.log("Submitting form data:", formData);
    e.preventDefault();
    console.log("Validating form data...");
    const isvalidated = Validate();
    console.log("isvalidated", isvalidated);
    if (isvalidated) {
      console.log("Validation passed");
      if (!isEditing) {
        const formDataToSend = new FormData();

        formDataToSend.append("categoryId", formData.category);
        formDataToSend.append("subCategory", formData.subCategory);
        formDataToSend.append("childCategory", formData.childCategory);
        formDataToSend.append("productName", formData.productName);
        formDataToSend.append("brand", formData.brand);
        formDataToSend.append("shortDescription", formData.shortDescription);
        formDataToSend.append("slug", formData.slug);
        formDataToSend.append("hsn", formData.hsn);

        if (formData.productImage) {
          formData.productImage.forEach((img) => {
            formDataToSend.append("productImage", img);
          });
        }

        if (
          formData.additionalImages &&
          Array.isArray(formData.additionalImages)
        ) {
          formData.additionalImages.forEach((img) => {
            formDataToSend.append("additionalImages", img);
          });
        }

        formDataToSend.append(
          "lowStockAlert",
          String(formData.lowStockAlert === true)
        );
        formDataToSend.append("tagAndLabel", formData.tagsLabel);
        formDataToSend.append(
          "refundable",
          String(formData.refundable === "Yes" || formData.refundable === true)
        );
        formDataToSend.append(
          "productStatus",
          String(formData.productStatus === "active")
        );
        formDataToSend.append("description", formData.description);

        formDataToSend.append(
          "applicableForCustomer",
          String(formData.isApplicableToCustomer === true)
        );

        formDataToSend.append(
          "customerDiscount",
          String(Number(formData.customerDiscunt))
        );
        formDataToSend.append(
          "customerTax",
          String(Number(formData.customerTax))
        );

        formDataToSend.append(
          "applicableForWholesale",
          String(formData.isApplicableToWholesaler === true)
        );

        formDataToSend.append(
          "wholesalerDiscount",
          String(Number(formData.wholeSalerDiscunt))
        );
        formDataToSend.append(
          "wholesalerTax",
          String(Number(formData.wholeSalerTax))
        );

        formDataToSend.append(
          "wholesalerAttribute",
          JSON.stringify(formData.wholesalerAttribute)
        );
        formDataToSend.append(
          "customerAttribute",
          JSON.stringify(formData.customerAttribute)
        );

        formDataToSend.append("metaTitle", formData.metaTitle);
        formDataToSend.append("metaKeyword", formData.metaKey);
        formDataToSend.append("metaDesc", formData.metaDescription);

        formDataToSend.append("delivery", formData.selectDeliveryOption);
        formDataToSend.append("lowStockQuantity", formData.lowStockQuantity);
        formDataToSend.append("quantityPerPack", formData.quantityPerPack);
        formDataToSend.append("packingType", formData.packingType);
        formDataToSend.append("isIncentive", formData.isIncentive === true);
        formDataToSend.append(
          "showToLineman",
          formData.showToLineman === true
        );
        console.log("formDataToSend", formDataToSend);

        const response = await productApi.productcreate(formDataToSend);
        if (response.status) {
          setTimeout(() => {
            handleClose();
          }, 2000);
        }
      }

      if (isEditing) {
        const formDataToSend = new FormData();
        formDataToSend.append("categoryId", formData.category);
        formDataToSend.append("subCategory", formData.subCategory);
        formDataToSend.append("childCategory", formData.childCategory);
        formDataToSend.append("productName", formData.productName);
        formDataToSend.append("brand", formData.brand);
        formDataToSend.append("shortDescription", formData.shortDescription);
        formDataToSend.append("slug", formData.slug);
        formDataToSend.append("hsn", formData.hsn);

        if (formData.productImage) {
          formData.productImage.forEach((img) => {
            if (img instanceof File) {
              formDataToSend.append("productImage", img);
            }
          });
        }

        if (
          formData.additionalImages &&
          Array.isArray(formData.additionalImages)
        ) {
          formData.additionalImages.forEach((img) => {
            formDataToSend.append("additionalImages", img);
          });
        }

        formDataToSend.append(
          "lowStockAlert",
          String(formData.lowStockAlert === true)
        );
        formDataToSend.append("tagAndLabel", formData.tagsLabel);
        formDataToSend.append(
          "refundable",
          String(formData.refundable === "Yes" || formData.refundable === true)
        );
        formDataToSend.append(
          "productStatus",
          String(formData.productStatus === "active")
        );
        formDataToSend.append("description", formData.description);

        formDataToSend.append(
          "applicableForCustomer",
          String(formData.isApplicableToCustomer === true)
        );

        formDataToSend.append(
          "customerDiscount",
          String(Number(formData.customerDiscunt))
        );
        formDataToSend.append(
          "customerTax",
          String(Number(formData.customerTax))
        );

        formDataToSend.append(
          "applicableForWholesale",
          String(formData.isApplicableToWholesaler === true)
        );

        formDataToSend.append(
          "wholesalerDiscount",
          String(Number(formData.wholeSalerDiscunt))
        );
        formDataToSend.append(
          "wholesalerTax",
          String(Number(formData.wholeSalerTax))
        );

        formDataToSend.append(
          "wholesalerAttribute",
          JSON.stringify(formData.wholesalerAttribute)
        );
        formDataToSend.append(
          "customerAttribute",
          JSON.stringify(formData.customerAttribute)
        );

        formDataToSend.append("metaTitle", formData.metaTitle);
        formDataToSend.append("metaKeyword", formData.metaKey);
        formDataToSend.append("metaDesc", formData.metaDescription);
        formDataToSend.append("delivery", formData.selectDeliveryOption);
        formDataToSend.append("lowStockQuantity", formData.lowStockQuantity);
        formDataToSend.append("quantityPerPack", formData.quantityPerPack);
        formDataToSend.append("packingType", formData.packingType);
        formDataToSend.append(
          "isIncentive",
          String(formData.isIncentive === true)
        );
        formDataToSend.append(
          "showToLineman",
          String(formData.showToLineman === true)
        );

        formDataToSend.append("id", selector.id);
        const response = await productApi.updateproduct(
          formDataToSend,
          selector.id
        );

        if (response.status) {
          setTimeout(() => {
            handleClose();
          }, 2000);
        }
      }
    }
  };

  const handleDeleteImage = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      productImage: prevData.productImage.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleDeleteAdditionalImage = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      additionalImages: prevData.additionalImages.filter(
        (_, i) => i !== indexToRemove
      ),
    }));
  };

  const formatHeaderName = (header) => {
    const specialCases = {
      sku: "SKU",
      stock: "Stock",
      maxlimit: "Max Limit",
      shippingweight: "Shipping Weight",
      wholesalermrp: "Wholesaler MRP",
      silver: "Silver Price",
      gold: "Gold Price",
      platinum: "Platinum Price",
      price: "Price",
      customermrp: "Customer MRP",
    };

    const lowerHeader = header.toLowerCase();
    if (specialCases[lowerHeader]) {
      return specialCases[lowerHeader];
    }

    return header
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return <>Loading....</>;
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div id="addproduct-accordion" className="custom-accordion">
              {/* General Info Section */}
              <div className="card mb-4">
                <a
                  href="#addproduct-productinfo-collapse"
                  className={`text-body ${isExpanded ? "" : "collapsed"}`}
                  data-bs-toggle="collapse"
                  aria-expanded={isExpanded}
                  aria-controls="addproduct-productinfo-collapse"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  <div className="p-4">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <div className="avatar-title custom-avatar rounded-circle bg-primary-subtle text-primary d-flex justify-content-center align-items-center">
                            <h5 className="text-primary font-size-17 mb-0">
                              01
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-size-16 mb-1">General Info</h5>
                        <p className="text-muted text-truncate mb-0">
                          Fill all information below
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <i
                          className={`mdi mdi-chevron-${isExpanded ? "up" : "down"
                            } accor-down-icon font-size-24`}
                        ></i>
                      </div>
                    </div>
                  </div>
                </a>

                <div
                  id="addproduct-productinfo-collapse"
                  className={`collapse ${isExpanded ? "show" : ""}`}
                  data-bs-parent="#addproduct-accordion"
                >
                  <div className="p-4 border-top">
                    <form>
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="category">
                              Category
                            </label>
                            <select
                              id="category"
                              name="category"
                              className="form-control"
                              value={formData.category}
                              onChange={(e) => {
                                handleChange(e);
                                categoryDtls(e.target.value);
                              }}
                            >
                              <option value="">Select Category</option>
                              {categoryData?.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                            {errors.category && (
                              <div className="text-danger">
                                {errors.category}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="subCategory">
                              Sub Category
                            </label>
                            <select
                              id="subCategory"
                              name="subCategory"
                              className="form-control"
                              value={formData.subCategory}
                              onChange={(e) => {
                                handleChange(e);
                                childCategoryDtls(e.target.value);
                              }}
                            >
                              <option value="">Select Sub Category</option>
                              {subCategoryData?.map((sub) => (
                                <option key={sub._id} value={sub._id}>
                                  {sub.name}
                                </option>
                              ))}
                            </select>
                            {errors.subCategory && (
                              <div className="text-danger">
                                {errors.subCategory}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="childCategory"
                            >
                              Child Category
                            </label>
                            <select
                              id="childCategory"
                              name="childCategory"
                              className="form-control"
                              value={formData.childCategory}
                              onChange={handleChange}
                              styles={{
                                option: (provided) => ({
                                  ...provided,
                                  height: "100px",
                                  padding: "10px",
                                }),
                              }}
                            >
                              <option value="">Select Child Category</option>
                              {childCategoryData?.map((child) => (
                                <option key={child._id} value={child._id}>
                                  {child.name}
                                </option>
                              ))}
                            </select>
                            {errors.childCategory && (
                              <div className="text-danger">
                                {errors.childCategory}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-3">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="brand">
                              Brand
                            </label>
                            <select
                              id="brand"
                              name="brand"
                              className="form-select"
                              value={formData.brand}
                              onChange={handleChange}
                            >
                              <option value="">Select Brand</option>
                              {brandData?.map((bramd) => (
                                <option key={bramd._id} value={bramd._id}>
                                  {bramd.name}
                                </option>
                              ))}
                            </select>
                            {errors.brand && (
                              <div className="text-danger">{errors.brand}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-3">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="productName">
                              Product name
                            </label>
                            <input
                              id="productName"
                              name="productName"
                              type="text"
                              className="form-control"
                              value={formData.productName}
                              onChange={handleChange}
                            />
                            {errors.productName && (
                              <div className="text-danger">
                                {errors.productName}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-3">
                          <div className="mb-3">
                            <label
                              htmlFor="shortDescription"
                              className="form-label"
                            >
                              Short Description
                            </label>
                            <textarea
                              id="shortDescription"
                              name="shortDescription"
                              className="form-control"
                              rows="1"
                              value={formData.shortDescription}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="slug">
                              Slug
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="slug"
                              value={formData.slug}
                              onChange={handleChange}
                            />

                            {errors.slug && (
                              <div className="text-danger">{errors.slug}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="packingType" className="form-label">
                              Packing Type
                            </label>
                            <select
                              className="form-select"
                              id="packingType"
                              name="packingType"
                              value={formData.packingType}
                              onChange={handleChange}
                            >
                              <option value="">Select Packing Type</option>
                              <option value="Bag">Bag</option>
                              <option value="Box">Box</option>
                            </select>
                            {errors.packingType && (
                              <div className="text-danger">
                                {errors.packingType}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label
                              htmlFor="quantityPerPack"
                              className="form-label"
                            >
                              Quantity Per Pack (Bag/Box)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="quantityPerPack"
                              name="quantityPerPack"
                              value={formData.quantityPerPack}
                              onChange={handleChange}
                              min={0}
                            />

                            {errors.quantityPerPack && (
                              <div className="text-danger">
                                {errors.quantityPerPack}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="Hsn">
                              HSN Code
                            </label>
                            <input
                              id=""
                              name="hsn"
                              type="text"
                              className="form-control"
                              value={formData.hsn}
                              onChange={handleChange}
                            />
                            {errors.hsn && (
                              <div className="text-danger">{errors.hsn}</div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="mb-3">
                            <label htmlFor="tagsLabel" className="form-label">
                              Tags &amp; Label
                            </label>
                            <select
                              id="tagsLabel"
                              className="form-select"
                              name="tagsLabel"
                              value={formData.tagsLabel}
                              onChange={handleChange}
                            >
                              <option>Select</option>
                              <option>Best Seller</option>
                              <option>New Arrival</option>
                              <option>Top Rated</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="refundable" className="form-label">
                              Refundable
                            </label>
                            <select
                              className="form-select"
                              id="refundable"
                              aria-label="Refundable select"
                              name="refundable"
                              value={formData.refundable}
                              onChange={handleChange}
                            >
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="mb-3">
                            <label
                              htmlFor="productStatus"
                              className="form-label"
                            >
                              Product Status
                            </label>
                            <select
                              className="form-select"
                              id="productStatus"
                              aria-label="Product status select"
                              name="productStatus"
                              value={formData.productStatus}
                              onChange={handleChange}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="col-lg-4 col-md-6 mb-3">
                            <div className="d-flex align-items-center">
                              <label
                                htmlFor="lowStockAlert"
                                className="form-label mb-0 me-3"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Low Stock Alert
                              </label>

                              <input
                                id="lowStockAlert"
                                name="lowStockAlert"
                                type="checkbox"
                                className="form-check-input"
                                checked={formData.lowStockAlert}
                                onChange={handleChangeCheckBox}
                              />
                            </div>
                          </div>

                          <div className="col-lg-4 col-md-6 mb-3">
                            {formData.lowStockAlert && (
                              <div className="d-flex flex-column">
                                <label
                                  htmlFor="lowStockQuantity"
                                  className="form-label mb-1"
                                >
                                  Alert Quantity
                                </label>
                                <input
                                  id="lowStockQuantity"
                                  name="lowStockQuantity"
                                  type="number"
                                  className="form-control"
                                  value={formData.lowStockQuantity || ""}
                                  onChange={handleChange}
                                  min="1"
                                  style={{ maxWidth: "150px" }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>



                      <div className="row">
                        <div className="col-xl-12">
                          <div className="card ">
                            <div className="card-header">
                              <h4 className="card-title mb-0">Description</h4>
                            </div>
                            <div className="card-body">
                              <CKEditor
                                editor={ClassicEditor}
                                data={formData.description}
                                onChange={handleEditorChange}
                                className=""
                                config={{
                                  licenseKey: "GPL",
                                  toolbar: [
                                    "undo",
                                    "redo",
                                    "heading",
                                    "|",
                                    "bold",
                                    "italic",
                                    "link",
                                    "imageUpload",
                                    "insertTable",
                                    "blockQuote",
                                    "bulletedList",
                                    "numberedList",
                                    "|",
                                    "outdent",
                                    "indent",
                                    "|",
                                  ],
                                }}
                                style={{ minHeight: "300px" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Attributes Section */}
              <div className="card">
                <div className="p-4">
                  <div
                    className="d-flex align-items-center"
                    onClick={() => setIsAttributesOpen(!isAttributesOpen)}
                  >
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar">
                        <div className="avatar-title custom-avatar rounded-circle bg-primary-subtle text-primary d-flex justify-content-center align-items-center">
                          <h5 className="text-primary font-size-17 mb-0">04</h5>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <h5 className="font-size-16 mb-1">Attributes</h5>
                      <p className="text-muted text-truncate mb-0">
                        Fill all information below
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <i
                        className={`mdi ${isAttributesOpen
                          ? "mdi-chevron-up"
                          : "mdi-chevron-down"
                          } accor-down-icon font-size-24 cursor-pointer`}
                        onClick={() => setIsAttributesOpen(!isAttributesOpen)}
                      ></i>
                    </div>
                  </div>
                </div>
                {isAttributesOpen && (
                  <div className="p-4 border-top">


                    <h5 className="font-size-18 mt-5 mb-4">
                      Customer Attribute
                    </h5>
                    <form>
                      <div className="row">
                        <div>
                          <MultiSelect
                            label="Select Attributes"
                            placeholder="Pick one or more"
                            data={attributeData.map((attr) => ({
                              value: attr._id,
                              label: attr.name,
                            }))}
                            value={formData.customerAttribute.attributeId}
                            onChange={(selected) =>
                              setFormData((prev) => ({
                                ...prev,
                                customerAttribute: {
                                  ...prev.customerAttribute,
                                  attributeId: selected,
                                },
                              }))
                            }
                            searchable
                            nothingFound="No options"
                          />
                          {errors.customerAttribute && (
                            <p className="text-danger">
                              {errors.customerAttribute}
                            </p>
                          )}
                          <Button mt="md" onClick={generateTableDataCustomer}>
                            Generate Table
                          </Button>

                          {formData.customerAttribute.rowData.length > 0 && (
                            <table className="table mt-4">
                              <thead>
                                <tr>
                                  {columnsCustomer.map((col, idx) => (
                                    <th key={idx}>{formatHeaderName(col)}</th>
                                  ))}
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {formData.customerAttribute.rowData.map(
                                  (row, rowIndex) => (
                                    <React.Fragment key={rowIndex}>
                                      <tr key={rowIndex}>
                                        {columnsCustomer.map((col) => (
                                          <td key={col}>
                                            {[
                                              "sku",
                                              "stock",
                                              "maxLimit",
                                              "shippingWeight",
                                              "customermrp",
                                              "price",
                                            ].includes(col)
                                              ? (
                                                <TextInput
                                                  value={row[col]}
                                                  onChange={(e) =>
                                                    handleRowChangeCustomer(
                                                      rowIndex,
                                                      col,
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              ) : (
                                                <Select
                                                  data={getAttributeOptionsCustomer(
                                                    col
                                                  )}
                                                  value={row[col]}
                                                  onChange={(value) =>
                                                    handleRowChangeCustomer(
                                                      rowIndex,
                                                      col,
                                                      value
                                                    )
                                                  }
                                                  searchable
                                                />
                                              )}
                                          </td>
                                        ))}
                                        <td>
                                          <ActionIcon
                                            onClick={handleAddRowCustomer}
                                            color="green"
                                            title="Add Row"
                                          >
                                            <IconPlus />
                                          </ActionIcon>
                                          <ActionIcon
                                            onClick={() =>
                                              handleRemoveRowCustomer(rowIndex)
                                            }
                                            color="red"
                                            title="Remove Row"
                                            ml="md"
                                          >
                                            <IconTrash />
                                          </ActionIcon>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colSpan={columnsCustomer.length + 1}>
                                          {/* Display all errors for this row */}
                                          {Object.keys(errors).map((key) => {
                                            if (
                                              key.startsWith(`customer_`) &&
                                              key.endsWith(`_${rowIndex}`)
                                            ) {
                                              return (
                                                <p
                                                  key={key}
                                                  className="text-danger"
                                                  size="sm"
                                                  style={{ display: "block" }}
                                                >
                                                  {errors[key]}
                                                </p>
                                              );
                                            }
                                            return null;
                                          })}
                                          {errors[rowIndex] && (
                                            <p
                                              size="sm"
                                              className="text-danger"
                                            >
                                              {errors[rowIndex]}
                                            </p>
                                          )}
                                        </td>
                                      </tr>
                                    </React.Fragment>
                                  )
                                )}
                              </tbody>
                            </table>
                          )}
                          <div className="row mt-3">
                            <div className="col-lg-6 mb-3">
                              <label className="form-label">
                                Discount (if applicable)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="customerDiscunt"
                                value={formData.customerDiscunt}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-lg-6 mb-3">
                              <label className="form-label">Tax %</label>
                              <select
                                className="form-control"
                                name="customerTax"
                                value={formData.customerTax}
                                onChange={handleChange}
                                style={{ width: "99.5%" }}
                              >
                                <option value="">Select</option>
                                {taxes
                                  .filter((tax) => tax.isActive)
                                  .map((tax) => (
                                    <option key={tax._id} value={tax.taxRate}>
                                      {tax.taxName}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Meta Tags Section */}
              <div className="card mb-4">
                <div
                  className="text-body collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#meta-tags-collapse"
                  aria-expanded={isMetaTagsOpen}
                  aria-controls="meta-tags-collapse"
                  onClick={() => setIsMetaTagsOpen(!isMetaTagsOpen)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="p-16">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <div className="avatar-title custom-avatar rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
                            <h5 className="text-primary font-size-17 mb-0">
                              05
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 custom-title overflow-hidden">
                        <h5 className="font-size-16 mb-1">Product Meta Tags</h5>
                        <p className="text-muted text-truncate mb-0">
                          Fill all information below
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <i
                          className={`mdi ${isMetaTagsOpen
                            ? "mdi-chevron-up"
                            : "mdi-chevron-down"
                            } accor-down-icon font-size-24`}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  id="meta-tags-collapse"
                  className={`collapse ${isMetaTagsOpen ? "show" : ""}`}
                  data-bs-parent="#meta-tags-accordion"
                >
                  <div className="p-16 border-top">
                    <form>
                      <div className="row">
                        <div className="col-lg-12 mb-3">
                          <label className="form-label">Meta Title</label>
                          <input
                            type="text"
                            name="metaTitle"
                            value={formData.metaTitle}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>

                        <div className="col-lg-12 mb-3">
                          <label className="form-label">Meta Keywords</label>
                          <input
                            type="text"
                            name="metaKey"
                            value={formData.metaKey}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </div>
                        <div className="col-lg-12 mb-3">
                          <label className="form-label">Meta Description</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            name="metaDescription"
                            value={formData.metaDescription}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="card mb-4">
                <a
                  onClick={() => setImageOpen(!imageOpen)}
                  className={`text-body collbodyd ${imageOpen ? "" : "collapsed"
                    }`}
                  aria-haspopup="true"
                  aria-expanded={imageOpen}
                  aria-controls="addproduct-manufacturer-collapse"
                >
                  <div className="p-4">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <div className="avatar-title custom-avatar rounded-circle bg-primary-subtle text-primary d-flex justify-content-center align-items-center">
                            <h5 className="text-primary font-size-17 mb-0">
                              06
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-size-16 mb-1">Images</h5>
                        <p className="text-muted text-truncate mb-0">
                          Fill all images
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <i
                          className={`mdi accor-down-icon font-size-24 ${imageOpen ? "mdi-chevron-up" : "mdi-chevron-down"
                            }`}
                        ></i>
                      </div>
                    </div>
                  </div>
                </a>

                {imageOpen && (
                  <div className="p-4 border-top">
                    <form>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="productImage"
                                  className="form-label"
                                >
                                  Product image
                                </label>
                                <input
                                  className="form-control"
                                  type="file"
                                  id="productImage"
                                  name="productImage"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleFileChange(e, "productImage")
                                  }
                                />
                                {errors.productImage && (
                                  <div className="text-danger">
                                    {errors.productImage}
                                  </div>
                                )}
                              </div>
                              {selector.isEdit &&
                                Array.isArray(formData.productImage) &&
                                formData.productImage.map((imgObj, index) => (
                                  <div
                                    key={imgObj._id || index}
                                    style={{
                                      position: "relative",
                                      display: "inline-block",
                                      margin: "5px",
                                    }}
                                  >
                                    <img
                                      src={
                                        imgObj instanceof File
                                          ? URL.createObjectURL(imgObj)
                                          : `${IMAGE_BASE_URL}${imgObj.docPath}/${imgObj.docName}`
                                      }
                                      alt={
                                        imgObj.originalName || "Product Image"
                                      }
                                      className="img-thumbnail"
                                      style={{ width: "50px", height: "50px" }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteImage(index)}
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "20px",
                                        height: "20px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                            </div>

                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="additionalImages"
                                  className="form-label"
                                >
                                  Additional images
                                </label>
                                <input
                                  className="form-control"
                                  type="file"
                                  id="additionalImages"
                                  name="additionalImages"
                                  multiple
                                  onChange={(e) =>
                                    handleFileChange(e, "additionalImages")
                                  }
                                />
                              </div>
                              {selector.isEdit &&
                                Array.isArray(formData.additionalImages) &&
                                formData.additionalImages.map(
                                  (imgObj, index) => (
                                    <div
                                      key={imgObj._id || index}
                                      style={{
                                        position: "relative",
                                        display: "inline-block",
                                        margin: "5px",
                                      }}
                                    >
                                      <img
                                        src={
                                          imgObj instanceof File
                                            ? URL.createObjectURL(imgObj)
                                            : `${IMAGE_BASE_URL}${imgObj.docPath}/${imgObj.docName}`
                                        }
                                        alt={
                                          imgObj.originalName ||
                                          "Additional Image"
                                        }
                                        className="img-thumbnail"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                        }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteAdditionalImage(index)
                                        }
                                        style={{
                                          position: "absolute",
                                          top: 0,
                                          right: 0,
                                          background: "red",
                                          color: "white",
                                          border: "none",
                                          borderRadius: "50%",
                                          width: "20px",
                                          height: "20px",
                                          cursor: "pointer",
                                          fontSize: "12px",
                                        }}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='modal-footer mt-3'>
          <button

            type='ffff'
            onClick={() => handleClose()}

            className='form-wizard-next-btn btn btn-secondary me-1 px-32'
          >
            Cancel
          </button>
          <button

            type='ffff'
            className='form-wizard-next-btn btn btn-primary px-32'
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductListLayer;