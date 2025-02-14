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

  <div class="exportview">
    <b-form class="vld-parent">
      <loading :active.sync="isLoading" is-full-page></loading>
      <b-breadcrumb :items="bcItems" />
      <b-container fluid>
        <p v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </p>
        <b-card bg-variant="light">
          <b-row>
            <b-col md="12">
              <b-form-group label="Model" label-class="text-md-left font-weight-bold" label-for="theModelRadio">
                <b-form-radio-group id="theModelRadio" v-model="theModelType">
                  <b-form-radio value="Model">Model package (.cairis)</b-form-radio>
                  <b-form-radio value="ModelXML">Model file (.xml)</b-form-radio>
                  <b-form-radio value="GRL">GRL</b-form-radio>
                  <b-form-radio value="Architectural Pattern">Architectural Pattern</b-form-radio>
                  <b-form-radio value="Security Patterns">Security Patterns</b-form-radio>
                  <b-form-radio value="Persona characteristics (Workbook)">Persona characteristics (Workbook)</b-form-radio>
                  <b-form-radio value="User goals (Workbook)">User goals (Workbook)</b-form-radio>
                </b-form-radio-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-form-group v-if="theModelType == 'Architectural Pattern'" label="Architectural Pattern" label-class="text-md-left font-weight-bold" label-for="thePatternSelect">
                <dimension-select ref="patternSelect" id="patternSelect" dimension="component_view" v-on:dimension-select-change="patternSelected" v-on:dimension-items-updated="patternsLoaded" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="4">
              <b-form-group v-if="theModelType == 'GRL'" label="Environment" label-class="text-md-left font-weight-bold" label-for="theEnvironmentSelect">
                <dimension-select ref="environmentSelect" id="environmentSelect" dimension="noncomposite_environment" v-on:dimension-select-change="environmentSelected" v-on:dimension-items-updated="environmentsLoaded" />
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group v-if="theModelType == 'GRL'" label="Task" label-class="text-md-left font-weight-bold" label-for="theTaskSelect">
                <dimension-select ref="taskSelect" id="taskSelect" dimension="task" v-on:dimension-select-change="taskSelected" v-on:dimension-items-updated="tasksLoaded" />
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group v-if="theModelType == 'GRL'" label="Persona" label-class="text-md-left font-weight-bold" label-for="thePersonaSelect">
                <dimension-select ref="personaSelect" id="personaSelect" dimension="persona" includeall="true" v-on:dimension-select-change="personaSelected" v-on:dimension-items-updated="personasLoaded" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-group label="File name" label-class="text-md-left font-weight-bold" label-for="theFileName">
            <b-form-input id="theModelFile" v-model="theFileName" type="text" required />
          </b-form-group>

        </b-card>
      </b-container>
      <b-container fluid>
        <b-form-row>
          <b-col md="4" offset-md="5" >
            <b-button type="submit" variant="primary" @click="onExport">Export</b-button>
            <b-button type="submit" variant="secondary" @click="onCancel">Cancel</b-button>
          </b-col>
        </b-form-row>
      </b-container>
    </b-form>

  </div>
</template>


<script>

import axios from 'axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import DimensionSelect from '@/components/DimensionSelect.vue'
import EventBus from '../utils/event-bus';

export default {
  computed : {
    bcItems() {
     return [{text: 'Home', to: {name: 'home'}},{text: 'Export', to: {name: 'export'}}]
    },
    exportURL() {
      return this.theModelType == 'Model' || this.theModelType == 'ModelXML' ? '/api/export/file' :
        (this.theModelType == 'Architectural Pattern' ? '/api/export/file/architectural_pattern/' + this.theParameterName :
          (this.theModelType == 'Security Patterns' ? '/api/export/file/security_patterns' :
            (this.theModelType == 'User goals (Workbook)' ? '/api/export/file/user_goals' :
              (this.theModelType == 'Persona characteristics (Workbook)' ? '/api/export/file/persona_characteristics' :
                ('/api/export/file/grl/task/' + this.theTaskName + '/persona/' + this.persona + '/environment/' + this.theEnvironmentName)))));
    },
    persona() {
      return this.thePersonaName == 'all' ? 'ALL' : this.thePersonaName;
    }
  },
  components : {
    Loading,
    DimensionSelect
  },
  data() {
    return {
      errors : [],
      isLoading : false,
      theModelType : 'Model',
      theExportURL : '/api/export/file',
      theArchitecturalPatternName : '',
      theEnvironmentName : '',
      theTaskName : '',
      thePersonaName : '',
      theFileName : 'model',
      theExportParameters : {
        session_id : this.$store.state.session,
        filename : 'model',
        fileType : 'xml'
      }
    }
  },
  methods : {
    checkForm() {
      this.errors = []

      if (this.theExportParameters.filename.length == 0) {
        this.errors.push('File name is required');
      }

      if (this.theModelType == 'Architectural Pattern') {
        if (this.theArchitecturalPatternName.length == 0) {
          this.errors.push('Architectural pattern is required');
        }
      }
      else if (this.theModelType == 'GRL') {
        if (this.theEnvironmentName.length == 0) {
          this.errors.push('Environment is required');
        }
        if (this.theTaskName.length == 0) {
          this.errors.push('Task is required');
        }
        if (this.thePersonaName.length == 0) {
          this.errors.push('Persona is required');
        }
      }
      if (!this.errors.length) {
        return true;
      }
      else {
        return false;
      }
    },
    onExport(evt) {
      evt.preventDefault();
      if (this.checkForm()) {
        this.isLoading = true;
        this.theExportParameters.fileType = this.theModelType == 'Model' ? 'cairis' : (this.theModelType == 'User goals (Workbook)' ? 'xlsx' : 'xml');
        const fileType = this.theModelType == 'Model' || this.theModelType == 'User goals (Workbook)' || this.theModelType == 'Persona characteristics (Workbook)' ? 'octet-stream' : 'xml';
        const exportHeaders = {'Content-Type': 'application/' + fileType} ;

        if (this.theModelType == 'Model') {
          this.theExportParameters.filename = this.theFileName + '.cairis';
        }
        else if (this.theModelType == 'Persona characteristics (Workbook)' || this.theModelType == 'User goals (Workbook)') {
          this.theExportParameters.filename = this.theFileName + '.xlsx';
        }
        else {
          this.theExportParameters.filename = this.theFileName;
        }

        axios.get(this.exportURL,{
          responseType : 'arraybuffer',
          headers : exportHeaders,
          baseURL : this.$store.state.url,
          params : this.theExportParameters
         })
        .then(response => {
          let blob = new Blob([response.data],{type: 'application/' + fileType });
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = this.theExportParameters.filename;
          link.click();
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          const decodedMsg = String.fromCharCode.apply(null,new Uint8Array(error.response.data));
          const objt = JSON.parse(decodedMsg);
          EventBus.$emit('operation-failure',objt['message']);
        });
      }
    },
    onCancel(evt) {
      evt.preventDefault();
      this.isLoading = false;
      this.$router.push({ name: 'home'})
    },
    patternSelected(patternName) {
      this.theArchitecturalPatternName = patternName;
    },
    patternsLoaded(patternName) {
      this.theArchitecturalPatternName = patternName;
    },
    environmentSelected(envName) {
      this.theEnvironmentName = envName;
    },
    environmentsLoaded(envName) {
      this.theEnvironmentName = envName;
    },
    taskSelected(taskName) {
      this.theTaskName = taskName;
    },
    tasksLoaded(taskName) {
      this.theTaskName = taskName;
    },
    personaSelected(personaName) {
      this.thePersonaName = personaName;
    },
    personasLoaded(personaName) {
      this.thePersonaName = personaName;
    }
  }
}
</script>
