// Utilities
import { defineStore } from 'pinia'
import cookie from '@/plugins/cookie';

/**
 * 
 * Backend errors names
 * 
 */
const errorNames = {
    /**
     * 
     * All
     * 
     */
    'UnexpectedError': {
        title: 'Erro',
        text: 'Desculpe, houve um erro inexperado. Entre em contato.'
    },
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
};

export const useAlertStore = defineStore('alert', {
    state: () => ({
        alert: {
            title: null,
            message: null,
            duration: null,
            type: 'success',
        },
        id: null
    }),
    getters: {
    },
    actions: {
        addError(error, flash = false, duration = null) {
            if (flash) {
                this.addFlashMessage(
                    errorNames[error]?.text ?? errorNames['UnexpectedError'].text,
                    errorNames[error]?.title ?? errorNames['UnexpectedError'].title,
                    'danger',
                    duration
                );
            } else {
                this.addMessage(
                    errorNames[error]?.text ?? errorNames['UnexpectedError'].text,
                    errorNames[error]?.title ?? errorNames['UnexpectedError'].title,
                    'danger',
                    duration
                );
            }
        },
        addDeniedAccessMessage(flash = false, duration = null) {
            const title = 'Acesso negado!';
            const message = 'Você não tem autorização para acessar a área solicitada.';
            const type = 'danger';

            if (flash) {
                this.addFlashMessage(message, title, type, duration);
            } else {
                this.addMessage(message, title, type, duration);
            }
        },
        addMessage(message, title, type = 'success', duration = null) {
            this.alert.title = title;
            this.alert.message = message;
            this.alert.type = type;
            this.alert.duration = duration;

            this.id = (new Date).getTime()
        },
        addFlashMessage(message, title, type = 'success', duration = null) {
            const alert = {
                title: title,
                message: message,
                type: type,
                duration: duration
            };

            cookie.set('flash_alert', JSON.stringify(alert));
        },
        getFlashAlert() {
            let alert = cookie.get('flash_alert');

            if (!alert) {
                return;
            }

            cookie.remove('flash_alert');

            alert = JSON.parse(alert);

            this.alert = alert;
            this.id = (new Date).getTime();
        }
    }
})
