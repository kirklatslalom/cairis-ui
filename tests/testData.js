const testData = {
asset : {
  theName : 'Clinical Data',
  theType : 'Information',
  theShortCode : 'CD',
  theDescription: 'Clinical Data',
  theSignificance: 'Unanonymised and in the wrong hands, this could be very damaging.',
  isCritical: 0,
  theCriticalRationale: "",
  theTags : [],
  theInterfaces : [{"theInterfaceName" : "if1","theInterfaceType" : "provided","theAccessRight" : "anonymous", "thePrivilege" : "normal"}],
  theEnvironmentProperties : [
    {
      "theName" : "Psychosis",
      "theAssociations" : [
        {
          "theHeadNav": 0,
          "theHeadType" : "Association",
          "theHeadMultiplicity":"*",
          "theHeadRole": "",
          "theTailRole" : "",
          "theTailMultiplicity" :"*",
          "theTailNav" : 0,
          "theTailName" : "Cache"}
      ],
      "theProperties" : [
        {"name":"Confidentiality",
         "value":"High",
         "rationale":"Clinical data is partially anonymised."},
        {"name":"Integrity",
         "value":"High",
         "rationale":"Don't touch this"},
        {"name":"Availability",
         "value":"None",
         "rationale":"None"},
        {"name":"Accountability",
         "value":"None",
         "rationale":"None"},
        {"name":"Anonymity",
         "value":"None",
         "rationale":"None"},
        {"name":"Pseudonymity",
         "value":"None",
         "rationale":"None"},
        {"name":"Unlinkability",
         "value":"None",
         "rationale":"None"},
        {"name":"Unobservability",
         "value":"None",
         "rationale":"None"}
      ]
    },
    {
      "theName" : "Stroke",
      "theAssociations" : [
        {"theHeadNav": 0,
         "theHeadType" : "Association",
         "theHeadMultiplicity":"*",
         "theHeadRole":"",
         "theTailRole" : "",
         "theTailMultiplicity" :"*",
         "theTailNav" : 0,
         "theTailName" : "Workflow"},
        {"theHeadNav": 0,
         "theHeadType" : "Association",
         "theHeadMultiplicity":"*",
         "theHeadRole":"",
         "theTailRole" : "",
         "theTailMultiplicity" :"*",
         "theTailNav" : 0,
         "theTailName" : "Portal"},
        {"theHeadNav": 0,
         "theHeadType" : "Association",
         "theHeadMultiplicity":"*",
         "theHeadRole":"",
         "theTailRole" : "",
         "theTailMultiplicity" :"*",
         "theTailNav" : 0,
         "theTailName" : "SomeAsset"},
        {"theHeadNav": 0,
         "theHeadType" : "Association",
         "theHeadMultiplicity":"*",
         "theHeadRole":"",
         "theTailRole" : "",
         "theTailMultiplicity" :"*",
         "theTailNav" : 0,
         "theTailName" : "SomeOtherAsset"}
      ],
      "theProperties" : [
        {"name":"Confidentiality",
         "value":"Low",
         "rationale":"Clinical data is fully anonymised."},
        {"name":"Integrity",
         "value":"None",
         "rationale":"None"},
        {"name":"Availability",
         "value":"None",
         "rationale":"None"},
        {"name":"Accountability",
         "value":"None",
         "rationale":"None"},
        {"name":"Anonymity",
         "value":"None",
         "rationale":"None"},
        {"name":"Pseudonymity",
         "value":"None",
         "rationale":"None"},
        {"name":"Unlinkability",
         "value":"None",
         "rationale":"None"},
        {"name":"Unobservability",
         "value":"None",
         "rationale":"None"}
      ]
    }
  ]
},
assets : [
  {theName: 'Corporate Network',theType: 'Systems'},
  {theName: 'Diary Entry',theType: 'Information'},
  {theName: 'Enterprise SCADA Network',theType: 'Systems'}
],
attacker : {
  theName : 'Carol',
  theImage : 'Carol.jpg',
  theDescription : 'Carol is a freelance journalist working in the South East of England.  Having heard stories about data theft, she is currently investigating a number of e-Science projects, including NeuroGrid, to see if she can find a story.',
  theTags : [],
  theEnvironmentProperties : [
    {theEnvironmentName : 'Psychosis',
     theRoles : ['Social Engineer'],
     theMotives : ["Headlines/press"],
     theCapabilities : [{name: 'Resources/Funding', value: 'Low'}]}
  ]
},
domainproperty : {
  theName : "Secure data analysis",
  theType : "Hypothesis",
  theOriginator : "Shamal Faily",
  theDescription : "We assume that the process of analysing data once it has been uploaded to NeuroGrid is secure."
},
environment : {
  theName : "Default",
  theShortCode : "DEF",
  theDescription : "Default environment",
  theEnvironments : []
},
requirement : {
  theName : "Anonymisation guidelines",
  theReference : "Clinical Data",
  theLabel : "1",
  theType : "Functional",
  thePriority : "1",
  theDescription : "Anonymisation guidelines shall comply with the MRC guidelines for secure data handling and anonymisation",
  theRationale : "None",
  theFitCriterion : "None",
  theOriginator : "Interview data"
},
role : {
  theName : 'Data Consumer',
  theType : 'Stakeholder',
  theShortCode : 'DCON',
  theDescription : 'Uses NeuroGrid data'
}

}


export default testData;
