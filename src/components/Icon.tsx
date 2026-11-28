import {
  Search, LayoutDashboard, Building2, CreditCard, Users, SlidersHorizontal,
  Layers3, Bell, History, ArrowUpRight, ArrowLeft, ChevronRight, Plus,
  Upload, Download, Pencil, CirclePause, Trash2, Workflow, ShieldCheck,
  Activity, Database, HardDrive, Globe, GraduationCap, FlaskConical, Compass,
  Waves, TrendingUp, Cog, Network, Warehouse, Truck, PanelsTopLeft, Eye,
  ShieldAlert, CalendarRange, Leaf, BookOpen, GitBranch, ClipboardList,
  Sparkles, ArrowRight, Check, X, CircleHelp, Package, BarChart3, Grid3X3,
  Layers, FileText, Boxes, CheckCircle2, Target, PanelLeft,
  QrCode, Clock, Smile, CircleAlert, Copy, Minus, Award, MapPin, CalendarDays, UserCheck, Presentation, ChevronUp, ChevronDown, ChevronLeft, Undo2, Redo2, ZoomIn, ZoomOut, Maximize2, Minimize2, Move, Rows3, RotateCcw, Save, Tag, Scan,
  Lock, Mail, Phone, Shield, Laptop, Smartphone, KeyRound, Camera, RefreshCw, Key,
  LogOut, User, CircleUser, Settings, HelpCircle, CheckCheck, Archive, BellOff,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
const icons: Record<string, LucideIcon> = {
  Search, LayoutDashboard, Building2, CreditCard, Users, SlidersHorizontal,
  Layers3, Bell, History, ArrowUpRight, ArrowLeft, ChevronRight, Plus,
  Upload, Download, Pencil, CirclePause, Trash2, Workflow, ShieldCheck,
  Activity, Database, HardDrive, Globe, GraduationCap, FlaskConical, Compass,
  Waves, TrendingUp, Cog, Network, Warehouse, Truck, PanelsTopLeft, Eye,
  ShieldAlert, CalendarRange, Leaf, BookOpen, GitBranch, ClipboardList,
  Sparkles, ArrowRight, Check, X, CircleHelp, Package, BarChart3, Grid3X3,
  Layers, FileText, Boxes, CheckCircle2, Target, PanelLeft,
  QrCode, Clock, Smile, CircleAlert, Copy, Minus, Award, MapPin, CalendarDays, UserCheck, Presentation, ChevronUp, ChevronDown, ChevronLeft, Undo2, Redo2, ZoomIn, ZoomOut, Maximize2, Minimize2, Move, Rows3, RotateCcw, Save, Tag, Scan,
  Lock, Mail, Phone, Shield, Laptop, Smartphone, KeyRound, Camera, RefreshCw, Key,
  LogOut, User, CircleUser, Settings, HelpCircle, CheckCheck, Archive, BellOff,
};
export default function Icon({ name, size = 18, className = '' }: { name: string; size?: number; className?: string }) {
  const Glyph = icons[name] || CircleHelp;
  return <Glyph size={size} strokeWidth={1.6} aria-hidden="true" className={className} />;
}
