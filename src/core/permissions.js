/**
 * 
 * 
 * Allowed resources/manageables
 * Check for more or new resources on API document on section \Administrative\Role      
 * https://documenter.getpostman.com/view/15369452/2s9YR57vX9
 * 
 * 
 */
const resources = {
    /**
     * 
     * unique names received from backend
     * 
     */
    'App_Models_User': [
        /**
         * surnames accepted to be used in the frontend
         * and that will be related to the unique name
         */
        'user',
        'dashboard.users',
        'dashboard.users.admins',
        'dashboard.users.show',
        'dashboard.users.create',
        'dashboard.users.edit'
    ],
    'App_Models_Role': [
        'role',
        'dashboard.roles',
        'dashboard.roles.show',
        'dashboard.roles.create',
        'dashboard.roles.edit'
    ],
    'App_Models_Setting_Setting': [
        'setting',
        'system.setting',
        'dashboard.settings.system'
    ]
}

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