import {
    LightningElement,
    track,
    api,
    wire
} from 'lwc';
import {
    loadScript,
    loadStyle
} from 'lightning/platformResourceLoader';
import fullCalendar from "@salesforce/resourceUrl/fullCalendar";
import domainURL from '@salesforce/label/c.Org_Domain_URL';
import {
    NavigationMixin
} from 'lightning/navigation';

import UserId from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import UserNameFld from '@salesforce/schema/User.Name';

var _this;

/**
 * @description: FullcalendarJs class with all the dependencies
 */
export default class Cme_appointment_calendar_v2 extends NavigationMixin(LightningElement) {
    @api rightHeaderActions;
    @api defaultView;
    @api isCommunity = false;
    @track selectedEvent = {};
    fullCalendarJsInitialised = false;
    openEvent = false;
    value="My Appointments";
    editMode = false;
    currentUserName;
    get options() {
        return [
            { label: 'My Appointments', value: 'My Appointments' },
            { label: 'All Appointments', value: 'All Appointments' },
            
        ];
    }

    get allowEdit() {
        return this.isCommunity ? this.editMode : false;
    }

    selectedTimeslot = '';
    get schedOptions() {
        return [
            { label: '01/08/2022, 10:00 am', value: '0' },
            { label: '03/08/2022, 02:00 pm', value: '1' },
            { label: '05/08/2022, 04:00 pm', value: '2' },
        ];
    }

    @wire(getRecord, { recordId: UserId, fields: [UserNameFld]}) 
    userDetails({error, data}) {
        if (data) {
            this.currentUserName = data.fields.Name.value;
        } else if (error) {
            this.error = error ;
        }
    }

    timeslots = [
        new Date(2022, 7, 1, 10, 0, 0, 0),
        new Date(2022, 7, 3, 14, 0, 0, 0),
        new Date(2022, 7, 5, 16, 0, 0, 0)
    ];

    connectedCallback(){
        _this = this;
    }

    /**
     * Load the fullcalendar.io in this lifecycle hook method
    */
    renderedCallback() {
        // Performs this operation only on first render
        if (this.fullCalendarJsInitialised) {
            return;
        }
        this.fullCalendarJsInitialised = true;

        Promise.all([
                loadScript(this, fullCalendar + "/packages/core/main.js"),
                loadStyle(this, fullCalendar + "/packages/core/main.css")
            ])
            .then(() => {
                //got to load core first, then plugins
                Promise.all([
                    loadScript(this, fullCalendar + "/packages/daygrid/main.js"),
                    loadStyle(this, fullCalendar + "/packages/daygrid/main.css"),
                    loadScript(this, fullCalendar + "/packages/list/main.js"),
                    loadStyle(this, fullCalendar + "/packages/list/main.css"),
                    loadScript(this, fullCalendar + "/packages/timegrid/main.js"),
                    loadStyle(this, fullCalendar + "/packages/timegrid/main.css"),
                    loadScript(this, fullCalendar + "/packages/interaction/main.js"),
                    loadScript(this, fullCalendar + "/packages/moment/main.js"),
                    loadScript(this, fullCalendar + "/packages/moment-timezone/main.js"),
                ]).then(() => {
                    this.init();
                });
            })
            .catch(error => {
                console.log("Error: ", error);
            });
    }

    init() {
        var calendarEl = this.template.querySelector(".fullcalendarjs");

        if (this.rightHeaderActions === undefined || this.rightHeaderActions === '') {
            this.rightHeaderActions = 'dayGridMonth,timeGridWeek,timeGridDay,listMonth';
        }
        if (this.rightHeaderActions === 'NA') {
            this.rightHeaderActions = '';
        }
        if (this.defaultView === undefined || this.defaultView === '') {
            this.defaultView = 'dayGridMonth';
        }
        let eventLst = [];
        // START - Dummy Event
        let dateNow = new Date();
        let dummyStart = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1, 9, 0, 0, 0);
        let dummyEnd = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1, 9, 30, 0, 0);
        eventLst.push({
            title: "Appointment",
            start: dummyStart,
            end: dummyEnd,
            id: "dummyEventId",
            type: "Appointment",
            status: "Scheduled",
            description: "I have an appointment to discuss mental health.",
            location: "Clinic",
            client: "Patient",
            allDay: false,
            color: "purple",
        });
        // END - Dummy Event
        this.calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: ['interaction', 'dayGrid', 'timeGrid', 'list'],
            header: {
                left: "prev,next,today",
                center: this.isCommunity ? '' : "title",
                right: this.isCommunity ? "title" : this.rightHeaderActions,
            },
            views: {
                listMonth: {
                    buttonText: "Month List"
                },
                timeGridWeek: {
                    buttonText: "Week"
                },
                timeGridDay: {
                    buttonText: "Day"
                },
                dayGridMonth: {
                    buttonText: "Month"
                },
                today: {
                    buttonText: "Today"
                }
            },
            defaultView: this.defaultView,
            eventClick: info => {
                this.openEvent = true;
                this.selectedEvent.status = info.event._def.extendedProps.status;
                this.selectedEvent.type = info.event._def.extendedProps.type;
                this.selectedEvent.title = info.event.title;
                this.selectedEvent.id = info.event.id;
                this.selectedEvent.start = info.event.start;
                this.selectedEvent.end = info.event.end;
                this.selectedEvent.location = info.event._def.extendedProps.location;
                this.selectedEvent.description = info.event._def.extendedProps.description;
                this.selectedEvent.client = info.event._def.extendedProps.client;
            },
            eventSources: [{
                events: eventLst,
                id: "custom",
            }
            ],
        
        });
        
        this.calendar.render();
        this.calendarLabel = this.calendar.view.title;
    }

    closeEventDetailModal() {
        this.openEvent = false;
        this.editMode = false;
        this.selectedTimeslot = '';
    }

    openEventPage() {
        if (this.isCommunity) {
            this.openEvent = true;
            this.editMode = true;
            this.createMode = true;

            let dateNow = new Date();
            let minutes = dateNow.getMinutes();
            if (minutes % 15 != 0) {
                minutes = ((parseInt(minutes/15)+1)*15);
            }
            let dummyStart = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), minutes, 0, 0);
            let dummyEnd = new Date(dummyStart).setMinutes(dummyStart.getMinutes() + 30);

            this.selectedEvent.status = "New";
            this.selectedEvent.type = "Appointment";
            this.selectedEvent.title = "New Appointment";
            this.selectedEvent.id = "newEventId";
            this.selectedEvent.start = dummyStart;
            this.selectedEvent.end = dummyEnd;
            this.selectedEvent.location = "Clinic";
            this.selectedEvent.description = null;
            this.selectedEvent.client = this.currentUserName;
        } else {
            var newEventURL = domainURL + 'o/Event/new?count=1&nooverride=1&useRecordTypeCheck=1&navigationLocation=LIST_VIEW';
            this.onOpenEvent(newEventURL, true);
        }
    }

    handleEventClick(event) {
        this.openEvent = false;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.value,
                actionName: 'view',
            },
        });
    }

    onOpenEvent(eventIDURL, isNew) {
        this.invokeWorkspaceAPI('isConsoleNavigation').then(isConsole => {
            if (isConsole) {
                this.invokeWorkspaceAPI('openSubtab', {
                    parentTabId: '',
                    //recordId: eventId,
                    url: eventIDURL,
                    focus: true
                }).then(tabId => {});
            }
        });
    }

    invokeWorkspaceAPI(methodName, methodArgs) {
        return new Promise((resolve, reject) => {
            const apiEvent = new CustomEvent("internalapievent", {
                bubbles: true,
                composed: true,
                cancelable: false,
                detail: {
                    category: "workspaceAPI",
                    methodName: methodName,
                    methodArgs: methodArgs,
                    callback: (err, response) => {
                        if (err) {
                            return reject(err);
                        } else {
                            return resolve(response);
                        }
                    }
                }
            });

            window.dispatchEvent(apiEvent);
        });
    }

    toggleEditMode(event) {
        this.editMode = !this.editMode;
        this.selectedTimeslot = '';
    }

    handleSaveChangesEventClick(event) {
        if (this.selectedTimeslot) {
            this.selectedEvent.start = this.timeslots[parseInt(this.selectedTimeslot)];
            this.selectedEvent.end = new Date(this.selectedEvent.start).setMinutes(this.selectedEvent.start.getMinutes() + 30);
            let targetEvent = this.calendar.getEventById(this.selectedEvent.id);
            targetEvent.setStart(this.selectedEvent.start);
            targetEvent.setEnd(this.selectedEvent.end);
        }
        this.toggleEditMode();
    }

    handleTimeslotChange(event) {
        this.selectedTimeslot = event.detail.value;
    }

}