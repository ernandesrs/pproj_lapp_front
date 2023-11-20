import lappf from './../../lappf.config';

/**
 * 
 * 
 * Allowed resources/permissibles/manageable
 * Check for more or new resources on API return
 * 
 * 
 */
const resources = lappf.resources;

let theUser = null;
let theResource = null;

const setUser = (user) => {
    if (!user) {
        throw "Needs a user to check permissions";
    }

    theUser = user;

    return setResource;
};

const setResource = (resource) => {
    let result = Object.entries(resources).find((resourceSurnames) => {
        return resourceSurnames[1].includes(resource);
    });

    if (!result) {
        throw "Not allowed resource '" + resource + "'. Needs a valid resource to check permissions.";
    }

    theResource = result[0];

    return permissions;
};

const hasPermissionTo = (action) => {
    return findFirstRoleWhereUserHasPermissionTo(action, theResource) ? true : false;
};

const findFirstRoleWhereUserHasPermissionTo = (action, resource = null) => {
    let r = resource ?? theResource;
    let theRole = (theUser.roles ?? []).find((role) => {
        let manageable = (role?.manageables ?? [])[r] ?? null;

        return manageable ? (manageable[action] ?? false) : false
    });

    return theRole ?? null;
};

const permissions = {
    canList: () => {
        return hasPermissionTo('viewAny');
    },
    canCreate: () => {
        return hasPermissionTo('create');
    },
    canShow: () => {
        return hasPermissionTo('view');
    },

    canEdit: () => {
        return hasPermissionTo('update');
    },
    canEditAdmins: () => {
        return hasPermissionTo('edit_admins');
    },

    canDelete: () => {
        return hasPermissionTo('delete');
    },
    canDeleteAdmins: () => {
        return hasPermissionTo('delete_admins');
    },
};

export default { setUser };