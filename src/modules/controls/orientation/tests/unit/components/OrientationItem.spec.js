import {createStore} from "vuex";
import {shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import OrientationItemComponent from "@modules/controls/orientation/components/OrientationItem.vue";
import layerCollection from "@core/layers/js/layerCollection.js";
import {
    getVectorFeaturesInCircle,
    union
} from "@modules/controls/orientation/utils/poiFeatureSearch.js";


describe("src/modules/controls/orientation/components/OrientationItem.vue", () => {
    let store,
        onlyFilteredFeatures = false,
        showDirection = false,
        showAccuracy = false,
        geolocation,
        iconGeolocationMarker,
        iconDirectionArrow,
        originalMapCollection,
        mapMock,
        viewMock,
        wrappers;
    const mockAlertingActions = {
        addSingleAlert: sinon.stub()
    };

    beforeEach(() => {
        iconGeolocationMarker = "bi-crosshair";
        iconDirectionArrow = "bi-arrow-up";
        showDirection = false;
        showAccuracy = false;
        geolocation = null;
        wrappers = [];
        mapMock = {
            addLayer: sinon.stub(),
            addOverlay: sinon.stub(),
            removeLayer: sinon.stub(),
            removeOverlay: sinon.stub()
        };
        viewMock = {
            getRotation: sinon.stub().returns(0),
            on: sinon.stub(),
            un: sinon.stub()
        };
        originalMapCollection = globalThis.mapCollection;
        globalThis.mapCollection = {
            getMap: sinon.stub().returns(mapMock),
            getMapView: sinon.stub().returns(viewMock)
        };
        store = createStore({
            namespaced: true,
            modules: {
                Controls: {
                    namespaced: true,
                    modules: {
                        Orientation: {
                            namespaced: true,
                            getters: {
                                geolocation: () => geolocation,
                                iconGeolocate: sinon.stub(),
                                iconGeolocatePOI: sinon.stub(),
                                iconGeolocationMarker: () => iconGeolocationMarker,
                                iconDirectionArrow: () => iconDirectionArrow,
                                poiDistances: () => [],
                                poiMode: sinon.stub(),
                                poiModeCurrentPositionEnabled: sinon.stub(),
                                showPoi: sinon.stub(),
                                showPoiChoice: sinon.stub(),
                                showPoiIcon: sinon.stub(),
                                showDirection: () => showDirection,
                                showAccuracy: () => showAccuracy,
                                zoomMode: sinon.stub(),
                                onlyFilteredFeatures: () => onlyFilteredFeatures
                            }
                        }
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        projection: () => ({
                            getCode: () => "EPSG:25832"
                        }
                        )
                    }
                },
                Alerting: {
                    namespaced: true,
                    actions: mockAlertingActions

                }
            },
            getters: {
                visibleLayerConfigs: sinon.stub()
            }
        });
    });

    afterEach(() => {
        wrappers.forEach(wrapper => wrapper.unmount());
        globalThis.mapCollection = originalMapCollection;
        sinon.restore();
    });

    /**
     * Mounts OrientationItem component with test store and tracks wrapper for teardown.
     * @returns {Object} Mounted wrapper.
     */
    function mountOrientationItem () {
        const wrapper = shallowMount(OrientationItemComponent, {
            global: {
                plugins: [store]
            }
        });

        wrappers.push(wrapper);
        return wrapper;
    }


    it("renders the Orientation component", () => {
        const wrapper = mountOrientationItem();

        expect(wrapper.find(".orientationButtons").exists()).to.be.true;
        expect(wrapper.find("#geolocation_marker").exists()).to.be.true;
        expect(wrapper.find("#geolocation_marker > i").wrapperElement.className).to.be.equals(iconGeolocationMarker);
    });

    it("renders the Orientation button", () => {
        const wrapper = mountOrientationItem();

        expect(wrapper.find("#geolocate").exists()).to.be.true;
    });

    it("will not render the Poi Orientation button", () => {
        const wrapper = mountOrientationItem();

        expect(wrapper.find("#geolocatePOI").exists()).to.be.false;
    });

    it("will union the array", () => {
        const arr1 = [3, 3, 4],
            arr2 = [5, 6, 7],
            arr = [3, 4, 5, 6, 7];

        expect(union(arr1, arr2, (obj1, obj2) => obj1 === obj2)).to.deep.equal(arr);
    });

    it("creates marker direction style from heading", () => {
        showDirection = true;
        const wrapper = mountOrientationItem();

        wrapper.vm.heading = Math.PI / 2;

        expect(wrapper.vm.markerDirectionStyle["--marker-heading-angle"]).to.equal("90deg");
    });

    it("adds the map rotation to the heading of the marker direction style", () => {
        showDirection = true;
        const wrapper = mountOrientationItem();

        wrapper.vm.heading = Math.PI / 2;
        wrapper.vm.onRotationChange({target: {getRotation: () => Math.PI / 2}});

        expect(wrapper.vm.mapRotation).to.equal(Math.PI / 2);
        expect(wrapper.vm.markerDirectionStyle["--marker-heading-angle"]).to.equal("180deg");
    });

    it("takes the initial map rotation from the view on mount", () => {
        viewMock.getRotation.returns(Math.PI);
        const wrapper = mountOrientationItem();

        expect(wrapper.vm.mapRotation).to.equal(Math.PI);
    });

    it("registers the change:rotation listener on mount and removes it on unmount", () => {
        const wrapper = mountOrientationItem(),
            listener = wrapper.vm.onRotationChange;

        expect(viewMock.on.calledWith("change:rotation")).to.be.true;
        expect(viewMock.on.firstCall.args[1]).to.be.a("function");

        wrapper.unmount();
        wrappers = [];

        expect(viewMock.un.calledWith("change:rotation", listener)).to.be.true;
    });

    it("returns no marker direction style if showDirection is disabled", () => {
        const wrapper = mountOrientationItem();

        wrapper.vm.heading = Math.PI / 2;

        expect(wrapper.vm.markerDirectionStyle).to.deep.equal({});
    });

    it("shows accuracy layer with marker overlay when accuracy is enabled", () => {
        showAccuracy = true;
        geolocation = {
            getAccuracyGeometry: sinon.stub().returns(null),
            un: sinon.stub(),
            on: sinon.stub(),
            setTracking: sinon.stub(),
            getPosition: sinon.stub().returns(null)
        };
        const wrapper = mountOrientationItem();

        wrapper.vm.showMarkerOverlay();

        expect(mapMock.addOverlay.calledOnceWithExactly(wrapper.vm.marker)).to.be.true;
        expect(mapMock.addLayer.calledOnce).to.be.true;
        expect(wrapper.vm.accuracyLayer).to.not.equal(null);
    });

    it("removes accuracy layer when marker overlay is removed", () => {
        showAccuracy = true;
        geolocation = {
            getAccuracyGeometry: sinon.stub().returns(null),
            un: sinon.stub(),
            on: sinon.stub(),
            setTracking: sinon.stub(),
            getPosition: sinon.stub().returns(null)
        };
        const wrapper = mountOrientationItem();

        wrapper.vm.showMarkerOverlay();
        wrapper.vm.removeOverlay();

        expect(mapMock.removeOverlay.calledOnceWithExactly(wrapper.vm.marker)).to.be.true;
        expect(mapMock.removeLayer.calledOnce).to.be.true;
        expect(wrapper.vm.accuracyLayer).to.equal(null);
    });

    describe("OrientationItem.vue methods", () => {
        const centerPosition = [0, 0],
            distance = 100,
            features = [{
                getStyle: () => {
                    return {
                        getImage: sinon.stub()
                    };
                },
                getGeometry: () => {
                    return {
                        getClosestPoint: () => {
                            return [10, 10];
                        }
                    };
                },
                get: () => sinon.stub()
            },
            {
                getStyle: () => {
                    return () => null;
                },
                getGeometry: () => {
                    return {
                        getClosestPoint: () => {
                            return [15, 10];
                        }
                    };
                },
                get: () => sinon.stub()
            }],
            layerSource = {
                getFeaturesInExtent: () => {
                    return features;
                }
            },
            wfsLayer = {
                has: () => {
                    return true;
                },
                get: (key) => {
                    if (key === "layerSource") {
                        return layerSource;
                    }
                    else if (key === "styleId") {
                        return "123";
                    }
                    else if (key === "name") {
                        return "TestLayer";
                    }
                    return "";
                },
                getLayerSource: () => layerSource
            },
            layerConfigs = [
                {
                    id: "1",
                    typ: "WFS",
                    visibility: true
                },
                {
                    id: "2",
                    typ: "WFS",
                    visibility: true
                },
                {
                    id: "3",
                    typ: "WFS",
                    visibility: true
                }
            ];

        it("getVectorFeaturesInCircle returns all features", () => {
            let returnedFeatures = "";

            sinon.stub(layerCollection, "getLayerById").returns(wfsLayer);
            returnedFeatures = getVectorFeaturesInCircle({
                layerConfigs,
                distance,
                centerPosition,
                onlyFilteredFeatures
            });
            expect(returnedFeatures.length).to.be.equals(2);
        });
        it("getVectorFeaturesInCircle returns only filtered features", () => {
            onlyFilteredFeatures = true;
            let returnedFeatures = "";

            sinon.stub(layerCollection, "getLayerById").returns(wfsLayer);
            returnedFeatures = getVectorFeaturesInCircle({
                layerConfigs,
                distance,
                centerPosition,
                onlyFilteredFeatures
            });
            expect(returnedFeatures.length).to.be.equals(1);
        });
        it("getVectorFeaturesInCircle returns only features in extent", () => {
            let returnedFeatures = "";

            sinon.stub(layerCollection, "getLayerById").returns(wfsLayer);
            returnedFeatures = getVectorFeaturesInCircle({
                layerConfigs,
                distance: 15,
                centerPosition,
                onlyFilteredFeatures
            });
            expect(returnedFeatures.length).to.be.equals(1);
        });
    });

});
