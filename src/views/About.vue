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

  <b-jumbotron id="about" header="CAIRIS" :lead="theVersion" container-fluid />
</template>

<script>

import axios from 'axios';
import EventBus from '../utils/event-bus';

export default {
  data() {
    return {
      theVersion : ''
    }
  },
  mounted() {
    var url = "/api/version";
    axios.get(url,{
      baseURL : this.$store.state.url,
      params : {'session_id' : this.$store.state.session}
     })
    .then(response => {
      this.theVersion = response.data;
     })
    .catch((error) => {
      EventBus.$emit('operation-failure',error)
    })
  }
}

</script>
