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
  <div class="kaosassociation">
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>
    <b-form>
      <b-container fluid>
      <b-card bg-variant="light" no body>
        <b-row>
          <b-col md=12>
            <b-container v-if="objt != undefined" fluid>
              <b-row>
                <b-col md="12">
                  <b-form-group label="Environment" label-class="font-weight-bold text-sm-left" label-for="theEnvironmentSelect" >
                    <dimension-select id="theEnvironmentSelect" ref="theEnvironmentSelect" dimension='noncomposite_environment' :is_disabled="disable" :initial="objt.theEnvironmentName" v-on:dimension-select-change="environmentSelected" v-on:dimension-items-updated="environmentsLoaded" />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-form-group label="Head" label-class="font-weight-bold text-md-left" label-for="theGoalRadio" >
                    <b-form-radio-group :disabled="disable" buttons button-variant="outline-primary" size="md" id="theGoalRadio" v-model="theGoalType" :options="goalTypeOptions" class="mb-3" required name="theGoalRadio" />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <dimension-select id="theGoalSelect" ref="theGoalSelect" :is_disabled="disable" :environment='objt.theEnvironmentName' :dimension='theGoalType' :initial="objt.theGoal" v-on:dimension-select-change="goalSelected" v-on:dimension-items-updated="goalsLoaded" />
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-form-group label="Tail" label-class="font-weight-bold text-md-left" label-for="theSubGoalRadio" >
                    <b-form-radio-group :disabled="disable" buttons button-variant="outline-primary" size="md" id="theSubGoalRadio" v-model="theSubGoalType" :options="subGoalTypeOptions" class="mb-3" required name="theSubGoalRadio" />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <div v-if="objt.theSubGoalDimension != 'role'">
                    <dimension-select id="theSubGoalSelect" ref="theSubGoalSelect" :is_disabled="disable" :environment='objt.theEnvironmentName' :dimension='objt.theSubGoalDimension' :initial="objt.theSubGoal" add_initial v-on:dimension-select-change="subGoalSelected" v-on:dimension-items-updated="subGoalsLoaded" />
                  </div>
                  <div v-if="objt.theSubGoalDimension == 'role'">
                    <dimension-select id="theSubGoalSelect" ref="theSubGoalSelect" :is_disabled="disable" :dimension='objt.theSubGoalDimension' :initial="objt.theSubGoal" v-on:dimension-select-change="subGoalSelected" />
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="2">
                  <b-form-group label="Association" label-class="font-weight-bold text-md-left" label-for="theAssociationRadio" >
                    <b-form-radio-group buttons button-variant="outline-primary" size="md" id="theAssociationRadio" v-model="objt.theAssociationType" :options="refTypes" class="mb-3" required name="theAssociationRadio">
                    </b-form-radio-group>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Alternative" label-class="font-weight-bold text-md-left" label-for="theHeadNryInput" >
                    <b-form-radio-group buttons button-variant="outline-primary" size="md" v-model="objt.theAlternativeId">
                      <b-form-radio value=0>No</b-form-radio>
                      <b-form-radio value=1>Yes</b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                </b-col>
                <b-col md="8">
                  <b-form-group label="Rationale" label-class="font-weight-bold text-md-left" label-for="theRationaleInput" >
                    <b-form-input id="theRationaleInput" size="md" v-model="objt.theRationale"></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-container>
          </b-col>
        </b-row>
      </b-card>
      </b-container>
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
import kaosAssociationMixin from '../mixins/kaosAssociationMixin'
import DimensionSelect from '@/components/DimensionSelect.vue'

export default {
  name : 'kaos-association',
  props : {
    object : Object,
    label : String,
    isUpdating : Boolean
  },
  watch : {
    object : 'setObject',
    theGoalType : 'setSubGoalTypes',
    theSubGoalType : 'setAssociationTypes'
  },
  mixins : [
    objectMixin,
    kaosAssociationMixin
  ],
  components : {
    DimensionSelect
  },
  computed : {
    disable() {
      return this.isUpdating == true ? true : false;
    },
    refTypes() {
      return this.refTypeOptions[this.theGoalType + ',' + this.theSubGoalType];
    }
  },
  data() {
    return {
      errors : [],
      objt : this.object,
      commitLabel : 'Create',
      theGoalType : 'goal',
      theSubGoalType : 'goal',
      goalTypeOptions : [
        {text : 'Goal', value : 'goal'},
        {text : 'Obstacle', value : 'obstacle'},
        {text : 'Domain Property', value : 'domainproperty'},
        {text : 'Requirement', value : 'requirement'},
        {text : 'Countermeasure', value : 'countermeasure'}
      ],
      subGoalTypeOptions : [
        {text : 'Goal', value : 'goal'},
        {text : 'Obstacle', value : 'obstacle'},
        {text : 'Task', value : 'task'},
        {text : 'Use Case', value : 'usecase'},
        {text : 'Domain Property', value : 'domainproperty'},
        {text : 'Role', value : 'role'},
        {text : 'Requirement', value : 'requirement'},
        {text : 'Threat', value : 'threat'},
        {text : 'Vulnerability', value : 'vulnerability'}
      ]
    }
  },
  methods : {
    setObject() {
      this.objt = this.object;
      this.$refs.theEnvironmentSelect.selected = this.objt.theEnvironmentName;
      this.theGoalType = this.object.theGoalDimension;
      this.$refs.theGoalSelect.selected = this.objt.theGoal;
      this.theSubGoalType = this.object.theSubGoalDimension;
      this.$refs.theSubGoalSelect.selected = this.objt.theSubGoal;
      this.commitLabel = this.label;
    },
    setSubGoalTypes() {
      this.objt.theGoalDimension = this.theGoalType;
      if (this.theGoalType == 'goal') {
        this.subGoalTypeOptions = [
          {'text' : 'Goal', 'value' : 'goal'},
          {'text' : 'Obstacle', 'value' : 'obstacle'},
          {'text' : 'Task', 'value' : 'task'},
          {'text' : 'Use Case', 'value' : 'usecase'},
          {'text' : 'Domain Property', 'value' : 'domainproperty'},
          {'text' : 'Role', 'value' : 'role'},
          {'text' : 'Requirement', 'value' : 'requirement'}
        ];
        if (this.subGoalTypeOptions.map(x => x.value).includes(this.theSubGoalType) == false) {
          this.theSubGoalType = 'goal';
        }
      }
      else if (this.theGoalType == 'obstacle') {
        this.subGoalTypeOptions = [
          {'text' : 'Obstacle', 'value' : 'obstacle'},
          {'text' : 'Goal', 'value' : 'goal'},
          {'text' : 'Domain Property', 'value' : 'domainproperty'},
          {'text' : 'Misuse Case', 'value' : 'misusecase'},
          {'text' : 'Task', 'value' : 'task'},
          {'text' : 'Use Case', 'value' : 'usecase'},
          {'text' : 'Requirement', 'value' : 'requirement'},
          {'text' : 'Role', 'value' : 'role'},
          {'text' : 'Threat', 'value' : 'unconnected_threat'},
          {'text' : 'Vulnerability', 'value' : 'unconnected_vulnerability'},
        ];
        if (this.objt.theSubGoalDimension == 'threat') {
          this.theSubGoalType = 'unconnected_threat';
        }
        else if (this.objt.theSubGoalDimension == 'vulnerability') {
          this.theSubGoalType = 'unconnected_vulnerability';
        }
        if (this.subGoalTypeOptions.map(x => x.value).includes(this.theSubGoalType) == false) {
          this.theSubGoalType = 'obstacle';
        }
      }
      else if (this.theGoalType == 'domainproperty') {
        this.subGoalTypeOptions = [
          {'text' : 'Obstacle', 'value' : 'obstacle'}
        ];
        if (this.subGoalTypeOptions.map(x => x.value).includes(this.theSubGoalType) == false) {
          this.theSubGoalType = 'obstacle';
        }
      }
      else if (this.theGoalType == 'requirement') {
        this.subGoalTypeOptions = [
          {'text' : 'Goal', 'value' : 'goal'},
          {'text' : 'Requirement', 'value' : 'requirement'},
          {'text' : 'Role', 'value' : 'role'},
          {'text' : 'Obstacle', 'value' : 'obstacle'}
        ];
        if (this.subGoalTypeOptions.map(x => x.value).includes(this.theSubGoalType) == false) {
          this.theSubGoalType = 'goal';
        }
      }
      else if (this.theGoalType == 'countermeasure') {
        this.subGoalTypeOptions = [
          {'text' : 'Task', 'value' : 'task'},
        ];
        if (this.subGoalTypeOptions.map(x => x.value).includes(this.theSubGoalType) == false) {
          this.theSubGoalType = 'task';
        }
      }
      this.setAssociationTypes();
    },
    setAssociationTypes() {
      this.objt.theSubGoalDimension = this.theSubGoalType;
      if (this.theGoalType == 'goal' && this.theSubGoalType == 'domainproperty') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'goal' && this.theSubGoalType == 'goal') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'goal' && this.theSubGoalType == 'obstacle') {
        this.objt.theAssociationType = 'obstruct';
      }
      else if (this.theGoalType == 'goal' && this.theSubGoalType == 'requirement') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'goal' && this.theSubGoalType == 'role') {
        this.objt.theAssociationType = 'responsible';
      }
      else if (this.theGoalType == 'goal' && this.theSubGoalType == 'task') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'goal' && this.theSubGoalType == 'usecase') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'obstacle' && this.theSubGoalType == 'domainproperty') {
        this.objt.theAssociationType = 'resolve';
      }
      else if (this.theGoalType == 'obstacle' && this.theSubGoalType == 'goal') {
        this.objt.theAssociationType = 'resolve';
      }
      else if (this.theGoalType == 'obstacle' && this.theSubGoalType == 'task') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'obstacle' && this.theSubGoalType == 'misusecase') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'obstacle' && this.theSubGoalType == 'obstacle') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'obstacle' && this.theSubGoalType == 'requirement') {
        this.objt.theAssociationType = 'resolve';
      }
      else if (this.theGoalType == 'obstacle' && this.theSubGoalType == 'role') {
        this.objt.theAssociationType = 'responsible';
      }
      else if (this.theGoalType == 'obstacle' && this.theSubGoalType == 'threat') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'obstacle' && this.theSubGoalType == 'usecase') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'obstacle' && this.theSubGoalType == 'vulnerability') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'domainproperty' && this.theSubGoalType == 'obstacle') {
        this.objt.theAssociationType = 'obstruct';
      }
      else if (this.theGoalType == 'requirement' && this.theSubGoalType == 'goal') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'requirement' && this.theSubGoalType == 'requirement') {
        this.objt.theAssociationType = 'and';
      }
      else if (this.theGoalType == 'requirement' && this.theSubGoalType == 'role') {
        this.objt.theAssociationType = 'responsible';
      }
      else if (this.theGoalType == 'requirement' && this.theSubGoalType == 'obstacle') {
        this.objt.theAssociationType = 'obstruct';
      }
      else if (this.theGoalType == 'countermeasure' && this.theSubGoalType == 'task') {
        this.objt.theAssociationType = 'and';
      }
    },
    onCommit(evt) {
      evt.preventDefault();
      if (this.checkForm()) {
        if (this.objt.theSubGoalDimension == 'unconnected_threat') {
          this.objt.theSubGoalDimension = 'threat';
        }
        else if (this.objt.theSubGoalDimension == 'unconnected_vulnerability') {
          this.objt.theSubGoalDimension = 'vulnerability';
        }
        this.$emit('kaos-association-commit',this.objt);
      }
    },
    onCancel(evt) {
      evt.preventDefault();
      this.$router.push({ name: 'objectsview', params: {dimension: 'kaosassociation'}});
    },
    checkForm() {
      this.errors = []
      if (this.objt.theEnvironmentName.length == 0) {
        this.errors.push('Environment is required');
      }
      if (this.objt.theGoalDimension.length == 0) {
        this.errors.push('Goal Type is required');
      }
      if (this.objt.theGoal.length == 0) {
        this.errors.push('Goal is required');
      }
      if (this.objt.theAssociationType.length == 0) {
        this.errors.push('Association Type is required');
      }
      if (this.objt.theSubGoalDimension.length == 0) {
        this.errors.push('Sub Goal Type is required');
      }
      if (this.objt.theSubGoal.length == 0) {
        this.errors.push('Sub Goal is required');
      }
      if (this.objt.theRationale.length == 0) {
        this.errors.push('Rationale is required');
      }
      if (this.objt.theGoal == this.objt.theSubGoal) {
        this.errors.push('Self refinement is not allowed.')
      }
      if (!this.errors.length) {
        return true;
      }
      else {
        return false;
      }
    },
    environmentSelected(item) {
      if (item != undefined) {
        this.objt.theEnvironmentName = item;
      }
    },
    environmentsLoaded(item) {
      this.objt.theEnvironmentName = item;
    },
    goalSelected(item) {
      if (item != undefined) {
        this.objt.theGoal = item;
      }
    },
    goalsLoaded(item) {
      this.objt.theGoal = item;
    },
    subGoalSelected(item) {
      if (item != undefined) {
        this.objt.theSubGoal = item;
      }
    },
    subGoalsLoaded(item) {
      this.objt.theSubGoal = item;
    }
  }
}
</script>
