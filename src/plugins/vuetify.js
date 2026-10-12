import {aliases, mdi} from "vuetify/iconsets/mdi-svg";
import {createVuetify} from "vuetify";
import "vuetify/styles";

/**
 * Uses a vuetify instance configured in an addon or creates one.
 * @returns {Promise<any>} The vuetify instance for app.use().
 */
export async function instantiateVuetify () {

    if (Config.vuetifyFolder) {
        try {
            const vuetify = await import(
                `../../addons/${Config.vuetifyFolder}/plugins/vuetify/index.js`
            );

            return vuetify.default;
        }
        catch (e) {
            console.error(`Vuetify cannot be loaded from file ${Config.vuetifyFolder}. Please check the file name set in the portal's config.js and try again.`, e);
            return undefined;
        }
    }

    const vuetify = createVuetify({
        components: {},
        directives: {},
        icons: {
            defaultSet: "mdi",
            aliases,
            sets: {mdi}
        },
        theme: {
            layers: true
        }

    });

    return vuetify;
}
