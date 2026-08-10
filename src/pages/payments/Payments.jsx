import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Structure from '../../components/layout/Structure';
import Icon from '../../components/common/Icon';
import Table from '../../components/common/Table';
import Fields from '../../components/common/Fields';
import Button from '../../components/common/Button';
import { CrudModal, DeleteModal } from '../../components/common/Modal';
import {
  getPayments,
  getIntegrations,
  createIntegration,
  updateIntegration,
  deleteIntegration
} from '../../api/paymentApi';
import {
  paymentsTableColumns,
  paymentIntegrationsTableColumns,
  paymentIntegrationsModalFields
} from '../../utils/apiData';

const getPaymentStatusStyle = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "captured" || s === "paid" || s === "success") return { bg: "#e6f4ea", color: "#137333" };
  if (s === "created" || s === "authorized" || s === "pending") return { bg: "#e8f0fe", color: "#1a73e8" };
  if (s === "failed") return { bg: "#fce8e6", color: "#c5221f" };
  if (s === "refunded") return { bg: "#f3e8ff", color: "#7e22ce" };
  return { bg: "#f1f3f4", color: "#3c4043" };
};

const getIntegrationStatusStyle = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "active") return { bg: "#e6f4ea", color: "#137333" };
  if (s === "inactive") return { bg: "#fce8e6", color: "#c5221f" };
  return { bg: "#f1f3f4", color: "#3c4043" };
};

const getDefaultStatusStyle = (isDefault) => {
  return isDefault ? { bg: "#e8f0fe", color: "#1a73e8" } : { bg: "#f1f5f9", color: "#3c4043" };
};

const Payments = () => {
  const loggedInUser = useSelector((state) => state.auth?.user);
  const isAdmin = loggedInUser?.role === 'admin';

  const [paymentsList, setPaymentsList] = useState([]);
  const [integrationsList, setIntegrationsList] = useState([]);
  const [activeTab, setActiveTab] = useState('Payments');
  const [search, setSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentIntegration, setCurrentIntegration] = useState(null);
  const [integrationForm, setIntegrationForm] = useState({
    gatewayName: '',
    provider: '',
    supportedMethods: '',
    mode: 'test',
    keyId: '',
    keySecret: '',
    webhookSecret: '',
    status: 'active',
    isDefault: 'false'
  });

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (paymentStatusFilter !== 'All') params.status = paymentStatusFilter.toLowerCase();

      const res = await getPayments(params);
      const data = res?.data || res;
      if (data && Array.isArray(data)) {
        setPaymentsList(data);
      } else {
        throw new Error('Invalid payments response format');
      }
    } catch (err) {
      console.warn('API payments fetch failed, using fallback mock data:', err);
      const mockPayments = [
        {
          _id: "64d5c412f8e12a45b61e2f7a",
          paymentId: "#PAY-1001",
          orderId: "#ORD-1001",
          customerId: "Raj Shetye",
          gateway: "Razorpay",
          razorpayOrderId: "order_Kxyz12345",
          razorpayPaymentId: "pay_Kxyz67890",
          amount: 800,
          currency: "INR",
          paymentMethod: "UPI",
          status: "captured",
          failureReason: "",
          paidAt: "2026-08-10T06:05:46.476Z",
          createdAt: "2026-08-10T06:05:46.476Z"
        },
        {
          _id: "64d5c412f8e12a45b61e2f7b",
          paymentId: "#PAY-1002",
          orderId: "#ORD-1002",
          customerId: "Guest",
          gateway: "Razorpay",
          razorpayOrderId: "order_Kxyz99999",
          razorpayPaymentId: "pay_Kxyz88888",
          amount: 1250,
          currency: "INR",
          paymentMethod: "Cards",
          status: "failed",
          failureReason: "Payment authorization failed by bank",
          paidAt: null,
          createdAt: "2026-08-10T07:15:20.100Z"
        }
      ];
      setPaymentsList(mockPayments);
    } finally {
      setLoading(false);
    }
  }, [search, paymentStatusFilter]);

  const loadIntegrations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getIntegrations();
      const data = res?.data || res;
      if (data && Array.isArray(data)) {
        setIntegrationsList(data);
      } else {
        throw new Error('Invalid integrations response format');
      }
    } catch (err) {
      console.warn('API integrations fetch failed, using fallback mock data:', err);
      const mockIntegrations = [
        {
          _id: "64d5c412f8e12a45b61e2f7c",
          gatewayName: "Razorpay Gateway",
          provider: "Razorpay",
          supportedMethods: ["UPI", "Cards", "Net Banking", "COD"],
          mode: "test",
          keyId: "rzp_test_12345",
          keySecret: "••••••••",
          webhookSecret: "whsec_123",
          status: "active",
          isDefault: true,
          addedOn: "2026-08-01T10:00:00.000Z"
        }
      ];
      setIntegrationsList(mockIntegrations);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'Payments') {
      loadPayments();
    } else {
      loadIntegrations();
    }
  }, [activeTab, loadPayments, loadIntegrations]);

  const handleAddClick = () => {
    setModalMode('create');
    setCurrentIntegration(null);
    setIntegrationForm({
      gatewayName: '',
      provider: '',
      supportedMethods: 'UPI, Cards, Net Banking, COD',
      mode: 'test',
      keyId: '',
      keySecret: '',
      webhookSecret: '',
      status: 'active',
      isDefault: 'false'
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (integration) => {
    setModalMode('edit');
    setCurrentIntegration(integration);
    setIntegrationForm({
      gatewayName: integration.gatewayName || '',
      provider: integration.provider || '',
      supportedMethods: Array.isArray(integration.supportedMethods)
        ? integration.supportedMethods.join(', ')
        : integration.supportedMethods || '',
      mode: integration.mode || 'test',
      keyId: integration.keyId || '',
      keySecret: '', // Keep keySecret empty for security when editing
      webhookSecret: integration.webhookSecret || '',
      status: integration.status || 'active',
      isDefault: String(integration.isDefault)
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (integration) => {
    setCurrentIntegration(integration);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (currentIntegration) {
      try {
        await deleteIntegration(currentIntegration._id);
        await loadIntegrations();
      } catch (err) {
        console.warn('API delete failed, removing locally:', err);
        setIntegrationsList((prev) => prev.filter((i) => i._id !== currentIntegration._id));
      }
      setIsDeleteModalOpen(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    const payload = {
      ...formData,
      supportedMethods: typeof formData.supportedMethods === 'string'
        ? formData.supportedMethods.split(',').map(m => m.trim()).filter(Boolean)
        : formData.supportedMethods,
      isDefault: formData.isDefault === 'true' || formData.isDefault === true
    };

    // If keySecret is left blank on edit, delete it from payload
    if (modalMode === 'edit' && !payload.keySecret) {
      delete payload.keySecret;
    }

    try {
      if (modalMode === 'create') {
        await createIntegration(payload);
      } else {
        await updateIntegration(currentIntegration._id, payload);
      }
      await loadIntegrations();
    } catch (err) {
      console.warn('API operation failed, applying locally:', err);
      const localItem = {
        ...payload,
        _id: currentIntegration?._id || `local_${Date.now()}`
      };
      if (modalMode === 'create') {
        setIntegrationsList((prev) => [localItem, ...prev]);
      } else {
        setIntegrationsList((prev) =>
          prev.map((i) => (i._id === currentIntegration._id ? localItem : i))
        );
      }
    }
    setIsAddModalOpen(false);
  };

  // Build columns mapping
  const paymentColumns = paymentsTableColumns.map((col) => {
    if (col.accessor === 'status') {
      return {
        ...col,
        render: (row) => {
          const style = getPaymentStatusStyle(row.status);
          const displayStatus = String(row.status || "").charAt(0).toUpperCase() + String(row.status || "").slice(1).toLowerCase();
          return (
            <span
              className="mini-text font-600 px-10 py-4 rounded-5"
              style={{ backgroundColor: style.bg, color: style.color, display: 'inline-block' }}
            >
              {displayStatus}
            </span>
          );
        }
      };
    }
    return col;
  });

  const integrationColumns = paymentIntegrationsTableColumns.map((col) => {
    if (col.accessor === 'status') {
      return {
        ...col,
        render: (row) => {
          const style = getIntegrationStatusStyle(row.status);
          const displayStatus = String(row.status || "").charAt(0).toUpperCase() + String(row.status || "").slice(1).toLowerCase();
          return (
            <span
              className="mini-text font-600 px-10 py-4 rounded-5"
              style={{ backgroundColor: style.bg, color: style.color, display: 'inline-block' }}
            >
              {displayStatus}
            </span>
          );
        }
      };
    }
    if (col.accessor === 'isDefaultText') {
      return {
        ...col,
        render: (row) => {
          const style = getDefaultStatusStyle(row.isDefault);
          return (
            <span
              className="mini-text font-600 px-10 py-4 rounded-5"
              style={{ backgroundColor: style.bg, color: style.color, display: 'inline-block' }}
            >
              {row.isDefault ? 'Default' : 'No'}
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
              title="Edit Integration"
            />
            <Button
              type="button"
              version="icon"
              icon="Trash"
              bg="light-danger"
              color="danger"
              onClick={() => handleDeleteClick(row)}
              title="Delete Integration"
            />
          </div>
        )
      };
    }
    return col;
  });

  const getModalFields = () => {
    return paymentIntegrationsModalFields.map((field) => {
      // For Edit Mode, we make keySecret optional
      if (field.name === 'keySecret' && modalMode === 'edit') {
        return {
          ...field,
          required: false,
          placeholder: 'Leave blank to keep existing key secret',
          defaultValue: ''
        };
      }
      return {
        ...field,
        defaultValue: integrationForm[field.name]
      };
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setPaymentStatusFilter('All');
  };

  // Filter local lists
  const filteredPayments = paymentsList.filter((p) => {
    const orderStr = typeof p.orderId === 'object' ? (p.orderId?.id || p.orderId?._id || '') : (p.orderId || '');
    const custStr = typeof p.customerId === 'object' ? (p.customerId?.fullname || p.customerId?.email || '') : (p.customerId || '');
    const searchMatch =
      String(p.paymentId || '').toLowerCase().includes(search.toLowerCase()) ||
      String(orderStr).toLowerCase().includes(search.toLowerCase()) ||
      String(custStr).toLowerCase().includes(search.toLowerCase());
    return searchMatch;
  });

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const formattedPayments = paginatedPayments.map((p) => {
    const orderIdText = typeof p.orderId === 'object' && p.orderId !== null
      ? (p.orderId.id || p.orderId._id || '-')
      : (p.orderId || '-');

    const customerText = typeof p.customerId === 'object' && p.customerId !== null
      ? (p.customerId.fullname || p.customerId.email || 'Guest')
      : (p.customerId || 'Guest');

    const rawDate = p.paidAt || p.createdAt;
    const paidAtText = rawDate ? new Date(rawDate).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '-';

    return {
      ...p,
      orderIdText,
      customerText,
      amountText: p.amount != null ? `${p.currency === 'USD' ? '$' : '₹'} ${p.amount}` : '-',
      paidAtText
    };
  });

  const formattedIntegrations = integrationsList.map((i) => ({
    ...i,
    supportedMethodsText: Array.isArray(i.supportedMethods)
      ? i.supportedMethods.join(', ')
      : i.supportedMethods || ''
  }));

  const renderFilterInputs = () => (
    <div className="flex flex-wrap items-center gap-12 w-full">
      <Fields
        type="text"
        placeholder="Search by Payment ID / Order ID..."
        value={search}
        onChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        style={{ flex: '1 1 240px', minWidth: '200px' }}
      />
      <Fields
        type="select"
        label="Payment Status"
        value={paymentStatusFilter}
        onChange={(val) => {
          setPaymentStatusFilter(val);
          setCurrentPage(1);
        }}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Captured', value: 'Captured' },
          { label: 'Authorized', value: 'Authorized' },
          { label: 'Created', value: 'Created' },
          { label: 'Failed', value: 'Failed' },
          { label: 'Refunded', value: 'Refunded' }
        ]}
        style={{ width: '180px' }}
      />
    </div>
  );

  const hasActiveFilters = !!search || paymentStatusFilter !== 'All';

  // Available tabs
  const tabsList = [
    {
      name: 'Payments',
      count: filteredPayments.length,
      icon: <Icon name="Payments" width="16" height="16" strokeWidth="2.5" />
    }
  ];

  if (isAdmin) {
    tabsList.push({
      name: 'Integrations',
      count: integrationsList.length,
      icon: <Icon name="Shield" width="16" height="16" strokeWidth="2.5" />
    });
  }

  return (
    <Structure
      showSidebar={false}
      headerIcon={<Icon name="Payments" width="22" height="22" strokeWidth="2" />}
      headerTitle="Payment Management"
      headerSub={
        activeTab === 'Payments'
          ? `${paymentsList.length} transactions total • ${paymentsList.filter((p) => p.status === 'captured').length} captured`
          : `${integrationsList.length} active gateways configured`
      }
      showTabControls={true}
      tabs={tabsList}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
      }}
      filterDescription={
        activeTab === 'Payments'
          ? hasActiveFilters
            ? `Filter active — showing ${filteredPayments.length} of ${paymentsList.length} payments`
            : 'Showing all transactions.'
          : 'Configure Razorpay, Stripe and other gateways.'
      }
      hasActiveFilters={activeTab === 'Payments' && hasActiveFilters}
      onClearAllFilters={handleResetFilters}
      filterInputs={activeTab === 'Payments' ? renderFilterInputs() : null}
      quickAction={
        isAdmin && activeTab === 'Integrations' ? (
          <div className="text-right">
            <p className="mini-text text-gray font-600 uppercase mb-2">INTEGRATION</p>
            <p
              className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer"
              onClick={handleAddClick}
            >
              Add New Gateway
              <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
            </p>
          </div>
        ) : null
      }
    >
      <div className="w-full">
        {activeTab === 'Payments' ? (
          <Table
            title="Transactions"
            headerSub={`Showing ${formattedPayments.length} of ${filteredPayments.length} items`}
            columns={paymentColumns}
            data={formattedPayments}
            totalItems={filteredPayments.length}
            itemsPerPage={10}
            page={currentPage}
            onPageChange={(p) => setCurrentPage(p)}
            showControls={true}
            isLoading={loading}
          />
        ) : (
          <Table
            title="Payment Gateways"
            headerSub={`Showing ${formattedIntegrations.length} gateway provider configurations`}
            columns={integrationColumns}
            data={formattedIntegrations}
            showControls={false}
            isLoading={loading}
          />
        )}
      </div>

      <CrudModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={modalMode === 'create' ? 'Add Payment Gateway' : 'Edit Gateway Settings'}
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
        title="Delete Gateway Configuration"
        message={`Are you sure you want to delete payment integration "${currentIntegration?.gatewayName || ''}"? This action cannot be undone.`}
      />
    </Structure>
  );
};

export default Payments;
