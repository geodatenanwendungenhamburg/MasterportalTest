<script>
import "../css/dropdownMenu.scss";

export default {
    name: "DropdownAutocomplete",
    props: {
        /** Allows for the component to be cleared. */
        clearable: {
            type: Boolean,
            default: false,
            required: false
        },
        /** Removes the ability to click or target the input. */
        disabled: {
            type: Boolean,
            default: false,
            required: false
        },
        /** @deprecated May be removed or changed */
        isGroup: {
            type: Boolean,
            default: false,
            required: false
        },
        /**
         * Can be an array of objects or strings. By default objects should have title and value properties, and can optionally have a props property containing any VListItem props.
         * Keys to use for these can be changed with the item-title, item-value, and item-props props.
         */
        items: {
            type: Array,
            required: true
        },
        /** Property on supplied items that contains its title */
        itemTitle: {
            type: String,
            default: undefined,
            required: false
        },
        /** Sets the text of the v-label or v-field-label component. */
        label: {
            type: String,
            required: true
        },
        /** @deprecated Because of name conflict with vuetify component */
        loading: {
            type: Boolean,
            default: false,
            required: false
        },
        /** Maximum number of chips to show in the selection field */
        maxChipCount: {
            type: Number,
            default: 3,
            required: false
        },
        /** The v-model value of the component. If component supports the multiple prop, this defaults to an empty array. */
        modelValue: {
            type: null,
            required: false,
            default: undefined
        },
        /** Changes select to multiple. Accepts array for value. */
        multiple: {
            type: Boolean,
            default: false,
            required: false
        },
        /** Shows a "Select all" option in mode "multiple" */
        selectAll: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    emits: ["update:modelValue"],
    computed: {
        /**
         * Checks whether all items are selected.
         * @returns {boolean} True if all items are selected.
         */
        allSelectedItems () {
            return this.modelValue?.length === this.items.length;
        },

        /**
         * Checks whether some items are selected.
         * @returns {boolean} True if more than one value is selected, or all values.
         */
        someSelectedItems () {
            if (!this.multiple) {
                return this.modelValue !== null && this.modelValue !== undefined;
            }
            return this.modelValue?.length > 0;
        }
    },
    methods: {
        /**
         * Toggles the selection of all items in the dropdown. Only for multiple selection.
         * @returns {void}
         */
        toggleSelectAll () {
            if (!this.multiple) {
                return;
            }
            if (this.allSelectedItems) {
                this.$emit("update:modelValue", []);
            }
            else {
                this.$emit("update:modelValue", this.items.slice());
            }
        }
    }
};
</script>

<template lang="html">
    <template v-if="loading">
        <v-skeleton-loader type="button" />
    </template>
    <template v-else-if="isGroup">
        <v-autocomplete
            :model-value="modelValue"
            :items
            :chips="multiple"
            :closable-chips="multiple"
            :clearable="!multiple && clearable"
            :label
            item-title="label"
            item-value="label"
            :multiple
            @update:modelValue="$emit('update:modelValue', $event)"
        >
            <template
                v-if="multiple"
                #chip="{ internalItem, index, props }"
            >
                <v-chip
                    v-if="index < maxChipCount"
                    v-bind="props"
                    closable
                >
                    {{ internalItem.value }}
                </v-chip>
                <span v-if="multiple && index === maxChipCount">
                    <small>{{ $t('common:shared.modules.dropdown.more', {count: modelValue.length - maxChipCount}) }}</small>
                </span>
            </template>
            <template #item="{ props, internalItem }">
                <v-list-subheader
                    v-if="typeof internalItem.raw.group !== 'undefined'"
                    :class="[
                        'group-title',
                        internalItem.raw.level ? 'level-' + internalItem.raw.level : ''
                    ]"
                >
                    {{ internalItem.raw.group }}
                </v-list-subheader>
                <v-list-item
                    v-else
                    v-bind="props"
                    :title="internalItem.raw.label"
                    :class="multiple ? '' : 'pl-8'"
                >
                    <template
                        v-if="multiple"
                        #prepend="{ isSelected }"
                    >
                        <v-checkbox-btn :model-value="isSelected" />
                    </template>
                </v-list-item>
            </template>
        </v-autocomplete>
    </template>
    <template v-else>
        <v-autocomplete
            v-bind="$attrs"
            :model-value="modelValue"
            :items
            :item-title="itemTitle"
            :label
            :multiple
            :chips="multiple"
            :clearable
            :closable-chips="multiple"
            :disabled
            @update:modelValue="$emit('update:modelValue', $event)"
        >
            <template
                v-if="multiple && selectAll"
                #prepend-item
            >
                <v-list-item
                    :title="$t('common:shared.modules.dropdown.selectAll')"
                    @click="toggleSelectAll"
                >
                    <template #prepend>
                        <v-checkbox-btn
                            :indeterminate="someSelectedItems && !allSelectedItems"
                            :model-value="allSelectedItems"
                        />
                    </template>
                </v-list-item>
                <v-divider class="mt-2" />
            </template>
            <template
                v-if="multiple"
                #chip="{ index, props }"
            >
                <v-chip
                    v-if="index < maxChipCount"
                    v-bind="props"
                />
                <span v-if="multiple && index === maxChipCount">
                    <small>{{ $t('common:shared.modules.dropdown.more', {count: modelValue.length - maxChipCount}) }}</small>
                </span>
            </template>
            <template
                #subheader="{props}"
            >
                <VListSubheader
                    v-bind="props"
                    class="group-title"
                    :class="props.level === 1 ? 'level-1' : 'level-2'"
                >
                    {{ props[itemTitle || "title"] }}
                </VListSubheader>
            </template>
        </v-autocomplete>
    </template>
</template>

<style lang="scss">
    .v-autocomplete {
        .v-field__overlay {
            background-color: unset;
        }
        .v-input__control {
            border: 1px solid $border-color;
            border-radius: $border-radius;
        }
        .v-chip {
            background-color: $light_blue;
        }
        .v-chip__underlay {
            background-color: unset;
        }
        .v-chip__close {
            border-radius: 50%;
            i {
                font-size: 1rem;
            }
            &:hover {
                background-color: $dark_blue;
                color: white;
                cursor: pointer;
            }
        }
        .v-chip__content {
            position: relative;
            top: 2px;
        }
        .v-field__outline {
            --v-field-border-width: 0;
        }
        .v-field--focused {
            .v-field__outline::after, .v-field__outline::before {
                border: 1px solid $secondary;
                border-radius: $border-radius;
            }
        }
        .v-field--focused {
            .v-field-label--floating {
                color: $secondary;
            }
        }
    }

    .v-skeleton-loader__button {
        max-width: 100%;
        height: 56px;
        margin: 0 0 5px 0;
    }

    .group-title {
        font-size: $font_size_big;
        color: $secondary;
        &.level-1 {
            font-family: $font_family_accent;
        }
        &.level-2 {
            font-family: $font_family_default;
            font-size: $font-size-base;
        }
    }
</style>
