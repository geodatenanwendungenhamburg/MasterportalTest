<script>
// @ts-check
import IconButton from "@shared/modules/buttons/components/IconButton.vue";
import StatisticDashboardDataSelectionExpanded from "./StatisticDashboardDataSelectionExpanded.vue";

export default {
    name: "StatisticDashboardDataSelection",
    components: {
        IconButton,
        StatisticDashboardDataSelectionExpanded
    },
    emits: ["resetAll"],
    data () {
        return {
            isExpanded: false
        };
    }
};

</script>

<template lang="html">
    <div class="card card-body p-3">
        <div
            v-show="isExpanded"
            class="px-2"
        >
            <div class="d-flex flex-wrap justify-content-between">
                <div class="my-3">
                    <h5 class="m-0">
                        <i class="bi bi-sliders mr-2" />
                        {{ $t('common:modules.statisticDashboard.headings.dataSelection') }}
                    </h5>
                </div>
                <div class="d-flex gap-2">
                    <IconButton
                        id="reset-filter-button"
                        :aria="$t('common:modules.statisticDashboard.button.resetFilter')"
                        :label="$t('common:modules.statisticDashboard.button.resetFilter')"
                        icon="bi bi-arrow-counterclockwise"
                        :label-class-array="['mt-1 lh-sm btn-label-smaller']"
                        @click="$emit('resetAll')"
                    />
                    <IconButton
                        id="close-filter-button"
                        :aria="$t('common:modules.statisticDashboard.button.closeFilter')"
                        :label="$t('common:modules.statisticDashboard.button.closeFilter')"
                        icon="bi bi-x"
                        :label-class-array="['mt-1 lh-sm btn-label-smaller']"
                        @click="isExpanded = false"
                    />
                </div>
            </div>
            <StatisticDashboardDataSelectionExpanded
                @click:showData="isExpanded = false"
            />
        </div>
        <template v-if="!isExpanded">
            <div class="d-flex flex-wrap justify-content-between">
                <div class="my-3">
                    <h5 class="m-0">
                        <i class="bi bi-sliders mx-2" />
                        {{ $t('common:modules.statisticDashboard.headings.dataSelection') }}
                    </h5>
                </div>
                <div>
                    <button
                        type="button"
                        class="btn btn-text fw-bold shadow-none"
                        @click="isExpanded = true"
                    >
                        {{ $t('common:modules.statisticDashboard.legend.edit') }}
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>

.btn-text {
    color: $secondary;
    font-size: $font_size_sm;
}

.btn-wrapper {
    width: 5rem !important;
}

</style>
