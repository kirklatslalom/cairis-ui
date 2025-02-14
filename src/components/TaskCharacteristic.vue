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

  <div class="taskcharacteristic">
    <characteristic-reference-modal ref="crDialog" :characteristicReference="this.selectedCharacteristicReference" :characteristic="this.objt.theName" characteristic_type="task" v-on:characteristic-reference-modal-update="updateCharacteristicReference"/>
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>
    <b-form>
      <b-card bg-variant="light">
        <b-container fluid>
          <b-row>
            <b-col md="12">
              <b-form-group label="Definition" label-class="font-weight-bold text-md-left" label-for="theDefinitionInput">
                <b-form-input id="theDefinitionInput" v-model="objt.theName" type="text" required />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group label="Task" label-class="font-weight-bold text-md-left" label-for="theTaskSelect">
                <dimension-select id="theTaskSelect" dimension='task' :initial="objt.theTaskName" v-on:dimension-select-change="taskSelected" v-on:dimension-items-updated="tasksLoaded" />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Modal Qualifier" label-class="font-weight-bold text-md-left" label-for="theModalQualifierInput">
                <b-form-input id="theModalQualifierInput" v-model="objt.theModQual" type="text" required />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="4">
              <b-table striped bordered small :fields="groundTableFields" :items="objt.theGrounds" @row-clicked="viewGrounds">
                <!-- eslint-disable-next-line -->
                <template v-slot:head(gwractions)="data">
                  <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addGrounds"/>
                </template>
                <template v-slot:cell(gwractions)="row">
                  <font-awesome-icon icon="minus" :style="{color: 'red'}" @click.stop="deleteGrounds(row.index)"/>
                </template>
              </b-table>
            </b-col>
            <b-col md="4">
              <b-table striped bordered small :fields="warrantTableFields" :items="objt.theWarrant" @row-clicked="viewWarrant">
                <!-- eslint-disable-next-line -->
                <template v-slot:head(gwractions)="data">
                  <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addWarrant"/>
                </template>
                <template v-slot:cell(gwractions)="row">
                  <font-awesome-icon icon="minus" :style="{color: 'red'}" @click.stop="deleteWarrant(row.index)"/>
                </template>
              </b-table>
            </b-col>
            <b-col md="4">
              <b-table striped bordered small :fields="rebuttalTableFields" :items="objt.theRebuttal" @row-clicked="viewRebuttal">
                <!-- eslint-disable-next-line -->
                <template v-slot:head(gwractions)="data">
                  <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addRebuttal"/>
                </template>
                <template v-slot:cell(gwractions)="row">
                  <font-awesome-icon icon="minus" :style="{color: 'red'}" @click.stop="deleteRebuttal(row.index)"/>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-container>
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

import objectMixin from '../mixins/objectMixin';
import CharacteristicReferenceModal from './CharacteristicReferenceModal';
import DimensionSelect from './DimensionSelect';

export default {
  props : {
    object : Object,
    label : String
  },
  watch : {
    object: 'setObject'
  },
  mixins : [
    objectMixin,
  ],
  components : {
    CharacteristicReferenceModal,
    DimensionSelect
  },
  data() {
    return {
      objt : this.object,
      commitLabel : this.label,
      envPropIndex : 0,
      errors : [],
      variableTypes: ['Activities','Attitudes','Aptitudes','Motivations','Skills','Environment Narrative','Intrinsic','Contextual'],
      groundTableFields : [
        {key: 'gwractions', label : ''},
        {key: 'theReferenceName', label : 'Grounds'},
      ],
      warrantTableFields : [
        {key: 'gwractions', label : ''},
        {key: 'theReferenceName', label : 'Warrant'},
      ],
      rebuttalTableFields : [
        {key: 'gwractions', label : ''},
        {key: 'theReferenceName', label : 'Rebuttal'},
      ],
      selectedCharacteristicReference : {
        update : false,
        characteristicReference : this.templateCharacteristicReference
      },
      templateCharacteristicReference : {
        theReferenceName : '',
        theReferenceDescription : '',
        theCharacteristicType : '',
        theDimensionName : 'document',
        theReferenceSynopsis : {
          theActor : '',
          theActorType : 'persona',
          theDimension : 'goal',
          theSynopsis : ''
        },
        theReferenceContribution : {
          theContribution : '',
          theMeansEnd: ''
        }
      }
    }
  },
  methods: {
    checkForm() {
      this.errors = []
      if (this.objt.theTaskName.length == 0) {
        this.errors.push('Task is required');
      }
      if (this.objt.theModQual.length == 0) {
        this.errors.push('Modal Qualifier is required');
      }
      if (this.objt.theName.length == 0 || this.objt.theName.trim().length == 0) {
        this.errors.push('Characteristic definition is required');
      }
      const resChars = /[<>‘'`"\\:%/_*?#£$&]/ ;
      const res = this.objt.theName.match(resChars);
      if (res != null) {
        this.errors.push('Character ' + res['index'] + ' in ' + this.objt.theName + ' is a reserved character.');
      }
      if (this.objt.theGrounds.length == 0) {
        this.errors.push('No grounds have been defined')
      }
      if (!this.errors.length) {
        return true;
      }
      else {
        return false;
      }
    },
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
      this.$router.push({ name: 'objectsview', params: {dimension: 'taskcharacteristic'}});
    },
    addGrounds() {
      this.selectedCharacteristicReference['characteristicReference'] = JSON.parse(JSON.stringify(this.templateCharacteristicReference));
      this.selectedCharacteristicReference.characteristicReference.theCharacteristicType = 'grounds';
      this.selectedCharacteristicReference.characteristicReference.theReferenceSynopsis.theActor = this.objt.theTaskName;
      this.selectedCharacteristicReference['update'] = false;
      this.$refs.crDialog.show();
    },
    viewGrounds(data,index) {
      this.selectedCharacteristicReference['index'] = index
      this.selectedCharacteristicReference['characteristicReference'] = JSON.parse(JSON.stringify(data));
      this.selectedCharacteristicReference['update'] = true;
      this.$refs.crDialog.show();
    },
    deleteGrounds(index) {
      this.objt.theGrounds.splice(index,1);
    },
    addWarrant() {
      this.selectedCharacteristicReference['characteristicReference'] = JSON.parse(JSON.stringify(this.templateCharacteristicReference));
      this.selectedCharacteristicReference.characteristicReference.theCharacteristicType = 'warrant';
      this.selectedCharacteristicReference.characteristicReference.theReferenceSynopsis.theActor = this.objt.theTaskName;
      this.selectedCharacteristicReference['update'] = false;
      this.$refs.crDialog.show();
    },
    viewWarrant(data,index) {
      this.selectedCharacteristicReference['index'] = index
      this.selectedCharacteristicReference['characteristicReference'] = JSON.parse(JSON.stringify(data));
      this.selectedCharacteristicReference['update'] = true;
      this.$refs.crDialog.show();
    },
    deleteWarrant(index) {
      this.objt.theWarrant.splice(index,1);
    },
    addRebuttal() {
      this.selectedCharacteristicReference['characteristicReference'] = JSON.parse(JSON.stringify(this.templateCharacteristicReference));
      this.selectedCharacteristicReference.characteristicReference.theCharacteristicType = 'rebuttal';
      this.selectedCharacteristicReference.characteristicReference.theReferenceSynopsis.theActor = this.objt.theTaskName;
      this.selectedCharacteristicReference['update'] = false;
      this.$refs.crDialog.show();
    },
    viewRebuttal(data,index) {
      this.selectedCharacteristicReference['index'] = index
      this.selectedCharacteristicReference['characteristicReference'] = JSON.parse(JSON.stringify(data));
      this.selectedCharacteristicReference['update'] = true;
      this.$refs.crDialog.show();
    },
    deleteRebuttal(index) {
      this.objt.theRebuttal.splice(index,1);
    },
    taskSelected(pName) {
      this.objt.theTaskName = pName;
    },
    tasksLoaded(pName) {
      this.objt.theTaskName = pName;
    },
    updateCharacteristicReference : function(updCr) {
      if (updCr.update) {
        if (updCr.reference.theCharacteristicType == 'grounds') {
          this.$set(this.objt.theGrounds,updCr.index,updCr.reference);
        }
        else if (updCr.reference.theCharacteristicType == 'warrant') {
          this.$set(this.objt.theWarrant,updCr.index,updCr.reference);
        }
        else {
          this.$set(this.objt.theRebuttal,updCr.index,updCr.reference);
        }
      }
      else {
        if (updCr.reference.theCharacteristicType == 'grounds') {
          this.objt.theGrounds.push(updCr.reference);
        }
        else if (updCr.reference.theCharacteristicType == 'warrant') {
          this.objt.theWarrant.push(updCr.reference);
        }
        else {
          this.objt.theRebuttal.push(updCr.reference);
        }
      }
    }
  }
}
</script>
