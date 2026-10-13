<script>
// @ts-check
// @ts-expect-error SCSS is handled by the bundler and has no TypeScript declarations.
import "../css/dropdownMenu.scss";

export default {
    name: "DropdownSelect",
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
        /**
         * Can be an array of objects or strings. By default objects should have title and value properties, and can optionally have a props property containing any VListItem props.
         * Keys to use for these can be changed with the item-title, item-value, and item-props props.
         */
        items: {
            type: Array,
            required: false,
            default: () => []
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
        allItemsSelected () {
            return this.modelValue?.length === this.items.length;
        },

        /**
         * Checks whether some items are selected.
         * @returns {boolean} True if more than one value is selected, or all values.
         */
        someItemsSelected () {
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
            if (this.allItemsSelected) {
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
    <v-select
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
                        :indeterminate="someItemsSelected && !allItemsSelected"
                        :model-value="allItemsSelected"
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
    </v-select>
</template>

<style lang="scss">
    .v-select {
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
            .v-field-label--floating {
                color: $secondary;
            }
        }
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
