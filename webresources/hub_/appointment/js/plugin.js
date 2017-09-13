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
    		// wjQuery(".loading").show();
    		sylvanAppointment.locationId = locationId;
    		if(fetchData){
    			var convertedStaffList = sylvanAppointment.formatObjects(data.getStaffAvailable(locationId), "staffList");
                if(sylvanAppointment.appointment == undefined || sylvanAppointment.appointment.fullCalendar('getView').name == 'resourceDay'){
                	sylvanAppointment.populateStaff(convertedStaffList, fetchData);
	            }else{
	                sylvanAppointment.staffList = [];
	                var firstClm = true;
	                for (var i = 0; i < convertedStaffList.length; i++) {
	                	if(firstClm){
	                		sylvanAppointment.staffList.push({
		                        name: "Unasigned",
		                        id:"unasignedId",
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
    	fetchResources(locationId, true);
    }, 500);

}, 500);


function SylvanAppointment(){
	this.staffList = [];
    this.appointment = undefined;
    this.locationId = "";
    this.filters = [];

    this.formatObjects = function(args, label){
    	var self = this;
    	var tempList = [];
    	args = args == null ? [] : args; 
    	if(label == "staffList"){
    		var firstColm = true;
    		var obj = [];
    		wjQuery.each(args, function(index, staffObj) {
    			var availableList = [];
    			if(firstColm){
            		obj.push({
                        id:"unasignedId",
                        name: "Unasigned",
                    });	
                    firstColm = false;
            	}
            	obj.push({
                    id: staffObj["_hub_staffid_value"],
                    name:staffObj["_hub_staffid_value@OData.Community.Display.V1.FormattedValue"],
                });
    		});
    		tempList = obj;
    	}
    	return tempList;
    }

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
    	var self = this;
        var currentCalendarDate;
        if (self.appointment != undefined) {
            currentCalendarDate = self.appointment.fullCalendar('getDate');
        }

        self.staffList = args;
        self.loadCalendar(currentCalendarDate);
    }

    this.loadCalendar = function (args) {
        var self = this;

        // assign filter object to local scope filter to avoid this conflict
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
            // allDaySlot:false,
            droppable: true,
            drop: function (date, allDay, ev, ui, resource) {
                self.createEventOnDrop(self, date, allDay, ev, ui, resource, this);
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
                // self.renderWeekModal(calEvent, jsEvent, view);
            },
            editable: false,
            resources: this.staffList,
            // events: this.eventList,
            windowResize: function (view) {
                // self.appointment.fullCalendar('option', 'height', window.innerHeight - 60);
            }
        };

        if (args != undefined) {
            this.calendarOptions.year = args.getFullYear();
            this.calendarOptions.month = args.getMonth();
            this.calendarOptions.date = args.getDate();
        }
        this.appointment = wjQuery('#appointment').fullCalendar(this.calendarOptions);
        this.loadMasterInformation();
    }

    this.loadMasterInformation = function () {
        var self = this;
        var checkedList = [];
        var currentCalendarDate = self.appointment.fullCalendar('getDate');
        wjQuery('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
        if (moment(currentCalendarDate).format('MM/DD/YYYY') == moment(new Date()).format('MM/DD/YYYY')) {
            wjQuery('.headerDate').addClass('today');
        }
        else {
            wjQuery('.headerDate').removeClass('today');
        }
        if (wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').length) {
            var dayOfWeek = moment(currentCalendarDate).format('dddd');
            var dayofMonth = moment(currentCalendarDate).format('M/D');
            wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').css('text-align', 'center');
            wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek + " <br/> " + dayofMonth);
        }

        if (wjQuery('.filter-section').length == 0){
	        wjQuery(".fc-agenda-divider.fc-widget-header").after("<div class='filter-section'></div>");
	        self.buildFilterBody();
	        self.filterSlide(false);
	        wjQuery('.filter-header').on('click', function () {
	            var id = wjQuery(this).parent().attr('id');
	            var flag = wjQuery("#" + id).hasClass("open");
	            if (flag) {
	                wjQuery(this).parent().children('.option-header-container').remove();
	                wjQuery('#' + id).removeClass('open');
	                wjQuery("#" + id).find('.filter-nav-icon').removeClass('open');
	            }
	            else {
	                var indices = id.split('_');
	                var index = indices[1];
	                for (var i = 0; i < self.filters[index].length; i++) {
	                    if (self.filters[index][i].radio) {
	                        wjQuery('#' + id).append('<div class="option_' + self.filters[index][i].id + ' option-header-container">' +
	                        '<label class="cursor option-title">' +
	                            '<input type="radio" class="filterCheckBox" name="' + index + '" value="' + self.filters[index][i].id + '">' + self.filters[index][i].name +
	                        '</label>' +
	                    '</div>');
	                    } else {
	                        if (index == "subject") {
	                            wjQuery('#' + id).append('<div class="option_' + self.filters[index][i].id + ' option-header-container">' +
	                               '<label class="cursor option-title">' +
	                                   '<input type="checkbox" class="filterCheckBox" name="' + index + '" value="' + self.filters[index][i].name + '">' + self.filters[index][i].name +
	                               '</label>' +
	                           '</div>');
	                        } else {
	                            wjQuery('#' + id).append('<div class="option_' + self.filters[index][i].id + ' option-header-container">' +
	                              '<label class="cursor option-title">' +
	                                  '<input type="checkbox" class="filterCheckBox" name="' + index + '" value="' + self.filters[index][i].id + '">' + self.filters[index][i].name +
	                              '</label>' +
	                          '</div>');
	                        }
	                    }

	                }
	                wjQuery('#' + id).addClass('open');
	                wjQuery("#" + id).find('.filter-nav-icon').addClass('open');

	                // wjQuery(".filterCheckBox").click(function () {
	                //     wjQuery(".loading").show();
	                //     if (wjQuery(this).is(':checked')) {
	                //         self.eventList = [];
	                //         self.calendar.fullCalendar('removeEvents');
	                //         self.calendar.fullCalendar('removeEventSource');
	                //         var index = checkedList.map(function (y) {
	                //             return y;
	                //         }).indexOf(wjQuery(this).val());
	                //         if (index == -1) {
	                //             checkedList.push(wjQuery(this).val());
	                //         }
	                //         self.calendar.fullCalendar('refetchEvents');
	                //     } else {
	                //         self.eventList = [];
	                //         self.calendar.fullCalendar('removeEvents');
	                //         self.calendar.fullCalendar('removeEventSource');
	                //         var index = checkedList.map(function (y) {
	                //             return y;
	                //         }).indexOf(wjQuery(this).val());
	                //         if (index != -1) {
	                //             checkedList.splice(checkedList.indexOf(wjQuery(this).val()), 1);
	                //         }
	                //         self.calendar.fullCalendar('refetchEvents');
	                //     }
	                // });
	            }
	        });
        }

    }

    this.buildFilterBody = function () {
    	var self = this;
        wjQuery('.filter-section').html('<div class="filter-container"></div>' +
            '<div class="filter-label-outer">' +
                '<span class="filter-slide-icon"></span>' +
                '<div class="filter-label">FILTERS' +
                '</div>' +
            '</div>');
        wjQuery.each(self.filters, function (filterKey, filterValue) {
            wjQuery('.filter-container').append(
                '<div id="filter_' + filterKey + '" class="filter-header-container">' +
                    '<div class="filter-header cursor">' +
                        '<div class="filter-title">' + filterKey + '</div>' +
                        '<span class="filter-nav-icon"></span>' +
                    '</div>' +
                '</div>'
            );
        });
        wjQuery('.filter-section').css('height', wjQuery('.filter-section').next().height() - 2 + "px");
        wjQuery('.filter-container').css({ 'height': wjQuery('.filter-section').next().height() - 2 + "px", "overflow-y": "auto" });
    }

    this.filterSlide = function (expanded) {
        wjQuery('.filter-label-outer').click(function () {
            wjQuery('.filter-section').animate(expanded ? { 'marginLeft': '-275px' } : { marginLeft: '0px' }, 500);
            expanded ? wjQuery('.filter-slide-icon').removeClass('open') : wjQuery('.filter-slide-icon').addClass('open');
            expanded = !expanded;
        });
    }

}

