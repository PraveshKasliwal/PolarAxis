import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Info, Phone, FileText, Truck, ArrowRight } from 'lucide-react';
import { alerts as initialAlerts } from '../../data/alerts';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import Modal from '../../components/shared/Modal';
import { useToast } from '../../context/ToastContext';

export default function AlertCenter() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const toast = useToast();

  const filteredAlerts = alerts.filter(alert => {
    if (currentUser?.role.includes('operations')) {
      return true;
    }
    return alert.tenantId === currentUser?.tenantId;
  });

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'critical', label: 'Critical' },
    { id: 'temperature', label: 'Temperature' },
    { id: 'customs', label: 'Customs' },
    { id: 'system', label: 'System' }
  ];

  const displayAlerts = activeTab === 'all'
    ? filteredAlerts
    : filteredAlerts.filter(a =>
        activeTab === 'critical' ? a.severity === 'critical' : a.category === activeTab
      );

  const getIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return XCircle;
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
      default:
        return CheckCircle;
    }
  };

  const getColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-500/5';
      case 'warning':
        return 'border-amber-500 bg-amber-500/5';
      case 'info':
        return 'border-blue-500 bg-blue-500/5';
      default:
        return 'border-border bg-surface';
    }
  };

  const handleAcknowledge = (alertId) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? { ...alert, acknowledged: true, status: 'acknowledged' }
          : alert
      )
    );
    toast.success('Alert acknowledged successfully');
  };

  const handleTakeAction = (alert) => {
    setSelectedAlert(alert);
    setShowActionModal(true);
  };

  const handleSubmitAction = (action) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === selectedAlert.id
          ? { ...alert, status: 'in_progress', action: action }
          : alert
      )
    );
    setShowActionModal(false);
    toast.success(`Action initiated: ${action}`);
    setSelectedAlert(null);
  };

  const getActionsByCategory = (category) => {
    switch (category) {
      case 'temperature':
        return [
          { id: 'contact_carrier', label: 'Contact Carrier', icon: Phone },
          { id: 'emergency_transfer', label: 'Trigger Emergency Transfer', icon: Truck },
          { id: 'escalate', label: 'Escalate to Operations', icon: ArrowRight }
        ];
      case 'customs':
        return [
          { id: 'submit_docs', label: 'Submit Customs Documents', icon: FileText },
          { id: 'contact_broker', label: 'Contact Customs Broker', icon: Phone },
          { id: 'escalate', label: 'Escalate to Operations', icon: ArrowRight }
        ];
      case 'system':
        return [
          { id: 'notify_it', label: 'Notify IT Team', icon: Phone },
          { id: 'retry_check', label: 'Retry System Check', icon: CheckCircle },
          { id: 'escalate', label: 'Escalate to Operations', icon: ArrowRight }
        ];
      default:
        return [
          { id: 'investigate', label: 'Investigate Issue', icon: Info },
          { id: 'escalate', label: 'Escalate to Operations', icon: ArrowRight }
        ];
    }
  };

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-primary"
      >
        Alert & Notification Center
      </motion.h1>

      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-accent border-b-2 border-accent'
                : 'text-secondary hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {displayAlerts.map((alert, i) => {
          const Icon = getIcon(alert.severity);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`border-l-4 rounded-lg p-6 ${getColor(alert.severity)}`}
            >
              <div className="flex items-start gap-4">
                <Icon className="w-6 h-6 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-primary">{alert.title}</h3>
                    <span className="text-xs text-muted">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-secondary mb-3">{alert.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    {alert.shipmentId && (
                      <span className="text-muted">Shipment: <span className="font-mono text-primary">{alert.shipmentId}</span></span>
                    )}
                    <span className="text-muted">Location: {alert.location}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {!alert.status || alert.status === 'active' ? (
                      <>
                        <button
                          onClick={() => handleTakeAction(alert)}
                          className="px-4 py-2 bg-accent text-white text-sm rounded-lg hover:bg-accent-dark transition-colors"
                        >
                          Take Action
                        </button>
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="px-4 py-2 bg-border text-primary text-sm rounded-lg hover:bg-border/80 transition-colors"
                        >
                          Acknowledge
                        </button>
                      </>
                    ) : alert.status === 'acknowledged' ? (
                      <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm rounded-lg inline-flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Acknowledged
                      </span>
                    ) : alert.status === 'in_progress' ? (
                      <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-sm rounded-lg inline-flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        In Progress: {alert.action}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {showActionModal && selectedAlert && (
        <Modal
          isOpen={showActionModal}
          onClose={() => {
            setShowActionModal(false);
            setSelectedAlert(null);
          }}
          title="Take Action"
        >
          <div className="space-y-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <h4 className="font-semibold text-primary mb-1">{selectedAlert.title}</h4>
              <p className="text-sm text-secondary">{selectedAlert.description}</p>
              {selectedAlert.shipmentId && (
                <p className="text-xs text-muted mt-2">
                  Shipment: <span className="font-mono">{selectedAlert.shipmentId}</span>
                </p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-primary mb-3">Select an action:</h4>
              <div className="space-y-2">
                {getActionsByCategory(selectedAlert.category).map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleSubmitAction(action.label)}
                      className="w-full p-4 bg-surface border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-all text-left flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ActionIcon className="w-5 h-5 text-accent" />
                      </div>
                      <span className="font-medium text-primary">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
