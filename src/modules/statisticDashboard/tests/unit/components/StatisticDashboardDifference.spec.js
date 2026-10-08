import {shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import {createStore} from "vuex";
import StatisticDashboardDifference from "@modules/statisticDashboard/components/StatisticDashboardDifference.vue";
import indexStatisticDashboard from "@modules/statisticDashboard/store/indexStatisticDashboard.js";
import Multiselect from "vue-multiselect";
import {rawLayerList} from "@masterportal/masterportalapi/src/index.js";
import getOAFFeature from "@shared/js/api/oaf/getOAFFeature.js";
import sinon from "sinon";


describe("src/modules/statiscticDashboard/components/StatisticDashboardDifference.vue", () => {
    const propsData = {
        referenceData: {
            "date": [
                {label: "2000", value: "2000"},
                {label: "2001", value: "2001"},
                {label: "2002", value: "2002"}
            ],
            "region": [
                {label: "Wandsbek", value: "Wandsbek"},
                {label: "Hamburg", value: "Hamburg"},
                {label: "Deutschland", value: "Deutschland"}
            ]
        }
    };

    let store;

    beforeEach(() => {
        store = createStore({
            namespaced: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        StatisticDashboard: indexStatisticDashboard
                    }
                }
            }
        });
    });


    describe("Component DOM", () => {
        it("The title should exist", () => {
            const wrapper = shallowMount(StatisticDashboardDifference, {
                propsData: propsData,
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.find("h4").exists()).to.be.true;
        });

        it("should find switcher component", () => {
            const wrapper = shallowMount(StatisticDashboardDifference, {
                propsData: propsData,
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.findComponent({name: "ButtonGroup"}).exists()).to.be.true;
        });

        it("The component multiselect should exist", () => {
            const wrapper = shallowMount(StatisticDashboardDifference, {
                propsData: propsData,
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.findComponent(Multiselect).exists()).to.be.true;
        });

        it("should find a des element", () => {
            const wrapper = shallowMount(StatisticDashboardDifference, {
                propsData: propsData,
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.find(".des").exists()).to.be.true;
        });
    });

    describe("Methods", () => {
        describe("updateSelectedReferenceData", () => {
            it("should set the selectedReferenceData to the emit object for date", () => {
                const wrapper = shallowMount(StatisticDashboardDifference, {
                        propsData: propsData,
                        global: {
                            plugins: [store]
                        }
                    }),
                    expected = {
                        type: "date",
                        value: {
                            label: "1999",
                            value: "1999-01-01"
                        }
                    },
                    setSelectedReferenceDataStub = sinon.stub(wrapper.vm, "setSelectedReferenceData");

                wrapper.vm.selectedDate = {label: "1999", value: "1999-01-01"};
                wrapper.vm.updateSelectedReferenceData("date");

                expect(setSelectedReferenceDataStub.calledWith(expected)).to.be.true;
                expect(wrapper.vm.selectedRegion).to.be.an("string").that.is.empty;
            });
            it("should set the selectedReferenceData to undefined for date if no vale for selectedDate is set", () => {
                const wrapper = shallowMount(StatisticDashboardDifference, {
                        propsData: propsData,
                        global: {
                            plugins: [store]
                        }
                    }),
                    setSelectedReferenceDataStub = sinon.stub(wrapper.vm, "setSelectedReferenceData");

                wrapper.vm.selectedDate = undefined;
                wrapper.vm.updateSelectedReferenceData("date");

                expect(setSelectedReferenceDataStub.calledWith(undefined)).to.be.true;
                expect(wrapper.vm.selectedRegion).to.be.an("string").that.is.empty;
            });
            it("should set the selectedReferenceData to the emit object for region", () => {
                const wrapper = shallowMount(StatisticDashboardDifference, {
                        propsData: propsData,
                        global: {
                            plugins: [store]
                        }
                    }),
                    expected = {
                        type: "region",
                        value: "Hamburg"
                    },
                    setSelectedReferenceDataStub = sinon.stub(wrapper.vm, "setSelectedReferenceData");

                wrapper.vm.selectedRegion = "Hamburg";
                wrapper.vm.updateSelectedReferenceData("region");

                expect(setSelectedReferenceDataStub.calledWith(expected)).to.be.true;
                expect(wrapper.vm.selectedDate).to.be.an("string").that.is.empty;
            });
            it("should set the selectedReferenceData to undefined for region", () => {
                const wrapper = shallowMount(StatisticDashboardDifference, {
                        propsData: propsData,
                        global: {
                            plugins: [store]
                        }
                    }),
                    setSelectedReferenceDataStub = sinon.stub(wrapper.vm, "setSelectedReferenceData");

                wrapper.vm.selectedRegion = undefined;
                wrapper.vm.updateSelectedReferenceData("region");

                expect(setSelectedReferenceDataStub.calledWith(undefined)).to.be.true;
                expect(wrapper.vm.selectedDate).to.be.an("string").that.is.empty;
            });
            it("should set the selectedReferenceData", async () => {
                const wrapper = shallowMount(StatisticDashboardDifference, {
                        propsData: propsData,
                        global: {
                            plugins: [store]
                        }
                    }),
                    setSelectedReferenceDataStub = sinon.stub(wrapper.vm, "setSelectedReferenceData");

                wrapper.vm.selectedRegion = "Hamburg";
                wrapper.vm.updateSelectedReferenceData("region");
                expect(setSelectedReferenceDataStub.called).to.be.true;
            });
        });
        describe("getRegionsOptionsForLastChild", () => {
            it("should return an empty arry if flattenedRegions is empty", async () => {
                const wrapper = shallowMount(StatisticDashboardDifference, {
                    propsData: propsData,
                    global: {
                        plugins: [store]
                    }
                });

                expect(await wrapper.vm.getRegionsOptionsForLastChild([])).to.be.an("array").that.is.empty;
            });
            it("should return the values of the last child if they are already present", async () => {
                const wrapper = shallowMount(StatisticDashboardDifference, {
                    propsData: propsData,
                    global: {
                        plugins: [store]
                    }
                });

                sinon.stub(rawLayerList, "getLayerWhere");
                await wrapper.vm.$nextTick();
                expect(await wrapper.vm.getRegionsOptionsForLastChild([{values: ["foo"]}])).to.deep.equal(["foo"]);
            });
            it("should return an empty array if no layer is found", async () => {
                const wrapper = shallowMount(StatisticDashboardDifference, {
                    propsData: propsData,
                    global: {
                        plugins: [store]
                    }
                });

                store.commit("Modules/StatisticDashboard/setSelectedLevel", {layerId: ["1234"]});
                sinon.stub(rawLayerList, "getLayerWhere").returns(undefined);
                await wrapper.vm.$nextTick();
                expect(await wrapper.vm.getRegionsOptionsForLastChild([{}, {attrName: "foo"}])).to.be.an("array").that.is.empty;
            });
            it("should return an empty array if selectedLevel has no layerId", async () => {
                const wrapper = shallowMount(StatisticDashboardDifference, {
                    propsData: propsData,
                    global: {
                        plugins: [store]
                    }
                });

                store.commit("Modules/StatisticDashboard/setSelectedLevel", {});
                sinon.stub(rawLayerList, "getLayerWhere").returns({});
                await wrapper.vm.$nextTick();
                expect(await wrapper.vm.getRegionsOptionsForLastChild([{}, {attrName: "foo"}])).to.be.an("array").that.is.empty;
            });
            it("should return an empty array if no unique object for the last child is given", async () => {
                const wrapper = shallowMount(StatisticDashboardDifference, {
                    propsData: propsData,
                    global: {
                        plugins: [store]
                    }
                });

                store.commit("Modules/StatisticDashboard/setSelectedLevel", {layerId: ["1234"]});
                sinon.stub(rawLayerList, "getLayerWhere").returns({});
                sinon.stub(getOAFFeature, "getUniqueValuesByScheme").resolves({});
                await wrapper.vm.$nextTick();
                expect(await wrapper.vm.getRegionsOptionsForLastChild([{}, {attrName: "foo"}])).to.be.an("array").that.is.empty;
            });
            it("should return the unique values for the last child", async () => {
                const wrapper = shallowMount(StatisticDashboardDifference, {
                    propsData: propsData,
                    global: {
                        plugins: [store]
                    }
                });

                store.commit("Modules/StatisticDashboard/setSelectedLevel", {layerId: ["1234"]});
                sinon.stub(rawLayerList, "getLayerWhere").returns({});
                sinon.stub(getOAFFeature, "getUniqueValuesByScheme").resolves({foo: {bar: true, fob: true}});
                await wrapper.vm.$nextTick();
                expect(await wrapper.vm.getRegionsOptionsForLastChild([{}, {attrName: "foo"}])).to.deep.equal(["bar", "fob"]);
            });
            it("should request the unique values for every layer of the selected level", async () => {
                const wrapper = shallowMount(StatisticDashboardDifference, {
                        propsData: propsData,
                        global: {
                            plugins: [store]
                        }
                    }),
                    getLayerWhereStub = sinon.stub(rawLayerList, "getLayerWhere"),
                    getUniqueValuesStub = sinon.stub(getOAFFeature, "getUniqueValuesByScheme").resolves({foo: {bar: true, fob: true}});

                getLayerWhereStub.withArgs({id: "1234"}).returns({url: "url1", collection: "col1"});
                getLayerWhereStub.withArgs({id: "5678"}).returns({url: "url2", collection: "col2"});
                store.commit("Modules/StatisticDashboard/setSelectedLevel", {layerId: ["1234", "5678"]});
                await wrapper.vm.$nextTick();

                expect(await wrapper.vm.getRegionsOptionsForLastChild([{}, {attrName: "foo"}])).to.deep.equal(["bar", "fob"]);
                expect(getUniqueValuesStub.calledWith("url1", "col1", ["foo"])).to.be.true;
                expect(getUniqueValuesStub.calledWith("url2", "col2", ["foo"])).to.be.true;
            });
        });
    });
});
