<script>
// @ts-check
/**
 * @import {StatisticDashboardMapGetters, StatisticDashboardMapMutations} from "../types/helpers.js"
 * @import {DropdownItem} from "@shared/modules/dropdown/types/typesDropdown.js"
 */
import ButtonGroup from "@shared/modules/buttons/components/ButtonGroup.vue";
import BaseCard from "@shared/modules/Cards/BaseCard.vue";
import DropdownAutocomplete from "@shared/modules/dropdown/components/DropdownAutocomplete.vue";
import {mapGetters, mapMutations} from "vuex";
import StatisticDashboardFilterRegions from "./StatisticDashboardFilterRegions.vue";
import StatisticDashboardDifference from "./StatisticDashboardDifference.vue";
import SwitchInput from "@shared/modules/checkboxes/components/SwitchInput.vue";

export default {
    name: "StatisticDashboardDataSelectionExpanded",
    components: {
        BaseCard,
        ButtonGroup,
        DropdownAutocomplete,
        StatisticDashboardFilterRegions,
        StatisticDashboardDifference,
        SwitchInput
    },
    data () {
        return {
            isExpanded: false,
            showDifference: false
        };
    },
    computed: {
        .../** @type {StatisticDashboardMapGetters} */ (mapGetters)("Modules/StatisticDashboard", [
            "categories",
            "data",
            "selectedCategories",
            "selectedDates",
            "selectedLevel",
            "selectedStatisticsKeys",
            "timeStepsFilter"
        ]),

        /**
         * Gets the buttons with group regions
         * @typedef {Object} ButtonGroupRegion
         * @property {string} name - The name of the region.
         * @returns {ButtonGroupRegion[]} The button group regions
         */
        buttonGroupRegions () {
            return this.data.map(level => ({
                name: level.levelName
            }));
        },

        /**
         * Gets the statistics filtered by the selected categories.
         * @returns {DropdownItem[]} The statistics for the selected categories.
         */
        statisticsForSelectedCategories () {
            if (typeof this.selectedLevel === "undefined") {
                return [];
            }

            return Object.entries(this.selectedLevel.mappingFilter.statisticsAttributes)
                .filter(([, attribute]) => this.selectedCategories.includes(attribute.category))
                .map(([statisticName, attribute]) => ({
                    value: statisticName,
                    title: attribute.name
                }));
        }
    },
    methods: {
        .../** @type {StatisticDashboardMapMutations} */ (mapMutations)("Modules/StatisticDashboard", [
            "setSelectedDates",
            "setSelectedLevelName",
            "setSelectedStatisticsKeys",
            "updateSelectedCategories"
        ])
    }
};

</script>

<template lang="html">
    <div
        v-if="buttonGroupRegions.length > 1"
        class="col-md-auto mt-2"
    >
        <ButtonGroup
            :buttons="buttonGroupRegions"
            :pre-checked-value="selectedLevel?.levelName"
            group="regions"
            class="level-switch"
            @set-selected-button="setSelectedLevelName"
        />
    </div>
    <BaseCard class="m-2">
        <DropdownAutocomplete
            label="Kategorien"
            :items="categories"
            multiple
            :model-value="selectedCategories"
            @update:model-value="updateSelectedCategories"
        />
        <DropdownAutocomplete
            label="Indikatoren"
            :items="statisticsForSelectedCategories"
            :model-value="selectedStatisticsKeys"
            multiple
            @update:model-value="setSelectedStatisticsKeys"
        />
        Aufschlüsselung
    </BaseCard>
    <BaseCard class="m-2">
        <StatisticDashboardFilterRegions />
    </BaseCard>
    <BaseCard class="m-2">
        <DropdownAutocomplete
            :label="$t('common:modules.statisticDashboard.label.year')"
            :items="timeStepsFilter"
            return-object
            multiple
            :placeholder="$t('common:modules.statisticDashboard.reference.placeholder')"
            :model-value="selectedDates"
            @update:model-value="setSelectedDates"
        />
    </BaseCard>
    <SwitchInput
        id="show-difference"
        v-model="showDifference"
        aria="Differenzen anzeigen"
        label="Differenzen anzeigen"
    />
    <StatisticDashboardDifference v-if="showDifference" />
</template>
