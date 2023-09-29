import { computed } from "vue";
import { storeToRefs } from "pinia";
import { getConfig } from "@/config";
import { emitter } from "@/utils/mitt";
import { routeMetaType } from "../types";
import { useGlobal } from "@pureadmin/utils";
import { useRouter, useRoute } from "vue-router";
import { router, remainingPaths } from "@/router";
import { useAppStoreHook } from "@/store/modules/app";
import { useUserStoreHook } from "@/store/modules/user";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { setManagerStatus } from "@/api/agents";
import { inOnline } from "@/api/auth";

const errorInfo =
  "The current routing configuration is incorrect, please check the configuration";

export function useNav() {
  const route = useRoute();
  const pureApp = useAppStoreHook();
  const routers = useRouter().options.routes;
  const { wholeMenus } = storeToRefs(usePermissionStoreHook());
  const tooltipEffect = getConfig()?.TooltipEffect ?? "light";

  const user = computed(() => {
    return useUserStoreHook()?.getUser;
  });

  const userOnlineStatus = computed(() => {
    return useUserStoreHook().getOnlineStatus;
  });

  const isCollapse = computed(() => {
    return !pureApp.getSidebarStatus;
  });

  const device = computed(() => {
    return pureApp.getDevice;
  });

  const { $storage, $config } = useGlobal<GlobalPropertiesApi>();
  const layout = computed(() => {
    return $storage?.layout?.layout;
  });

  const title = computed(() => {
    return $config.Title;
  });

  function changeTitle(meta: routeMetaType) {
    const Title = getConfig().Title;
    if (Title) document.title = `${meta.title} | ${Title}`;
    else document.title = meta.title;
  }

  const setUserStatus = status => {
    setManagerStatus(status).catch();
  };

  function logout() {
    useUserStoreHook().logOut();
  }

  function backHome() {
    router.push("/home");
  }

  function goToProfileSetting() {
    router.push("/settings/profile");
  }

  function onPanel() {
    emitter.emit("openPanel");
  }

  function toggleSideBar() {
    pureApp.toggleSideBar();
  }

  function toggleSideBarValue(opened?: boolean) {
    pureApp.toggleSideBar(opened);
  }

  function handleResize(menuRef) {
    menuRef?.handleResize();
  }

  function resolvePath(route) {
    if (!route.children) return console.error(errorInfo);
    const httpReg = /^http(s?):\/\//;
    const routeChildPath = route.children[0]?.path;
    if (httpReg.test(routeChildPath)) {
      return route.path + "/" + routeChildPath;
    } else {
      return routeChildPath;
    }
  }

  function menuSelect(indexPath: string, routers): void {
    if (wholeMenus.value.length === 0) return;
    if (isRemaining(indexPath)) return;
    let parentPath = "";
    const parentPathIndex = indexPath.lastIndexOf("/");
    if (parentPathIndex > 0) {
      parentPath = indexPath.slice(0, parentPathIndex);
    }
    function findCurrentRoute(indexPath: string, routes) {
      if (!routes) return console.error(errorInfo);
      return routes.map(item => {
        if (item.path === indexPath) {
          if (item.redirect) {
            findCurrentRoute(item.redirect, item.children);
          } else {
            emitter.emit("changLayoutRoute", {
              indexPath,
              parentPath
            });
          }
        } else {
          if (item.children) findCurrentRoute(indexPath, item.children);
        }
      });
    }
    findCurrentRoute(indexPath, routers);
  }

  function isRemaining(path: string): boolean {
    return remainingPaths.includes(path);
  }

  if (!useAppStoreHook().getInOnline) {
    useAppStoreHook().toggleInOnline(true);

    useAppStoreHook().setInOnlineInterval(
      setInterval(() => {
        inOnline().catch();
      }, 90000)
    );
  }

  return {
    route,
    title,
    device,
    layout,
    logout,
    routers,
    $storage,
    backHome,
    onPanel,
    changeTitle,
    toggleSideBar,
    toggleSideBarValue,
    menuSelect,
    handleResize,
    resolvePath,
    isCollapse,
    pureApp,
    user,
    userOnlineStatus,
    tooltipEffect,
    setUserStatus,
    goToProfileSetting
  };
}
