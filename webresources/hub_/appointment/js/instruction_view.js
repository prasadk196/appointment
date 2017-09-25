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

  var appointmentType = [
    {
      type:0,
      name:"Instructional",
      borderColor:"red",
      backgroundColor:"red",
      display:"customer"
    },
    {
      type:1,
      name:"Center Visit",
      borderColor:"#7bc143",
      backgroundColor:"#dff0d5",
      display:"customer"
    },
    {
      type:2,
      name:"Practice Test",
      borderColor:"#9acaea",
      backgroundColor:"#ebf5fb",
      display:"student"
    },
    {
      type:3,
      name:"School Visit",
      borderColor:"red",
      backgroundColor:"red",
      display:"customer"
    },
    {
      type:4,
      name:"Welcome Conference",
      borderColor:"#7bc143",
      backgroundColor:"#dff0d5",
      display:"customer"
    },
    {
      type:5,
      name:"Enrollment Conference",
      borderColor:"#7bc143",
      backgroundColor:"#dff0d5",
      display:"customer"
    },
    {
      type:6,
      name:"Initial Assessment",
      borderColor:"#9acaea",
      backgroundColor:"#ebf5fb",
      display:"student"
    },
    {
      type:7,
      name:"Progress Assessment",
      borderColor:"#9acaea",
      backgroundColor:"#ebf5fb",
      display:"student"
    },
    {
      type:8,
      name:"Ongoing Conference",
      borderColor:"#eacc82",
      backgroundColor:"#fcf7db",
      display:"customer"
    },
    {
      type:9,
      name:"Care Call",
      borderColor:"red",
      backgroundColor:"red",
      display:"customer"
    },
    {
      type:10,
      name:"Event",
      borderColor:"red",
      backgroundColor:"red",
      display:"customer"
    }
  ];

  var staffAvailableList = [{
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
      "_hub_staffid_value@OData.Community.Display.V1.FormattedValue": "John Smith",
      "_hub_staffid_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_staffid",
      "_hub_staffid_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_staff",
      "_hub_staffid_value": "5886bcbd-ab77-e711-80f3-c4346bad526c",
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


var appointmentHours = [
  
  {
    "@odata.etag": "W/\"3449581\"",
    "hub_starttime@OData.Community.Display.V1.FormattedValue": "10:00 AM",
    "hub_starttime": 480,
    "hub_days@OData.Community.Display.V1.FormattedValue": "Monday",
    "hub_days": 1,
    "hub_endtime@OData.Community.Display.V1.FormattedValue": "11:00 AM",
    "hub_endtime": 540,
    "hub_timingsid": "246925eb-cd87-e711-80f6-c4346bacfbbc",
    "hub_effectivestartdate@OData.Community.Display.V1.FormattedValue": "9/25/2017",
    "hub_effectivestartdate": "2017-09-25",
    "aworkhours_x002e_hub_type@OData.Community.Display.V1.FormattedValue": "Welcome Conference",
    "aworkhours_x002e_hub_type": 4,
    "aworkhours_x002e_hub_capacity@OData.Community.Display.V1.FormattedValue": "2",
    "aworkhours_x002e_hub_capacity": 2
  },
  {
    "@odata.etag": "W/\"3713844\"",
    "hub_starttime@OData.Community.Display.V1.FormattedValue": "11:00 AM",
    "hub_starttime": 480,
    "hub_days@OData.Community.Display.V1.FormattedValue": "Monday",
    "hub_days": 1,
    "hub_endtime@OData.Community.Display.V1.FormattedValue": "11:30 AM",
    "hub_endtime": 540,
    "hub_timingsid": "15ee0cb2-9497-e711-80f8-c4346bacfbbc",
    "hub_effectivestartdate@OData.Community.Display.V1.FormattedValue": "9/25/2017",
    "hub_effectivestartdate": "2017-09-25",
    "aworkhours_x002e_hub_type@OData.Community.Display.V1.FormattedValue": "Center Visit",
    "aworkhours_x002e_hub_type": 1,
    "aworkhours_x002e_hub_capacity@OData.Community.Display.V1.FormattedValue": "10",
    "aworkhours_x002e_hub_capacity": 10
  },
  {
    "@odata.etag": "W/\"3716283\"",
    "hub_starttime@OData.Community.Display.V1.FormattedValue": "8:30 AM",
    "hub_starttime": 510,
    "hub_days@OData.Community.Display.V1.FormattedValue": "Monday",
    "hub_days": 1,
    "hub_endtime@OData.Community.Display.V1.FormattedValue": "9:30 AM",
    "hub_endtime": 570,
    "hub_timingsid": "ac27f285-a297-e711-80f8-c4346bacfbbc",
    "hub_effectivestartdate@OData.Community.Display.V1.FormattedValue": "9/25/2017",
    "hub_effectivestartdate": "2017-09-25",
    "aworkhours_x002e_hub_type@OData.Community.Display.V1.FormattedValue": "Practice Test",
    "aworkhours_x002e_hub_type": 2,
    "aworkhours_x002e_hub_capacity@OData.Community.Display.V1.FormattedValue": "3",
    "aworkhours_x002e_hub_capacity": 3
  },
  {
    "@odata.etag": "W/\"3828312\"",
    "hub_starttime@OData.Community.Display.V1.FormattedValue": "8:00 AM",
    "hub_starttime": 480,
    "hub_days@OData.Community.Display.V1.FormattedValue": "Monday",
    "hub_days": 1,
    "hub_endtime@OData.Community.Display.V1.FormattedValue": "9:00 AM",
    "hub_endtime": 540,
    "hub_timingsid": "b250a172-669f-e711-80f9-c4346badc680",
    "hub_effectivestartdate@OData.Community.Display.V1.FormattedValue": "9/25/2017",
    "hub_effectivestartdate": "2017-09-25",
    "hub_effectiveenddate@OData.Community.Display.V1.FormattedValue": "10/31/2017",
    "hub_effectiveenddate": "2017-10-31",
    "aworkhours_x002e_hub_type@OData.Community.Display.V1.FormattedValue": "Welcome Conference",
    "aworkhours_x002e_hub_type": 4,
    "aworkhours_x002e_hub_capacity@OData.Community.Display.V1.FormattedValue": "5",
    "aworkhours_x002e_hub_capacity": 5
  }
];

 
var appointment = [
  {
    "@odata.etag": "W/\"3711439\"",
    "activityid": "bdf15454-7997-e711-80f9-c4346badc680",
    "_hub_staff_value@OData.Community.Display.V1.FormattedValue": "John Smith",
    "_hub_staff_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_staff_Appointment",
    "_hub_staff_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_staff",
    "_hub_staff_value": "5886bcbd-ab77-e711-80f3-c4346bad526c",
    "statecode@OData.Community.Display.V1.FormattedValue": "Scheduled",
    "statecode": 3,
    "hub_endtime@OData.Community.Display.V1.FormattedValue": "9:00 AM",
    "hub_endtime": 540,
    "hub_end_date@OData.Community.Display.V1.FormattedValue": "9/25/2017",
    "hub_end_date": "2017-09-25",
    "_regardingobjectid_value@OData.Community.Display.V1.FormattedValue": "Diana Ken",
    "_regardingobjectid_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "regardingobjectid_account_appointment",
    "_regardingobjectid_value@Microsoft.Dynamics.CRM.lookuplogicalname": "account",
    "_regardingobjectid_value": "2e6891c5-e58e-e711-80f7-c4346bacfbbc",
    "_hub_student_value@OData.Community.Display.V1.FormattedValue": "Cathy Finn",
    "_hub_student_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_student_Appointment",
    "_hub_student_value@Microsoft.Dynamics.CRM.lookuplogicalname": "contact",
    "_hub_student_value": "a0b3ae12-e68e-e711-80f7-c4346bacfbbc",
    "hub_start_date@OData.Community.Display.V1.FormattedValue": "9/25/2017",
    "hub_start_date": "2017-09-25",
    "hub_fulldayappointment@OData.Community.Display.V1.FormattedValue": "No",
    "hub_fulldayappointment": false,
    "hub_type@OData.Community.Display.V1.FormattedValue": "Welcome Conference",
    "hub_type": 4,
    "_hub_location_value@OData.Community.Display.V1.FormattedValue": "Better Education, Inc.",
    "_hub_location_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_location_Appointment",
    "_hub_location_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_center",
    "_hub_location_value": "46ecf508-e26d-e711-80f2-c4346bacfbbc",
    "hub_appointmentstatus@OData.Community.Display.V1.FormattedValue": "Schedule",
    "hub_appointmentstatus": 0,
    "hub_starttime@OData.Community.Display.V1.FormattedValue": "8:00 AM",
    "hub_starttime": 480,
    "instancetypecode@OData.Community.Display.V1.FormattedValue": "Not Recurring",
    "instancetypecode": 0,
    "hub_outofofficeappointment@OData.Community.Display.V1.FormattedValue": "No",
    "hub_outofofficeappointment": false
  },
  {
    "@odata.etag": "W/\"3711475\"",
    "_hub_staff_value@OData.Community.Display.V1.FormattedValue": "Simon",
    "_hub_staff_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_staffid",
    "_hub_staff_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_staff",
    "_hub_staff_value": "7ea9ed74-2f66-e711-80f2-c4346bacfbbc",
    "statecode@OData.Community.Display.V1.FormattedValue": "Scheduled",
    "statecode": 3,
    "hub_endtime@OData.Community.Display.V1.FormattedValue": "10:00 AM",
    "hub_endtime": 600,
    "hub_end_date@OData.Community.Display.V1.FormattedValue": "9/25/2017",
    "hub_end_date": "2017-09-25",
    "_regardingobjectid_value@OData.Community.Display.V1.FormattedValue": "Kiran Angadi",
    "_regardingobjectid_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "regardingobjectid_account_appointment",
    "_regardingobjectid_value@Microsoft.Dynamics.CRM.lookuplogicalname": "account",
    "_regardingobjectid_value": "39eace39-9a8c-e711-80f6-c4346bacfbbc",
    "_hub_student_value@OData.Community.Display.V1.FormattedValue": "Vinod K",
    "_hub_student_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_student_Appointment",
    "_hub_student_value@Microsoft.Dynamics.CRM.lookuplogicalname": "contact",
    "_hub_student_value": "b49f3b66-9a8c-e711-80f6-c4346bacfbbc",
    "hub_start_date@OData.Community.Display.V1.FormattedValue": "9/25/2017",
    "hub_start_date": "2017-09-25",
    "hub_fulldayappointment@OData.Community.Display.V1.FormattedValue": "No",
    "hub_fulldayappointment": false,
    "hub_type@OData.Community.Display.V1.FormattedValue": "Welcome Conference",
    "hub_type": 4,
    "_hub_location_value@OData.Community.Display.V1.FormattedValue": "Better Education, Inc.",
    "_hub_location_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_location_Appointment",
    "_hub_location_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_center",
    "_hub_location_value": "46ecf508-e26d-e711-80f2-c4346bacfbbc",
    "hub_appointmentstatus@OData.Community.Display.V1.FormattedValue": "Schedule",
    "hub_appointmentstatus": 0,
    "hub_starttime@OData.Community.Display.V1.FormattedValue": "9:30 AM",
    "hub_starttime": 570,
    "instancetypecode@OData.Community.Display.V1.FormattedValue": "Not Recurring",
    "instancetypecode": 0,
    "hub_outofofficeappointment@OData.Community.Display.V1.FormattedValue": "No",
    "hub_outofofficeappointment": false
  },
  {
    "@odata.etag": "W/\"3711524\"",
    "statecode@OData.Community.Display.V1.FormattedValue": "Scheduled",
    "statecode": 3,
    "hub_endtime@OData.Community.Display.V1.FormattedValue": "12:00 PM",
    "hub_endtime": 720,
    "hub_end_date@OData.Community.Display.V1.FormattedValue": "9/25/2017",
    "hub_end_date": "2017-09-25",
    "_regardingobjectid_value@OData.Community.Display.V1.FormattedValue": "Prasad N",
    "_regardingobjectid_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "regardingobjectid_account_appointment",
    "_regardingobjectid_value@Microsoft.Dynamics.CRM.lookuplogicalname": "account",
    "_regardingobjectid_value": "39eace39-9a8c-e711-80f6-c4346bacfbbz",
    "_hub_student_value@OData.Community.Display.V1.FormattedValue": "Robin Son",
    "_hub_student_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_student_Appointment",
    "_hub_student_value@Microsoft.Dynamics.CRM.lookuplogicalname": "contact",
    "_hub_student_value": "56ae7707-4491-e711-80f7-c4346bacfbbc",
    "hub_start_date@OData.Community.Display.V1.FormattedValue": "9/25/2017",
    "hub_start_date": "2017-09-25",
    "hub_fulldayappointment@OData.Community.Display.V1.FormattedValue": "No",
    "hub_fulldayappointment": false,
    "hub_type@OData.Community.Display.V1.FormattedValue": "Practice Test",
    "hub_type": 2,
    "_hub_location_value@OData.Community.Display.V1.FormattedValue": "Better Education, Inc.",
    "_hub_location_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_location_Appointment",
    "_hub_location_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_center",
    "_hub_location_value": "46ecf508-e26d-e711-80f2-c4346bacfbbc",
    "hub_appointmentstatus@OData.Community.Display.V1.FormattedValue": "Schedule",
    "hub_appointmentstatus": 0,
    "hub_starttime@OData.Community.Display.V1.FormattedValue": "11:00 AM",
    "hub_starttime": 660,
    "instancetypecode@OData.Community.Display.V1.FormattedValue": "Not Recurring",
    "instancetypecode": 0,
    "hub_outofofficeappointment@OData.Community.Display.V1.FormattedValue": "No",
    "hub_outofofficeappointment": false,
    "_hub_pricelist_value@OData.Community.Display.V1.FormattedValue": "Practice Test -Better Edu",
    "_hub_pricelist_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_pricelist_Appointment",
    "_hub_pricelist_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_pricelist",
    "_hub_pricelist_value": "d28554ab-7a97-e711-80f9-c4346badc680",
    "_hub_diagnosticserviceid_value@OData.Community.Display.V1.FormattedValue": "Better education Practice Test",
    "_hub_diagnosticserviceid_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_DiagnosticServiceId_Appointment",
    "_hub_diagnosticserviceid_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_sch_diagnostic_service",
    "_hub_diagnosticserviceid_value": "4e607638-8494-e711-80f8-c4346bad526c"
  },
  {
    "@odata.etag": "W/\"3711815\"",
    "activityid": "286e8f68-7c97-e711-80f9-c4346badc680",
    "_hub_staff_value@OData.Community.Display.V1.FormattedValue": "Donna",
    "_hub_staff_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_staffid",
    "_hub_staff_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_staff",
    "_hub_staff_value": "7ea9ed74-2f66-e711-80f2-c4346bacfbbc",
    "statecode@OData.Community.Display.V1.FormattedValue": "Scheduled",
    "statecode": 3,
    "hub_endtime@OData.Community.Display.V1.FormattedValue": "10:30 AM",
    "hub_endtime": 630,
    "hub_end_date@OData.Community.Display.V1.FormattedValue": "9/25/2017",
    "hub_end_date": "2017-09-25",
    "_regardingobjectid_value@OData.Community.Display.V1.FormattedValue": "Kiran Angadi",
    "_regardingobjectid_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "regardingobjectid_account_appointment",
    "_regardingobjectid_value@Microsoft.Dynamics.CRM.lookuplogicalname": "account",
    "_regardingobjectid_value": "39eace39-9a8c-e711-80f6-c4346bacfbbc",
    "_hub_student_value@OData.Community.Display.V1.FormattedValue": "Abar",
    "_hub_student_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_student_Appointment",
    "_hub_student_value@Microsoft.Dynamics.CRM.lookuplogicalname": "contact",
    "_hub_student_value": "b49f3b66-9a8c-e711-80f6-c4346bacfaad",
    "hub_start_date@OData.Community.Display.V1.FormattedValue": "9/25/2017",
    "hub_start_date": "2017-09-25",
    "hub_fulldayappointment@OData.Community.Display.V1.FormattedValue": "No",
    "hub_fulldayappointment": false,
    "hub_type@OData.Community.Display.V1.FormattedValue": "Initial Assessment",
    "hub_type": 6,
    "_hub_location_value@OData.Community.Display.V1.FormattedValue": "Better Education, Inc.",
    "_hub_location_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_location_Appointment",
    "_hub_location_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_center",
    "_hub_location_value": "46ecf508-e26d-e711-80f2-c4346bacfbbc",
    "hub_appointmentstatus@OData.Community.Display.V1.FormattedValue": "Schedule",
    "hub_appointmentstatus": 0,
    "hub_starttime@OData.Community.Display.V1.FormattedValue": "9:00 AM",
    "hub_starttime": 540,
    "instancetypecode@OData.Community.Display.V1.FormattedValue": "Not Recurring",
    "instancetypecode": 0,
    "hub_outofofficeappointment@OData.Community.Display.V1.FormattedValue": "No",
    "hub_outofofficeappointment": false,
    "_hub_pricelist_value@OData.Community.Display.V1.FormattedValue": "Grade 1-5 Price",
    "_hub_pricelist_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_pricelist_Appointment",
    "_hub_pricelist_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_pricelist",
    "_hub_pricelist_value": "3c3d23b5-0988-e711-80f7-c4346badc680",
    "_hub_diagnosticserviceid_value@OData.Community.Display.V1.FormattedValue": "Initial Assessment Appointment",
    "_hub_diagnosticserviceid_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "hub_DiagnosticServiceId_Appointment",
    "_hub_diagnosticserviceid_value@Microsoft.Dynamics.CRM.lookuplogicalname": "hub_sch_diagnostic_service",
    "_hub_diagnosticserviceid_value": "c938d984-0988-e711-80f7-c4346badc680"
  },
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

  this.getAppointment = function(locationId){
    return appointment;
  }

  this.getAppointmentHours = function(locationId,startDate,endDate, isInstruction){
    return appointmentHours;
  }

  this.getAppointmentType = function(){
    return appointmentType;
  }
}



