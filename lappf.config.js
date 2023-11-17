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
            icon: 'mdi-account-group-outline',
            to: {
                name: 'dashboard.users'
            },
            activeIn: ['dashboard.users', 'dashboard.users.create', 'dashboard.users.show', 'dashboard.users.edit']
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
    }
};

export default config;