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
  <div class="propertiesview">
    <properties-model :object="this.objt" v-on:properties-commit="commitProperties" />
  </div>
</template>

<script>
import axios from 'axios';
import EventBus from '../utils/event-bus';
import store from '../store'
import PropertiesModel from '@/components/PropertiesModel.vue'

export default {
  computed : {
    bcItems() {
      return [{text: 'Home', to: {name: 'home'}},{text: 'Properties', to: {name: 'propertiesmodel'}}]
    }
  },
  components : {
    PropertiesModel
  },
  data() {
    return {
      objt : {
        projectName : 'New project',
        richPicture : '',
        projectScope : '',
        definitions : [],
        projectGoals : '',
        contributions : [],
        projectBackground : '',
        revisions : []
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    const url = '/api/settings';
    axios.get(url,{
      baseURL : store.state.url,
      params : {'session_id' : store.state.session}
    })
    .then(response => {
      next(vm => {
        vm.objt = response.data;
      })
    })
    .catch((error) => {
      EventBus.$emit('operation-failure',error)
    });
  },
  methods : {
    commitProperties(objt) {
      const settingsUrl = this.$store.state.url + '/api/settings?session_id=' + this.$store.state.session;
      axios.put(settingsUrl,{
        session_id : this.$store.state.session,
        object : objt
      })
      .then(response => {
        document.title = objt.projectName;
        EventBus.$emit('operation-success',response.data.message)
        this.$router.push({ name: 'home'})
      })
      .catch((error) => {
        EventBus.$emit('operation-failure',error)
      })
    }
  }
}
</script>
