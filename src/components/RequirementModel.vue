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

  <div class="requirementmodel">
    <side-bar :dimension="theSelectedDimension" :panelParameters="panelParameters" :panelObject="theSelectedObject" />
    <b-card no-body>
    <b-container fluid>
      <b-row class="justify-content-md-left">
        <b-col md="2">
          <b-form-radio-group buttons size="md" id="theDimensionRadio" v-model="theDimensionName" :options="dimensionOptions" class="sm-3" required name="theDimensionRadio"/>
        </b-col>
        <b-col md="5">
          <dimension-select id="requirementModelDimension" ref="requirementModelDimension" :dimension="theDimensionName" initial="all" includeall v-on:dimension-select-change="dimensionSelected" v-on:dimension-items-updated="dimensionsLoaded" />
        </b-col>
        <b-col md="5">
          <b-form-group label="Requirement" label-for="requirementModelRequirement" label-cols="3" >
            <dimension-select id="requirementModelRequirement" ref="requirementModelRequirement" :dimensionUrl="requirementsNameURI" initial="all" includeall v-on:dimension-select-change="requirementSelected" v-on:dimension-items-updated="requirementsLoaded" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>
    </b-card>
    <graphical-model :api="requirementModelURI" :jsonParameters="this.filterParameters" v-on:graphical-model-url="nodeClicked"/>
  </div>
</template>

<script>

import axios from 'axios';
import GraphicalModel from '@/components/GraphicalModel.vue';
import DimensionSelect from '@/components/DimensionSelect.vue';
import SideBar from '@/components/SideBar.vue';
import EventBus from '../utils/event-bus';

export default {
  computed : {
    requirementModelURI() {
      return "/api/requirements/model/environment/" + this.theDimensionValue + "/requirement/" + this.theRequirementName;
    },
    requirementsNameURI() {
      return (this.theDimensionValue == 'all' ? "/api/dimensions/table/requirement" : "/api/requirements/" + this.theDimensionName + "/" + this.theDimensionValue + "/names");
    },
    panelParameters() {
      return undefined;
    }
  },
  data() {
    return {
      theDimensionName : 'environment',
      theDimensionValue : 'all',
      theRequirementName : 'all',
      theSelectedObject: null,
      filterParameters : {
        asset : '0'
      },
      dimensionOptions : [
        {text : 'Environment', value : 'environment'},
        {text : 'Asset', value : 'asset'}
      ],
      theSelectedDimension : ''
    }
  },
  components : {
    DimensionSelect,
    GraphicalModel,
    SideBar
  },
  methods : {
    nodeClicked(url) {
      this.theSelectedDimension = url.slice(5).substring(0, url.slice(5).indexOf('/'))
      if (['requirements'].indexOf(this.theSelectedDimension) == -1) {
        return;
      }
      axios.get(url,{
        baseURL : this.$store.state.url,
        params : {'session_id' : this.$store.state.session}
      })
      .then(response => {
        this.theSelectedObject = response.data;
      })
      .catch((error) => {
        EventBus.$emit('operation-failure',error)
      })
    },
    dimensionSelected(dimName) {
      this.theDimensionValue = dimName
      this.theRequirementName = 'all'
      this.filterParameters.asset = (this.theDimensionName == 'asset' ? '1' : '0');
      if (this.$refs.requirementsModelRequirement != undefined) {
        this.$refs.requirementModelRequirement.selected = this.theRequirementName;
      }
    },
    dimensionsLoaded(dimName) {
      this.theDimensionValue = dimName
      this.theRequirementName = 'all'
      this.filterParameters.asset = (this.theDimensionName == 'asset' ? '1' : '0');
      if (this.$refs.requirementsModelRequirement != undefined) {
        this.$refs.requirementModelRequirement.selected = this.theRequirementName;
      }
    },
    requirementSelected(reqName) {
      this.filterParameters.asset = (this.theDimensionName == 'asset' ? '1' : '0');
      this.theRequirementName = reqName
    },
    requirementsLoaded(reqName) {
      this.filterParameters.asset = (this.theDimensionName == 'asset' ? '1' : '0');
      this.theRequirementName = reqName
    }
  }
}
</script>
