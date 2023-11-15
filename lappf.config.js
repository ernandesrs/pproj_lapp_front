const config = {
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
    ]
};

export default config;