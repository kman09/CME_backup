import {
    LightningElement,
    track,
    api
} from 'lwc';
import {
    loadScript,
    loadStyle
} from 'lightning/platformResourceLoader';
import fetchAllEvents from '@salesforce/apex/CME_AppointmentCalendarController.fetchAllEvents';
import fullCalendar from "@salesforce/resourceUrl/fullCalendar";
import domainURL from '@salesforce/label/c.Org_Domain_URL';
import {
    NavigationMixin
} from 'lightning/navigation';

var _this;

/**
 * @description: FullcalendarJs class with all the dependencies
 */
export default class Cme_appointment_calendar extends NavigationMixin(LightningElement) {
    @api rightHeaderActions;
    @api defaultView;
    @api isCommunity = false;
    @track selectedEvent = {};
    fullCalendarJsInitialised = false;
    openEvent = false;
    value="My Appointments";
    get options() {
        return [
            { label: 'My Appointments', value: 'My Appointments' },
            { label: 'All Appointments', value: 'All Appointments' },
            
        ];
    }

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
                events: this.eventSourceHandler,
                id: "custom",
            }
            ],
        
        });
        
        this.calendar.render();
        this.calendarLabel = this.calendar.view.title;
    }

    fetchAppointments(){
        var eventSource = this.calendar.getEventSourceById('custom');
        eventSource.refetch();
    }
    
    eventSourceHandler(info, successCallback, failureCallback) {
        
        let selOpt = '';
        if( _this.template.querySelector('.appointmentCls') ){
            selOpt = _this.template.querySelector('.appointmentCls').value;
        }

        fetchAllEvents({ appointmentView: selOpt })

        .then(result => {
            if (result) {
                let eventLst = [];

                for (let i = 0; i < result.length; i++) {
                    let event = result[i];

                    //Color
                    let color;
                    if (event.Status__c == 'Cancelled') {
                        color = 'red';
                    } else {
                        if (event.Type == 'Assessment') {
                            color = 'purple';
                        } else if (event.Type == 'Depot Administration') {
                            color = '#FFC300';
                        } else if (event.Type == 'Tele Appointment') {
                            color = '#ff8f00';
                        } else if (event.Type == 'Home Visit') {
                            color = 'green';
                        }
                    }
                    let clientName = '';
                    if(event.WhatId != '' && event.WhatId != undefined && event.What.Name != undefined && 
                        event.What.Name != '' && event.What.Name != 'undefined'){
                        clientName = event.What.Name;
                    }
                    eventLst.push({
                        title: event.Subject,
                        start: event.StartDateTime,
                        end: event.EndDateTime,
                        id: event.Id,
                        type: event.Type,
                        status: event.Status__c,
                        description: event.Description,
                        location: event.Location__c,
                        client: clientName,
                        allDay: false,
                        color: color,
                    });
                }
                successCallback(eventLst);
            }
        })
        .catch(error => {
            console.error("error calling apex controller:", error);
            failureCallback(error);
        });
    }

    closeEventDetailModal() {
        this.openEvent = false;
    }

    openEventPage() {
        var newEventURL = domainURL + 'o/Event/new?count=1&nooverride=1&useRecordTypeCheck=1&navigationLocation=LIST_VIEW';
        this.onOpenEvent(newEventURL, true);
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
}