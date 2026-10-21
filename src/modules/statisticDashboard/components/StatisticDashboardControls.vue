<script>
import ButtonGroup from "@shared/modules/buttons/components/ButtonGroup.vue";
import isObject from "@shared/js/utils/isObject.js";
import {mapGetters, mapMutations} from "vuex";
import IconButton from "@shared/modules/buttons/components/IconButton.vue";

export default {
    name: "StatisticDashboardControls",
    components: {
        ButtonGroup,
        IconButton
    },
    props: {
        descriptions: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    emits: ["showChartTable", "showChartsInGrid"],
    data () {
        return {
            currentDescriptionIndex: 0,
            buttonGroupControls: [{
                                      name: "Tabelle",
                                      icon: "bi bi-table pe-2"
                                  },
                                  {
                                      name: "Diagramm",
                                      icon: "bi bi-bar-chart pe-2"
                                  }],
            switchValue: "",
            indexSelectedStatistics: 0
        };
    },
    computed: {
        ...mapGetters("Maps", ["projection"]),
        ...mapGetters("Modules/StatisticDashboard", [
            "chartTableToggle",
            "chosenStatisticName",
            "selectedDates",
            "selectedDatesValues",
            "selectedStatistics",
            "selectedReferenceData",
            "selectedRegions",
            "selectedRegionsValues",
            "selectedDatesValues"
        ]),
        /**
         * Checks if there is at least one description
         * @returns {Boolean} True if there is one otherwise false.
         */
        hasDescription () {
            if (this.descriptions.length === 0) {
                return false;
            }
            return true;
        },
        /**
         * Gets the title of the current description.
         * @returns {void}
         */
        titleDescription () {
            return this.descriptions[this.currentDescriptionIndex].title;
        },
        /**
         * Gets the content of the current description.
         * @returns {void}
         */
        contentDescription () {
            return this.descriptions[this.currentDescriptionIndex].content;
        },
        precheckedViewSwitcher () {
            if (this.chartTableToggle === "table") {
                return this.buttonGroupControls[0].name;
            }
            return this.buttonGroupControls[1].name;
        },
        isStatisticsSelected () {
            return this.selectedDatesValues.length > 0 && this.selectedRegionsValues.length > 0 && Object.keys(this.selectedStatistics)?.length > 1;
        },
        /**
         * Gets the reference subtitle.
         * @returns {String} The subtitle of reference.
         */
        referenceSubTitle () {
            if (typeof this.selectedReferenceData === "undefined") {
                return "";
            }

            let value = "";

            if (this.selectedReferenceData?.type === "region") {
                value = this.selectedReferenceData.value;

                return i18next.t("common:modules.statisticDashboard.reference.region", {value});
            }

            value = this.selectedReferenceData?.value?.label;

            return i18next.t("common:modules.statisticDashboard.reference.year", {value});
        },
        showStatisticnameInChart () {
            return this.isStatisticsSelected && typeof this.chosenStatisticName === "string" && this.chosenStatisticName !== "" && this.chartTableToggle === "chart";
        },
        showStatisticnameInTable () {
            return this.isStatisticsSelected && this.chartTableToggle === "table";
        }
    },
    watch: {
        /**
         * Emits an event to toggle between chart and table view.
         * @returns {void}
         */
        switchValue () {
            this.$emit("showChartTable");
        }
    },
    methods: {
        ...mapMutations("Modules/StatisticDashboard", [
            "setChosenStatisticName"
        ]),
        /**
         * Sets the description index one higher.
         * If the index reaches the end of the descriptions,it is set back to the beginning.
         * @returns {void}
         */
        nextDescription () {
            if (this.currentDescriptionIndex < this.descriptions.length - 1) {
                this.currentDescriptionIndex++;
            }
            else {
                this.currentDescriptionIndex = 0;
            }
        },
        /**
         * Sets the description index one lower.
         * If the index reaches the beginning of the descriptions, it is set to the end again.
         * @returns {void}
         */
        prevDescription () {
            if (this.currentDescriptionIndex > 0) {
                this.currentDescriptionIndex--;
            }
            else {
                this.currentDescriptionIndex = this.descriptions.length - 1;
            }
        },
        /**
         * Sets chart or table view
         * @param {Object} value - The name of clicked button in object with key name.
         * @returns {void}
         */
        handleView (value) {
            this.switchValue = value;
        },
        /**
         * Sets indexSelectedStatistics after clicking previous arrow.
         * @param {Number} index - The current indexSelectedStatistics.
         * @param {Object} selectedStatistics - The selected statistics.
         * @returns {void}
         */
        prevStatistic (index, selectedStatistics) {
            if (!isObject(selectedStatistics) || !Object.keys(selectedStatistics).length) {
                return;
            }

            this.indexSelectedStatistics = index - 1 >= 0 ? index - 1 : Object.keys(selectedStatistics).length + index - 1;
            this.setChosenStatisticName(selectedStatistics[Object.keys(selectedStatistics)[this.indexSelectedStatistics]]?.name);
        },
        /**
         * Sets indexSelectedStatistics after clicking next arrow.
         * @param {Number} index - The current indexSelectedStatistics.
         * @param {Object} selectedStatistics - The selected statistics.
         * @returns {void}
         */
        nextStatistic (index, selectedStatistics) {
            if (!isObject(selectedStatistics) || !Object.keys(selectedStatistics).length) {
                return;
            }

            this.indexSelectedStatistics = index + 1 < Object.keys(selectedStatistics).length ? index + 1 : index - Object.keys(selectedStatistics).length + 1;
            this.setChosenStatisticName(selectedStatistics[Object.keys(selectedStatistics)[this.indexSelectedStatistics]]?.name);
        }
    }
};
</script>

<template>
    <div class="align-items-center justify-content-between mb-3 dashboard-controls">
        <!-- Descriptions -->
        <div
            v-if="hasDescription"
            class="flex-grow-1 pb-1 description"
        >
            <div class="hstack gap-1">
                <button
                    class="p-2 fs-5 lh-1 border-0 bg-transparent description-icons"
                    @click="prevDescription"
                    @keydown="prevDescription"
                >
                    <i class="bi bi-chevron-left" />
                </button>
                <p class="pe-2 fs-6 description-content">
                    {{ titleDescription }}<br>{{ contentDescription }}
                </p>
                <button
                    class="p-2 fs-5 lh-1 border-0 bg-transparent description-icons"
                    @click="nextDescription"
                    @keydown="nextDescription"
                >
                    <i class="bi bi-chevron-right" />
                </button>
            </div>
        </div>
        <div
            v-else
            class="flex-grow-1 pb-1 descriptions-placeholder"
        >
            <div
                class="gap-1 empty"
            />
        </div>
        <ButtonGroup
            :buttons="buttonGroupControls"
            :pre-checked-value="precheckedViewSwitcher"
            :is-group="false"
            class="col col-md btn-table-diagram mb-2 p-0"
            group="dataViews"
            @set-selected-button="handleView"
        />
        <div
            v-if="showStatisticnameInChart"
            class="back-overview"
            role="button"
            tabindex="0"
            @click="$emit('showChartsInGrid', true)"
            @keydown="$emit('showChartsInGrid', true)"
        >
            <button
                class="p-2 fs-5 lh-1 border-0 bg-transparent"
            >
                <i class="bi bi-chevron-left" />
            </button>
            <span>
                {{ $t('common:modules.statisticDashboard.backToOverview') }}
            </span>
        </div>
        <div
            v-if="showStatisticnameInTable"
            class="container static-name"
        >
            <div class="row justify-content-center align-items-center">
                <IconButton
                    class="slider-control col col-1 btn-light bg-transparent"
                    :aria="$t('common:modules.statisticDashboard.button.arrowLeft')"
                    icon="bi bi-chevron-left"
                    :interaction="() => prevStatistic(indexSelectedStatistics, selectedStatistics)"
                />
                <div class="statistic-name col col-auto">
                    <span>{{ chosenStatisticName }}</span>
                    <span
                        v-if="referenceSubTitle !== ''"
                        class="text-center"
                    >
                        <span> - {{ $t('common:modules.statisticDashboard.reference.difference') }}</span>
                        <br>
                        <span class="statistic-name-subtitle col col-auto">{{ referenceSubTitle }}</span>
                    </span>
                </div>
                <IconButton
                    class="slider-control col col-1 btn-light bg-transparent"
                    :aria="$t('common:modules.statisticDashboard.button.arrowRight')"
                    icon="bi bi-chevron-right"
                    :interaction="() => nextStatistic(indexSelectedStatistics, selectedStatistics)"
                />
            </div>
        </div>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style lang="scss" scoped>
.dashboard-controls {
    .description {
        margin-top: 25px;
        .description-content {
            width: 350px;
        }
        .description-icons {
            opacity: 0.5;
        }
        .description-icons:hover {
            opacity: 1;
        }
    }
    .descriptions-placeholder {
         margin-top: 10px;
        .empty {
            width: 350px;
        }
    }
}

.btn-table-diagram {
    margin-top: 25px;
}

.difference-button {
    display: inline-block;
}

.toolbar-button-icon {
    font-size: $font_size_sm;
}

.vertical-divider {
    border-left: 1px solid $dark_grey;
    height: 35px;
}

.dropdown-menu {
    width: calc(60 * 47vw / 100);
    --bs-dropdown-zindex: 1100;
}

.btn-light {
    background-color: $light_grey;
    color: $light_grey_inactive_contrast;
    border-color: $light_grey;
}
.btn-light:hover {
    background-color: $primary;
    color: $black;
    border-color: $primary;
}

.btn {
    &.activated {
        background-color: $dark_blue;
        &:hover {
            background-color: $primary;
            color: $black;
            .badge {
            background-color: $secondary;
            color: $white;
            }
        }
    }
}

.badge {
    background-color: $primary;
    color: $black;
    --bs-badge-padding-y: 0.2rem;
    --bs-badge-padding-x: 0.7rem;
 }

 .static-name {
    margin-top: -60px;
    margin-bottom: 40px;
 }

.statistic-name {
    font-family: $font_family_accent;
    font-size: $font_size_big;
    max-width: calc(100% - 360px);
    text-align: center;
}

.statistic-name-subtitle {
    font-family: $font_family_accent;
    font-size: $font_size_sm;
    display: block;
}
.back-overview {
    font-size: 12px;
    cursor: pointer;
}
</style>
