const config = {
    /**
     * 
     * Dashboard navigation
     * 
     */
    navigation: [

        // simple menu item
        {
            text: 'Dashboard',
            icon: 'mdi-chart-pie',
            to: {
                name: 'dashboard.home'
            },
            activeIn: ['dashboard.home']
        },
        {
            text: 'Usuários',
            icon: 'mdi-account-group',
            to: {
                name: 'dashboard.users'
            },
            activeIn: ['dashboard.users', 'dashboard.users.admins', 'dashboard.users.create', 'dashboard.users.show', 'dashboard.users.edit'],
            items: [
                {
                    text: 'Todos',
                    icon: 'mdi-account-group',
                    to: {
                        name: 'dashboard.users'
                    },
                    activeIn: ['dashboard.users', 'dashboard.users.create', 'dashboard.users.show', 'dashboard.users.edit']
                },
                {
                    text: 'Administradores',
                    icon: 'mdi-account-group',
                    to: {
                        name: 'dashboard.users.admins'
                    },
                    activeIn: ['dashboard.users.admins']
                }
            ]
        },
        {
            text: 'Funções',
            icon: 'mdi-shield-lock',
            to: {
                name: 'dashboard.roles'
            },
            activeIn: ['dashboard.roles', 'dashboard.roles.create', 'dashboard.roles.show', 'dashboard.roles.edit']
        },
        {
            text: 'Configurações',
            icon: 'mdi-cogs',
            activeIn: ['dashboard.settings.local', 'dashboard.settings.system'],
            items: [
                {
                    text: 'Local',
                    icon: 'mdi-cogs',
                    to: {
                        name: 'dashboard.settings.local'
                    },
                    activeIn: ['dashboard.settings.local']
                },
                {
                    text: 'Sistema',
                    icon: 'mdi-cogs',
                    to: {
                        name: 'dashboard.settings.system'
                    },
                    activeIn: ['dashboard.settings.system']
                }
            ]
        },
        {
            text: 'Perfil',
            icon: 'mdi-account',
            to: {
                name: 'dashboard.profile'
            },
            activeIn: ['dashboard.profile']
        }
    ],

    /**
     * 
     * Backend errors names
     * 
     */
    messages: {
        /**
         * 
         * All
         * 
         */
        'NotFoundException': {
            title: 'Não encontrado',
            text: 'A url ou recurso que você solicitou não foi encontrado.'
        },
        'InvalidDataException': {
            title: 'Dados inválidos',
            text: 'Um ou mais dados informados são inválidos.'
        },
        'UnauthorizedActionException': {
            title: 'Não autorizado',
            text: 'Desculpe, você não tem autorização para executar esta ação.'
        },

        /**
         * 
         * Admin
         * 
         */
        'HasDependentsException': {
            title: 'Impossível excluir',
            text: 'Este recurso não pode ser excluído pois há outros recursos vinculados a ele.'
        },

        /**
         * 
         * Account
         * 
         */
        'InvalidRegisterVerificationTokenException': {
            title: 'Token inválido',
            text: 'O token de verificação de registro é inválido.'
        },
        'HasAlreadyBeenVerifiedException': {
            title: 'Já verificado',
            text: 'A sua conta já foi verificada.'
        },
        'UnauthenticatedException': {
            title: 'Não autenticado',
            text: 'Você não está autenticado.'
        },
        'EmailOrPasswordInvalidException': {
            title: 'Falha no login',
            text: 'O e-mail e/ou senha informado é inválido.'
        },
        'InvalidUpdatePasswordTokenException': {
            title: 'Token inválido',
            text: 'O token de atualização de senha é inválido.'
        }
    },

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