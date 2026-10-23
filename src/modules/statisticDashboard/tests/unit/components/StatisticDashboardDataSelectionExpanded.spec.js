import {shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import {createStore} from "vuex";
import ButtonGroup from "@shared/modules/buttons/components/ButtonGroup.vue";
import DropdownAutocomplete from "@shared/modules/dropdown/components/DropdownAutocomplete.vue";
import indexStatisticDashboard from "@modules/statisticDashboard/store/indexStatisticDashboard.js";
import StatisticDashboardDataSelectionExpanded from "@modules/statisticDashboard/components/StatisticDashboardDataSelectionExpanded.vue";
import StatisticDashboardDifference from "@modules/statisticDashboard/components/StatisticDashboardDifference.vue";
import FlatButton from "@shared/modules/buttons/components/FlatButton.vue";
import SwitchInput from "@shared/modules/checkboxes/components/SwitchInput.vue";

describe("src/modules/statisticDashboard/components/StatisticDashboardDataSelectionExpanded.vue", () => {
    const statisticAttributes = {
            populationTotal: {name: "Total population", category: "Population"},
            populationFemale: {name: "Female population", category: "Population"},
            employmentTotal: {name: "Total employment", category: "Employment"}
        },
        levels = [
            {
                levelName: "Counties",
                mappingFilter: {statisticsAttributes: statisticAttributes}
            },
            {
                levelName: "Municipalities",
                mappingFilter: {statisticsAttributes: statisticAttributes}
            }
        ];

    let store;

    beforeEach(() => {
        store = createStore({
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        StatisticDashboard: {
                            ...indexStatisticDashboard,
                            state: structuredClone(indexStatisticDashboard.state)
                        }
                    }
                }
            }
        });
        store.commit("Modules/StatisticDashboard/setData", levels);
        store.commit("Modules/StatisticDashboard/setSelectedLevelName", "Counties");
        store.commit("Modules/StatisticDashboard/setSelectedCategories", ["Population"]);
        store.commit("Modules/StatisticDashboard/setSelectedStatisticsKeys", ["populationTotal", "populationFemale"]);
    });

    /**
     * Mounts the expanded data selection with the test store.
     * @returns {Wrapper} The mounted component.
     */
    function createWrapper () {
        return shallowMount(StatisticDashboardDataSelectionExpanded, {
            global: {
                plugins: [store]
            }
        });
    }

    it("filters the statistic options by selected categories", () => {
        const wrapper = createWrapper();

        expect(wrapper.vm.statisticsForSelectedCategories).to.deep.equal([
            {value: "populationTotal", title: "Total population"},
            {value: "populationFemale", title: "Female population"}
        ]);
    });

    it("returns no statistic options when no level is selected", () => {
        store.commit("Modules/StatisticDashboard/setSelectedLevelName", "Missing level");
        const wrapper = createWrapper();

        expect(wrapper.vm.statisticsForSelectedCategories).to.deep.equal([]);
    });

    it("updates the selected categories and removes statistics outside them", async () => {
        const wrapper = createWrapper(),
            categoryDropdown = wrapper.findAllComponents(DropdownAutocomplete)[0];

        await categoryDropdown.vm.$emit("update:model-value", ["Employment"]);

        expect(store.state.Modules.StatisticDashboard.selectedCategories).to.deep.equal(["Employment"]);
        expect(store.state.Modules.StatisticDashboard.selectedStatisticsKeys).to.deep.equal([]);
    });

    it("updates selected statistics from the statistic dropdown", async () => {
        const wrapper = createWrapper(),
            statisticDropdown = wrapper.findAllComponents(DropdownAutocomplete)[1];

        await statisticDropdown.vm.$emit("update:model-value", ["populationFemale"]);

        expect(store.state.Modules.StatisticDashboard.selectedStatisticsKeys).to.deep.equal(["populationFemale"]);
    });

    it("renders level buttons and changes the selected level", async () => {
        const wrapper = createWrapper(),
            buttonGroup = wrapper.findComponent(ButtonGroup);

        expect(buttonGroup.props("buttons")).to.deep.equal([
            {name: "Counties"},
            {name: "Municipalities"}
        ]);

        await buttonGroup.vm.$emit("set-selected-button", "Municipalities");

        expect(store.state.Modules.StatisticDashboard.selectedLevelName).to.equal("Municipalities");
    });

    it("shows difference controls after enabling the difference switch", async () => {
        const wrapper = createWrapper(),
            differenceSwitch = wrapper.findComponent(SwitchInput);

        expect(wrapper.findComponent(StatisticDashboardDifference).exists()).to.be.false;

        await differenceSwitch.vm.$emit("update:model-value", true);

        expect(wrapper.findComponent(StatisticDashboardDifference).exists()).to.be.true;
    });

    it("emits the showData event when the action button is activated", () => {
        const wrapper = createWrapper(),
            showDataButton = wrapper.findComponent(FlatButton);

        showDataButton.props("interaction")();

        expect(wrapper.emitted("click:showData")).to.have.lengthOf(1);
    });
});
