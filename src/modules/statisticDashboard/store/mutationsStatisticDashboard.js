// @ts-check

/** @import { StatisticDashboardState } from "../store/stateStatisticDashboard.js" */
import {generateSimpleMutations} from "@shared/js/utils/generators.js";
import initialState from "./stateStatisticDashboard.js";

const mutations = {
    ...generateSimpleMutations(initialState),

    /**
     * Updates the selected categories, and statistics if necessary
     * @param {StatisticDashboardState} state The state
     * @param {string[]} selectedCategories Payload - the new categories
     */
    updateSelectedCategories (state, selectedCategories) {
        const selectedLevel = state.data.find(level => level.levelName === state.selectedLevelName);

        if (!selectedLevel) {
            return;
        }

        state.selectedCategories = selectedCategories;

        const updatedSelectedStatisticsKeys = state.selectedStatisticsKeys.filter(key => {
            return selectedCategories.includes(
                selectedLevel.mappingFilter.statisticsAttributes[key].category
            );
        });

        state.selectedStatisticsKeys = updatedSelectedStatisticsKeys;
    }
};

export default mutations;
