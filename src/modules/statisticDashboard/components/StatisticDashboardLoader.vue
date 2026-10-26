<script>
import {defineAsyncComponent} from "vue";
import SpinnerItem from "@shared/modules/spinner/components/SpinnerItem.vue";

/**
 * Lightweight entry point of the statistic dashboard for the menu.
 * Loads the StatisticDashboard lazily and shows a spinner while loading.
 * Implements the keep-alive hooks, so the menu caches this component and with it the loaded dashboard.
 * See documentation: docs/Dev/vueComponents/ModuleCaching.md
 * @module modules/statisticDashboard/components/StatisticDashboardLoader
 */
export default {
    name: "StatisticDashboardLoader",
    components: {
        StatisticDashboard: defineAsyncComponent({
            loader: () => import("./StatisticDashboard.vue"),
            loadingComponent: SpinnerItem,
            delay: 200
        })
    },

    /**
     * Keep-alive hook, required by the menu to cache this component. The dashboard handles its own activation.
     * @returns {void}
     */
    activated () {
        return undefined;
    },

    /**
     * Keep-alive hook, required by the menu to cache this component. The dashboard handles its own deactivation.
     * @returns {void}
     */
    deactivated () {
        return undefined;
    }
};
</script>

<template>
    <StatisticDashboard />
</template>
