import type {
  VNode,
  FunctionalComponent,
  PropType as VuePropType,
  ComponentPublicInstance
} from "vue";
import type { ECharts } from "echarts";
import type { IconifyIcon } from "@iconify/vue";
import type { TableColumns } from "@pureadmin/table";
import { type RouteComponent, type RouteLocationNormalized } from "vue-router";

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };

  interface Window {
    // Global vue app instance
    __APP__: App<Element>;
    webkitCancelAnimationFrame: (handle: number) => void;
    mozCancelAnimationFrame: (handle: number) => void;
    oCancelAnimationFrame: (handle: number) => void;
    msCancelAnimationFrame: (handle: number) => void;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  }

  type ViteCompression =
    | "none"
    | "gzip"
    | "brotli"
    | "both"
    | "gzip-clear"
    | "brotli-clear"
    | "both-clear";

  interface ViteEnv {
    VITE_PORT: number;
    VITE_PUBLIC_PATH: string;
    VITE_ROUTER_HISTORY: string;
    VITE_CDN: boolean;
    VITE_COMPRESSION: ViteCompression;
  }

  interface TableColumnList extends Array<TableColumns> {}

  interface ServerConfigs {
    Version?: string;
    Title?: string;
    FixedHeader?: boolean;
    HiddenSideBar?: boolean;
    MultiTagsCache?: boolean;
    KeepAlive?: boolean;
    Locale?: string;
    Layout?: string;
    Theme?: string;
    DarkMode?: boolean;
    Grey?: boolean;
    Weak?: boolean;
    HideTabs?: boolean;
    SidebarStatus?: boolean;
    EpThemeColor?: string;
    ShowLogo?: boolean;
    ShowModel?: string;
    MenuArrowIconNoTransition?: boolean;
    CachingAsyncRoutes?: boolean;
    TooltipEffect?: Effect;
  }

  interface StorageConfigs {
    version?: string;
    title?: string;
    fixedHeader?: boolean;
    hiddenSideBar?: boolean;
    multiTagsCache?: boolean;
    keepAlive?: boolean;
    locale?: string;
    layout?: string;
    theme?: string;
    darkMode?: boolean;
    grey?: boolean;
    weak?: boolean;
    hideTabs?: boolean;
    sidebarStatus?: boolean;
    epThemeColor?: string;
    showLogo?: boolean;
    showModel?: string;
    email?: string;
  }

  interface ResponsiveStorage {
    locale: {
      locale?: string;
    };
    layout: {
      layout?: string;
      theme?: string;
      darkMode?: boolean;
      sidebarStatus?: boolean;
      epThemeColor?: string;
    };
    configure: {
      grey?: boolean;
      weak?: boolean;
      hideTabs?: boolean;
      showLogo?: boolean;
      showModel?: string;
      multiTagsCache?: boolean;
    };
    tags?: Array<any>;
  }

  interface toRouteType extends RouteLocationNormalized {
    meta: {
      roles: Array<string>;
      keepAlive?: boolean;
      dynamicLevel?: string;
    };
  }

  interface RouteChildrenConfigsTable {
    path: string;
    name?: string;
    redirect?: string;
    component?: RouteComponent;
    meta?: {
      title: string;
      icon?: string | FunctionalComponent | IconifyIcon;
      extraIcon?: {
        svg?: boolean;
        name?: string;
      };
      showLink?: boolean;
      showParent?: boolean;
      roles?: Array<string>;
      auths?: Array<string>;
      keepAlive?: boolean;
      frameSrc?: string;
      frameLoading?: boolean;
      transition?: {
        name?: string;
        enterTransition?: string;
        leaveTransition?: string;
      };
      hiddenTag?: boolean;
      dynamicLevel?: number;
    };
    children?: Array<RouteChildrenConfigsTable>;
  }

  interface RouteConfigsTable {
    path: string;
    name?: string;
    component?: RouteComponent;
    redirect?: string;
    meta?: {
      title: string;
      icon?: string | FunctionalComponent | IconifyIcon;
      showLink?: boolean;
      rank?: number;
    };
    children?: Array<RouteChildrenConfigsTable>;
  }

  interface GlobalPropertiesApi {
    $echarts: ECharts;
    $storage: ResponsiveStorage;
    $config: ServerConfigs;
  }
}
