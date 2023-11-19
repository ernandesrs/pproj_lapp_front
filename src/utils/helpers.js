import config from './../../lappf.config';

const getTerms = {
    roles: {
        actions: (action) => {
            return config.terms.roles.actions[action] ?? 'Indefinido'
        },
        manageables: (manageable) => {
            return config.terms.roles.manageables[manageable] ?? 'Indefinido'
        }
    }
};

export {
    getTerms
};