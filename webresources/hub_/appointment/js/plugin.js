var data = new Data();
var DEFAULT_START_TIME = "8:00 AM";
var DEFAULT_END_TIME = "9:00 AM";
var currentCalendarDate = moment(new Date()).format("YYYY-MM-DD");

setTimeout(function () {
	var sylvanAppointment = new SylvanAppointment();
	var locationId = sylvanAppointment.populateLocation(data.getLocation());
	wjQuery('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
    wjQuery('#datepicker').datepicker('destroy');
    wjQuery('#datepicker').datepicker({
        buttonImage: "/webresources/hub_/calendar/images/calendar.png",
        buttonImageOnly: true,
        changeMonth: true,
        changeYear: true,
        showOn: 'button',
        onSelect: function (date) {
            wjQuery(".loading").show();
            sylvanAppointment.dateFromCalendar(date, locationId);
            wjQuery('#datepicker').hide();
        }
    });

    wjQuery(".loc-dropdown .dropdown-menu").on('click', 'li a', function () {
        if (wjQuery(".loc-dropdown .selectedCenter").val() != wjQuery(this).attr('value-id')) {
            wjQuery(".loc-dropdown .selectedCenter").text(wjQuery(this).text());
            wjQuery(".loc-dropdown .selectedCenter").val(wjQuery(this).attr('value-id'));
            locationId = wjQuery(this).attr('value-id');
            return fetchResources(locationId, true);
        }
    });

    setTimeout(function () {
    	function fetchResources(locationId, fetchData) {
    		wjQuery(".loading").show();
    		sylvanAppointment.locationId = locationId;
    		var staffList = [];
    		if(fetchData){
    			var tempStaffList = data.getStaffAvailable(locationId);
                staffList = tempStaffList == null ? [] : tempStaffList;
                if(staffList.length){
	                if(sylvanAppointment.appointment == undefined || sylvanAppointment.appointment.fullCalendar('getView').name == 'resourceDay'){
	                	sylvanAppointment.populateStaff(staffList, fetchData);
		            }else{
		                sylvanAppointment.staffList = [];
		                var firstClm = true;
		                for (var i = 0; i < staffList.length; i++) {
		                	if(firstClm){
		                		this.staffList.push({
			                        name: "Unasigned",
			                        id:"unasignedId",
			                        // capacity: staffData[i]["hub_capacity"]
			                    });	
			                    firstClm = false;
		                	}
				                sylvanAppointment.staffList.push({
		                        name: staffData[i]['_hub_staffid_value@OData.Community.Display.V1.FormattedValue'],
                        		id: staffData[i]._hub_staffid_value,
		                    });
		                }
		            }
                }

    		}

    	}
    	fetchResources(locationId, true);
    }, 500);

}, 500);


function SylvanAppointment(){
	this.staffList = [];
    this.appointment = undefined;
    this.locationId = "";

	this.populateLocation = function (args) {
        if (args != null) {
            var locationData = [];
            args[0][0] == undefined ? locationData = args : locationData = args[0];
            var locationList = [];
            for (var i = 0; i < locationData.length; i++) {
                if (!i) {
                    wjQuery(".loc-dropdown .selectedCenter").text(locationData[i].hub_centername);
                    wjQuery(".loc-dropdown .selectedCenter").val(locationData[i].hub_centerid);
                }
                locationList.push('<li><a tabindex="-1" value-id=' + locationData[i].hub_centerid + ' href="javascript:void(0)">' + locationData[i].hub_centername + '</a></li>');
            }
            wjQuery(".loc-dropdown ul").html(locationList);
            return locationData[0].hub_centerid;
        }
    }

    this.dateFromCalendar = function (date, locationId) {
        var self = this;
        var displayDate = new Date(date);
        self.appointment.fullCalendar('gotoDate', displayDate);
        wjQuery('.headerDate').text(date);
        if (moment(date).format('MM/DD/YYYY') == moment(new Date()).format('MM/DD/YYYY')) {
            wjQuery('.headerDate').addClass('today');
        }
        else {
            wjQuery('.headerDate').removeClass('today');
        }
        var dayOfWeek = moment(date).format('dddd');
        var dayofMonth = moment(date).format('M/D');
        wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek + " <br/> " + dayofMonth);
        // self.clearEvents();
        var currentCalendarDate = moment(date).format("YYYY-MM-DD");
        self.refreshCalendarEvent(this.locationId, true);
    }

    this.populateStaff = function (args, isFetch) {
        var currentCalendarDate;
        if (this.appointment != undefined) {
            currentCalendarDate = this.appointment.fullCalendar('getDate');
        }
        // this.clearAll();
        if (args != null) {
            var staffData = [];
            if (args[0] != undefined) {
                args[0][0] == undefined ? staffData = args : staffData = args[0];
                this.staffList = [];
                var firstClm = true;
                for (var i = 0; i < staffData.length; i++) {
                	if(firstClm){
                		this.staffList.push({
	                        name: "Unasigned",
	                        id:"unasignedId",
	                        // capacity: staffData[i]["hub_capacity"]
	                    });	
	                    firstClm = false;
                	}
                    this.staffList.push({
                        name: staffData[i]['_hub_staffid_value@OData.Community.Display.V1.FormattedValue'],
                        id: staffData[i]._hub_staffid_value,
                        // capacity: staffData[i]["hub_capacity"]
                    });
                }
                this.loadCalendar(currentCalendarDate);
            }
        }
    }

    this.loadCalendar = function (args) {

        // assign filter object to local scope filter to avoid this conflict
        var filters = this.filters;
        var t = this;
        var self = this;
        var date = new Date();

        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        this.calendarOptions = {
            header: false,
            defaultView: 'resourceDay',
            disableResizing: true,
            minTime: 8,
            maxTime: 20,
            allDayText: '',
            allDaySlot:false,
            droppable: true,
            drop: function (date, allDay, ev, ui, resource) {
                t.createEventOnDrop(t, date, allDay, ev, ui, resource, this);
            },
            handleWindowResize: true,
            height: window.innerHeight - 60,
            slotMinutes: 60,
            selectable: false,
            slotEventOverlap: true,
            selectHelper: true,
            select: function (start, end, allDay, event, resourceId) {
                if (title) {
                    console.log("@@ adding event " + title + ", start " + start + ", end " + end + ", allDay " + allDay + ", resource " + resourceId);
                    this.appointment.fullCalendar('renderEvent',
                    {
                        title: title,
                        start: start,
                        end: end,
                        allDay: allDay,
                        resourceId: resourceId
                    },
                    true // make the event "stick"
                );
                }
                this.appointment.fullCalendar('unselect');
            },
            eventClick: function(calEvent, jsEvent, view) {
                self.renderWeekModal(calEvent, jsEvent, view);
            },
            editable: false,
            resources: this.staffList,
            // events: this.eventList,
            windowResize: function (view) {
                self.appointment.fullCalendar('option', 'height', window.innerHeight - 60);
            }
        };

        if (args != undefined) {
            this.calendarOptions.year = args.getFullYear();
            this.calendarOptions.month = args.getMonth();
            this.calendarOptions.date = args.getDate();
        }
        this.appointment = wjQuery('#appointment').fullCalendar(this.calendarOptions);
        // this.loadMasterInformation();

        wjQuery("#addResource").click(function () {
            var newStaff = {
                name: "Resource " + (this.staffList.length + 1),
                id: "resource" + (this.staffList.length + 1)
            };
            this.staffList.push(newStaff);
            this.appointment.fullCalendar("addResource", [newStaff]);
        });

        // From date for new appointment
        wjQuery(".from-datepicker-input").datepicker();
        var selectedFromDate;
        wjQuery(".from-datepicker-input").on("change", function () {
            selectedFromDate = wjQuery(this).val();
        });

        wjQuery(".from-up-arrow").on("click", function () {
            var date = new Date(selectedFromDate);
            date.setDate(date.getDate() + 1);
            selectedFromDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            wjQuery(".from-datepicker-input").val(selectedFromDate);
        });

        wjQuery(".from-down-arrow").on("click", function () {
            var date = new Date(selectedFromDate);
            date.setDate(date.getDate() - 1);
            selectedFromDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            wjQuery(".from-datepicker-input").val(selectedFromDate);
        });

        // To date for new appointment
        wjQuery(".to-datepicker-input").datepicker();
        var selectedToDate;
        wjQuery(".to-datepicker-input").on("change", function () {
            selectedToDate = wjQuery(this).val();
        });

        wjQuery(".to-up-arrow").on("click", function () {
            var date = new Date(selectedFromDate);
            date.setDate(date.getDate() + 1);
            selectedToDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            wjQuery(".to-datepicker-input").val(selectedToDate);
        });

        wjQuery(".to-down-arrow").on("click", function () {
            var date = new Date(selectedToDate);
            date.setDate(date.getDate() - 1);
            selectedToDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            wjQuery(".to-datepicker-input").val(selectedToDate);
        });

        wjQuery("#save").click(function () {
            // alert("success");
            var fromDate = wjQuery("#fromDate").val();
            var fromTime = wjQuery("#fromTime").val();
            var toDate = wjQuery("#toDate").val();
            var toTime = wjQuery("#toTime").val();
            var type = wjQuery("#type").val();
            var capacity = wjQuery("#capacity").val();
            var staff = wjQuery("#staff").val();
            var location = wjQuery("#location").val();
            var notes = wjQuery("#notes").val();
        });
    }

}


// wjQuery(document).ready(function() {
// 	var date = new Date();
// 	var d = date.getDate();
// 	var m = date.getMonth();
// 	var y = date.getFullYear();
	
// 	wjQuery('#appointment').fullCalendar({
// 		editable: true,
// 		header:false,

// 		events: [
// 			{
// 				title: 'All Day Event',
// 				start: new Date(y, m, 1)
// 			},
// 			{
// 				title: 'Long Event',
// 				start: new Date(y, m, d-5),
// 				end: new Date(y, m, d-2)
// 			},
// 			{
// 				id: 999,
// 				title: 'Repeating Event',
// 				start: new Date(y, m, d-3, 16, 0),
// 				allDay: false
// 			},
// 			{
// 				id: 999,
// 				title: 'Repeating Event',
// 				start: new Date(y, m, d+4, 16, 0),
// 				allDay: false
// 			},
// 			{
// 				title: 'Meeting',
// 				start: new Date(y, m, d, 10, 30),
// 				allDay: false
// 			},
// 			{
// 				title: 'Lunch',
// 				start: new Date(y, m, d, 12, 0),
// 				end: new Date(y, m, d, 14, 0),
// 				allDay: false
// 			},
// 			{
// 				title: 'Birthday Party',
// 				start: new Date(y, m, d+1, 19, 0),
// 				end: new Date(y, m, d+1, 22, 30),
// 				allDay: false
// 			},
// 			{
// 				title: 'Click for Google',
// 				start: new Date(y, m, 28),
// 				end: new Date(y, m, 29),
// 				url: 'http://google.com/'
// 			}
// 		]
// 	});
	
// });
