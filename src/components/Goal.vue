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
  <div class="attacker">
    <dimension-modal v-if="objt.theEnvironmentProperties" ref="environmentDialog" dimension="noncomposite_environment" :existing="environmentNames" v-on:dimension-modal-update="addGoalEnvironmentProperty"/>
    <dimension-modal v-if="objt.theEnvironmentProperties.length" ref="assetDialog" dimension="asset" :environment="environmentName" :existing="concernNames" v-on:dimension-modal-update="addGoalConcern"/>
    <kaos-refinement-modal v-if="selectedAssociation.environment != ''" ref="goalRefinementDialog" :goalAssociation="selectedAssociation" :source="objt.theName" refinementType="Goal" v-on:kaos-refinement-update="updateGoalRefinement"/>
    <kaos-refinement-modal v-if="selectedAssociation.environment != ''" ref="subGoalRefinementDialog" :goalAssociation="selectedAssociation" :source="objt.theName" refinementType="Sub-Goal" v-on:kaos-refinement-update="updateSubGoalRefinement"/>
    <concern-association-modal v-if="objt.theEnvironmentProperties.length" ref="concernAssociationDialog" :concernAssociation="selectedConcernAssociation" :concerns="concernNames" v-on:concern-association-update="updateConcernAssociation"/>
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>
    <b-form>
      <b-card bg-variant="light" no body>
        <b-row>
          <b-col md="6">
            <b-form-group label="Goal" label-class="font-weight-bold text-md-left" label-for="theGoalInput">
              <b-form-input id="theGoalInput" v-model="objt.theName" type="text" required />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Originator" label-class="font-weight-bold text-md-left" label-for="theOriginator">
              <b-form-input id="theOriginatorInput" v-model="objt.theOriginator" type="text" required />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Tags" label-class="font-weight-bold text-md-left" label-for="theTagsInput">
              <b-form-tags v-model="objt.theTags" separator="," placeholder="Enter new tags separated by comma" remove-on-delete tag-variant="primary" tag-pills class="md-8"></b-form-tags>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>
      <b-card header="Environments" bg-variant="light" no-body class="text-left">
        <template slot="header">
          <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addEnvironment"/> Environment
        </template>
        <b-row>
          <b-col sm="12">
            <b-tabs pills v-model="envPropIndex">
              <b-tab v-for="envProp in objt.theEnvironmentProperties" :key="envProp.theEnvironmentName" :title=envProp.theName>
                <template slot="title">
                  <font-awesome-icon icon="minus" :style="{color: 'red'}" @click="deleteEnvironment(envProp.theEnvironmentName)"/>  {{envProp.theEnvironmentName}}
                </template>
              </b-tab>
            </b-tabs>
          </b-col>
        </b-row>
        <b-row v-show="this.objt.theEnvironmentProperties.length">
          <b-col md="12">
            <b-card no-body bg-variant="light">
              <b-tabs tab>
                <b-tab title="Definition" active>
                  <b-container fluid>
                    <b-row>
                      <b-col md="6">
                        <b-form-group label="Category" label-class="text-md-left font-weight-bold" label-for="theCategorySelect">
                          <b-form-select id="theCategorySelect" v-model="category" :options="goalCategories" required />
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <b-form-group label="Priority" label-class="text-md-left font-weight-bold" label-for="theType">
                          <b-form-radio-group v-model="priority">
                            <b-form-radio value="Low">Low</b-form-radio>
                            <b-form-radio value="Medium">Medium</b-form-radio>
                            <b-form-radio value="High">High</b-form-radio>
                          </b-form-radio-group>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="6">
                        <b-form-group label="Definition" label-class="text-md-left font-weight-bold" label-for="theDefinitionInput">
                          <b-form-textarea id="theDefinition" v-model="definition" type="text" :rows=2 :max-rows=4 required />
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <b-form-group label="Fit Criterion" label-class="text-md-left font-weight-bold" label-for="theFitCriterionInput">
                          <b-form-textarea id="theFitCriterionInput" v-model="fitCriterion" type="text" :rows=2 :max-rows=4 required />
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="12">
                        <b-form-group label="Issue" label-class="text-md-left font-weight-bold" label-for="theIssueInput">
                          <b-form-textarea id="theIssueInput" v-model="issue" type="text" :rows=2 :max-rows=4 required />
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-tab>
                <b-tab title="Goals">
                  <b-container fluid>
                    <b-row>
                      <b-col md="12">
                        <b-table striped bordered small hover :items="goalRefinements" :fields=goalRefinementTableFields @row-clicked="viewGoalRefinement">
                          <!-- eslint-disable-next-line -->
                          <template v-slot:head(goalrefinementactions)="data">
                            <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addGoalRefinement"/>
                          </template>
                          <template v-slot:cell(goalrefinementactions)="row">
                            <font-awesome-icon icon="minus" :style="{color: 'red'}" @click.stop="deleteGoalRefinement(row.index)"/>
                          </template>
                        </b-table>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-tab>
                <b-tab title="Sub-Goals">
                  <b-container fluid>
                    <b-row>
                      <b-col md="12">
                        <b-table striped bordered small hover :items="subGoalRefinements" :fields=subGoalRefinementTableFields @row-clicked="viewSubGoalRefinement">
                          <!-- eslint-disable-next-line -->
                          <template v-slot:head(subgoalrefinementactions)="data">
                            <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addSubGoalRefinement"/>
                          </template>
                          <template v-slot:cell(subgoalrefinementactions)="row">
                            <font-awesome-icon icon="minus" :style="{color: 'red'}" @click.stop="deleteSubGoalRefinement(row.index)"/>
                          </template>
                        </b-table>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-tab>
                <b-tab title="Concerns">
                  <b-container fluid>
                    <b-row>
                      <b-col md="4">
                        <b-table striped bordered small hover :items="concerns" :fields=concernTableFields>
                          <!-- eslint-disable-next-line -->
                          <template v-slot:head(concernactions)="data">
                            <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addConcern"/>
                          </template>
                          <template v-slot:cell(concernactions)="row">
                            <font-awesome-icon icon="minus" :style="{color: 'red'}" @click.stop="deleteConcern(row.index)"/>
                          </template>
                        </b-table>
                      </b-col>
                      <b-col md="8">
                        <b-table striped bordered small hover :items="concernAssociations" :fields=concernAssociationTableFields @row-clicked="viewConcernAssociation">
                          <!-- eslint-disable-next-line -->
                          <template v-slot:head(concernassociationactions)="data">
                            <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addConcernAssociation"/>
                          </template>
                          <template v-slot:cell(concernassociationactions)="row">
                            <font-awesome-icon icon="minus" :style="{color: 'red'}" @click.stop="deleteConcernAssociation(row.index)"/>
                          </template>
                        </b-table>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-tab>
              </b-tabs>
            </b-card>
          </b-col>
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
import environmentMixin from '../mixins/environmentMixin'
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
    KaosRefinementModal : () => import('@/components/KaosRefinementModal.vue'),
    ConcernAssociationModal : () => import('@/components/ConcernAssociationModal')
  },
  mixins : [
    objectMixin,
    environmentMixin,
    concernMixin
  ],
  computed : {
    concernNames() {
      return this.objt.theEnvironmentProperties.length > 0 ? this.objt.theEnvironmentProperties[this.envPropIndex].theConcerns : [] ;
    },
    concerns() {
      return this.objt.theEnvironmentProperties.length > 0 ? this.objt.theEnvironmentProperties[this.envPropIndex].theConcerns.map(concern => ({name : concern})): []
    },
    category : {
      get : function() {
        return this.objt.theEnvironmentProperties.length > 0 ? this.objt.theEnvironmentProperties[this.envPropIndex].theCategory : ''
      },
      set : function(value) {
        this.objt.theEnvironmentProperties[this.envPropIndex].theCategory = value;
      }
    },
    priority : {
      get : function() {
        return this.objt.theEnvironmentProperties.length > 0 ? this.objt.theEnvironmentProperties[this.envPropIndex].thePriority : ''
      },
      set : function(value) {
        this.objt.theEnvironmentProperties[this.envPropIndex].thePriority = value;
      }
    },
    definition : {
      get : function() {
        return this.objt.theEnvironmentProperties.length > 0 ? this.objt.theEnvironmentProperties[this.envPropIndex].theDefinition : ''
      },
      set : function(value) {
        this.objt.theEnvironmentProperties[this.envPropIndex].theDefinition = value;
      }
    },
    issue : {
      get : function() {
        return this.objt.theEnvironmentProperties.length > 0 ? this.objt.theEnvironmentProperties[this.envPropIndex].theIssue : ''
      },
      set : function(value) {
        this.objt.theEnvironmentProperties[this.envPropIndex].theIssue = value;
      }
    },
    fitCriterion : {
      get : function() {
        return this.objt.theEnvironmentProperties.length > 0 ? this.objt.theEnvironmentProperties[this.envPropIndex].theFitCriterion : ''
      },
      set : function(value) {
        this.objt.theEnvironmentProperties[this.envPropIndex].theFitCriterion = value;
      }
    },
    goalRefinements() {
      return this.objt.theEnvironmentProperties.length > 0 ? this.objt.theEnvironmentProperties[this.envPropIndex].theGoalRefinements : []
    },
    subGoalRefinements() {
      return this.objt.theEnvironmentProperties.length > 0 ? this.objt.theEnvironmentProperties[this.envPropIndex].theSubGoalRefinements : []
    },
  },
  data() {
    return {
      errors : [],
      objt : this.object,
      envPropIndex : 0,
      commitLabel : this.label,
      goalRefinementTableFields : [
        {key: 'goalrefinementactions', label : ''},
        {key: 'theEndType', label : 'Type'},
        {key: 'theEndName', label : 'Goal'},
        {key: 'theRefType', label : 'Refinement'},
        {key: 'isAlternate', label : 'Alternate'},
        {key: 'theRationale', label : 'Rationale'}
      ],
      subGoalRefinementTableFields : [
        {key: 'subgoalrefinementactions', label : ''},
        {key: 'theEndType', label : 'Type'},
        {key: 'theEndName', label : 'Sub-Goal'},
        {key: 'theRefType', label : 'Refinement'},
        {key: 'isAlternate', label : 'Alternate'},
        {key: 'theRationale', label : 'Rationale'}
      ],
      goalCategories : ['Maintain','Achieve','Avoid','Improve','Increase','Maximise','Minimise'],
      selectedAssociation : {
        environment : '',
        update : false,
        association : {
          theEndName : '',
          theEndType : 'goal',
          theRefType : 'and',
          isAlternate: 'No',
          theRationale : ''
         }
      }
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
      this.$router.push({ name: 'objectsview', params: {dimension: 'goal'}});
    },
    addGoalEnvironmentProperty : function(envName) {
      this.addEnvironmentProperty({
        theEnvironmentName : envName,
        theConcerns : [],
        theConcernAssociations : [],
        theDefinition : '',
        theFitCriterion : '',
        theIssue : '',
        thePriority : 'High',
        theCategory : 'Maintain',
        theGoalRefinements : [],
        theSubGoalRefinements : [],
        thePolicy : null
      });
    },
    viewGoalRefinement(data,index) {
      this.selectedAssociation['index'] = index
      this.selectedAssociation['association'] = JSON.parse(JSON.stringify(data));
      this.selectedAssociation['environment'] = this.objt.theEnvironmentProperties[this.envPropIndex].theEnvironmentName;
      this.selectedAssociation['update'] = true;
      this.$refs.goalRefinementDialog.show();
    },
    addGoalRefinement() {
      this.selectedAssociation['association'] = {theEndName : '', theEndType : 'goal', theRefType : 'and', isAlternate: 'No', theRationale : ''};
      this.selectedAssociation['environment'] = this.objt.theEnvironmentProperties[this.envPropIndex].theEnvironmentName;
      this.selectedAssociation['update'] = false;
      this.$refs.goalRefinementDialog.show();
    },
    deleteGoalRefinement(index) {
      this.objt.theEnvironmentProperties[this.envPropIndex].theGoalRefinements.splice(index,1);
    },
    viewSubGoalRefinement(data,index) {
      this.selectedAssociation['index'] = index
      this.selectedAssociation['association'] = JSON.parse(JSON.stringify(data));
      this.selectedAssociation['environment'] = this.objt.theEnvironmentProperties[this.envPropIndex].theEnvironmentName;
      this.selectedAssociation['update'] = true;
      this.$refs.subGoalRefinementDialog.show();
    },
    addSubGoalRefinement() {
      this.selectedAssociation['association'] = {theEndName : '', theEndType : 'goal', theRefType : 'and', isAlternate: 'No', theRationale : ''};
      this.selectedAssociation['environment'] = this.objt.theEnvironmentProperties[this.envPropIndex].theEnvironmentName;
      this.selectedAssociation['update'] = false;
      this.$refs.subGoalRefinementDialog.show();
    },
    updateGoalRefinement : function(updAssoc) {
      if (updAssoc.update) {
        this.$set(this.objt.theEnvironmentProperties[this.envPropIndex].theGoalRefinements,updAssoc.index,updAssoc.association);
      }
      else {
        this.objt.theEnvironmentProperties[this.envPropIndex].theGoalRefinements.push(updAssoc.association);
      }
    },
    updateSubGoalRefinement : function(updAssoc) {
      if (updAssoc.update) {
        this.$set(this.objt.theEnvironmentProperties[this.envPropIndex].theSubGoalRefinements,updAssoc.index,updAssoc.association);
      }
      else {
        this.objt.theEnvironmentProperties[this.envPropIndex].theSubGoalRefinements.push(updAssoc.association);
      }
    },
    deleteSubGoalRefinement(index) {
      this.objt.theEnvironmentProperties[this.envPropIndex].theSubGoalRefinements.splice(index,1);
    },
    addGoalConcern(data) {
      this.objt.theEnvironmentProperties[this.envPropIndex].theConcerns.push(data);
    },
    deleteConcern(index) {
      this.objt.theEnvironmentProperties[this.envPropIndex].theConcerns.splice(index,1);
    },
    checkForm() {
      this.errors = []
      if (this.objt.theName.length == 0 || this.objt.theName.trim().length == 0) {
        this.errors.push('Goal name is required');
      }
      const resChars = /[<>‘'`"\\:%/_*?#£$&]/ ;
      const res = this.objt.theName.match(resChars);
      if (res != null) {
        this.errors.push('Character ' + res['index'] + ' in ' + this.objt.theName + ' is a reserved character.');
      }
      if (this.objt.theOriginator.length == 0) {
        this.errors.push('Originator is required');
      }
      if (this.objt.theEnvironmentProperties.length == 0) {
        this.errors.push('No environment properties have been defined')
      }
      for (let i = 0; i < this.objt.theEnvironmentProperties.length; i++) {
        const envProps = this.objt.theEnvironmentProperties[i];
        if (envProps.theDefinition.length == 0) {
          this.errors.push('No definition set for environment ' + envProps.theEnvironmentName);
        }
        if (envProps.theFitCriterion.length == 0) {
          this.errors.push('No fit criterion set for environment ' + envProps.theEnvironmentName);
        }
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
