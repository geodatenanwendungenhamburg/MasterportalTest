import {shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import DropdownSelect from "@shared/modules/dropdown/components/DropdownSelect.vue";

describe("src/shared/modules/dropdown/components/DropdownSelect.vue", () => {
    const items = ["Hamburg", "Bremen", "Berlin"],
        // the default stub renders vuetify's "prefix" prop as a read-only DOM attribute
        VSelectStub = {
            name: "VSelect",
            props: ["items", "modelValue"],
            emits: ["update:modelValue"],
            template: "<div />"
        };

    /**
     * Mounts the component with the given props.
     * @param {Object} props the props to pass
     * @returns {Object} the mounted wrapper
     */
    function mountComponent (props = {}) {
        return shallowMount(DropdownSelect, {
            props: {label: "City", ...props},
            global: {
                stubs: {VSelect: VSelectStub}
            }
        });
    }

    describe("items", () => {
        it("passes all items to the select", () => {
            const wrapper = mountComponent({items}),
                select = wrapper.findComponent({name: "VSelect"});

            expect(select.exists()).to.be.true;
            expect(select.props("items")).to.have.lengthOf(3);
        });

        it("passes an empty list if no items are given", () => {
            const wrapper = mountComponent(),
                select = wrapper.findComponent({name: "VSelect"});

            expect(select.props("items")).to.have.lengthOf(0);
        });
    });

    describe("update:modelValue", () => {
        it("emits update:modelValue with the selected value", async () => {
            const wrapper = mountComponent({items});

            await wrapper.findComponent({name: "VSelect"}).vm.$emit("update:modelValue", "Bremen");

            expect(wrapper.emitted("update:modelValue")).to.deep.equal([["Bremen"]]);
        });

        it("emits update:modelValue with an array if multiple is set", async () => {
            const wrapper = mountComponent({items, multiple: true});

            await wrapper.findComponent({name: "VSelect"}).vm.$emit("update:modelValue", ["Hamburg", "Berlin"]);

            expect(wrapper.emitted("update:modelValue")).to.deep.equal([[["Hamburg", "Berlin"]]]);
        });

        it("does not emit update:modelValue without interaction", () => {
            const wrapper = mountComponent({items});

            expect(wrapper.emitted("update:modelValue")).to.be.undefined;
        });
    });
});
