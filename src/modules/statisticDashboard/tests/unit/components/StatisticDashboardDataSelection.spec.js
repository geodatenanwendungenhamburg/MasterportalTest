import {shallowMount, mount} from "@vue/test-utils";
import {describe, it, expect} from "vitest";
import IconButton from "@shared/modules/buttons/components/IconButton.vue";
import StatisticDashboardDataSelection from "../../../components/StatisticDashboardDataSelection.vue";

describe("StatisticDashboardDataSelection.vue", () => {
    const mountOptions = {
        global: {
            mocks: {
                $t: key => key
            }
        }
    };

    it("renders the edit button and is collapsed by default", () => {
        const wrapper = shallowMount(StatisticDashboardDataSelection, mountOptions);

        expect(wrapper.vm.isExpanded).toBe(false);
        expect(wrapper.find("button.btn-text").exists()).toBe(true);
        expect(wrapper.find("#close-filter-button").exists()).toBe(false);
    });

    it("sets isExpanded to true when the edit button is clicked", async () => {
        const wrapper = shallowMount(StatisticDashboardDataSelection, mountOptions);

        await wrapper.find("button.btn-text").trigger("click");

        expect(wrapper.vm.isExpanded).toBe(true);
        expect(wrapper.find("button.btn-text").exists()).toBe(false);
    });

    it("renders reset and close buttons when expanded", async () => {
        const wrapper = shallowMount(StatisticDashboardDataSelection, mountOptions);

        await wrapper.setData({isExpanded: true});

        expect(wrapper.find("#reset-filter-button").exists()).toBe(true);
        expect(wrapper.find("#close-filter-button").exists()).toBe(true);
    });

    it("sets isExpanded to false when the close button is clicked", async () => {
        const wrapper = mount(StatisticDashboardDataSelection, mountOptions);

        await wrapper.setData({isExpanded: true});

        const iconButtons = wrapper.findAllComponents(IconButton);
        const closeButton = iconButtons.find(button => button.props("id") === "close-filter-button"
            || button.attributes("id") === "close-filter-button");

        await closeButton.vm.$emit("click");

        expect(wrapper.vm.isExpanded).toBe(false);
        expect(wrapper.find("button.btn-text").exists()).toBe(true);
    });
});
