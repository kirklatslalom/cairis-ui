<template>
<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.

Authors: Shamal Faily
-->
  <div class="templategoal">
    <dimension-modal ref="assetDialog" dimension="template_asset" label="Goal concern" :existing="this.objt.theConcerns" v-on:dimension-modal-update="addGoalConcern"/>
    <dimension-modal ref="roleDialog" dimension="role" :existing="this.objt.theResponsibilities" v-on:dimension-modal-update="addGoalRole"/>
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>
    <b-form>
      <b-card bg-variant="light" no body>
        <b-row>
          <b-col md="12">
            <b-form-group label="Name" label-class="font-weight-bold text-md-left" label-for="theGoalInput">
              <b-form-input id="theGoalInput" v-model="objt.theName" type="text" required />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <b-form-group label="Definition" label-class="text-md-left font-weight-bold" label-for="theDefinitionText">
              <b-form-textarea id="theDefinitionText" v-model="objt.theDefinition" type="text" :rows=2 :max-rows=4 required />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <b-form-group label="Rationale" label-class="text-md-left font-weight-bold" label-for="theRationaleText">
              <b-form-textarea id="theRationaleText" v-model="objt.theRationale" type="text" :rows=2 :max-rows=4 required />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-table striped bordered small hover :items="concerns" :fields=concernTableFields>
            <!-- eslint-disable-next-line -->
            <template v-slot:head(concernactions)="data">
              <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addConcern"/>
            </template>
            <template v-slot:cell(concernactions)="row">
              <font-awesome-icon icon="minus" :style="{color: 'red'}" @click.stop="deleteConcern(row.index)"/>
            </template>
          </b-table>
        </b-row>
        <b-row>
          <b-table striped bordered small hover :items="responsibilities" :fields=responsibilityTableFields>
            <!-- eslint-disable-next-line -->
            <template v-slot:head(responsibilityactions)="data">
              <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addRole"/>
            </template>
            <template v-slot:cell(responsibilityactions)="row">
              <font-awesome-icon icon="minus" :style="{color: 'red'}" @click.stop="deleteRole(row.index)"/>
            </template>
          </b-table>
        </b-row>
      </b-card>
      <b-container fluid>
        <b-form-row>
          <b-col md="4" offset-md="5" >
            <b-button type="submit" variant="primary" @click="onCommit">{{commitLabel}}</b-button>
            <b-button type="submit" variant="secondary" @click="onCancel">Cancel</b-button>
          </b-col>
        </b-form-row>
      </b-container>
    </b-form>
  </div>
</template>


<script>

import objectMixin from '../mixins/objectMixin'
import concernMixin from '../mixins/concernMixin'

export default {
  props : {
    object : Object,
    label : String
  },
  watch : {
    object: 'setObject'
  },
  components : {
    DimensionModal : () => import('@/components/DimensionModal.vue'),
  },
  mixins : [
    objectMixin,
    concernMixin
  ],
  computed : {
    concerns() {
      return this.objt.theConcerns.map(concern => ({name : concern}));
    },
    responsibilities() {
      return this.objt.theResponsibilities.map(r => ({name : r}));
    }
  },
  data() {
    return {
      errors : [],
      objt : this.object,
      envPropIndex : 0,
      commitLabel : this.label,
      responsibilityTableFields : [
        {key: 'responsibilityactions', label : ''},
        {key: 'name', label : 'Responsibility'}
      ]
    }
  },
  methods : {
    setObject() {
      this.objt = this.object;
      this.commitLabel = this.label;
    },
    onCommit(evt) {
      evt.preventDefault();
      if (this.checkForm()) {
        this.$emit('object-commit',this.objt);
      }
    },
    onCancel(evt) {
      evt.preventDefault();
      this.$router.push({ name: 'objectsview', params: {dimension: 'templategoal'}});
    },
    addGoalConcern(data) {
      this.objt.theConcerns.push(data);
    },
    deleteConcern(index) {
      this.objt.theConcerns.splice(index,1);
    },
    addGoalRole(data) {
      this.objt.theResponsibilities.push(data);
    },
    addRole() {
      this.$refs.roleDialog.show();
    },
    deleteRole(index) {
      this.objt.theResponsibilities.splice(index,1);
    },
    checkForm() {
      this.errors = []
      if (this.objt.theName.length == 0 || this.objt.theName.trim().length == 0) {
        this.errors.push('Name is required');
      }
      const resChars = /[<>‘'`"\\:%/_*?#£$&]/ ;
      const res = this.objt.theName.match(resChars);
      if (res != null) {
        this.errors.push('Character ' + res['index'] + ' in ' + this.objt.theName + ' is a reserved character.');
      }
      if (this.objt.theDefinition.length == 0) {
        this.errors.push('Definition is required');
      }
      if (this.objt.theRationale.length == 0) {
        this.errors.push('Rationale is required');
      }
      if (!this.errors.length) {
        return true;
      }
      else {
        return false;
      }
    }
  }
}
</script>
