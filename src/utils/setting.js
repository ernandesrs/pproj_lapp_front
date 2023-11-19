import cookie from "@/plugins/cookie";

const SETTINGS_DEFAULT = {
    theme: 'light',
    items_per_page: 10
};

const SETTINGS_KEY = 'local_settings';

const addSetting = (settings) => {
    let theSettings = settings;
    if (typeof settings == 'object') {
        theSettings = JSON.stringify(settings);
    }

    cookie.set(SETTINGS_KEY, theSettings);
};

const getSetting = (name) => {
    const settings = getSettings();

    return settings[name] ?? null;
};

const getSettings = () => {
    let settings = cookie.get(SETTINGS_KEY);
    if (!settings) {
        addSetting(SETTINGS_DEFAULT);
    }

    return settings ? JSON.parse(settings) : SETTINGS_DEFAULT;
};

export default { addSetting, getSettings, getSetting }