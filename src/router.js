/*  Licensed to the Apache Software Foundation (ASF) under one
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

    Authors: Shamal Faily */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/architecturalpatternmodel',
      name: 'architecturalpatternmodel',
      component: () => import('./views/ArchitecturalPatternModelView.vue')
    },
    {
      path: '/assetassociation/environment/:envName/head/:headName/tail/:tailName',
      name: 'assetassociation',
      component: () => import('./views/AssetAssociationView.vue'),
      props: true
    },
    {
      path: '/assetmodel',
      name: 'assetmodel',
      component: () => import('./views/AssetModelView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/conceptreference/:objectName',
      name: 'conceptreference',
      component: () => import('./views/ConceptReferenceView.vue'),
      props: true
    },
    {
      path: '/dataflowdiagram',
      name: 'dataflowdiagram',
      component: () => import('./views/DataFlowDiagramView.vue')
    },
    {
      path: '/databases',
      name: 'databases',
      component: () => import('./views/DatabaseView.vue')
    },
    {
      path: '/dataflow/:objectName/environment/:envName',
      name: 'dataflow',
      component: () => import('./views/DataFlowView.vue'),
      props: true
    },
    {
      path: '/dependency/environment/:envName/depender/:depName/dependee/:deeName/dependency/:dpyName',
      name: 'dependency',
      component: () => import('./views/DependencyView.vue'),
      props: true
    },
    {
      path: '/documentation',
      name: 'documentation',
      component: () => import('./views/DocumentationView.vue')
    },
    {
      path: '/documentreference/:objectName',
      name: 'documentreference',
      component: () => import('./views/DocumentReferenceView.vue'),
      props: true
    },
    {
      path: '/export',
      name: 'export',
      component: () => import('./views/ExportView.vue')
    },
    {
      path: '/externaldocument/:objectName',
      name: 'externaldocument',
      component: () => import('./views/ExternalDocumentView.vue'),
      props: true
    },
    {
      path: '/environment/:objectName',
      name: 'environment',
      component: () => import('./views/EnvironmentView.vue'),
      props: true
    },
    {
      path: '/find/:findTxt',
      name: 'findview',
      component: () => import('./views/FindView.vue'),
      props: true
    },
    {
      path: '/goalmodel',
      name: 'goalmodel',
      component: () => import('./views/GoalModelView.vue')
    },
    {
      path: '/import',
      name: 'import',
      component: () => import('./views/ImportView.vue')
    },
    {
      path: '/kaosassociation/environment/:envName/goal/:goalName/subgoal/:subGoalName',
      name: 'kaosassociation',
      component: () => import('./views/KaosAssociationView.vue'),
      props: true
    },
    {
      path: '/locationsmodel',
      name: 'locationsmodel',
      component: () => import('./views/LocationsModelView.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('./views/Logout.vue')
    },
    {
      path: '/misusabilitymodel',
      name: 'misusabilitymodel',
      component: () => import('./views/MisusabilityModelView.vue')
    },
    {
      path: '/objects/:dimension/name/:objectName',
      name: 'objectview',
      component: () => import('./views/ObjectView.vue'),
      props: true
    },
    {
      path: '/objects/:dimension',
      name: 'objectsview',
      component: () => import('./views/ObjectsView.vue'),
      props: true
    },
    {
      path: '/obstaclemodel',
      name: 'obstaclemodel',
      component: () => import('./views/ObstacleModelView.vue')
    },
    {
      path: '/personacharacteristic/:objectName',
      name: 'personacharacteristic',
      component: () => import('./views/PersonaCharacteristicView.vue'),
      props: true
    },
    {
      path: '/personamodel',
      name: 'personamodel',
      component: () => import('./views/PersonaModelView.vue')
    },
    {
      path: '/persona/:objectName',
      name: 'persona',
      component: () => import('./views/PersonaView.vue'),
      props: true
    },
    {
      path: '/properties',
      name: 'properties',
      component: () => import('./views/PropertiesView.vue')
    },
    {
      path: '/requirementmodel',
      name: 'requirementmodel',
      component: () => import('./views/RequirementModelView.vue')
    },
    {
      path: '/objects/requirement/name/:objectName',
      name: 'requirement',
      component: () => import('./views/RequirementView.vue'),
      props: true
    }, 
    {
      path: '/responsibilitymodel',
      name: 'responsibilitymodel',
      component: () => import('./views/ResponsibilityModelView.vue')
    },
    {
      path: '/riskmodel',
      name: 'riskmodel',
      component: () => import('./views/RiskModelView.vue')
    },
    {
      path: '/taskmodel',
      name: 'taskmodel',
      component: () => import('./views/TaskModelView.vue')
    },
    {
      path: '/task/:objectName',
      name: 'task',
      component: () => import('./views/TaskView.vue'),
      props: true
    },
    {
      path: '/traces',
      name: 'traces',
      component: () => import('./views/Traces.vue')
    },
    {
      path: '/trustboundary/:objectName',
      name: 'trustboundary',
      component: () => import('./views/TrustBoundaryView.vue'),
      props: true
    },
    {
      path: '/validationmodel',
      name: 'validationmodel',
      component: () => import('./views/ValidationView.vue')
    },
    {
      path: '/valuetypes/:dimension',
      name: 'valuetypes',
      component: () => import('./views/ValueTypes.vue'),
      props: true
    },
    {
      path: '/valuetype/:objectName',
      name: 'valuetype',
      component: () => import('./views/ValueTypeView.vue'),
      props: true
    },
    {
      path: '*',
      name: 'NotFound',
      component: () => import('./components/NotFound.vue')
    }
  ]
})
