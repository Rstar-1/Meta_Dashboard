import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Structure from '../../components/layout/Structure';
import Icon from '../../components/common/Icon';
import Image from '../../components/common/Image';
import Table from '../../components/common/Table';
import Fields from '../../components/common/Fields';
import Button from '../../components/common/Button';
import { CrudModal, DeleteModal } from '../../components/common/Modal';
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder
} from '../../api/orderApi';
import { getProducts } from '../../api/productApi';
import { getIntegrations } from '../../api/paymentApi';
import { ordersTableColumns, ordersModalFields } from '../../utils/apiData';

// Image mapper helper to render beautiful Unsplash photos based on keyword
const getProductImage = (name) => {
  const n = String(name || "").toLowerCase();
  if (n.includes("headphone") || n.includes("headset") || n.includes("earbud")) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80";
  }
  if (n.includes("watch") || n.includes("tracker") || n.includes("fitness")) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=80";
  }
  if (n.includes("shoe") || n.includes("sneaker")) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80";
  }
  if (n.includes("camera")) {
    return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=80&q=80";
  }
  if (n.includes("handbag") || n.includes("bag") || n.includes("duffle")) {
    return "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=80&q=80";
  }
  if (n.includes("perfume")) {
    return "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=80&q=80";
  }
  if (n.includes("tripod")) {
    return "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=80&q=80";
  }
  if (n.includes("bottle") || n.includes("cup") || n.includes("glass")) {
    return "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=80&q=80";
  }
  return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=80&q=80";
};

const getPaymentStatusStyle = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "paid") return { bg: "#e6f4ea", color: "#137333" };
  if (s === "pending") return { bg: "#fef7e0", color: "#b06000" };
  if (s === "failed") return { bg: "#fce8e6", color: "#c5221f" };
  return { bg: "#f1f3f4", color: "#3c4043" };
};

const getOrderStatusStyle = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "delivered") return { bg: "#e6f4ea", color: "#137333" };
  if (s === "processing") return { bg: "#e8f0fe", color: "#1a73e8" };
  if (s === "pending") return { bg: "#fef7e0", color: "#b06000" };
  if (s === "shipped") return { bg: "#f3e8ff", color: "#7e22ce" };
  if (s === "cancelled") return { bg: "#fce8e6", color: "#c5221f" };
  return { bg: "#f1f3f4", color: "#3c4043" };
};

const Orders = () => {
  const loggedInUser = useSelector((state) => state.auth?.user);
  const [ordersList, setOrdersList] = useState([]);
  const [productsListForDropdown, setProductsListForDropdown] = useState([]);
  const [integrationsListForDropdown, setIntegrationsListForDropdown] = useState([]);
  const [search, setSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ fromDate: '', toDate: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderForm, setOrderForm] = useState({
    products: [],
    totalAmount: '',
    paymentStatus: 'Paid',
    paymentMethod: 'Razorpay',
    razorpayOrderId: '',
    orderStatus: 'Delivered'
  });

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (orderStatusFilter !== 'All') params.orderStatus = orderStatusFilter;
      if (paymentStatusFilter !== 'All') params.paymentStatus = paymentStatusFilter;

      const res = await getOrders(params);
      const data = res?.data || res;
      if (data && Array.isArray(data)) {
        const mappedData = data.map((order) => {
          const addressName = order.address?.fullName || '';
          const addressPhone = order.address?.phone || '';
          const createdName = order.createdBy?.fullname || '';
          const createdPhone = order.createdBy?.mobile || '';
          const createdAvatar = order.createdBy?.image || '';

          return {
            ...order,
            customerName: order.customerName || addressName || createdName || 'Guest',
            phone: order.phone || addressPhone || createdPhone || '',
            avatar: order.avatar || createdAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80',
          };
        });
        setOrdersList(mappedData);
      }
    } catch (err) {
      console.warn('Backend Orders service unavailable, keeping current state:', err);
    } finally {
      setLoading(false);
    }
  }, [search, orderStatusFilter, paymentStatusFilter]);

  const loadDropdownProducts = useCallback(async () => {
    try {
      const res = await getProducts();
      const data = res?.data || res;
      if (data && Array.isArray(data)) {
        setProductsListForDropdown(data);
      }
    } catch (err) {
      console.warn('Could not load products for dropdown:', err);
    }
  }, []);

  const loadDropdownIntegrations = useCallback(async () => {
    try {
      const res = await getIntegrations();
      const data = res?.data || res;
      if (data && Array.isArray(data)) {
        const active = data.filter((item) => item.status === 'active');
        setIntegrationsListForDropdown(active);
      }
    } catch (err) {
      console.warn('Could not load integrations for dropdown:', err);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadDropdownProducts();
    loadDropdownIntegrations();
  }, [loadOrders, loadDropdownProducts, loadDropdownIntegrations]);

  const handleAddClick = () => {
    setModalMode('create');
    setCurrentOrder(null);
    setOrderForm({
      products: [],
      totalAmount: '',
      paymentStatus: 'Paid',
      paymentMethod: 'Razorpay',
      razorpayOrderId: '',
      orderStatus: 'Delivered'
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (order) => {
    setModalMode('edit');
    setCurrentOrder(order);
    setOrderForm({
      products: Array.isArray(order.products)
        ? order.products.map(p => typeof p === 'object' && p !== null ? (p.name || p) : p)
        : (order.productsText ? order.productsText.split(',').map((p) => p.trim()) : []),
      totalAmount: order.totalAmount || '',
      paymentStatus: order.paymentStatus || 'Paid',
      paymentMethod: order.paymentMethod || 'Razorpay',
      razorpayOrderId: order.razorpayOrderId || '',
      orderStatus: order.orderStatus || 'Delivered'
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (order) => {
    setCurrentOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (currentOrder) {
      try {
        await deleteOrder(currentOrder.id);
        await loadOrders();
      } catch (err) {
        console.warn('Failed to delete Order via API, removing locally:', err);
        setOrdersList((prev) => prev.filter((o) => o.id !== currentOrder.id));
      }
      setIsDeleteModalOpen(false);
    }
  };

  const mapProductNamesToItems = (selectedNames) => {
    if (!Array.isArray(selectedNames)) return [];
    return selectedNames.map(name => {
      const prod = productsListForDropdown.find(p => p.name === name);
      if (prod) {
        return {
          productId: prod._id,
          vendorId: prod.vendorId,
          name: prod.name,
          image: prod.images && prod.images.length > 0 ? prod.images[0] : '',
          price: prod.basePrice || prod.price || 0,
          quantity: 1,
          variant: {
            size: '',
            color: ''
          }
        };
      }
      return {
        name,
        price: 0,
        quantity: 1
      };
    });
  };

  const handleFormSubmit = async (formData) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ' ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const amount = String(formData.totalAmount || '').trim();
    const formattedAmount = amount.startsWith('₹') ? amount : `₹ ${amount}`;

    const payload = {
      products: mapProductNamesToItems(formData.products),
      totalAmount: formattedAmount,
      paymentStatus: formData.paymentStatus || 'Paid',
      paymentMethod: formData.paymentMethod || 'Razorpay',
      razorpayOrderId: modalMode === 'edit' && currentOrder ? currentOrder.razorpayOrderId : undefined,
      orderStatus: formData.orderStatus || 'Delivered',
      source: modalMode === 'edit' && currentOrder ? (currentOrder.source || 'Website') : 'Website',
      date: modalMode === 'edit' && currentOrder ? (currentOrder.date || formattedDate) : formattedDate,
      createdBy: currentOrder?.createdBy || (loggedInUser
        ? {
          _id: loggedInUser._id,
          email: loggedInUser.email || '',
          role: loggedInUser.role || 'vendor'
        }
        : undefined)
    };

    if (modalMode === 'edit' && currentOrder) {
      payload.id = currentOrder.id;
    }

    try {
      if (modalMode === 'create') {
        await createOrder(payload);
      } else if (currentOrder) {
        await updateOrder(currentOrder.id, payload);
      }
      await loadOrders();
    } catch (err) {
      console.warn('API update failed, updating local state:', err);
      const offlinePayload = {
        ...payload,
        id: payload.id || `#ORD-${1000 + ordersList.length + 1}`,
        customerName: currentOrder?.customerName || loggedInUser?.fullname || 'Admin User',
        phone: currentOrder?.phone || loggedInUser?.mobile || '+91 99999 99999',
        avatar: currentOrder?.avatar || loggedInUser?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80',
        createdBy: currentOrder?.createdBy || {
          _id: loggedInUser?._id,
          fullname: loggedInUser?.fullname,
          role: loggedInUser?.role || 'admin'
        }
      };
      if (modalMode === 'create') {
        setOrdersList((prev) => [offlinePayload, ...prev]);
      } else if (currentOrder) {
        setOrdersList((prev) =>
          prev.map((o) => (o.id === currentOrder.id ? offlinePayload : o))
        );
      }
    }
    setIsAddModalOpen(false);
  };

  const columns = ordersTableColumns.map((col) => {
    if (col.accessor === 'products') {
      return {
        ...col,
        render: (row) => {
          const products = Array.isArray(row.products)
            ? row.products.map(p => typeof p === 'object' && p !== null ? p.name : p)
            : (row.productsText ? row.productsText.split(',').map((p) => p.trim()) : []);
          if (products.length === 0) return '-';

          const visible = products.slice(0, 2);
          const extra = products.length - visible.length;

          return (
            <div className="flex items-center gap-6">
              {visible.map((p, idx) => (
                <Image
                  key={idx}
                  src={getProductImage(p)}
                  alt={p}
                  className="rounded-5 object-cover"
                  style={{ width: '32px', height: '32px', border: '1px solid #e2e8f0' }}
                  title={p}
                />
              ))}
              {extra > 0 && (
                <span
                  className="flex items-center justify-center rounded-5 mini-text text-dark font-600"
                  style={{ width: '32px', height: '32px', display: 'inline-flex', background: '#f1f5f9', border: '1px solid #e2e8f0' }}
                >
                  +{extra}
                </span>
              )}
            </div>
          );
        }
      };
    }

    if (col.accessor === 'paymentStatus') {
      return {
        ...col,
        render: (row) => {
          const style = getPaymentStatusStyle(row.paymentStatus);
          return (
            <span
              className="mini-text font-600 px-10 py-4 rounded-5"
              style={{ backgroundColor: style.bg, color: style.color, display: 'inline-block' }}
            >
              {row.paymentStatus}
            </span>
          );
        }
      };
    }

    if (col.accessor === 'orderStatus') {
      return {
        ...col,
        render: (row) => {
          const style = getOrderStatusStyle(row.orderStatus);
          return (
            <span
              className="mini-text font-600 px-10 py-4 rounded-5"
              style={{ backgroundColor: style.bg, color: style.color, display: 'inline-block' }}
            >
              {row.orderStatus}
            </span>
          );
        }
      };
    }

    if (col.accessor === 'actions') {
      return {
        ...col,
        render: (row) => (
          <div className="flex items-center gap-8">
            <Button
              type="button"
              version="icon"
              icon="Edit"
              bg="light-primary"
              color="primary"
              onClick={() => handleEditClick(row)}
              title="Edit Order"
            />
            <Button
              type="button"
              version="icon"
              icon="Trash"
              bg="light-danger"
              color="danger"
              onClick={() => handleDeleteClick(row)}
              title="Delete Order"
            />
          </div>
        )
      };
    }

    return col;
  });

  // Filter logic
  const filteredOrders = ordersList.filter((order) => {
    // 1. Search term match
    const matchesSearch =
      (order.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.phone || '').toLowerCase().includes(search.toLowerCase());

    // 2. Collapsible order status dropdown match
    const matchesOrderStatus = orderStatusFilter === 'All' || order.orderStatus === orderStatusFilter;

    // 3. Collapsible payment status dropdown match
    const matchesPaymentStatus = paymentStatusFilter === 'All' || order.paymentStatus === paymentStatusFilter;

    // 4. Collapsible Date Range match
    let matchesDate = true;
    if (dateRange.fromDate && dateRange.toDate) {
      const orderDateObj = new Date(order.date);
      const fromDateObj = new Date(dateRange.fromDate);
      const toDateObj = new Date(dateRange.toDate);

      fromDateObj.setHours(0, 0, 0, 0);
      toDateObj.setHours(23, 59, 59, 999);

      if (!isNaN(orderDateObj.getTime())) {
        matchesDate = orderDateObj >= fromDateObj && orderDateObj <= toDateObj;
      }
    }

    return matchesSearch && matchesOrderStatus && matchesPaymentStatus && matchesDate;
  });

  const paginatedData = filteredOrders.slice((currentPage - 1) * 10, currentPage * 10);

  // Stats summary for header sub
  const pendingCount = ordersList.filter((o) => o.orderStatus === 'Pending').length;
  const processingCount = ordersList.filter((o) => o.orderStatus === 'Processing').length;
  const completedCount = ordersList.filter((o) => o.orderStatus === 'Delivered').length;

  const handleResetFilters = () => {
    setSearch('');
    setOrderStatusFilter('All');
    setPaymentStatusFilter('All');
    setDateRange({ fromDate: '', toDate: '' });
  };

  const renderFilterInputs = () => (
    <div className="grid-cols-3 gap-12 w-full">
      <Fields
        label="SEARCH ORDERS"
        type="input"
        placeholder="Filter by ID, customer, or phone..."
        value={search}
        onChange={(val) => setSearch(val)}
      />
      <Fields
        label="ORDER STATUS"
        type="select"
        value={orderStatusFilter}
        onChange={(val) => setOrderStatusFilter(val)}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Delivered', value: 'Delivered' },
          { label: 'Processing', value: 'Processing' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Shipped', value: 'Shipped' },
          { label: 'Cancelled', value: 'Cancelled' }
        ]}
      />
      <Fields
        label="PAYMENT STATUS"
        type="select"
        value={paymentStatusFilter}
        onChange={(val) => setPaymentStatusFilter(val)}
        options={[
          { label: 'All Payment Status', value: 'All' },
          { label: 'Paid', value: 'Paid' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Failed', value: 'Failed' }
        ]}
      />
    </div>
  );

  const getModalFields = () =>
    ordersModalFields.map((field) => {
      if (field.name === 'products') {
        return {
          ...field,
          options: productsListForDropdown.map((p) => ({ label: p.name, value: p.name })),
          defaultValue: orderForm.products || []
        };
      }
      if (field.name === 'paymentMethod') {
        const dynamicOptions = [
          ...integrationsListForDropdown.map((integration) => ({
            label: `${integration.gatewayName} (${integration.provider})`,
            value: integration.provider
          })),
          { label: 'Cash on Delivery (COD)', value: 'COD' }
        ];
        return {
          ...field,
          options: dynamicOptions.length > 1 ? dynamicOptions : field.options,
          defaultValue: orderForm.paymentMethod || 'Razorpay'
        };
      }
      return {
        ...field,
        defaultValue: orderForm[field.name] ?? ''
      };
    });

  const hasActiveFilters =
    orderStatusFilter !== 'All' ||
    paymentStatusFilter !== 'All' ||
    !!search ||
    !!dateRange.fromDate;

  return (
    <Structure
      showSidebar={false}
      headerIcon={<Icon name="Orders" width="22" height="22" strokeWidth="2" />}
      headerTitle="Orders Overview"
      headerSub={`${ordersList.length} orders total • ${pendingCount} pending • ${processingCount} processing • ${completedCount} completed`}
      showTabControls={true}
      tabs={[
        {
          name: 'Order List',
          count: filteredOrders.length,
          icon: <Icon name="Orders" width="16" height="16" strokeWidth="2.5" />
        }
      ]}
      activeTab="Order List"
      filterDescription={
        hasActiveFilters
          ? `Filter active — showing ${filteredOrders.length} of ${ordersList.length} orders`
          : `Showing all orders.`
      }
      hasActiveFilters={hasActiveFilters}
      onClearAllFilters={handleResetFilters}
      filterInputs={renderFilterInputs()}
      quickAction={
        <div className="text-right">
          <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
          <p
            className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer"
            onClick={handleAddClick}
          >
            Add New Order
            <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
          </p>
        </div>
      }
    >
      <div className="w-full">
        <Table
          title="Order List"
          headerSub={`Showing ${paginatedData.length} of ${filteredOrders.length} items`}
          columns={columns}
          data={paginatedData}
          totalItems={filteredOrders.length}
          itemsPerPage={10}
          page={currentPage}
          onPageChange={(p) => setCurrentPage(p)}
          showControls={true}
          isLoading={loading}
        />
      </div>

      <CrudModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={modalMode === 'create' ? 'Create New Order' : 'Edit Order Details'}
        size="sm"
        type="sidebar"
        placement="right"
        fields={getModalFields()}
        onSubmit={handleFormSubmit}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order "${currentOrder?.id || ''}"? This action cannot be undone.`}
      />
    </Structure>
  );
};

export default Orders;
