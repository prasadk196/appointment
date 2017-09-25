var data = new Data();
var DEFAULT_START_TIME = "8:00 AM";
var DEFAULT_END_TIME = "9:00 AM";
var currentCalendarDate = moment(new Date()).format("YYYY-MM-DD");

setTimeout(function () {
    var sylvanAppointment = new SylvanAppointment();
    var locationId = sylvanAppointment.populateLocation(data.getLocation());
    wjQuery('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
    
    setTimeout(function () {

        wjQuery(".loc-dropdown .dropdown-menu").on('click', 'li a', function () {
            if (wjQuery(".location-btn").val() != wjQuery(this).attr('value-id')) {
                wjQuery(".location-btn").text(wjQuery(this).text());
                wjQuery(".location-btn").val(wjQuery(this).attr('value-id'));
                locationId = wjQuery(this).attr('value-id');
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
                return fetchResources(locationId, true);
            }
        });

        var rtime;
        var timeout = false;
        var delta = 300;
        wjQuery(window).resize(function() {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(resizeend, delta);
            }
        });

        function resizeend() {
            if (new Date() - rtime < delta) {
                setTimeout(resizeend, delta);
            } else {
                timeout = false;
                fetchResources(locationId, true);
            }               
        }

        function fetchResources(locationId, fetchData) {
            wjQuery(".loading").show();
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
                                id:"unassignedId",
                                name: "Unassigned",
                            }); 
                            firstClm = false;
                        }
                        sylvanAppointment.staffList.push({
                            name: staffData[i]['_hub_staffid_value@OData.Community.Display.V1.FormattedValue'],
                            id: staffData[i]._hub_staffid_value,
                        });
                    }
                }
                if(sylvanAppointment.staffList.length){
                    sylvanAppointment.refreshCalendarEvent(locationId, true);
                    wjQuery('.nextBtn').off('click').on('click', function () {
                        wjQuery(".loading").show();
                        sylvanAppointment.next(locationId);
                    });

                    wjQuery('.prevBtn').off('click').on('click', function () {
                        wjQuery(".loading").show();
                        sylvanAppointment.prev(locationId);
                    });

                    wjQuery('#datepicker').datepicker({
                        buttonImage: "/webresources/hub_/calendar/images/calendar.png",
                        buttonImageOnly: true,
                        changeMonth: true,
                        changeYear: true,
                        showOn: 'button',
                        onSelect: function (date) {
                            wjQuery(".loading").show();
                            sylvanAppointment.clearEvents();
                            sylvanAppointment.dateFromCalendar(date, locationId);
                            wjQuery('#datepicker').hide();
                        }
                    });

                }else{
                    wjQuery(".loading").hide();
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
    this.appointmentList = [];
    this.eventList = [];
    this.appointmentHours = [];

    this.clearEvents = function () {
        var self = this;
        self.filters = new Object();
        self.eventList = [];
        self.staffList = [];
        self.appointmentList = [];
        self.appointmentHours = [];
        self.appointment.fullCalendar('removeEvents');
        self.appointment.fullCalendar('removeEventSource');
    }

    this.formatObjects = function(args, label){
        args = args == null ? [] : args; 
        var self = this;
        var tempList = [];
        if(label == "staffList"){
            tempList = [];
            var firstColm = true;
            wjQuery.each(args, function(index, staffObj) {
                var obj = [];
                var availableList = [];
                if(firstColm){
                    obj = {
                        id:"unassignedId",
                        name: "Unassigned",
                    };  
                    firstColm = false;
                    tempList.push(obj);
                }
                obj = {
                    id: staffObj["_hub_staffid_value"],
                    name:staffObj["_hub_staffid_value@OData.Community.Display.V1.FormattedValue"],
                    subjects: self.getStaffSubjects(staffObj),
                    availableList: self.getStaffAvailableDays(staffObj),
                    locationId: staffObj['astaff_x002e_hub_center'],
                };

                if(staffObj['hub_startdate'] != undefined){
                    obj['startDate'] = new Date(staffObj['hub_startdate']);
                }

                if(staffObj['hub_enddate'] != undefined){
                    obj['endDate'] = new Date(staffObj['hub_enddate']);
                }else{
                    // add present day as end date
                    obj['endDate'] = undefined ;
                }
                tempList.push(obj);
            });
        }else if(label == "appointmentList"){
            tempList = [];
            wjQuery.each(args, function(index, appointmentObj) {
                var startObj = new Date(appointmentObj['hub_start_date']+" "+appointmentObj['hub_starttime@OData.Community.Display.V1.FormattedValue']);
                var endObj = new Date(appointmentObj['hub_end_date']+" "+appointmentObj['hub_endtime@OData.Community.Display.V1.FormattedValue']);
                tempList.push({
                    type:appointmentObj['hub_type'],
                    typeValue:appointmentObj['hub_type@OData.Community.Display.V1.FormattedValue'],
                    staffId:appointmentObj['_hub_staff_value'],
                    staffValue:appointmentObj['_hub_staff_value@OData.Community.Display.V1.FormattedValue'],
                    startObj:startObj,
                    endObj:endObj,
                    locationId:appointmentObj['_hub_location_value'],
                    status:appointmentObj['hub_appointmentstatus'],
                    studentId:appointmentObj['_hub_student_value'],
                    studentName:appointmentObj['_hub_student_value@OData.Community.Display.V1.FormattedValue'],
                    parentId:appointmentObj['_regardingobjectid_value'],
                    parentName:appointmentObj['_regardingobjectid_value@OData.Community.Display.V1.FormattedValue'],
                });
            });
        }else if(label == "appointmentHours"){
            tempList = [];
            wjQuery.each(args, function(index, appointmentHour) {
                var startObj = new Date(appointmentHour['hub_effectivestartdate']+" "+appointmentHour['hub_starttime@OData.Community.Display.V1.FormattedValue']); 
                var endObj = new Date(appointmentHour['hub_effectivestartdate']+" "+appointmentHour['hub_endtime@OData.Community.Display.V1.FormattedValue']); 
                tempList.push({
                    type:appointmentHour['aworkhours_x002e_hub_type'],
                    typeValue:appointmentHour['aworkhours_x002e_hub_type@OData.Community.Display.V1.FormattedValue'],
                    startObj:startObj,
                    endObj:endObj,
                    capacity:appointmentHour['aworkhours_x002e_hub_capacity']
                });
            });
            this.appointmentHours = tempList;
        }
        return tempList;
    }

    this.getStaffSubjects = function (teacherObj) {
        var subjects = [];
        self = this;
        wjQuery.each(teacherObj, function (k, v) {
            if (k.indexOf("astaff_x002e_hub_") != -1 && typeof (v) == 'boolean' && v == true) {
                value = k.replace("astaff_x002e_hub_", "");
                subjects.push(value.toLowerCase());
            }
        });
        return subjects;
    }

    this.getStaffAvailableDays = function (teacherObj) {
        var avaialbeDaysList = {};
        self = this;
        wjQuery.each(teacherObj, function (k, v) {
            if(k.startsWith("hub_") &&  k.endsWith("day") && typeof (v) == 'boolean' && v == true){
                key = k.replace("hub_", "");
                if(key == "thursday"){
                    startHour = teacherObj["hub_"+key.substring(0, 4)+"starttime"];                    
                    endHour = teacherObj["hub_"+key.substring(0, 4)+"endtime"];                    
                    startTime = teacherObj["hub_"+key.substring(0, 4)+"starttime@OData.Community.Display.V1.FormattedValue"];
                    endTime = teacherObj["hub_"+key.substring(0, 4)+"endtime@OData.Community.Display.V1.FormattedValue"];
                    avaialbeDaysList[key] = {startTime: startTime, endTime: endTime, startHour:startHour, endHour:endHour};
                }else{
                    startHour = teacherObj["hub_"+key.substring(0, 3)+"starttime"];                    
                    endHour = teacherObj["hub_"+key.substring(0, 3)+"endtime"];                    
                    startTime = teacherObj["hub_"+key.substring(0, 3)+"starttime@OData.Community.Display.V1.FormattedValue"];
                    endTime = teacherObj["hub_"+key.substring(0, 3)+"endtime@OData.Community.Display.V1.FormattedValue"];
                    avaialbeDaysList[key] = {startTime: startTime, endTime: endTime, startHour:startHour, endHour:endHour};
                }
            }
        });
        return avaialbeDaysList;
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
        self.clearEvents();
        var currentCalendarDate = moment(date).format("YYYY-MM-DD");
        self.refreshCalendarEvent(this.locationId, true);
    }

    this.populateStaff = function (args, isFetch) {
        var self = this;
        var currentCalendarDate;
        if (self.appointment != undefined) {
            self.clearEvents();
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
            slotMinutes: 30,
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
            resources: self.staffList,
            events: self.eventList,
            windowResize: function (view) {
                // self.appointment.fullCalendar('option', 'height', window.innerHeight - 60);
            }
        };

        if (args != undefined) {
            this.calendarOptions.year = args.getFullYear();
            this.calendarOptions.month = args.getMonth();
            this.calendarOptions.date = args.getDate();
        }
        self.appointment = wjQuery('#appointment').fullCalendar(this.calendarOptions);
        self.loadMasterInformation();
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
                }
            });
        }
    }

    this.next = function (locationId) {
        this.appointment.fullCalendar('next');
        var currentCalendarDate = this.appointment.fullCalendar('getDate');
        wjQuery('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
        if (moment(currentCalendarDate).format('MM/DD/YYYY') == moment(new Date()).format('MM/DD/YYYY')) {
            wjQuery('.headerDate').addClass('today');
        }
        else {
            wjQuery('.headerDate').removeClass('today');
        }
        var currentView = this.appointment.fullCalendar('getView');
        if (currentView.name == 'resourceDay') {
            var dayOfWeek = moment(currentCalendarDate).format('dddd');
            var dayofMonth = moment(currentCalendarDate).format('M/D');
            wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek + " <br/> " + dayofMonth);
        }
        this.clearEvents();
        currentCalendarDate = moment(currentCalendarDate).format("YYYY-MM-DD");
        this.refreshCalendarEvent(this.locationId, true);
    }

    this.prev = function (locationId) {
        this.appointment.fullCalendar('prev');
        var currentCalendarDate = this.appointment.fullCalendar('getDate');
        wjQuery('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
        if (moment(currentCalendarDate).format('MM/DD/YYYY') == moment(new Date()).format('MM/DD/YYYY')) {
            wjQuery('.headerDate').addClass('today');
        }
        else {
            wjQuery('.headerDate').removeClass('today');
        }
        var currentView = this.appointment.fullCalendar('getView');
        if (currentView.name == 'resourceDay') {
            var dayOfWeek = moment(currentCalendarDate).format('dddd');
            var dayofMonth = moment(currentCalendarDate).format('M/D');
            wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek + " <br/> " + dayofMonth);
        }
        this.clearEvents();
        currentCalendarDate = moment(currentCalendarDate).format("YYYY-MM-DD");
        this.refreshCalendarEvent(this.locationId, true);
    }

    this.refreshCalendarEvent = function (locationId, isFetch) {
        var self = this;
        setTimeout(function () {
            var currentCalendarDate = self.appointment.fullCalendar('getDate');
            var currentView = self.appointment.fullCalendar('getView');
            // fetch master schedule data based on below flag
            var isFromMasterSchedule = self.findDataSource(currentCalendarDate,currentView);
            if (currentView.name == 'resourceDay') {
                startDate = endDate = moment(currentCalendarDate).format("YYYY-MM-DD");
                if(isFromMasterSchedule){
                    // master schedule data
                }else{
                    // actual data
                }
                var appointmentHours = data.getAppointmentHours(locationId,startDate,endDate, false);
                if (appointmentHours == null) {
                    appointmentHours = [];
                }
                self.populateAppointmentHours(self.formatObjects(appointmentHours, "appointmentHours"));
                self.appointmentList = (isFetch || self.appointmentList.length == 0) ? self.formatObjects(data.getAppointment(locationId), "appointmentList") : self.appointmentList;
                if (self.appointmentList == null) {
                    self.appointmentList = [];
                }
                self.populateAppointmentEvent(self.appointmentList);
            }
        }, 300);
    }

    this.findDataSource = function (currentCalendarDate,view) {
        var now = new Date();
        //constant from instruction view js
        now.setDate(now.getDate() + MASTER_SCHEDULE_CONST);
        if(view.name == 'resourceDay'){
            if (currentCalendarDate > now.getTime()) {
                return true;
            }
            return false;
        }
        else{
            if(view.end.getTime() > now.getTime()){
                return true;
            }
            return false;
        }
    }

    this.createEventOnDrop = function (self, date, allDay, ev, ui, resource, elm) {
        var type= wjQuery(elm).attr("type");
        var idLabel = "";
        //----- uniqIdArry has ----//
        // 0. student/parent Id
        // 1. start time
        // 2. staff id only for assigned type 
        var uniqIdArry = [];
        if(elm.hasAttribute("parentid")){
            uniqIdArry = wjQuery(elm).attr("parentid").split("_");
            idLabel = "parentId";
        }else if(elm.hasAttribute("studentid")){
            uniqIdArry = wjQuery(elm).attr("studentid").split("_");
            idLabel = "studentId";
        }

        if(type == "unassigned"){
            var index = -1;
            for(var i=0; i< self.appointmentList.length; i++){
                if(uniqIdArry[0] == self.appointmentList[i][idLabel] &&
                    self.appointmentList[i]["staffId"] == undefined && 
                    uniqIdArry[1] == self.appointmentList[i]['startObj'] ){
                    index = i;
                    break;
                }
            }
            if(index != -1){
                elm.remove();
                self.appointmentList[index]['staffId'] = resource.id;
                self.appointmentList[index]['staffValue'] = resource.name;
                self.appointmentList[index]['startObj'] = date;
                console.log(self.appointmentList[index]);
                self.appointment.fullCalendar( 'updateEvent', self.generateEventObject([self.appointmentList[index]], "appointment") )
            }
        }
    }

    this.getEventColor = function(eventType){
        var eventTypeList = data.getAppointmentType();
        for (var i = 0 ; i < eventTypeList.length; i++) {
            if(eventType == eventTypeList[i]["type"]){
                return eventTypeList[i];
                break;
            }
        }
    }

    this.generateEventObject = function(args, label){
        if(label == "appointment"){
           var appointmentEventList = [];
           wjQuery.each(args, function (index, appointmentObj) {
            var eventColorObj = self.getEventColor(appointmentObj["type"]);
            var eventObj = {
                start:appointmentObj['startObj'],
                end:appointmentObj['endObj'],
                allDay : false,
                type:appointmentObj['type'],
                borderColor:eventColorObj.borderColor,
                color:"#333",
                backgroundColor:eventColorObj.backgroundColor
            }

            if(appointmentObj['staffId'] == undefined){
                var parentId = appointmentObj['parentId']+"_"+appointmentObj['startObj'];
                var studentId = appointmentObj['studentId']+"_"+appointmentObj['startObj'];
                eventObj["id"] = appointmentObj['startObj']+"_"+"unassignedId";
                eventObj['resourceId'] = "unassignedId";
                if( eventColorObj.display == "student"){
                    eventObj['title'] = "<span class='draggable drag-student' type='unassigned' studentId='"+studentId+"' >"+appointmentObj['studentName']+"</span>";
                }else{
                    eventObj['title'] = "<span class='draggable drag-parent' type='unassigned' parentId='"+parentId+"' >"+appointmentObj['parentName']+"</span>";
                }
            }else{
                var parentId = appointmentObj['parentId']+"_"+appointmentObj['startObj']+"_"+appointmentObj['staffId'];
                var studentId = appointmentObj['studentId']+"_"+appointmentObj['startObj']+"_"+appointmentObj['staffId'];
                eventObj["id"] = appointmentObj['startObj']+"_"+appointmentObj["staffId"];
                eventObj['resourceId'] = appointmentObj['staffId'];
                if( eventColorObj.display == "student"){
                    eventObj['title'] = "<span class='draggable drag-student' type='assigned' studentId='"+studentId+"' >"+appointmentObj['studentName']+"</span>";
                }else{
                    eventObj['title'] = "<span class='draggable drag-parent' type='assigned' parentId='"+parentId+"' >"+appointmentObj['parentName']+"</span>";
                }
            }
            appointmentEventList.push(eventObj);
           }); 
           return appointmentEventList;
        }
    }

    this.updateEventObj = function (appointmentObj, populatedEvent){
        var self = this;
        var eventColorObj = self.getEventColor(appointmentObj["type"]);
        if( eventColorObj.display == "student"){
            populatedEvent.studentList.push({
                                            id:appointmentObj['studentId'], 
                                            name:appointmentObj['studentName']
                                            })
            populatedEvent.title += "<span class='draggable drag-student' type='unassigned' id='"+appointmentObj['studentId']+"' >"+appointmentObj['studentName']+"</span>";
        }else{
            populatedEvent.parentList.push({
                                            id:appointmentObj['parentId'], 
                                            name:appointmentObj['parentName']
                                        });
            populatedEvent.title += "<span class='draggable drag-parent' type='assigned' id='"+appointmentObj['parentId']+"' >"+appointmentObj['parentName']+"</span>";
        }
        self.appointment.fullCalendar('updateEvent', populatedEvent);

    } 

    this.addEventObj = function(appointmentObj){
        var eventColorObj = self.getEventColor(appointmentObj["type"]);
            var eventObj = {
                start:appointmentObj['startObj'],
                end:appointmentObj['endObj'],
                allDay : false,
                type:appointmentObj['type'],
                borderColor:eventColorObj.borderColor,
                color:"#333",
                backgroundColor:eventColorObj.backgroundColor
            }
            if(appointmentObj['staffId'] == undefined){
                var parentId = appointmentObj['parentId']+"_"+appointmentObj['startObj'];
                var studentId = appointmentObj['studentId']+"_"+appointmentObj['startObj'];
                eventObj["id"] = appointmentObj['startObj']+"_"+"unassignedId";
                eventObj['resourceId'] = "unassignedId";
                if( eventColorObj.display == "student"){
                    eventObj['title'] = "<span class='draggable drag-student' type='unassigned' studentId='"+studentId+"' >"+appointmentObj['studentName']+"</span>";
                }else{
                    eventObj['title'] = "<span class='draggable drag-parent' type='unassigned' parentId='"+parentId+"' >"+appointmentObj['parentName']+"</span>";
                }
            }else{
                var parentId = appointmentObj['parentId']+"_"+appointmentObj['startObj']+"_"+appointmentObj['staffId'];
                var studentId = appointmentObj['studentId']+"_"+appointmentObj['startObj']+"_"+appointmentObj['staffId'];
                eventObj["id"] = appointmentObj['startObj']+"_"+appointmentObj["staffId"];
                eventObj['resourceId'] = appointmentObj['staffId'];
                if( eventColorObj.display == "student"){
                    eventObj['title'] = "<span class='draggable drag-student' type='assigned' studentId='"+studentId+"' >"+appointmentObj['studentName']+"</span>";
                }else{
                    eventObj['title'] = "<span class='draggable drag-parent' type='assigned' parentId='"+parentId+"' >"+appointmentObj['parentName']+"</span>";
                }
            }
            self.eventList.push(eventObj);
            self.appointment.fullCalendar( 'addEvent', eventObj );
            self.appointment.fullCalendar('refetchEvents');
    }

    this.populateAppointmentEvent = function(appointmentList){
        var self = this;
        if(appointmentList.length){
            wjQuery.each(appointmentList, function(index, appointmentObj) {
                if(appointmentObj['staffId'] == undefined){
                    var eventId = appointmentObj["type"]+"_"+appointmentObj['startObj']+"_"+"unassignedId";
                }else{
                    var eventId = appointmentObj["type"]+"_"+appointmentObj['startObj']+"_"+appointmentObj['staffId'];
                }
                var populatedEvent = self.appointment.fullCalendar('clientEvents', eventId);
                if(populatedEvent.length){
                    self.updateEventObj(appointmentObj, populatedEvent[0], eventId);
                }else{
                    self.addEventObj(appointmentObj);
                }
            });
            wjQuery(".loading").hide();
            wjQuery('.fc-view-resourceDay .fc-event-time').css('visibility','hidden');
            this.draggable('draggable');
        }
    }

    this.populateAppointmentHours = function(appointmentHours){
        var self = this;
        appointmentHours = appointmentHours == null ? [] : appointmentHours;
        if(appointmentHours.length){
            wjQuery.each(appointmentHours, function (index, appointmentHrObj) {
                var eventColorObj = self.getEventColor(appointmentHrObj["type"]);
                wjQuery.each(self.staffList, function(key, staffObj){
                    if(staffObj['id'] != "unassignedId"){
                        var eventId = appointmentHrObj["type"]+"_"+appointmentHrObj['startObj']+"_"+staffObj['id']
                        var eventPopulated = self.appointment.fullCalendar('clientEvents', eventId);
                        var eventObj = {};
                        eventObj = {
                            id:eventId,
                            resourceId:staffObj['id'],
                            start:appointmentHrObj['startObj'],
                            end:appointmentHrObj['endObj'],
                            allDay : false,
                            type:appointmentHrObj['type'],
                            typeValue:appointmentHrObj['typeValue'],
                            borderColor:eventColorObj.borderColor,
                            color:"#333",
                            title:"",
                            backgroundColor:eventColorObj.backgroundColor,
                            studentList:[],
                            parentList:[]
                        }
                        self.eventList.push(eventObj);
                        self.appointment.fullCalendar( 'addEvent', eventObj );
                        self.appointment.fullCalendar('refetchEvents');
                    }
                });
            });
            wjQuery(".loading").hide();
            this.draggable('draggable');
        }
    }

    this.eventValidation = function(newObj, prevEvent){
        eventValidation = true;
        return eventValidation;
    }

    this.draggable = function (selector) {
        var self = this;
        wjQuery('.' + selector).draggable({
            revert: true,
            revertDuration: 0,
            appendTo: '#scrollarea',
            helper: 'clone',
            cursor: "move",
            scroll: true,
            cursorAt: { top: 0 },
            drag: function () {
                // if (sofExpanded) {
                //     wjQuery('.sof-pane').css('opacity', '.1');
                // }
                // if (taExpanded) {
                //     wjQuery('.ta-pane').css('opacity', '.1');
                // }
            },
            stop: function () {
                // if (sofExpanded) {
                //     wjQuery('.sof-pane').css('opacity', '1');
                // }
                // if (taExpanded) {
                //     wjQuery('.ta-pane').css('opacity', '1');
                // }
            }
        });
    };

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

