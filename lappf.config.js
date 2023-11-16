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

        // menu item with submenu
        {
            text: 'Submenu',
            icon: 'mdi-apps',
            activeIn: ['dashboard.exampleOne', 'dashboard.exampleTwo'],
            items: [
                {
                    text: 'Example #1',
                    icon: 'mdi-arrow-right',
                    to: {
                        name: 'dashboard.exampleOne'
                    },
                    activeIn: ['dashboard.exampleOne']
                },
                {
                    text: 'Example #2',
                    icon: 'mdi-arrow-right',
                    to: {
                        name: 'dashboard.exampleTwo'
                    },
                    activeIn: ['dashboard.exampleTwo']
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