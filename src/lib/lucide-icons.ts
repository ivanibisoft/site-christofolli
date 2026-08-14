import {
  FlaskConical,
  Thermometer,
  Leaf,
  LineChart,
  HardHat,
  Zap,
  Shield,
  Lightbulb,
  Wrench,
  Settings,
  CheckCircle,
  AlertTriangle,
  Star,
  Heart,
  ThumbsUp,
  Rocket,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Home,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  FileText,
  BookOpen,
  Camera,
  Image,
  Video,
  Music,
  Search,
  Bell,
  Lock,
  Key,
  Cloud,
  Sun,
  Moon,
  Globe,
  Package,
  Truck,
  ShoppingCart,
  Coffee,
  Gift,
  Award,
  Briefcase,
  GraduationCap,
  Microscope,
  type LucideIcon,
} from 'lucide-react'

/**
 * Map of icon name (as stored in the `custom_icons` / `builder_services.icon`
 * fields) to the corresponding Lucide component. Mirrors the seed migration.
 */
export const LUCIDE_ICONS: Record<string, LucideIcon> = {
  // "Flask" is an alias kept for backward compatibility with records seeded
  // before the custom_icons system — maps to the same beaker component.
  Flask: FlaskConical,
  FlaskConical,
  Thermometer,
  Leaf,
  LineChart,
  HardHat,
  Zap,
  Shield,
  Lightbulb,
  Wrench,
  Settings,
  CheckCircle,
  AlertTriangle,
  Star,
  Heart,
  ThumbsUp,
  Rocket,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Home,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  FileText,
  BookOpen,
  Camera,
  Image,
  Video,
  Music,
  Search,
  Bell,
  Lock,
  Key,
  Cloud,
  Sun,
  Moon,
  Globe,
  Package,
  Truck,
  ShoppingCart,
  Coffee,
  Gift,
  Award,
  Briefcase,
  GraduationCap,
  Microscope,
}

/** Fallback icon used when a stored name has no matching Lucide component. */
export const FALLBACK_ICON: LucideIcon = LineChart

/**
 * Returns the Lucide component for a given icon name, or a fallback when the
 * name is not recognized.
 */
export function getLucideIcon(name?: string | null): LucideIcon {
  if (name && LUCIDE_ICONS[name]) {
    return LUCIDE_ICONS[name]
  }
  return FALLBACK_ICON
}
