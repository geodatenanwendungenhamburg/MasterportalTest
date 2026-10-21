import {expect} from "chai";
import mutations from "@modules/statisticDashboard/store/mutationsStatisticDashboard.js";

describe("src/modules/statisticDashboard/store/mutationsStatisticDashboard.js", () => {
    describe("updateSelectedCategories", () => {
        it("should update selected categories and retain statistics in those categories", () => {
            const state = {
                data: [{
                    levelName: "Counties",
                    mappingFilter: {
                        statisticsAttributes: {
                            populationTotal: {category: "Population"},
                            employmentTotal: {category: "Employment"}
                        }
                    }
                }],
                selectedLevelName: "Counties",
                selectedCategories: ["Population", "Employment"],
                selectedStatisticsKeys: ["populationTotal", "employmentTotal"]
            };

            mutations.updateSelectedCategories(state, ["Population"]);

            expect(state.selectedCategories).to.deep.equal(["Population"]);
            expect(state.selectedStatisticsKeys).to.deep.equal(["populationTotal"]);
        });

        it("should leave state unchanged when no level is selected", () => {
            const state = {
                data: [],
                selectedLevelName: "Missing level",
                selectedCategories: ["Population"],
                selectedStatisticsKeys: ["populationTotal"]
            };

            mutations.updateSelectedCategories(state, ["Employment"]);

            expect(state.selectedCategories).to.deep.equal(["Population"]);
            expect(state.selectedStatisticsKeys).to.deep.equal(["populationTotal"]);
        });
    });
});
