var MASTER_SCHEDULE_CONST = 35;
 
var locations =  [
    
    {
      "@odata.etag": "W/\"1482859\"",
      "hub_centername": "Bel Air Learning Center",
      "hub_centerid": "b97bc0df-a334-e711-80ed-c4346bacfbbc",
      "hub_centertype@OData.Community.Display.V1.FormattedValue": "Center",
      "hub_centertype": true
    },
    {
      "@odata.etag": "W/\"1476918\"",
      "hub_centername": "CD5, LLC",
      "hub_centerid": "e9cfb78f-9052-e711-80f1-c4346bad526c",
      "hub_centertype@OData.Community.Display.V1.FormattedValue": "Center",
      "hub_centertype": true
    },
    {
      "@odata.etag": "W/\"1472522\"",
      "hub_centername": "Timonium Learning Center",
      "hub_centerid": "5eb89403-a434-e711-80ed-c4346bacfbbc",
      "hub_centertype@OData.Community.Display.V1.FormattedValue": "Center",
      "hub_centertype": true
    }
  ];

  var staffAvailableList = [
      {
      "@odata.etag": "W/\"1497385\"",
      "hub_enddate@OData.Community.Display.V1.FormattedValue": "10/21/2017",
      "hub_enddate": "2017-10-21T00:00:00Z",
      "hub_saturday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_saturday": true,
      "hub_monday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_monday": false,
      "hub_fristarttime@OData.Community.Display.V1.FormattedValue": "9:00 AM",
      "hub_fristarttime": 540,
      "hub_friendtime@OData.Community.Display.V1.FormattedValue": "9:00 PM",
      "hub_friendtime": 1260,
      "hub_friday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_friday": true,
      "hub_thurendtime@OData.Community.Display.V1.FormattedValue": "5:00 PM",
      "hub_thurendtime": 1020,
      "hub_staffavailabilityid": "368ff4fb-3650-e711-80f1-c4346bacfbbc",
      "_hub_staffid_value@OData.Community.Display.V1.FormattedValue": "James",
      "_hub_staffid_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_staffid",
      "_hub_staffid_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_staff",
      "_hub_staffid_value": "60339fb2-d940-e711-80f0-c4346bad526z",
      "hub_wedstarttime@OData.Community.Display.V1.FormattedValue": "9:00 AM",
      "hub_wedstarttime": 540,
      "hub_wedendtime@OData.Community.Display.V1.FormattedValue": "9:00 PM",
      "hub_wedendtime": 1260,
      "hub_wedday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_wednesday": true,
      "hub_satendtime@OData.Community.Display.V1.FormattedValue": "6:30 PM",
      "hub_satendtime": 1110,
      "hub_thursday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_thursday": true,
      "hub_tuesday@OData.Community.Display.V1.FormattedValue": "No",
      "hub_tuesday": false,
      "hub_thurstarttime@OData.Community.Display.V1.FormattedValue": "10:00 AM",
      "hub_thurstarttime": 600,
      "hub_startdate@OData.Community.Display.V1.FormattedValue": "9/20/2017",
      "hub_startdate": "2017-06-13T00:00:00Z",
      "hub_satstarttime@OData.Community.Display.V1.FormattedValue": "9:30 AM",
      "hub_satstarttime": 570,
      "astaff_x002e_hub_center@OData.Community.Display.V1.FormattedValue": "Bel Air Learning Center",
      "astaff_x002e_hub_center": "b97bc0df-a334-e711-80ed-c4346bacfbbc",
      "astaff_x002e_hub_science@OData.Community.Display.V1.FormattedValue": "No",
      "astaff_x002e_hub_science": false,
      "astaff_x002e_hub_reading@OData.Community.Display.V1.FormattedValue": "Yes",
      "astaff_x002e_hub_reading": true,
      "astaff_x002e_hub_certifications": "Robotics Certification ",
      "astaff_x002e_hub_writing@OData.Community.Display.V1.FormattedValue": "No",
      "astaff_x002e_hub_writing": false,
      "astaff_x002e_hub_math@OData.Community.Display.V1.FormattedValue": "Yes",
      "astaff_x002e_hub_math": true,
      "astaff_x002e_hub_robotics@OData.Community.Display.V1.FormattedValue": "Yes",
      "astaff_x002e_hub_robotics": true
    },
    {
      "@odata.etag": "W/\"1722796\"",
      "hub_saturday@OData.Community.Display.V1.FormattedValue": "No",
      "hub_saturday": false,
      "hub_monday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_monday": false,
      "hub_fristarttime@OData.Community.Display.V1.FormattedValue": "9:00 AM",
      "hub_fristarttime": 540,
      "hub_friendtime@OData.Community.Display.V1.FormattedValue": "4:00 PM",
      "hub_friendtime": 960,
      "hub_friday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_friday": true,
      "hub_staffavailabilityid": "bf8ed62c-0a67-e711-80f2-c4346bad526c",
      "_hub_staffid_value@OData.Community.Display.V1.FormattedValue": "Simon",
      "_hub_staffid_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_staffid",
      "_hub_staffid_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_staff",
      "_hub_staffid_value": "7ea9ed74-2f66-e711-80f2-c4346bacfbbc",
      "hub_wedstarttime@OData.Community.Display.V1.FormattedValue": "9:00 AM",
      "hub_wedstarttime": 540,
      "hub_wedendtime@OData.Community.Display.V1.FormattedValue": "9:00 PM",
      "hub_wedendtime": 1260,
      "hub_wedday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_wednesday": true,
      "hub_thursday@OData.Community.Display.V1.FormattedValue": "No",
      "hub_thursday": false,
      "hub_tuesday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_tuesday": true,
      "hub_startdate@OData.Community.Display.V1.FormattedValue": "9/20/2017",
      "hub_startdate": "2017-09-12T00:00:00Z",
      "hub_tuestarttime@OData.Community.Display.V1.FormattedValue": "7:00 AM",
      "hub_tuestarttime": 420,
      "hub_tueendtime@OData.Community.Display.V1.FormattedValue": "2:00 PM",
      "hub_tueendtime": 840,
      "astaff_x002e_hub_center@OData.Community.Display.V1.FormattedValue": "Bel Air Learning Center",
      "astaff_x002e_hub_center": "b97bc0df-a334-e711-80ed-c4346bacfbbc",
      "astaff_x002e_hub_science@OData.Community.Display.V1.FormattedValue": "Yes",
      "astaff_x002e_hub_science": true,
      "astaff_x002e_hub_reading@OData.Community.Display.V1.FormattedValue": "Yes",
      "astaff_x002e_hub_reading": true,
      "astaff_x002e_hub_writing@OData.Community.Display.V1.FormattedValue": "Yes",
      "astaff_x002e_hub_writing": true,
      "astaff_x002e_hub_math@OData.Community.Display.V1.FormattedValue": "Yes",
      "astaff_x002e_hub_math": true,
      "astaff_x002e_hub_robotics@OData.Community.Display.V1.FormattedValue": "No",
      "astaff_x002e_hub_robotics": false
    },
    {
      "@odata.etag": "W/\"1722798\"",
      "hub_saturday@OData.Community.Display.V1.FormattedValue": "No",
      "hub_saturday": false,
      "hub_monday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_monday": true,
      "hub_monstarttime@OData.Community.Display.V1.FormattedValue": "10:00 AM",
      "hub_monstarttime": 600,
      "hub_monendtime@OData.Community.Display.V1.FormattedValue": "7:30 PM",
      "hub_monendtime": 1170,
      "hub_wednesday@OData.Community.Display.V1.FormattedValue": "No",
      "hub_wednesday": false,
      "hub_thurendtime@OData.Community.Display.V1.FormattedValue": "11:00 AM",
      "hub_thurendtime": 660,
      "hub_staffavailabilityid": "6a6dd74e-0a67-e711-80f2-c4346bad526c",
      "_hub_staffid_value@OData.Community.Display.V1.FormattedValue": "Donna",
      "_hub_staffid_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_staffid",
      "_hub_staffid_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_staff",
      "_hub_staffid_value": "5aea3143-2f66-e711-80f2-c4346bacfbbc",
      "hub_wedstarttime@OData.Community.Display.V1.FormattedValue": "9:00 AM",
      "hub_wedstarttime": 540,
      "hub_wedendtime@OData.Community.Display.V1.FormattedValue": "9:00 PM",
      "hub_wedendtime": 1260,
      "hub_wedday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_wednesday": true,
      "hub_thursday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_thursday": true,
      "hub_tuesday@OData.Community.Display.V1.FormattedValue": "Yes",
      "hub_tuesday": true,
      "hub_thurstarttime@OData.Community.Display.V1.FormattedValue": "7:00 AM",
      "hub_thurstarttime": 420,
      "hub_startdate@OData.Community.Display.V1.FormattedValue": "9/20/2017",
      "hub_startdate": "2017-09-12T00:00:00Z",
      "hub_tuestarttime@OData.Community.Display.V1.FormattedValue": "9:30 AM",
      "hub_tuestarttime": 570,
      "hub_tueendtime@OData.Community.Display.V1.FormattedValue": "4:00 PM",
      "hub_tueendtime": 960,
      "astaff_x002e_hub_center@OData.Community.Display.V1.FormattedValue": "Bel Air Learning Center",
      "astaff_x002e_hub_center": "b97bc0df-a334-e711-80ed-c4346bacfbbc",
      "astaff_x002e_hub_science@OData.Community.Display.V1.FormattedValue": "Yes",
      "astaff_x002e_hub_science": true,
      "astaff_x002e_hub_reading@OData.Community.Display.V1.FormattedValue": "Yes",
      "astaff_x002e_hub_reading": true,
      "astaff_x002e_hub_writing@OData.Community.Display.V1.FormattedValue": "Yes",
      "astaff_x002e_hub_writing": true,
      "astaff_x002e_hub_math@OData.Community.Display.V1.FormattedValue": "Yes",
      "astaff_x002e_hub_math": true,
      "astaff_x002e_hub_robotics@OData.Community.Display.V1.FormattedValue": "No",
      "astaff_x002e_hub_robotics": false
    }
  ];



function Data(){

  this.getLocation = function(){
    return locations;
  }

  this.getResources = function(id){
    return resources;
  }

  this.getStaffAvailable = function(locationId,startDate,endDate){
    return staffAvailableList;
  }

}



