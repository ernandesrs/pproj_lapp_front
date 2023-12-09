const config = {
    /**
     * 
     * *
     * 
     */
    terms: {
        roles: {
            actions: {
                view: 'Ver',
                create: 'Criar',
                delete: 'Excluir',
                update: 'Atualizar',
                viewAny: 'Ver todos',
                edit_admins: 'Editar administradores',
                delete_admins: 'Excluir administradores'
            },
            manageables: {
                App_Models_Role: 'Função',
                App_Models_User: 'Usuário',
                App_Models_Setting_Setting: 'Configurações',
            }
        }
    },

    /**
     * 
     * 
     * Allowed resources/manageables
     * Check for more or new resources on API document on section \Administrative\Role      
     * https://documenter.getpostman.com/view/15369452/2s9YR57vX9
     * 
     * 
     */
    resources: {
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
            'dashboard.settings'
        ]
    }
};

export default config;