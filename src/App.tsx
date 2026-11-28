import { Navigate, Route, Routes } from 'react-router-dom';
import TrainingOrientation, { TrainingProvider } from './pages/TrainingOrientation';
import ValueStreamMapping, { VSMProvider } from './pages/ValueStreamMapping';
import FlowManagement, { FlowProvider } from './pages/FlowManagement';
import RiskAssessment, { RiskProvider } from './pages/RiskAssessment';
import PPQAnalysis, { PPQProvider } from './pages/PPQAnalysis';
import VSIIntake from './ppq/VSIIntake';
import VSIAnalysis, { VSIProvider } from './pages/VSIAnalysis';
import CapacityPlanning, { CapacityProvider } from './pages/CapacityPlanning';
import EquipmentPlanning, { EquipmentProvider } from './pages/EquipmentPlanning';
import ManpowerPlanning, { ManpowerProvider } from './pages/ManpowerPlanning';
import SupplyChainDesign, { SupplyProvider } from './pages/SupplyChainDesign';
import SupermarketDesign, { SupermarketProvider } from './pages/SupermarketDesign';
import MaterialHandling, { MHProvider } from './pages/MaterialHandling';
import LayoutDesign, { LayoutProvider } from './pages/LayoutDesign';
import VisualManagement, { VisualProvider } from './pages/VisualManagement';
import ProjectPlan, { ProjectProvider } from './pages/ProjectPlan';
import Layout from './components/Layout';
import { PreviewProvider } from './components/PreviewDialog';
import Dashboard from './pages/Dashboard';
import Organizations from './pages/Organizations';
import Services from './pages/Services';
import Subscriptions from './pages/Subscriptions';
import Users from './pages/Users';
import ProfileSettings from './pages/ProfileSettings';
import Notifications, { NotificationsProvider } from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import Search from './pages/Search';
import Placeholder from './pages/Placeholder';
export default function App() {
  return <PreviewProvider><NotificationsProvider><TrainingProvider><VSMProvider><FlowProvider><RiskProvider><PPQProvider><VSIProvider><CapacityProvider><EquipmentProvider><ManpowerProvider><SupplyProvider><SupermarketProvider><MHProvider><LayoutProvider><VisualProvider><ProjectProvider><Routes><Route element={<Layout />}>
    <Route index element={<Navigate to="/home" replace />} />
    <Route path="/home" element={<Dashboard />} />
    <Route path="/hub/organizations" element={<Organizations />} />
    <Route path="/hub/subscriptions" element={<Subscriptions />} />
    <Route path="/hub/users" element={<Users />} />
    <Route path="/training" element={<TrainingOrientation />} />
    <Route path="/training/curriculum" element={<TrainingOrientation />} />
    <Route path="/training/attendance" element={<TrainingOrientation />} />
    <Route path="/training/report" element={<TrainingOrientation />} />
    <Route path="/vsm" element={<ValueStreamMapping />} />
    <Route path="/vsm/streams" element={<ValueStreamMapping />} />
    <Route path="/vsm/setup" element={<ValueStreamMapping />} />
    <Route path="/vsm/processes" element={<ValueStreamMapping />} />
    <Route path="/vsm/current" element={<ValueStreamMapping />} />
    <Route path="/vsm/planner" element={<ValueStreamMapping />} />
    <Route path="/vsm/future" element={<ValueStreamMapping />} />
    <Route path="/vsm/analytics" element={<ValueStreamMapping />} />
    <Route path="/flow-management" element={<FlowManagement />} />
    <Route path="/flow-management/streams" element={<FlowManagement />} />
    <Route path="/flow-management/chart" element={<FlowManagement />} />
    <Route path="/flow-management/transport" element={<FlowManagement />} />
    <Route path="/flow-management/analysis" element={<FlowManagement />} />
    <Route path="/flow-management/report" element={<FlowManagement />} />
    <Route path="/risk" element={<RiskAssessment />} />
    <Route path="/risk/register" element={<RiskAssessment />} />
    <Route path="/risk/compliance" element={<RiskAssessment />} />
    <Route path="/risk/scoring" element={<RiskAssessment />} />
    <Route path="/risk/priority" element={<RiskAssessment />} />
    <Route path="/risk/mitigation" element={<RiskAssessment />} />
    <Route path="/risk/report" element={<RiskAssessment />} />
    <Route path="/ppq" element={<PPQAnalysis />} />
    <Route path="/ppq/products" element={<PPQAnalysis />} />
    <Route path="/ppq/analysis" element={<PPQAnalysis />} />
    <Route path="/ppq/pareto" element={<PPQAnalysis />} />
    <Route path="/ppq/process-matrix" element={<PPQAnalysis />} />
    <Route path="/ppq/families" element={<Navigate to="/vsi/grouping" replace />} />
    <Route path="/ppq/report" element={<Navigate to="/vsi/report" replace />} />
    <Route path="/vsi" element={<VSIAnalysis />} />
    <Route path="/vsi/grouping" element={<VSIIntake />} />
    <Route path="/vsi/suggestions" element={<VSIAnalysis />} />
    <Route path="/vsi/report" element={<VSIAnalysis />} />
    <Route path="/capacity" element={<CapacityPlanning />} />
    <Route path="/capacity/operations" element={<CapacityPlanning />} />
    <Route path="/capacity/calculation" element={<CapacityPlanning />} />
    <Route path="/capacity/report" element={<CapacityPlanning />} />
    <Route path="/equipment" element={<EquipmentPlanning />} />
    <Route path="/equipment/register" element={<EquipmentPlanning />} />
    <Route path="/equipment/plan" element={<EquipmentPlanning />} />
    <Route path="/equipment/report" element={<EquipmentPlanning />} />
    <Route path="/manpower" element={<ManpowerPlanning />} />
    <Route path="/manpower/deployment" element={<ManpowerPlanning />} />
    <Route path="/manpower/productivity" element={<ManpowerPlanning />} />
    <Route path="/manpower/report" element={<ManpowerPlanning />} />
    <Route path="/supply-chain" element={<SupplyChainDesign />} />
    <Route path="/supply-chain/inventory" element={<SupplyChainDesign />} />
    <Route path="/supply-chain/suppliers" element={<SupplyChainDesign />} />
    <Route path="/supply-chain/kaizens" element={<SupplyChainDesign />} />
    <Route path="/supply-chain/report" element={<SupplyChainDesign />} />
    <Route path="/supermarket" element={<SupermarketDesign />} />
    <Route path="/supermarket/sizing" element={<SupermarketDesign />} />
    <Route path="/supermarket/line-side" element={<SupermarketDesign />} />
    <Route path="/supermarket/report" element={<SupermarketDesign />} />
    <Route path="/material-handling" element={<MaterialHandling />} />
    <Route path="/material-handling/design" element={<MaterialHandling />} />
    <Route path="/material-handling/cases" element={<MaterialHandling />} />
    <Route path="/material-handling/report" element={<MaterialHandling />} />
    <Route path="/layout-design" element={<LayoutDesign />} />
    <Route path="/layout-design/areas" element={<LayoutDesign />} />
    <Route path="/layout-design/drafter" element={<LayoutDesign />} />
    <Route path="/layout-design/presentation" element={<LayoutDesign />} />
    <Route path="/visual" element={<VisualManagement />} />
    <Route path="/visual/placement" element={<VisualManagement />} />
    <Route path="/visual/deployment" element={<VisualManagement />} />
    <Route path="/visual/report" element={<VisualManagement />} />
    <Route path="/visual-management" element={<Navigate to="/visual" replace />} />
    <Route path="/visual-management/*" element={<Navigate to="/visual" replace />} />
    <Route path="/project-plan" element={<ProjectPlan />} />
    <Route path="/project-plan/phases" element={<ProjectPlan />} />
    <Route path="/project-plan/actions" element={<ProjectPlan />} />
    <Route path="/project-plan/report" element={<ProjectPlan />} />
    <Route path="/rollout" element={<Navigate to="/project-plan" replace />} />
    <Route path="/rollout/*" element={<Navigate to="/project-plan" replace />} />
    <Route path="/services" element={<Services />} />
    <Route path="/profile" element={<ProfileSettings />} />
    <Route path="/settings" element={<Navigate to="/profile" replace />} />
    <Route path="/account" element={<Navigate to="/profile" replace />} />
    <Route path="/plans" element={<Placeholder title="Plans & Limits" />} />
    <Route path="/hub/notifications" element={<Notifications />} />
    <Route path="/audit-logs" element={<AuditLogs />} />
    <Route path="/search" element={<Search />} />
    <Route path="*" element={<Placeholder title="Page not found" />} />
  </Route></Routes></ProjectProvider></VisualProvider></LayoutProvider></MHProvider></SupermarketProvider></SupplyProvider></ManpowerProvider></EquipmentProvider></CapacityProvider></VSIProvider></PPQProvider></RiskProvider></FlowProvider></VSMProvider></TrainingProvider></NotificationsProvider></PreviewProvider>;
}


