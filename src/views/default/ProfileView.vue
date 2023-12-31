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
									<thumb-comp :image-url="userForm.data?.photo_url"
										:alternative-text="userForm.data.first_name" max-width="125" max-height="125" border elevated circle />
								</div>
								<div class="d-flex align-center align-sm-start flex-column">
									<v-btn-group density="compact">
										<v-btn text="Nova foto" color="info" prepend-icon="mdi-arrow-up"
											@click="method_openPhotoSelector" :disabled="photoForm.submitting" />
										<v-file-input class="d-none" ref="photoSelector" label="Selecionar Arquivo"
											show-size @change="method_photoUpload"></v-file-input>

										<confirmation-comp v-model="photoDeleteConfirmDialog" color="danger"
											title="Excluir foto?"
											text="Após confirmar, a exclusão da foto não poderá ser desfeita."
											:callback-confirm="method_deletePhoto" :callback-cancel="() => {
												// este callback será chamado quando houver o cancelamento da exclusão da foto
											}" />

										<v-btn v-if="userForm.data?.photo_url" @click="method_deletePhotoConfirm"
											text="Excluir foto" color="danger-lighten-1" prepend-icon="mdi-delete-outline"
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
									<basic-user-fields v-model="userForm.data" :errors="userForm.errors" />

									<v-row>
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
							<v-row class="py-2">
								<v-col cols="12">
									<v-text-field type="password" v-model="passwordForm.data.password" name="password"
										label="Senha" id="password" :error-messages="passwordForm.errors?.password" />
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
import ConfirmationComp from '@/components/ConfirmationComp.vue';
import BasicUserFields from '@/components/views/BasicUserFields.vue';
import { req } from '@/plugins/requester';
import { useAlertStore } from '@/store/alert';
import { useAuthStore } from '@/store/auth';
import { ref } from 'vue';
import ThumbComp from '@/components/ThumbComp.vue';

const loadingContent = ref(true);

const accountTab = ref(0);

const userForm = ref({
	submitting: false,
	data: {},
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

const photoDeleteConfirmDialog = ref(false);

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

	if (
		!['image/jpeg', 'image/png'].includes(photo.type)
		||
		photo.size > 1024000
	) {
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

const method_deletePhotoConfirm = () => {
	photoDeleteConfirmDialog.value = true;
}

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
