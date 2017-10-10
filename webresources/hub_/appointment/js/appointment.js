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
        var self = this;
        var uniqueId = '';
        /*----- uniqIdArry has ----*/
        // 0. type
        // 1. student/parent Id
        // 2. start time
        // 3. end time
        // 4. staff id
        var eventFor = '';
        if(elm.hasAttribute("parentid")){
            uniqueId = wjQuery(elm).attr("parentid").split('_');
            eventFor = 'customer';
        }else if(elm.hasAttribute("studentid")){
            uniqueId = wjQuery(elm).attr("studentid").split('_');
            eventFor = 'student';
        }
        var eventColorObj = self.getEventColor(uniqueId[0]);
        var index = self.findUniqueAppointment(uniqueId);
        if(index != -1){
            var newAppointmentObj = wjQuery.extend(true, {}, self.appointmentList[index]);
            newAppointmentObj['staffId'] = resource.id;
            newAppointmentObj['staffValue'] = resource.name;
            newAppointmentObj['endObj'] = self.findAppointmentDuration(newAppointmentObj['startObj'],newAppointmentObj['endObj'],date);
            newAppointmentObj['startObj'] = date;
            if(eventColorObj.appointmentHour){
                var showPopup = true;
                for (var i = 0; i < self.appointmentHours.length; i++) {
                    if(self.appointmentHours[i].type == uniqueId[0]){
                        if(self.appointmentHours[i].startObj.getTime() >= newAppointmentObj['startObj'].getTime() &&
                          newAppointmentObj['endObj'].getTime() <= self.appointmentHours[i].endObj.getTime()){
                            showPopup = false;
                            break;
                        }
                    }
                } 
                if(showPopup){
                    self.appointmentHourPopup(self, date, allDay, ev, ui, resource, elm,'Appointment Hour is not available.Do you wish to continue?');
                }
                else{
                    self.updateAppointmentOnDrop(self, date, allDay, ev, ui, resource, elm);
                }
            }
            else{
                self.updateAppointmentOnDrop(self, date, allDay, ev, ui, resource, elm);
            }
        }
    }

    this.updatePrevEvent = function(prevEvent,element,eventFor){
        if (prevEvent) {
            var eventTitleHTML = wjQuery(prevEvent[0].title);
            if(eventFor == 'student'){
                for (var i = 0; i < eventTitleHTML.length; i++) {
                    if (wjQuery(eventTitleHTML[i]).attr('studentId') == wjQuery(element).attr('studentId')) {
                        eventTitleHTML.splice(i, 1);
                    }
                }
            }
            else{
                for (var i = 0; i < eventTitleHTML.length; i++) {
                    if (wjQuery(eventTitleHTML[i]).attr('parentId') == wjQuery(element).attr('parentId')) {
                        eventTitleHTML.splice(i, 1);
                    }
                }
            }
            if (eventTitleHTML.prop('outerHTML') != undefined) {
                if (eventTitleHTML.length == 1) {
                    prevEvent[0].title = eventTitleHTML.prop('outerHTML');
                } else {
                    prevEvent[0].title = "";
                    for (var i = 0; i < eventTitleHTML.length; i++) {
                        prevEvent[0].title += eventTitleHTML[i].outerHTML;
                    }
                }
                this.appointment.fullCalendar('updateEvent', prevEvent);
            }
            else {
                for (var i = 0; i < this.eventList.length; i++) {
                    if (this.eventList[i].id == prevEvent[0].id)
                        this.eventList.splice(i, 1);
                }
                this.appointment.fullCalendar('removeEvents', prevEvent[0].id);
            }
        }
    }

    this.appointmentHourPopup = function (t, date, allDay, ev, ui, resource, elm, message) {
        wjQuery("#dialog > .dialog-msg").text(message);
        wjQuery("#dialog").dialog({
            resizable: false,
            height: "auto",
            width: 350,
            modal: true,
            buttons: {
                Yes: function () {
                    t.updateAppointmentOnDrop(t, date, allDay, ev, ui, resource, elm);
                    wjQuery(this).dialog("close");
                },
                No: function () {
                    wjQuery(this).dialog("close");
                }
            }
        });
    }

    this.updateAppointmentOnDrop = function(self, date, allDay, ev, ui, resource, elm){
        var uniqueId = '';
        /*----- uniqIdArry has ----*/
        // 0. type
        // 1. student/parent Id
        // 2. start time
        // 3. end time
        // 4. staff id
        var eventFor = '';
        if(elm.hasAttribute("parentid")){
            uniqueId = wjQuery(elm).attr("parentid").split('_');
            eventFor = 'customer';
        }else if(elm.hasAttribute("studentid")){
            uniqueId = wjQuery(elm).attr("studentid").split('_');
            eventFor = 'student';
        }
        var index = self.findUniqueAppointment(uniqueId);
        if(index != -1){
            var newAppointmentObj = wjQuery.extend(true, {}, self.appointmentList[index]);
            elm.remove();
            newAppointmentObj['staffId'] = resource.id;
            newAppointmentObj['staffValue'] = resource.name;
            newAppointmentObj['endObj'] = self.findAppointmentDuration(newAppointmentObj['startObj'],newAppointmentObj['endObj'],date);
            newAppointmentObj['startObj'] = date;
            var newEventId = newAppointmentObj['type']+"_"+newAppointmentObj['startObj']+"_"+newAppointmentObj['endObj']+"_"+newAppointmentObj['staffId'];
            var prevEventId = newAppointmentObj['type']+"_"+self.appointmentList[index]['startObj']+"_"+self.appointmentList[index]['endObj']+"_"+self.appointmentList[index]['staffId'];
            var prevEvent = self.appointment.fullCalendar('clientEvents',prevEventId);
            var newEvent = self.appointment.fullCalendar('clientEvents',newEventId);
            var responseObj = self.saveAppointment(newAppointmentObj, self.appointmentList[index]);
            if (typeof (responseObj) == 'boolean' && responseObj) {
                self.updatePrevEvent(prevEvent,elm,eventFor);
                self.populateAppointmentEvent([newAppointmentObj]);
            }
        }
    }

    this.findUniqueAppointment = function(uniqueId){
        var self = this;
        var index = -1;
        var eventColorObj = self.getEventColor(uniqueId[0]);
        if(eventColorObj.display == 'student'){
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
        else{
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
        }
        return index;
    }

    this.saveAppointment = function(newAppointmentObj,prevAppointmentObj){

        var newAppointment = {};
        var prevAppointment = {};

        newAppointment.activityid = newAppointmentObj.id;
        newAppointment.hub_location = newAppointmentObj.locationId;
        newAppointment.hub_type = newAppointmentObj.type;
        newAppointment.hub_staff = newAppointmentObj.staffId;
        newAppointment.hub_start_date = moment(newAppointmentObj.startObj).format("YYYY-MM-DD");
        newAppointment.hub_starttime  = this.convertToMinutes(moment(newAppointmentObj.startObj).format("h:mm A"));
        newAppointment.hub_endtime =  this.convertToMinutes(moment(newAppointmentObj.endObj).format("h:mm A"));

        prevAppointment.activityid = prevAppointmentObj.id;
        prevAppointment.hub_location = prevAppointmentObj.locationId;
        prevAppointment.hub_type = prevAppointmentObj.type;
        prevAppointment.hub_staff = prevAppointmentObj.staffId;
        prevAppointment.hub_start_date = moment(prevAppointmentObj.startObj).format("YYYY-MM-DD");
        prevAppointment.hub_starttime  = this.convertToMinutes(moment(prevAppointmentObj.startObj).format("h:mm A"));
        prevAppointment.hub_endtime =  this.convertToMinutes(moment(prevAppointmentObj.endObj).format("h:mm A"));
        

        return data.updateAppointment(newAppointment, prevAppointment);
    };

    this.cancelAppointment = function(element){
        var self = this;
        var uniqIdArry = [];
        var eventFor = '';
        if(element.hasAttribute("parentid")){
            uniqIdArry = wjQuery(element).attr("parentid").split('_');
            eventFor = 'customer';
        }else if(element.hasAttribute("studentid")){
            uniqIdArry = wjQuery(element).attr("studentid").split('_');
            eventFor = 'student';
        }
        var index = self.findUniqueAppointment(uniqIdArry);
        if(index != -1){
            var responseObj = data.cancelAppointment({'activityid': self.appointmentList[index].id});
            if(responseObj){
                var prevEventId = self.appointmentList[index]['type']+"_"+self.appointmentList[index]['startObj']+"_"+self.appointmentList[index]['endObj']+"_"+self.appointmentList[index]['staffId'];
                var prevEvent = self.appointment.fullCalendar('clientEvents',prevEventId);
                self.updatePrevEvent(prevEvent,element,eventFor);
                self.appointmentList.splice(index,1);
            }
        }
    }

    this.convertToMinutes = function (timeString) {
        if (timeString != undefined) {
            if (timeString.split(' ')[1] == 'AM') {
                var hours = parseInt(moment(timeString, 'h:mm A').format('h'));
                var minutes = parseInt(moment(timeString, 'h:mm A').format('mm'));
                return (hours * 60) + minutes;
            }
            else {
                var hours = parseInt(moment(timeString, 'h:mm A').format('h'));
                hours = hours != 12 ? hours + 12 : hours;
                var minutes = parseInt(moment(timeString, 'h:mm A').format('mm'));
                return (hours * 60) + minutes;
            }
        }
    }

    this.findAppointmentDuration = function(start, end, newStart){
        var timeDiff = Math.abs(end.getTime() - start.getTime());
        var diffMins = Math.ceil(timeDiff / (60 * 1000));
        var diffHours = Math.floor(diffMins / 60);
        diffMins %= 60; 
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
        if( eventColorObj.display == "student"){
            populatedEvent.title += "<span class='draggable drag-student' studentId='"+studentId+"' >"+appointmentObj['studentName']+"</span>";
            self.addContext(studentId,eventColorObj.display);
        }else{
            populatedEvent.title += "<span class='draggable drag-parent' parentId='"+parentId+"' >"+appointmentObj['parentName']+"</span>";
            self.addContext(parentId,eventColorObj.display);
        }
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
                self.addContext(studentId,eventColorObj.display);
            }else{
                eventObj['title'] = "<span class='draggable drag-parent' parentId='"+parentId+"' >"+appointmentObj['parentName']+"</span>";
                self.addContext(parentId,eventColorObj.display);
            }
            self.eventList.push(eventObj);
            self.appointment.fullCalendar('removeEvents');
            self.appointment.fullCalendar('removeEventSource');
            self.appointment.fullCalendar('addEventSource', { events: self.eventList });
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
            self.draggable('draggable');
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
                        title : '',
                        type:appointmentHrObj['type'],
                        typeValue:appointmentHrObj['typeValue'],
                        borderColor:eventColorObj.borderColor,
                        color:"#333",
                        backgroundColor:eventColorObj.backgroundColor,
                        studentList:[],
                        parentList:[]
                    }
                    if(eventColorObj.appointmentHour){
                        eventObj.title = self.addPlaceHolders(appointmentHrObj['capacity'],eventColorObj);
                    }
                    self.eventList.push(eventObj);
                    self.appointment.fullCalendar( 'removeEventSource');
                    self.appointment.fullCalendar( 'removeEvents');
                    self.appointment.fullCalendar( 'addEventSource', self.eventList );
                    self.appointment.fullCalendar( 'refetchEvents');
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

    this.addContext = function(id,label){
        var obj= {};
        var self = this;
        obj.cancel = {
            name: "Cancel",
            callback: function (key, options) {
              self.cancelAppointment(options.$trigger[0]);
            }
        }
        if(label == "student"){
            wjQuery.contextMenu( 'destroy', 'span[studentId="' + id + '"]');
            wjQuery.contextMenu({
                selector: 'span[studentId="' + id + '"]',
                build: function ($trigger, e) {
                  return {
                      items: obj
                  };
                }
            });
        }
        else{
            wjQuery.contextMenu( 'destroy', 'span[parentId="' + id + '"]');
            wjQuery.contextMenu({
                selector: 'span[parentId="' + id + '"]',
                build: function ($trigger, e) {
                  return {
                      items: obj
                  };
                }
            });
        }
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

