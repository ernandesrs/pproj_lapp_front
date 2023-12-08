<template>
  <base-view no-container page-title="Resumo geral" :breadcrumbs="[]">

    <v-row>
      <v-col cols="12">
        <section-comp title="Seção de dashboard" subtitle="Breve descrição da seção de dashboard">
          <template #content>
            <v-table hover density="compact">
              <thead>
                <tr>
                  <th>Col #1</th>
                  <th>Col #2</th>
                  <th>Col #3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A</td>
                  <td>B</td>
                  <td>C</td>
                </tr>
                <tr>
                  <td>D</td>
                  <td>E</td>
                  <td>F</td>
                </tr>
                <tr>
                  <td>G</td>
                  <td>H</td>
                  <td>I</td>
                </tr>
              </tbody>
            </v-table>
          </template>
        </section-comp>
      </v-col>

      <v-col cols="12" md="6">
        <section-comp has-actions title="Seção de dashboard" subtitle="Breve descrição da seção de dashboard">
          <template #content>
            <v-table hover density="compact">
              <thead>
                <tr>
                  <th>Col #1</th>
                  <th>Col #2</th>
                  <th>Col #3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A</td>
                  <td>B</td>
                  <td>C</td>
                </tr>
                <tr>
                  <td>D</td>
                  <td>E</td>
                  <td>F</td>
                </tr>
                <tr>
                  <td>G</td>
                  <td>H</td>
                  <td>I</td>
                </tr>
              </tbody>
            </v-table>
          </template>

          <template #actions>
            <v-btn color="primary" variant="text" text="Ver tudo" />
          </template>
        </section-comp>
      </v-col>

      <v-col cols="12" md="6">
        <section-comp border title="Seção de dashboard" subtitle="Breve descrição da seção de dashboard">
          <template #content>
            <v-table hover density="compact">
              <thead>
                <tr>
                  <th>Col #1</th>
                  <th>Col #2</th>
                  <th>Col #3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A</td>
                  <td>B</td>
                  <td>C</td>
                </tr>
                <tr>
                  <td>D</td>
                  <td>E</td>
                  <td>F</td>
                </tr>
                <tr>
                  <td>G</td>
                  <td>H</td>
                  <td>I</td>
                </tr>
              </tbody>
            </v-table>
          </template>
        </section-comp>
      </v-col>
    </v-row>

  </base-view>
</template>

<script setup>

import SectionComp from '@/components/SectionComp.vue';
import BaseView from '@/layouts/default/BaseView.vue';

</script>
