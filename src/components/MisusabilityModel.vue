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

  <div class="misusabilitymodel">
    <side-bar :dimension="theSelectedDimension" :panelParameters="panelParameters" :panelObject="theSelectedObject" />
    <b-card no-body>
    <b-container fluid>
      <b-row>
        <b-col>
          <b-form-group label="Misusability Case" label-for="misusabilityModelMisusabilityCase" :label-cols="3" >
            <dimension-select id="misusabilityModelMisusabilityCase" ref="misusabilityModelMisusabilityCase" dimension="misusability_case" v-on:dimension-select-change="misusabilityCaseSelected" v-on:dimension-items-updated="misusabilityCasesLoaded" />
          </b-form-group>
        </b-col>
        <b-col v-if="theMisusabilityCase != ''">
          <b-form-group label="Characteristic" label-form="misusabilityModelCharacteristic" :label-cols="4" >
            <dimension-select id="misusabilityModelCharacteristic" ref="misusabilityModelCharacteristic" :dimensionUrl="tcUrl" initial="all" includeall v-on:dimension-select-change="characteristicSelected" v-on:dimension-items-updated="characteristicsLoaded" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>
    </b-card>
    <graphical-model v-if="theMisusabilityCase != ''" :api="misusabilityModelURI" v-on:graphical-model-url="nodeClicked" />
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
    misusabilityModelURI() {
      return this.theMisusabilityCase != '' ? '/api/tasks/model/misusability/' + this.theMisusabilityCase + '/characteristic/' + this.theCharacteristic : '';
    },
    tcUrl() {
      return this.theMisusabilityCase != '' ? '/api/dimensions/table/task_characteristic/environment/' + this.theMisusabilityCase : '';
    },
    panelParameters() {
      return undefined;
    }
  },
  data() {
    return {
      theMisusabilityCase : '',
      theCharacteristic : 'all',
      theSelectedObject: null,
      theSelectedDimension : ''
    }
  },
  components : {
    DimensionSelect,
    SideBar,
    GraphicalModel
  },
  methods : {
    nodeClicked(url) {
      const dimName = url.slice(5).substring(0, url.slice(5).indexOf('/'));
      if (['grounds','warrants','backings','rebuttals'].indexOf(dimName) == -1) {
        return;
      }
      let objtUrl = '/api/concept_references' + url.slice(12);
      if (dimName == 'backings') {
        objtUrl = '/api/external_documents' + url.slice(13);
      }
      else if (dimName == 'warrants') {
        objtUrl = '/api/concept_references' + url.slice(13);
      }
      else if (dimName == 'rebuttals') {
        objtUrl = '/api/concept_references' + url.slice(14);
      }
      axios.get(objtUrl,{
        baseURL : this.$store.state.url,
        params : {'session_id' : this.$store.state.session}
      })
      .then(response => {
        if (dimName == 'backings') {
          this.theSelectedDimension = 'external_documents';
          this.theSelectedObject = response.data;
        }
      })
      .catch((error) => {
        EventBus.$emit('operation-failure',error);
      })
    },
    misusabilityCaseSelected(mucName) {
      this.theMisusabilityCase = mucName;
      if (this.$refs.misusabilityModelCharacteristic != undefined) {
        this.theCharacteristic = 'all';
        this.$refs.misusabilityModelCharacteristic.selected = this.theCharacteristic;
      }
    },
    misusabilityCasesLoaded(mucName) {
      this.theMisusabilityCase = mucName;
      if (this.$refs.misusabilityModelCharacteristic != undefined) {
        this.theCharacteristic = 'all';
        this.$refs.misusabilityModelCharacteristic.selected = this.theCharacteristic;
      }
    },
    characteristicSelected(charName) {
      this.theCharacteristic = charName;
    },
    characteristicsLoaded(charName) {
      this.theCharacteristic = charName;
    }
  }
}
</script>
