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

  <div class="dataflowpanel">
    <b-container v-if="panelObject != undefined">
      <b-form-group label="Type" label-class="font-weight-bold text-md-left" label-for="theTypeInput" >
        <b-form-input readonly id="theType" v-model="panelObject.theType" />
      </b-form-group>
      <b-table bordered small :items="assets" :fields="assetTableFields" />
      <b-table bordered small :items="panelObject.theObstacles" :fields="obstacleTableFields" />
    </b-container>
  </div>
</template>

<script>

  export default {
    name: 'dataflow-panel',
    props : {
      panelParameters : Object,
      panelObject : Object
    },
    data() {
      return {
        assetTableFields : [
          {key: 'name', label : 'Asset'}
        ],
        obstacleTableFields : [
          {key: 'theObstacleName', label : 'Obstacle'},
          {key: 'theKeyword', label : 'Keyword'},
          {key: 'theContext', label : 'Context'}
        ]
      }
    },
    computed : {
      assets() {
        return this.panelObject != undefined && this.panelObject.theAssets != undefined ? this.panelObject.theAssets.map(asset => ({name : asset})): [];
      }
    }
  };
</script>
