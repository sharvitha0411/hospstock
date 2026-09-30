/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, NavItemKey } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { NotificationDrawer } from './components/layout/NotificationDrawer';

// 10 PURPOSE-BUILT ROLE WORKSPACES (Section 18)
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { PharmacistDashboard } from './components/dashboards/PharmacistDashboard';
import { ReceptionDashboard } from './components/dashboards/ReceptionDashboard';
import { NurseDashboard } from './components/dashboards/NurseDashboard';
import { DistrictOfficerDashboard } from './components/dashboards/DistrictOfficerDashboard';
import { SupplyChainDashboard } from './components/dashboards/SupplyChainDashboard';
import { WarehouseDashboard } from './components/dashboards/WarehouseDashboard';
import { MLAnalystDashboard } from './components/dashboards/MLAnalystDashboard';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard';
import { AuditorDashboard } from './components/dashboards/AuditorDashboard';

// Specialized Sub-Workspaces
import { HealthDataWorkspace } from './components/healthData/HealthDataWorkspace';
import { DemandForecastWorkspace } from './components/forecast/DemandForecastWorkspace';
import { RiskDashboard } from './components/risk/RiskDashboard';
import { RedistributionWorkspace } from './components/redistribution/RedistributionWorkspace';
import { DigitalTwinSimulator } from './components/digitalTwin/DigitalTwinSimulator';
import { AlertsCenter } from './components/alerts/AlertsCenter';
import { ReportGenerator } from './components/reports/ReportGenerator';
import { HospitalsList } from './components/hospitals/HospitalsList';
import { HospitalDetailModal } from './components/hospitals/HospitalDetailModal';
import { SupplierManagement } from './components/suppliers/SupplierManagement';
import { LandingPage } from './components/landing/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { MLTrainingStudio } from './components/ml/MLTrainingStudio';
import { ManualMLTrainingWorkspace } from './components/ml/ManualMLTrainingWorkspace';
import { PredictionWorkspace } from './components/predictions/PredictionWorkspace';
import { MLGovernanceWorkspace } from './components/ml/MLGovernanceWorkspace';
import { HospStockDashboard } from './components/hospstock/HospStockDashboard';

import { User, Hospital } from './types';
import { DEMO_USERS, DISTRICTS, HOSPITALS, MEDICINES, ALERTS } from './data/mockData';
import { useApp } from './context/AppContext';

export default function App() {
  const {
    currentUser,
    setCurrentUser,
    alerts,
    resolveAlert,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDateRange,
    setSelectedDateRange,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [currentView, setCurrentView] = useState<'APP' | 'LANDING'>(() => {
    try {
      const saved = localStorage.getItem('medichain_currentView');
      if (saved === 'APP') return 'APP';
    } catch {}
    return 'APP';
  });
  const [currentTab, setCurrentTab] = useState<NavItemKey>(() => {
    try {
      const saved = localStorage.getItem('medichain_currentTab');
      if (saved && saved !== 'overview' && saved !== 'dashboard') return saved;
    } catch {}
    return 'hospstock';
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Persist view and tab preference
  React.useEffect(() => {
    try {
      localStorage.setItem('medichain_currentView', currentView);
    } catch {}
  }, [currentView]);

  React.useEffect(() => {
    try {
      localStorage.setItem('medichain_currentTab', currentTab);
    } catch {}
  }, [currentTab]);

  // Modals & Drawers
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<Hospital | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const criticalAlertCount = alerts.filter((a) => a.severity === 'CRITICAL' && !a.resolved).length;
  const totalActiveAlertCount = alerts.filter((a) => !a.resolved).length;

  const handleSelectUser = (user: User, targetTab?: string) => {
    setCurrentUser(user);
    if (targetTab) {
      setCurrentTab(targetTab);
    } else {
      setCurrentTab('overview');
    }
  };

  // Render role-specific purpose-built dashboard (Section 1, 18, 20)
  const renderWorkspaceContent = () => {
    // 1. Role-specific primary overview or general overview / dashboard
    if (currentTab === 'overview' || currentTab === 'dashboard') {
      switch (currentUser.role) {
        case 'DOCTOR':
          return <DoctorDashboard onNavigateToTab={setCurrentTab} />;
        case 'PHARMACIST':
          return <PharmacistDashboard onNavigateToTab={setCurrentTab} />;
        case 'RECEPTIONIST':
          return <ReceptionDashboard onNavigateToTab={setCurrentTab} />;
        case 'NURSE':
          return <NurseDashboard onNavigateToTab={setCurrentTab} />;
        case 'DISTRICT_ADMIN':
        case 'HOSPITAL_ADMIN':
          return (
            <DistrictOfficerDashboard
              onNavigateToTab={setCurrentTab}
              onSelectHospitalDetail={(hId) => {
                const hosp = HOSPITALS.find((h) => h.id === hId);
                if (hosp) setSelectedHospitalForModal(hosp);
              }}
            />
          );
        case 'SUPPLY_CHAIN_OFFICER':
        case 'DISTRIBUTOR':
          return <SupplyChainDashboard onNavigateToTab={setCurrentTab} />;
        case 'WAREHOUSE_MANAGER':
          return <WarehouseDashboard onNavigateToTab={setCurrentTab} />;
        case 'ML_ANALYST':
          return <MLAnalystDashboard onNavigateToTab={setCurrentTab} />;
        case 'SUPER_ADMIN':
          return <SuperAdminDashboard onNavigateToTab={setCurrentTab} />;
        case 'AUDITOR':
        default:
          return <AuditorDashboard onNavigateToTab={setCurrentTab} />;
      }
    }

    // 2. Doctor subtabs
    if (currentTab.startsWith('doctor-')) {
      return <DoctorDashboard onNavigateToTab={setCurrentTab} />;
    }

    // 3. Pharmacist subtabs
    if (currentTab.startsWith('pharmacy-')) {
      if (currentTab === 'pharmacy-reports') {
        return <ReportGenerator currentUser={currentUser} />;
      }
      if (currentTab === 'pharmacy-predictions') {
        return <PredictionWorkspace onNavigateToTab={setCurrentTab} />;
      }
      if (currentTab === 'pharmacy-ml' || currentTab === 'pharmacy-forecast') {
        return <ManualMLTrainingWorkspace onNavigateToTab={setCurrentTab} />;
      }
      return <PharmacistDashboard onNavigateToTab={setCurrentTab} />;
    }

    // 4. Receptionist subtabs
    if (currentTab.startsWith('reception-')) {
      return <ReceptionDashboard onNavigateToTab={setCurrentTab} />;
    }

    // 5. Nurse subtabs
    if (currentTab.startsWith('nurse-')) {
      return <NurseDashboard onNavigateToTab={setCurrentTab} />;
    }

    // 6. District Officer subtabs
    if (currentTab.startsWith('district-')) {
      if (currentTab === 'district-network') {
        return <HospitalsList onSelectHospital={(h) => setSelectedHospitalForModal(h)} />;
      }
      if (currentTab === 'district-risk') {
        return (
          <RiskDashboard
            onNavigateToRedistribution={() => setCurrentTab('district-redistribution')}
            onSelectHospitalDetail={(hId) => {
              const hosp = HOSPITALS.find((h) => h.id === hId);
              if (hosp) setSelectedHospitalForModal(hosp);
            }}
          />
        );
      }
      if (currentTab === 'district-forecast') {
        return <DemandForecastWorkspace onNavigateToRisk={() => setCurrentTab('district-risk')} />;
      }
      if (currentTab === 'district-redistribution') {
        return <RedistributionWorkspace />;
      }
      if (currentTab === 'district-disruptions') {
        return <DigitalTwinSimulator />;
      }
      if (currentTab === 'district-reports') {
        return <ReportGenerator currentUser={currentUser} />;
      }
      return (
        <DistrictOfficerDashboard
          onNavigateToTab={setCurrentTab}
          onSelectHospitalDetail={(hId) => {
            const hosp = HOSPITALS.find((h) => h.id === hId);
            if (hosp) setSelectedHospitalForModal(hosp);
          }}
        />
      );
    }

    // 7. Supply Chain Officer subtabs
    if (currentTab.startsWith('supply-')) {
      if (currentTab === 'supply-surplus-deficit' || currentTab === 'supply-planner') {
        return <RedistributionWorkspace />;
      }
      if (currentTab === 'supply-suppliers') {
        return <SupplierManagement />;
      }
      return <SupplyChainDashboard onNavigateToTab={setCurrentTab} />;
    }

    // 8. Warehouse Manager subtabs
    if (currentTab.startsWith('warehouse-')) {
      if (currentTab === 'warehouse-suppliers') {
        return <SupplierManagement />;
      }
      if (currentTab === 'warehouse-reports') {
        return <ReportGenerator currentUser={currentUser} />;
      }
      return <WarehouseDashboard onNavigateToTab={setCurrentTab} />;
    }

    // 9. ML Analyst subtabs
    if (currentTab.startsWith('ml-')) {
      if (currentTab === 'ml-training' || currentTab === 'ml-studio') {
        return <ManualMLTrainingWorkspace onNavigateToTab={setCurrentTab} />;
      }
      if (currentTab === 'ml-predictions') {
        return <PredictionWorkspace onNavigateToTab={setCurrentTab} />;
      }
      if (currentTab === 'ml-overview') {
        return <MLAnalystDashboard onNavigateToTab={setCurrentTab} />;
      }
      if (currentTab === 'ml-registry' || currentTab === 'ml-performance' || currentTab === 'ml-explainability' || currentTab === 'ml-monitoring') {
        return <MLGovernanceWorkspace />;
      }
      if (currentTab === 'ml-quality' || currentTab === 'ml-datasets') {
        return <HealthDataWorkspace />;
      }
      if (currentTab === 'ml-forecasts') {
        return <DemandForecastWorkspace onNavigateToRisk={() => setCurrentTab('district-risk')} />;
      }
      if (currentTab === 'ml-evaluation') {
        return <ReportGenerator currentUser={currentUser} />;
      }
      return <ManualMLTrainingWorkspace onNavigateToTab={setCurrentTab} />;
    }

    // 10. Super Admin subtabs
    if (currentTab.startsWith('admin-')) {
      if (currentTab === 'admin-audit') {
        return <AuditorDashboard onNavigateToTab={setCurrentTab} />;
      }
      if (currentTab === 'admin-facilities' || currentTab === 'admin-districts') {
        return <HospitalsList onSelectHospital={(h) => setSelectedHospitalForModal(h)} />;
      }
      if (currentTab === 'admin-suppliers') {
        return <SupplierManagement />;
      }
      return <SuperAdminDashboard onNavigateToTab={setCurrentTab} />;
    }

    // 11. Auditor subtabs
    if (currentTab.startsWith('auditor-')) {
      if (currentTab === 'auditor-reports') {
        return <ReportGenerator currentUser={currentUser} />;
      }
      return <AuditorDashboard onNavigateToTab={setCurrentTab} />;
    }

    // 12. Fallback direct workspace mappings
    switch (currentTab) {
      case 'reception':
        return <ReceptionDashboard onNavigateToTab={setCurrentTab} />;
      case 'doctor':
        return <DoctorDashboard onNavigateToTab={setCurrentTab} />;
      case 'nurse':
        return <NurseDashboard onNavigateToTab={setCurrentTab} />;
      case 'pharmacy':
        return <PharmacistDashboard onNavigateToTab={setCurrentTab} />;
      case 'warehouse':
        return <WarehouseDashboard onNavigateToTab={setCurrentTab} />;
      case 'ml':
        return <MLAnalystDashboard onNavigateToTab={setCurrentTab} />;
      case 'auditor':
        return <AuditorDashboard onNavigateToTab={setCurrentTab} />;
      case 'hospstock':
      case 'health-data':
      case 'inventory':
      case 'pharmacy-inventory':
        return <HospStockDashboard />;
      case 'forecast':
        return <DemandForecastWorkspace onNavigateToRisk={() => setCurrentTab('risk')} />;
      case 'predictions':
      case 'ml-predictions':
      case 'pharmacy-predictions':
        return <PredictionWorkspace onNavigateToTab={setCurrentTab} />;
      case 'ml-training':
        return <ManualMLTrainingWorkspace onNavigateToTab={setCurrentTab} />;
      case 'risk':
        return (
          <RiskDashboard
            onNavigateToRedistribution={() => setCurrentTab('redistribution')}
            onSelectHospitalDetail={(hId) => {
              const hosp = HOSPITALS.find((h) => h.id === hId);
              if (hosp) setSelectedHospitalForModal(hosp);
            }}
          />
        );
      case 'redistribution':
        return <RedistributionWorkspace />;
      case 'digital-twin':
        return <DigitalTwinSimulator />;
      case 'alerts':
        return <AlertsCenter onNavigateToModule={(mod) => setCurrentTab(mod as NavItemKey)} />;
      case 'reports':
        return <ReportGenerator currentUser={currentUser} />;
      case 'hospitals':
        return <HospitalsList onSelectHospital={(h) => setSelectedHospitalForModal(h)} />;
      case 'suppliers':
        return <SupplierManagement />;
      default:
        // Default to role's dashboard
        switch (currentUser.role) {
          case 'DOCTOR':
            return <DoctorDashboard onNavigateToTab={setCurrentTab} />;
          case 'PHARMACIST':
            return <PharmacistDashboard onNavigateToTab={setCurrentTab} />;
          case 'RECEPTIONIST':
            return <ReceptionDashboard onNavigateToTab={setCurrentTab} />;
          case 'NURSE':
            return <NurseDashboard onNavigateToTab={setCurrentTab} />;
          case 'DISTRICT_ADMIN':
          case 'HOSPITAL_ADMIN':
            return <DistrictOfficerDashboard onNavigateToTab={setCurrentTab} />;
          case 'SUPPLY_CHAIN_OFFICER':
          case 'DISTRIBUTOR':
            return <SupplyChainDashboard onNavigateToTab={setCurrentTab} />;
          case 'WAREHOUSE_MANAGER':
            return <WarehouseDashboard onNavigateToTab={setCurrentTab} />;
          case 'ML_ANALYST':
            return <MLAnalystDashboard onNavigateToTab={setCurrentTab} />;
          case 'SUPER_ADMIN':
            return <SuperAdminDashboard onNavigateToTab={setCurrentTab} />;
          case 'AUDITOR':
          default:
            return <AuditorDashboard onNavigateToTab={setCurrentTab} />;
        }
    }
  };

  if (currentView === 'LANDING') {
    return (
      <>
        <LandingPage
          onEnterCommandCenter={(tab) => {
            setCurrentView('APP');
            if (tab) setCurrentTab(tab);
            else setCurrentTab('overview');
          }}
          onExploreDigitalTwin={() => {
            setCurrentView('APP');
            setCurrentTab('digital-twin');
          }}
          onOpenRoleModal={() => setIsRoleModalOpen(true)}
          onSelectRoleUser={(user, targetTab) => {
            handleSelectUser(user, targetTab);
            setCurrentView('APP');
          }}
          currentUser={currentUser}
        />
        <LoginModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          currentUser={currentUser}
          onSelectUser={(u) => handleSelectUser(u)}
        />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      {/* Desktop & Mobile Responsive Sidebar with Role-Specific Navigation */}
      <div className={`${mobileMenuOpen ? 'block fixed inset-0 z-50' : 'hidden lg:block'}`}>
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setMobileMenuOpen(false);
          }}
          currentUser={currentUser}
          onOpenRoleSwitcher={() => setIsRoleModalOpen(true)}
          onGoToLanding={() => setCurrentView('LANDING')}
          criticalAlertCount={criticalAlertCount}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          districts={DISTRICTS}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDateRange={selectedDateRange}
          onSelectDateRange={setSelectedDateRange}
          onToggleNotificationDrawer={() => setIsNotificationDrawerOpen(!isNotificationDrawerOpen)}
          criticalAlertCount={criticalAlertCount}
          totalAlertCount={totalActiveAlertCount}
          onSimulateClick={() => setCurrentTab('digital-twin')}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onGoToLanding={() => setCurrentView('LANDING')}
        />

        {/* Scrollable Viewport Body Rendering Role-Specific Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {renderWorkspaceContent()}
        </main>
      </div>

      {/* Slide-out Real-Time Notification Drawer with Role Scope Filter */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        alerts={alerts}
        onResolveAlert={resolveAlert}
        onNavigateToModule={(mod) => {
          setCurrentTab(mod as NavItemKey);
          setIsNotificationDrawerOpen(false);
        }}
        currentUserRole={currentUser.role}
      />

      {/* Hospital Detail Drill-Down Modal */}
      <HospitalDetailModal
        hospital={selectedHospitalForModal}
        onClose={() => setSelectedHospitalForModal(null)}
        onNavigateToRedistribution={() => {
          setSelectedHospitalForModal(null);
          setCurrentTab('district-redistribution');
        }}
      />

      {/* Role-Based Authentication Persona Switcher Modal */}
      <LoginModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => handleSelectUser(u)}
      />
    </div>
  );
}
