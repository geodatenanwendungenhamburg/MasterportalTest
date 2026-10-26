<script>
import SwitchInput from "@shared/modules/checkboxes/components/SwitchInput.vue";

export default {
    name: "StatisticDashboardMapSettings",
    components: {
        SwitchInput
    },
    props: {
        /**
         * Current number of classes.
         */
        classCount: {
            type: Number,
            required: false,
            default: 5
        },
        /**
         * Value of the currently selected classification method.
         */
        classificationMethod: {
            type: String,
            required: false,
            default: ""
        },
        /**
         * Available classification methods as [{value, label}, ...]. The dropdown is hidden if empty.
         */
        classificationOptions: {
            type: Array,
            required: false,
            default: () => []
        },
        /**
         * Legend entries as delivered by FeaturesHandler.getLegendValue: [{name, graphic}, ...].
         */
        legendItems: {
            type: Array,
            required: false,
            default: () => []
        },
        /**
         * True if there is no data to build a legend from.
         */
        legendNoData: {
            type: Boolean,
            required: false,
            default: false
        },
        /**
         * Maximum class count.
         * @type {Number}
         * @default 9
         */
        maxClassCount: {
            type: Number,
            required: false,
            default: 9
        },
        /**
         * Minimum class count.
         * @type {Number}
         * @default 3
         */
        minClassCount: {
            type: Number,
            required: false,
            default: 3
        },
        /**
         * Whether area names, year and value are shown as labels on the map.
         */
        showLabels: {
            type: Boolean,
            required: false,
            default: true
        },
        /**
         * Whether tooltips are shown on the map.
         */
        showTooltips: {
            type: Boolean,
            required: false,
            default: true
        },
        /**
         * Name of the selected statistic, used in the legend title.
         */
        statisticName: {
            type: String,
            required: false,
            default: ""
        },
        /**
         * Selected year (column), used in the legend title.
         */
        year: {
            type: [String, Number],
            required: false,
            default: ""
        }
    },
    emits: ["update:showLabels", "update:showTooltips", "update:classificationMethod", "update:classCount"],
    computed: {
        /**
         * Gets the title of the legend, e.g. "statistic name - year".
         * @returns {String} The legend title.
         */
        legendTitle () {
            return `${this.statisticName} - ${this.year}`;
        }
    },
    methods: {
        /**
         * Emits the new number of classes as a number (range inputs deliver strings).
         * @param {Event} event The input event of the range slider.
         * @returns {void}
         */
        onClassCountInput (event) {
            this.$emit("update:classCount", Number(event.target.value));
        }
    }
};
</script>

<template>
    <div class="map-settings px-2">
        <h5 class="mb-3 mt-3 map-settings-heading">
            {{ $t("common:modules.statisticDashboard.legend.additionalInformation") }}
        </h5>
        <SwitchInput
            id="map-settings-labels"
            class="mb-2"
            label="common:modules.statisticDashboard.legend.showLabels"
            :aria="$t('common:modules.statisticDashboard.legend.showLabels')"
            :model-value="showLabels"
            @update:model-value="$emit('update:showLabels', $event)"
        />
        <SwitchInput
            id="map-settings-tooltips"
            class="mb-4"
            label="common:modules.statisticDashboard.legend.showTooltips"
            :aria="$t('common:modules.statisticDashboard.legend.showTooltips')"
            :model-value="showTooltips"
            @update:model-value="$emit('update:showTooltips', $event)"
        />
        <div
            v-if="legendItems.length || legendNoData"
            class="map-settings-legend mb-4"
        >
            <h5 class="mb-1 map-settings-heading">
                {{ $t("common:modules.statisticDashboard.legend.legend") }}
            </h5>
            <template v-if="!legendNoData">
                <p
                    class="map-settings-legend-title mb-3"
                >
                    {{ legendTitle }}
                </p>
                <ul class="list-unstyled mb-0">
                    <li
                        v-for="item in legendItems"
                        :key="item.name"
                        class="d-flex align-items-center mb-1"
                    >
                        <img
                            :alt="item.name"
                            :src="item.graphic"
                            class="legend-img me-3"
                        >
                        <span class="legend-name">{{ item.name }}</span>
                    </li>
                </ul>
            </template>
            <p
                v-else
                class="mb-0"
            >
                {{ $t("common:modules.statisticDashboard.legend.nodata") }}
            </p>
        </div>
        <h5 class="mb-3 map-settings-subheading">
            {{ $t("common:modules.statisticDashboard.legend.editClassification") }}
        </h5>
        <div
            v-if="classificationOptions.length"
            class="form-floating mb-4"
        >
            <select
                id="map-settings-classification"
                class="form-select"
                :value="classificationMethod"
                @change="$emit('update:classificationMethod', $event.target.value)"
            >
                <option
                    v-for="option in classificationOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
            <label for="map-settings-classification">
                {{ $t("common:modules.statisticDashboard.legend.editClassification") }}
            </label>
        </div>
        <label
            class="form-label"
            for="map-settings-class-count"
        >
            {{ $t("common:modules.statisticDashboard.legend.numberOfClasses", {count: classCount}) }}
        </label>
        <input
            id="map-settings-class-count"
            class="form-range"
            type="range"
            step="1"
            :min="minClassCount"
            :max="maxClassCount"
            :value="classCount"
            @input="onClassCountInput"
        >
        <div class="d-flex justify-content-between map-settings-range-labels">
            <span>{{ minClassCount }}</span>
            <span>{{ maxClassCount }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.map-settings {
    .map-settings-heading {
        font-family: $font_family_accent;
    }
    .map-settings-subheading {
        font-family: $font_family_accent;
        color: $dark_grey;
    }

    .map-settings-legend-title,
    .map-settings-range-labels {
        font-size: $font_size_sm;
    }
    .legend-img {
        width: 15px;
        border-radius: 50%;
    }
    .legend-name {
        font-size: 12px;
    }
}
</style>
