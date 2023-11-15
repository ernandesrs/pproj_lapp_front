<template>
	<base-view page-title="Perfil" :breadcrumbs="[{ title: 'Meu perfil', to: { name: 'dashboard.profile' } }]"
		:loading="loadingContent">

		<v-tabs v-model="accountTab" color="primary">
			<v-tab text="Dados básicos" prepend-icon="mdi-account" />
			<v-tab text="Segurança" prepend-icon="mdi-lock" />
		</v-tabs>
		<v-window class="mt-8" v-model="accountTab">
			<v-window-item>
				<v-card>
					<v-card-item>
						<v-row justify="start">

							<!-- photo -->
							<v-col cols="12" md="8" lg="6"
								class="mb-4 d-flex flex-column flex-sm-row justify-center align-center">
								<div class="mb-4 mb-sm-0 mr-sm-4">
									<v-img v-if="userForm.data?.photo_url" :src="userForm.data.photo_url" width="125px"
										height="125px" cover class="rounded-circle" />
									<div v-else
										class="rounded-circle d-flex align-center justify-center text-h6 font-weight-medium text-light-darken-4 border"
										style="width: 125px; height: 125px;">
										{{ userForm.data.first_name[0] }}
									</div>
								</div>
								<div class="d-flex align-center align-sm-start flex-column">
									<v-btn-group density="compact">
										<v-btn text="Nova foto" color="info" prepend-icon="mdi-arrow-up"
											@click="method_openPhotoSelector" :loading="photoForm.submitting" />
										<v-file-input class="d-none" ref="photoSelector" label="Selecionar Arquivo"
											show-size @change="method_photoUpload"></v-file-input>

										<v-btn v-if="userForm.data?.photo_url" @click="method_deletePhoto"
											text="Excluir foto" color="danger" prepend-icon="mdi-delete-outline"
											:loading="photoForm.submitting" />
									</v-btn-group>
									<small class="mt-4"
										:class="[photoForm.fail ? 'text-danger font-weight-medium' : 'text-dark-lighten-4']">
										Sua foto deve ter no mínimo 250x250px, máximo de 1Mb e do tipo jpg ou png.
									</small>
								</div>
							</v-col>

							<!-- basic data -->
							<v-col cols="12">
								<v-form @submit.prevent="method_updateAccount">
									<v-row>
										<v-col cols="6">
											<v-text-field v-model="userForm.data.first_name" name="first_name" label="Nome"
												id="first_name" :error-messages="userForm.errors?.first_name" />
										</v-col>
										<v-col cols="6">
											<v-text-field v-model="userForm.data.last_name" name="last_name"
												label="Sobrenome" id="last_name"
												:error-messages="userForm.errors?.last_name" />
										</v-col>
										<v-col cols="12">
											<v-text-field v-model="userForm.data.username" name="username" label="Usuário"
												id="username" :error-messages="userForm.errors?.username" />
										</v-col>
										<v-col cols="12" class="text-right">
											<v-btn type="submit" text="Atualizar" color="primary" prepend-icon="mdi-check"
												:loading="userForm.submitting" />
										</v-col>
									</v-row>
								</v-form>
							</v-col>
						</v-row>
					</v-card-item>
				</v-card>
			</v-window-item>
			<v-window-item>
				<v-card>
					<v-card-item>
						<!-- basic data -->
						<v-form @submit.prevent="method_updatePassword">
							<v-row>
								<v-col cols="12">
									<v-text-field type="password" v-model="passwordForm.data.password" name="password" label="Senha"
										id="password" :error-messages="passwordForm.errors?.password" />
								</v-col>
								<v-col cols="12">
									<v-text-field type="password" v-model="passwordForm.data.password_confirmation"
										name="password_confirmation" label="Confirmar senha" id="password_confirmation"
										:error-messages="passwordForm.errors?.password_confirmation" />
								</v-col>
								<v-col cols="12" class="text-right">
									<v-btn type="submit" text="Atualizar" color="primary" prepend-icon="mdi-check"
										:loading="passwordForm.submitting" />
								</v-col>
							</v-row>
						</v-form>
					</v-card-item>
				</v-card>
			</v-window-item>
		</v-window>

	</base-view>
</template>

<script setup>

import BaseView from '@/layouts/default/BaseView.vue';
import { req } from '@/plugins/requester';
import { useAlertStore } from '@/store/alert';
import { useAuthStore } from '@/store/auth';
import { ref } from 'vue';

const loadingContent = ref(true);

const accountTab = ref(0);

const userForm = ref({
	data: null,
	submitting: false,
	errors: {}
});

const photoSelector = ref(null);

const photoForm = ref({
	photo: null,
	submitting: false,
	fail: false
});

const passwordForm = ref({
	submitting: false,
	data: {
		password: null,
		password_confirmation: null
	},
	errors: {}
});

const method_getUserData = () => {
	return req({
		action: '/account/me',
		method: 'get',
		success: (r) => {
			userForm.value.data = r.data.user;
		},
		finally: () => {
			loadingContent.value = false;
		}
	});
};

const method_updateAccount = () => {
	userForm.value.submitting = true;

	return req({
		action: '/account/me/update',
		method: 'post',
		data: {
			...userForm.value.data
		},
		success: (r) => {
			useAlertStore().addMessage('Os dados do seu perfil foram atualizados com sucesso.', 'Dados atualizados!', 'info');
			useAuthStore().addUser(r.data.user);
		},
		fail: (r) => {
			userForm.value.errors = r.response.data.errors;
		},
		finally: () => {
			userForm.value.submitting = false;
		}
	});
};

const method_openPhotoSelector = () => {
	photoSelector.value.click();
};

const method_photoUpload = (e) => {
	let photo = e.target.files[0] ?? null;

	if (!photo) {
		photoForm.value.fail = true;
		return;
	}

	photoForm.value.submitting = true;

	let data = new FormData;

	data.append('photo', photo);

	return req({
		action: '/account/me/photo',
		method: 'post',
		data: data,
		success: (r) => {
			useAlertStore().addMessage('Sua foto de perfil foi atualizada com sucesso.', 'Foto atualizada!', 'info');
			userForm.value.data.photo_url = r.data.photo;
			photoForm.value.fail = false;
		},
		fail: () => {
			useAlertStore().addMessage('Erro ao atualizar sua foto de perfil, verifique e tente de novo.', 'Erro!', 'danger');
			photoForm.value.fail = true;
		},
		finally: () => {
			photoForm.value.submitting = false;
		}
	});
};

const method_deletePhoto = () => {
	photoForm.value.submitting = true;

	return req({
		action: '/account/me/photo',
		method: 'delete',
		success: () => {
			userForm.value.data.photo_url = null;

			useAlertStore().addMessage('Sua foto de perfil foi excluída com sucesso.', 'Excluída!', 'warning');
		},
		finally: () => {
			photoForm.value.submitting = false;
		}
	});
};

const method_updatePassword = () => {
	passwordForm.value.submitting = true;

	return req({
		action: '/account/me/update-password',
		method: 'post',
		data: passwordForm.value.data,
		success: () => {
			useAlertStore().addMessage('Sua senha foi atualizada com sucesso!', 'Senha atualizada!', 'info');
		},
		fail: (r) => {
			passwordForm.value.errors = r.response.data.errors;
		},
		finally: () => {
			passwordForm.value.submitting = false;
		}
	});
}

method_getUserData();

</script>
