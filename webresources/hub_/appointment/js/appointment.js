var data = new Data();
var DEFAULT_START_TIME = "8:00 AM";
var DEFAULT_END_TIME = "9:00 AM";
var currentCalendarDate = moment(new Date()).format("YYYY-MM-DD");

setTimeout(function () {
    var sylvanAppointment = new SylvanAppointment();
    var locationId = sylvanAppointment.populateLocation(data.getLocation());
    wjQuery('.headerDate').text(moment(currentCalendarDate).format('MM/DD/YYYY'));
    sylvanAppointment.calendarDate = new Date();
    if (moment(sylvanAppointment.calendarDate).format('MM/DD/YYYY') == moment(new Date()).format('MM/DD/YYYY')) {
        wjQuery('.headerDate').addClass('today');
    }
    else {
        wjQuery('.headerDate').removeClass('today');
    }
    function getSunday(d) {
        d = new Date(d);
        var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -7:0); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    setTimeout(function () {
        wjQuery(".loc-dropdown .dropdown-menu").on('click', 'li a', function () {
            if (wjQuery(".location-btn").val() != wjQuery(this).attr('value-id')) {
                wjQuery(".location-btn").text(wjQuery(this).text());
                wjQuery(".location-btn").val(wjQuery(this).attr('value-id'));
                locationId = wjQuery(this).attr('value-id');
                return fetchResources(locationId);
            }
        });

        wjQuery('.nextBtn').off('click').on('click', function () {
            //wjQuery(".loading").show();
            if(wjQuery('#dayBtn:checked').val() == 'on'){
                sylvanAppointment.calendarDate = new Date(new Date(sylvanAppointment.calendarDate).setDate(new Date(sylvanAppointment.calendarDate).getDate() + 1));
            }
            else{
                sylvanAppointment.calendarDate = new Date(new Date(sylvanAppointment.calendarDate).setDate(new Date(sylvanAppointment.calendarDate).getDate() + 7));
            }
            wjQuery('.headerDate').text(moment(sylvanAppointment.calendarDate).format('MM/DD/YYYY'));
            if (moment(sylvanAppointment.calendarDate).format('MM/DD/YYYY') == moment(new Date()).format('MM/DD/YYYY')) {
                wjQuery('.headerDate').addClass('today');
            }
            else {
                wjQuery('.headerDate').removeClass('today');
            }
            fetchResources(locationId);
        });

        wjQuery('.prevBtn').off('click').on('click', function () {
            //wjQuery(".loading").show();
            if(wjQuery('#dayBtn:checked').val() == 'on'){
                sylvanAppointment.calendarDate = new Date(new Date(sylvanAppointment.calendarDate).setDate(new Date(sylvanAppointment.calendarDate).getDate() - 1));
            }
            else{
                sylvanAppointment.calendarDate = new Date(new Date(sylvanAppointment.calendarDate).setDate(new Date(sylvanAppointment.calendarDate).getDate() - 7));
            }
            wjQuery('.headerDate').text(moment(sylvanAppointment.calendarDate).format('MM/DD/YYYY'));
            if (moment(sylvanAppointment.calendarDate).format('MM/DD/YYYY') == moment(new Date()).format('MM/DD/YYYY')) {
                wjQuery('.headerDate').addClass('today');
            }
            else {
                wjQuery('.headerDate').removeClass('today');
            }
            fetchResources(locationId);
        });

        wjQuery('#datepicker').datepicker({
            buttonImage: "/webresources/hub_/calendar/images/calendar.png",
            buttonImageOnly: true,
            changeMonth: true,
            changeYear: true,
            showOn: 'button',
            onSelect: function (date) {
                //wjQuery(".loading").show();
                //sylvanAppointment.clearEvents();
                sylvanAppointment.calendarDate = new Date(moment(moment(date).format('MM/DD/YYYY')).format('YYYY-MM-DD'));
                wjQuery('.headerDate').text(moment(sylvanAppointment.calendarDate).format('MM/DD/YYYY'));
                if (moment(sylvanAppointment.calendarDate).format('MM/DD/YYYY') == moment(new Date()).format('MM/DD/YYYY')) {
                    wjQuery('.headerDate').addClass('today');
                }
                else {
                    wjQuery('.headerDate').removeClass('today');
                }
                fetchResources(locationId);
                wjQuery('#datepicker').hide();
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
                fetchResources(locationId);
            }               
        }

        function fetchResources(locationId) {
            //wjQuery(".loading").show();
            sylvanAppointment.locationId = locationId;
            if(wjQuery('#dayBtn:checked').val() == 'on'){
                sylvanAppointment.startDate =  sylvanAppointment.calendarDate;
                sylvanAppointment.endDate =  sylvanAppointment.calendarDate;
            }
            else{
                sylvanAppointment.startDate =  getSunday(sylvanAppointment.calendarDate);
                sylvanAppointment.endDate =  new Date(new Date(sylvanAppointment.startDate).setDate(new Date(sylvanAppointment.startDate).getDate() + 6));
            }
            var convertedStaffList = sylvanAppointment.formatObjects(data.getAppointmentStaff(locationId,sylvanAppointment.startDate,sylvanAppointment.endDate), "staffList");
            if(sylvanAppointment.appointment == undefined || sylvanAppointment.appointment.fullCalendar('getView').name == 'resourceDay'){
                sylvanAppointment.populateStaff(convertedStaffList);
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
            }else{
                wjQuery(".loading").hide();
            }
        }
        fetchResources(locationId);
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
        self.appointmentList = [];
        self.appointmentHours = [];
        self.appointment.fullCalendar('removeEvents');
        self.appointment.fullCalendar('removeEventSource');
    }

    this.clearAll = function () {
        var self = this;
        self.filters = new Object();
        self.eventList = [];
        self.staffList = [];
        self.appointmentList = [];
        self.appointmentHours = [];
        self.appointment.fullCalendar('removeEvents');
        self.appointment.fullCalendar('removeEventSource');
        self.appointment.fullCalendar('destroy');
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
                    id: staffObj["hub_staffid"],
                    name:staffObj["hub_name"]
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
        }
        else if(label == "appointmentList"){
            tempList = [];
            wjQuery.each(args, function(index, appointmentObj) {
                var startObj = new Date(appointmentObj['hub_start_date']+" "+appointmentObj['hub_starttime@OData.Community.Display.V1.FormattedValue']);
                var endObj = new Date(appointmentObj['hub_end_date']+" "+appointmentObj['hub_endtime@OData.Community.Display.V1.FormattedValue']);
                var obj = {
                    id: appointmentObj['activityid'],
                    type:appointmentObj['hub_type'],
                    typeValue:appointmentObj['hub_type@OData.Community.Display.V1.FormattedValue'],
                    startObj:startObj,
                    endObj:endObj,
                    locationId:appointmentObj['_hub_location_value'],
                    status:appointmentObj['hub_appointmentstatus'],
                    studentId:appointmentObj['_hub_student_value'],
                    studentName:appointmentObj['_hub_student_value@OData.Community.Display.V1.FormattedValue'],
                    parentId:appointmentObj['_regardingobjectid_value'],
                    parentName:appointmentObj['_regardingobjectid_value@OData.Community.Display.V1.FormattedValue'],
                };
                if(appointmentObj['_hub_staff_value'] != undefined){
                    obj.staffId = appointmentObj['_hub_staff_value'];
                    obj.staffValue = appointmentObj['_hub_staff_value@OData.Community.Display.V1.FormattedValue'];
                }
                else{
                    obj.staffId = 'unassignedId';
                    obj.staffValue = 'unassignedId'
                }
                var index = -1;
                for (var i = 0; i < tempList.length; i++) {
                    if(tempList[i].id == obj.id){
                        index = i;
                        break;
                    }
                }
                if(index == -1)
                    tempList.push(obj);    
            });
        }
        else if(label == "appointmentHours"){
            tempList = [];
            var currentCalendarDate = self.appointment.fullCalendar('getDate');
            wjQuery.each(args, function(index, appointmentHour) {
                var appEffectiveStartDate = appointmentHour['hub_effectivestartdate'];
                var appEffectiveEndDate,addAppFlag = false;
                if(appointmentHour['hub_effectiveenddate'] != undefined){
                    appEffectiveEndDate = moment(appointmentHour['hub_effectiveenddate']).format("YYYY-MM-DD");
                }
                else{
                    appEffectiveEndDate = moment(currentCalendarDate).format("YYYY-MM-DD");
                }
                appEffectiveStartDate = new Date(appEffectiveStartDate + ' ' + '00:00').getTime();
                appEffectiveEndDate = new Date(appEffectiveEndDate + ' ' + '23:59').getTime();
                if (currentCalendarDate.getTime() >= appEffectiveStartDate && currentCalendarDate.getTime() <= appEffectiveEndDate) {
                    addAppFlag = true;
                }
                if(addAppFlag && appointmentHour['hub_days'] == self.getDayValue(currentCalendarDate)){
                    var duration = appointmentHour['aworkhours_x002e_hub_duration'];
                    for (var i = appointmentHour['hub_starttime']; i < (appointmentHour['hub_endtime']); i+= duration) {
                        var startObj = new Date(moment(currentCalendarDate).format('YYYY-MM-DD')+" "+self.convertMinsNumToTime(i)); 
                        var endObj = new Date(moment(currentCalendarDate).format('YYYY-MM-DD')+" "+self.convertMinsNumToTime(i+duration)); 
                        tempList.push({
                            type:appointmentHour['aworkhours_x002e_hub_type'],
                            typeValue:appointmentHour['aworkhours_x002e_hub_type@OData.Community.Display.V1.FormattedValue'],
                            startObj:startObj,
                            endObj:endObj,
                            capacity:appointmentHour['hub_capacity'],
                            duration : duration

                        });
                    }
                }
            });
            this.appointmentHours = tempList;
        }
        return tempList;
    }

    this.convertMinsNumToTime = function(minsNum){
      if(minsNum){
        // var mins_num = parseFloat(this, 10); // don't forget the second param
        var hours   = Math.floor(minsNum / 60);
        var minutes = Math.floor((minsNum - ((hours * 3600)) / 60));
        var seconds = Math.floor((minsNum * 60) - (hours * 3600) - (minutes * 60));

        // Appends 0 when unit is less than 10
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes;
      }
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
        
        var dayOfWeek = moment(date).format('dddd');
        var dayofMonth = moment(date).format('M/D');
        wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek + " <br/> " + dayofMonth);
        self.clearEvents();
        var currentCalendarDate = moment(date).format("YYYY-MM-DD");
        self.refreshCalendarEvent(this.locationId, true);
    }

    this.getDayValue = function (date) {
        if (date != undefined) {
            switch (moment(date).format('dddd').toLowerCase()) {
                case 'monday':
                    return 1;
                    break;
                case 'tuesday':
                    return 2;
                    break;
                case 'wednesday':
                    return 3;
                    break;
                case 'thursday':
                    return 4;
                    break;
                case 'friday':
                    return 5;
                    break;
                case 'saturday':
                    return 6;
                    break;
                case 'sunday':
                    return 7;
                    break;
            }
        }
    }

    this.populateStaff = function (args, isFetch) {
        var self = this;
        if (self.appointment != undefined) {
            self.clearAll();
        }
        if(args.length){
            self.staffList = args;
            self.loadCalendar(self.calendarDate);
        }
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
            defaultEventMinutes : 30,
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
        
        if (wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').length) {
            var dayOfWeek = moment(currentCalendarDate).format('dddd');
            var dayofMonth = moment(currentCalendarDate).format('M/D');
            wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').css('text-align', 'center');
            wjQuery('thead .fc-agenda-axis.fc-widget-header.fc-first').html(dayOfWeek + " <br/> " + dayofMonth);
        }
    }

    this.next = function (locationId) {
        this.appointment.fullCalendar('next');
        var currentCalendarDate = this.appointment.fullCalendar('getDate');
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
                self.appointmentList = (isFetch || self.appointmentList.length == 0) ? self.formatObjects(data.getAppointment(locationId,self.startDate,self.endDate), "appointmentList") : self.appointmentList;
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
        var type = wjQuery(elm).attr("type");
        var uniqueId = '';
        /*----- uniqIdArry has ----*/
        // 0. student/parent Id
        // 1. start time
        // 2. end time
        // 3. staff id only for assigned type 
        var index = -1;
        if(elm.hasAttribute("parentid")){
            uniqueId = wjQuery(elm).attr("parentid").split('_');
            for(var i=0; i< self.appointmentList.length; i++){
                if(uniqueId[0] == self.appointmentList[i]['type'] &&
                    uniqueId[1] == self.appointmentList[i]["parentId"] && 
                    uniqueId[2] == self.appointmentList[i]['startObj'] &&
                    uniqueId[3] == self.appointmentList[i]['endObj'] &&
                    uniqueId[4] == self.appointmentList[i]['staffId']){
                    index = i;
                    break;
                }
            }
            
        }else if(elm.hasAttribute("studentid")){
            uniqueId = wjQuery(elm).attr("studentid").split('_');
            for(var i=0; i< self.appointmentList.length; i++){
                if(uniqueId[0] == self.appointmentList[i]['type'] &&
                    uniqueId[1] == self.appointmentList[i]["studentId"] && 
                    uniqueId[2] == self.appointmentList[i]['startObj'] &&
                    uniqueId[3] == self.appointmentList[i]['endObj'] &&
                    uniqueId[4] == self.appointmentList[i]['staffId']){
                    index = i;
                    break;
                }
            }
        }
        if(index != -1){
            elm.remove();
            self.appointmentList[index]['staffId'] = resource.id;
            self.appointmentList[index]['staffValue'] = resource.name;
            self.appointmentList[index]['endObj'] = self.findAppointmentDuration(self.appointmentList[index]['startObj'],self.appointmentList[index]['endObj'],date);
            self.appointmentList[index]['startObj'] = date;
            self.populateAppointmentEvent([self.appointmentList[index]]);
        }
    }

    this.findAppointmentDuration = function(start, end, newStart){
        var timeDiff = Math.abs(end.getTime() - start.getTime());
        var diffMins = Math.ceil(timeDiff / (60 * 1000));
        diffMins %= 60; 
        var diffHours = Math.ceil(timeDiff / (3600 * 1000));
        var newEnd = new Date(newStart);
        newEnd = new Date(newEnd.setHours(newEnd.getHours() + diffHours));
        newEnd = new Date(newEnd.setMinutes(newEnd.getMinutes() + diffMins));
        return newEnd;
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

    this.updateEventObj = function (appointmentObj, populatedEvent){
        var self = this;
        var eventColorObj = self.getEventColor(appointmentObj["type"]);
        var parentId = appointmentObj['type']+"_"+appointmentObj['parentId']+"_"+appointmentObj['startObj']+"_"+appointmentObj['endObj']+"_"+appointmentObj["staffId"];
        var studentId = appointmentObj['type']+"_"+appointmentObj['studentId']+"_"+appointmentObj['startObj']+"_"+appointmentObj['endObj']+"_"+appointmentObj["staffId"];
        populatedEvent.parentList.push({
                                        id:appointmentObj['parentId'], 
                                        name:appointmentObj['parentName']
                                    });
        populatedEvent.title += "<span class='draggable drag-parent' type='assigned' parentId='"+parentId+"' >"+appointmentObj['parentName']+"</span>";
        self.appointment.fullCalendar('updateEvent', populatedEvent);
    } 

    this.addEventObj = function(appointmentObj){
        var self = this;
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
            var parentId = appointmentObj['type']+"_"+appointmentObj['parentId']+"_"+appointmentObj['startObj']+"_"+appointmentObj['endObj']+"_"+appointmentObj["staffId"];
            var studentId = appointmentObj['type']+"_"+appointmentObj['studentId']+"_"+appointmentObj['startObj']+"_"+appointmentObj['endObj']+"_"+appointmentObj["staffId"];
            eventObj["id"] = appointmentObj["type"]+"_"+appointmentObj['startObj']+"_"+appointmentObj['endObj']+"_"+appointmentObj['staffId'];
            eventObj['resourceId'] = appointmentObj['staffId'];
            if( eventColorObj.display == "student"){
                eventObj['title'] = "<span class='draggable drag-student' studentId='"+studentId+"' >"+appointmentObj['studentName']+"</span>";
            }else{
                eventObj['title'] = "<span class='draggable drag-parent' parentId='"+parentId+"' >"+appointmentObj['parentName']+"</span>";
            }
            self.eventList.push(eventObj);
            self.appointment.fullCalendar( 'renderEvent', eventObj, true );
            self.appointment.fullCalendar('refetchEvents');
    }

    this.populateAppointmentEvent = function(appointmentList){
        var self = this;
        if(appointmentList.length){
            wjQuery.each(appointmentList, function(index, appointmentObj) {
                var eventId = appointmentObj["type"]+"_"+appointmentObj['startObj']+"_"+appointmentObj['endObj']+"_"+appointmentObj['staffId'];
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
                var eventId = appointmentHrObj["type"]+"_"+appointmentHrObj['startObj']+"_"+appointmentHrObj['endObj']+"_unassignedId";
                var eventPopulated = self.appointment.fullCalendar('clientEvents', eventId);
                if(eventPopulated.length){
                    eventPopulated[0].capacity += appointmentHrObj['capacity'];
                    eventPopulated[0].title = self.addPlaceHolders(eventPopulated[0].capacity,eventColorObj);
                    self.appointment.fullCalendar('updateEvent', eventPopulated[0]); 
                }else{
                    var eventObj = {};
                    eventObj = {
                        id:eventId,
                        resourceId:'unassignedId',
                        capacity : appointmentHrObj['capacity'],
                        start:appointmentHrObj['startObj'],
                        end:appointmentHrObj['endObj'],
                        allDay : false,
                        type:appointmentHrObj['type'],
                        typeValue:appointmentHrObj['typeValue'],
                        borderColor:eventColorObj.borderColor,
                        color:"#333",
                        title:self.addPlaceHolders(appointmentHrObj['capacity'],eventColorObj),
                        backgroundColor:eventColorObj.backgroundColor,
                        studentList:[],
                        parentList:[]
                    }
                    self.eventList.push(eventObj);
                    self.appointment.fullCalendar( 'removeEventSource');
                    self.appointment.fullCalendar( 'removeEvents');
                    self.appointment.fullCalendar( 'addEventSource', self.eventList );
                    self.appointment.fullCalendar('refetchEvents');
                }

            });
            wjQuery(".loading").hide();
            this.draggable('draggable');
        }
    }

    this.addPlaceHolders = function(capacity,eventColorObj){
        var html = '';
        if(eventColorObj.display == 'student'){
            for (var i = 0; i < capacity; i++) {
                html+= '<span class="app-placeholder student-'+eventColorObj.type+'">Student name</span>';
            }
        }
        else if(eventColorObj.display == 'customer'){
            for (var i = 0; i < capacity; i++) {
                html+= '<span class="app-placeholder customer-'+eventColorObj.type+'">Customer name</span>';
            }
        }
        return html;
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

}

