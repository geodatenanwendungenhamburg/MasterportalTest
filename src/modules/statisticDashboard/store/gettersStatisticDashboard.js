/** @import { SelectedStatistics }  from "../types/internalTypes.js" */
/** @import { StatisticDashboardLevel } from "../types/typesStatisticDashboard" */
/** @import { StatisticDashboardState } from "../store/stateStatisticDashboard.js" */
import {generateSimpleGetters} from "@shared/js/utils/generators.js";
import isObject from "@shared/js/utils/isObject.js";
import initialState from "./stateStatisticDashboard.js";
import sortBy from "@shared/js/utils/sortBy.js";

const getters = {
    ...generateSimpleGetters(initialState),

    /**
     * Gets the selected level from the configured levels by its name.
     * @param {StatisticDashboardState} state - The StatisticDashboard state.
     * @returns {StatisticDashboardLevel|undefined} The matching level or undefined.
     */
    selectedLevel: state => state.data.find(level => level.levelName === state.selectedLevelName),

    /**
     * Gets the available categories from the selected level
     * @param {StatisticDashboardState} state - The StatisticDashboard state.
     * @param {object} getters
     * @param {StatisticDashboardLevel|undefined} getters.selectedLevel
     * @returns {string[]} The available categories.
     */
    categories (state, {selectedLevel}) {
        if (!selectedLevel) {
            return [];
        }
        const categories = new Set();

        for (const attribute of Object.values(selectedLevel.mappingFilter.statisticsAttributes)) {
            categories.add(attribute.category);
        }
        return [...categories];
    },

    /**
     * Gets the an object containing the selectedStatistics
     * @param {StatisticDashboardState} state - The StatisticDashboard state.
     * @param {object} getters
     * @param {StatisticDashboardLevel|undefined} getters.selectedLevel The selected level.
     * @returns {SelectedStatistics} An object containing the selected statistics.
     */
    selectedStatistics (state, {selectedLevel}) {
        if (!selectedLevel) {
            return {};
        }
        return Object.fromEntries(
            Object.entries(selectedLevel.mappingFilter.statisticsAttributes)
                .filter(([key]) => state.selectedStatisticsKeys.includes(key))
                .map(([key, value]) => [key, {
                    ...value,
                    key,
                    selectedOrder: state.selectedStatisticsKeys.findIndex(e => e === key)
                }])
        );
    },

    /**
     * Gets the values of the selected dates.
     * @param {Object} state - The StatisticDashboard state.
     * @param {Object} getters - The StatisticDashboard getters.
     * @param {Object[]} getters.selectedDates - The selected dates.
     * @return {String[]} The values of the selected dates.
     */
    selectedDatesValues (state, {selectedDates}) {
        const datesValues = [];

        selectedDates.forEach(date => {
            if (!isObject(date)) {
                return;
            }
            if (Array.isArray(date.value)) {
                datesValues.push(...date.value);
            }
            else {
                datesValues.push(date.value);
            }
        });

        return datesValues;
    },

    /**
     * Gets the values of the selected regions.
     * @param {Object} state - The StatisticDashboard state.
     * @param {Object} getters - The StatisticDashboard getters.
     * @param {Object[]} getters.selectedRegions - The selected regions.
     * @returns {String[]} The values(names) of the selected regions.
     */
    selectedRegionsValues (state, {selectedRegions}) {
        if (!Array.isArray(selectedRegions)) {
            return [];
        }

        let regions = selectedRegions;

        if (selectedRegions.some(val => val.title === i18next.t("common:modules.statisticDashboard.button.allAreas")) && typeof state?.flattenedRegions !== "undefined") {
            regions = sortBy(state?.flattenedRegions.find(region => {
                return !Object.prototype.hasOwnProperty.call(region, "child");
            })?.values, "title");
        }

        const mappedRegionsValues = regions.map(region => region.value),
            allRegions = mappedRegionsValues.find(region => Array.isArray(region));

        return typeof allRegions !== "undefined" ? allRegions : mappedRegionsValues;
    }
};

export default getters;
