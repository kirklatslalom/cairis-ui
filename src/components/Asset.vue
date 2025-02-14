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

  <div class="asset">
    <dimension-modal ref="environmentDialog" dimension="noncomposite_environment" :existing="environmentNames" v-on:dimension-modal-update="addAssetEnvironmentProperty"/>
    <association-modal ref="assetAssociationDialog" :assetAssociation="selectedAssociation" v-on:association-update="updateAssetAssociation"/>
    <property-modal ref="propertyDialog" :securityProperty="selectedProperty" v-on:property-update="updateProperty"/>
    <asset-interface-modal ref="assetInterfaceDialog" :assetInterface="selectedInterface" v-on:interface-update="updateAssetInterface"/>
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>
    <b-form v-on:property-update="updateProperty">
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Summary" active>
            <b-card bg-variant="light">
              <b-row>
                <b-col md="6">
                  <b-form-group label="Asset" label-class="font-weight-bold text-md-left" label-for="theAssetInput">
                    <b-form-input id="theAssetInput" v-model="objt.theName" type="text" required />
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Shortcode" label-class="font-weight-bold text-md-left" label-for="theShortCodeInput">
                    <b-form-input id="theShortCodeInput" v-model="objt.theShortCode" type="text" required />
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group label="Type" label-class="font-weight-bold text-md-left" label-for="theTypeInput">
                    <dimension-select id="theTypeInput" ref="assetTypeInput" :initial="objt.theType" dimension="asset_type" v-on:dimension-select-change="assetTypeSelected" v-on:dimension-items-updated="assetTypesLoaded" />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-group label="Description" label-class="font-weight-bold text-md-left" label-for="theDescriptionInput">
                    <b-form-textarea id="theDescription" v-model="objt.theDescription" type="text" :rows=4 :max-rows=4 required />
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Significance" label-class="font-weight-bold text-md-left" label-for="theSignificanceInput">
                    <b-form-textarea id="theSignificance" v-model="objt.theSignificance" type="text" :rows=4 :max-rows=4 required />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-form-group label="Tags" label-class="font-weight-bold text-md-left" label-for="theTagsInput">
                    <b-form-tags id="theTagsInput" v-model="objt.theTags" separator="," placeholder="Enter new tags separated by comma" remove-on-delete tag-variant="primary" tag-pills class="md-8"></b-form-tags>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-card>
          </b-tab>
          <b-tab title="Criticality">
            <b-card bg-variant="light">
                <b-row>
                  <b-col md="12">
                    <b-form-checkbox v-model="critical" >Critical Asset</b-form-checkbox>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-textarea v-model="objt.theCriticalRationale" type="text" :rows=2 :max-rows=4 v-if="objt.isCritical" />
                  </b-col>
                </b-row>
            </b-card>
          </b-tab>
          <b-tab title="Interfaces">
            <b-card bg-variant="light">
              <b-table striped small hover :items="objt.theInterfaces" :fields=interfaceTableFields @row-clicked="viewInterface">
                <!-- eslint-disable-next-line -->
                <template v-slot:head(intactions)="data">
                  <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addInterface"/>
                </template>
                <template v-slot:cell(intactions)="row">
                  <font-awesome-icon icon="minus" :style="{color: 'red'}" @click.stop="deleteInterface(row.index)"/>
                </template>
              </b-table>
            </b-card>
          </b-tab>
        </b-tabs>
        <b-container fluid>
          <b-card header="Environments" no-body class="text-left">
            <template slot="header">
              <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addEnvironment"/> Environment
            </template>
            <b-row>
              <b-col sm="12">
                <b-tabs pills v-model="envPropIndex">
                  <b-tab v-for="envProp in this.objt.theEnvironmentProperties" :key="envProp.theEnvironmentName" :title=envProp.theName>
                    <template slot="title">
                      <font-awesome-icon icon="minus" :style="{color: 'red'}" @click="deleteEnvironment(envProp.theEnvironmentName)"/>  {{envProp.theEnvironmentName}}
                    </template>
                  </b-tab>
                 </b-tabs>
               </b-col>
            </b-row>
            <b-row v-show="this.objt.theEnvironmentProperties.length">
              <b-col sm="12">
                <b-tabs >
                  <b-tab title="Definition" active>
                    <b-table striped small hover :items="notNone" :fields=propTableFields @row-clicked="viewProperty">
                      <!-- eslint-disable-next-line -->
                      <template v-slot:head(propactions)="data">
                        <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addProperty"/>
                      </template>
                      <template v-slot:cell(propactions)="row">
                        <font-awesome-icon icon="minus" :style="{color: 'red'}" @click.stop="clearProperty(row.item)"/>
                      </template>
                    </b-table>
                  </b-tab>
                  <b-tab title="Associations">
                    <b-table striped small hover :items="assetAssociations" :fields="assocTableFields" @row-clicked="viewAssetAssociation">
                      <!-- eslint-disable-next-line -->
                      <template v-slot:head(assocactions)="data">
                        <font-awesome-icon icon="plus" :style="{color: 'green'}" @click.stop="addAssetAssociation"/>
                      </template>
                      <template v-slot:cell(assocactions)="row">
                        <font-awesome-icon icon="minus" :style="{color: 'red'}" @click.stop="deleteAssetAssociation(row.index)"/>
                      </template>
                    </b-table>
                  </b-tab>
                </b-tabs>
              </b-col>
            </b-row>
          </b-card>
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

import environmentMixin from '../mixins/environmentMixin'
import objectMixin from '../mixins/objectMixin'
import propertiesMixin from '../mixins/propertiesMixin'
import PropertyModal from './PropertyModal'
import DimensionModal from './DimensionModal'
import DimensionSelect from './DimensionSelect'
import AssociationModal from './AssociationModal'
import AssetInterfaceModal from './AssetInterfaceModal'

export default {
  props : {
    object : Object,
    label : String
  },
  watch : {
    object: 'setObject'
  },
  mixins : [
    environmentMixin,
    objectMixin,
    propertiesMixin
  ],
  computed : {
    assetAssociations() {
      return this.objt.theEnvironmentProperties.length > 0 && this.envPropIndex >= 0 ? this.objt.theEnvironmentProperties[this.envPropIndex].theAssociations : [] ;
    },
    tailAssets() {
      return this.objt.theEnvironmentProperties.length > 0 && this.envPropIndex >= 0 ? this.objt.theEnvironmentProperties[this.envPropIndex].theAssociations.map(assoc => assoc.theTailName) : [] ;
    },
    unusedProperties() {
      return this.objt.theEnvironmentProperties.length > 0 && this.envPropIndex >= 0 ? this.objt.theEnvironmentProperties[this.envPropIndex].theProperties.filter(prop => (prop.value == 'None')).map(prop => prop.name) : [];
    },
    critical : {
      get : function() {
        return this.objt.isCritical == 1 ? true : false;
      },
      set : function(value) {
        if (value == true) {
          this.objt.isCritical = 1;
        }
        else {
          this.objt.isCritical = 0;
        }
      }
    }
  },
  components : {
    PropertyModal,
    DimensionModal,
    AssociationModal,
    AssetInterfaceModal,
    DimensionSelect
  },
  data() {
    return {
      objt : this.object,
      commitLabel : this.label,
      envPropIndex : 0,
      errors : [],
      selectedAssociation : {
        asset : '',
        environment : '',
        update : false,
        initial : '',
        association : {
          theHeadNav : 0,
          theHeadType : 'Association',
          theHeadMultiplicity : '*',
          theHeadRole: '',
          theTailRole : '',
          theTailMultiplicity : '*',
          theTypeType : 'Association',
          theTailNav : 0,
          theTailName : ''
         }
      },
      selectedInterface : {
        update : false,
        assetinterface : {
          theInterfaceName : '',
          theInterfaceType : '',
          theAccessRight : '',
          thePrivilege : ''
        }
      },
      assetTypes: ['Hardware','Information','People','Software','Systems','Systems - General','System of Systems'],
      envFields : {
        envactions : {label : ''},
        theName : {label : 'Environment'}
      },
      interfaceTableFields : [
        {key: 'intactions', label: ''},
        {key: 'theInterfaceName', label : 'Interface'},
        {key: 'theInterfaceType' ,label : 'Type'},
        {key: 'theAccessRight' , label : 'Access Right'},
        {key: 'thePrivilege', label : 'Privilege'}
      ],
      assocTableFields : [
        {key: 'assocactions', label: ''},
        {key: 'theHeadNav', label: 'Nav'},
        {key: 'theHeadType',label: 'Type'},
        {key: 'theHeadMultiplicity', label: 'Nry'},
        {key: 'theHeadRole', label: 'Role'},
        {key: 'theTailRole', label: 'Tail Role'},
        {key: 'theTailMultiplicity', label: 'Tail Nry'},
        {key: 'theTailNav', label: 'Tail Nav'},
        {key: 'theTailName', label: 'Tail Asset'}
      ]
    }
  },
  methods: {
    checkForm() {
      this.errors = []
      if (this.objt.theName.length == 0 || this.objt.theName.trim().length == 0) {
        this.errors.push('Asset name is required');
      }
      const resChars = /[<>‘'`"\\:%/_*?#£$&]/ ;
      const res = this.objt.theName.match(resChars);
      if (res != null) {
        this.errors.push('Character ' + res['index'] + ' in ' + this.objt.theName + ' is a reserved character.');
      }
      if (this.objt.theShortCode.length == 0) {
        this.errors.push('Short code is required');
      }
      if (this.objt.theType.length == 0) {
        this.errors.push('Asset type is required');
      }
      if (this.objt.theDescription.length == 0) {
        this.errors.push('Description is required');
      }
      if (this.objt.theSignificance.length == 0) {
        this.errors.push('Significance is required');
      }
      if (this.objt.theEnvironmentProperties.length == 0) {
        this.errors.push('No environment properties have been defined')
      }
      for (let i = 0; i < this.objt.theEnvironmentProperties.length; i++) {
        const envProps = this.objt.theEnvironmentProperties[i];
        if (envProps.theProperties.filter(p => p.value != 'None').length ==0) {
          this.errors.push('At least one property should be not None in environment ' + envProps.theEnvironmentName);
        }
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
      this.$router.push({ name: 'objectsview', params: {dimension: 'asset'}});
    },
    addAssetAssociation() {
      this.selectedAssociation['asset'] = this.objt.theName;
      this.selectedAssociation['assets'] = this.tailAssets;
      this.selectedAssociation['assets'].push(this.objt.theName);
      this.selectedAssociation['environment'] = this.objt.theEnvironmentProperties[this.envPropIndex].theEnvironmentName;
      this.selectedAssociation['association'] = {theHeadNav : 0, theHeadType : 'Association', theHeadMultiplicity : '*', theHeadRole: '', theTailRole : '', theTailMultiplicity : '*', theTailNav : 0, theTailType : 'Association', theTailName : ''};
      this.selectedAssociation['update'] = false;
      this.selectedAssociation['initial'] = '';
      this.$refs.assetAssociationDialog.show();
    },
    deleteAssetAssociation(index) {
      this.objt.theEnvironmentProperties[this.envPropIndex].theAssociations.splice(index,1);
    },
    addInterface() {
      this.selectedInterface['assetinterface'] = {theInterfaceName : '', theInterfaceType : '', theAccessRight : '', thePrivilege: ''};
      this.selectedInterface['update'] = false;
      this.$refs.assetInterfaceDialog.show();
    },
    deleteInterface(index) {
      this.objt.theInterfaces.splice(index,1);
    },
    viewInterface(data,index) {
      this.selectedInterface.index = index
      this.selectedInterface['assetinterface'] = JSON.parse(JSON.stringify(data));
      this.selectedInterface['update'] = true;
      this.$refs.assetInterfaceDialog.show();
    },
    updateAssetInterface : function(updIf) {
      if (updIf.update) {
        this.$set(this.objt.theInterfaces,updIf.index,updIf.interface);
      }
      else {
        this.objt.theInterfaces.push(updIf.interface);
      }
    },
    addEnvironment(evt) {
      evt.preventDefault();
      this.$refs.environmentDialog.show();
    },
    addAssetEnvironmentProperty : function(envName) {
      this.addEnvironmentProperty({
        theEnvironmentName : envName,
        theAssociations : [],
        theProperties : this.defaultProperties()
      });
    },
    updateAssetAssociation : function(updAssoc) {
      if (updAssoc.update) {
        this.$set(this.objt.theEnvironmentProperties[this.envPropIndex].theAssociations,updAssoc.index,updAssoc.association);
      }
      else {
        this.objt.theEnvironmentProperties[this.envPropIndex].theAssociations.push(updAssoc.association);
      }
    },
    viewAssetAssociation(data,index) {
      this.selectedAssociation['asset'] = this.objt.theName;
      this.selectedAssociation['index'] = index
      this.selectedAssociation['environment'] = this.objt.theEnvironmentProperties[this.envPropIndex].theEnvironmentName
      this.selectedAssociation['association'] = JSON.parse(JSON.stringify(data));
      this.selectedAssociation['update'] = true;
      this.selectedAssociation['initial'] = this.selectedAssociation['association'].theTailName
      this.selectedAssociation['assets'] = this.tailAssets.filter(v => v!= this.selectedAssociation['association'].theTailName);
      this.selectedAssociation['assets'].push(this.objt.theName);
      this.$refs.assetAssociationDialog.show();
    },
    assetTypeSelected(vtName) {
      this.objt.theType = vtName;
    },
    assetTypesLoaded(vtName) {
      this.objt.theType = vtName;
    }
  }
}
</script>
