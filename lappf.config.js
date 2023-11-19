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
            activeIn: ['dashboard.users', 'dashboard.users.create', 'dashboard.users.show', 'dashboard.users.edit']
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
            to: {
                name: 'dashboard.settings'
            },
            activeIn: ['dashboard.settings']
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
                App_Models_User: 'Usuário'
            }
        }
    }
};

export default config;