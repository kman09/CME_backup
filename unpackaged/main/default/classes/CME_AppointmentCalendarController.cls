/**
 * @author Sumit Chhatriya
 * @email sumit.chhatriya@mtxb2b.com
 * @create date 2022-06-23 
 * @modify date 2022-06-23 
 * @desc This is class to get all the events
 */
public without sharing class CME_AppointmentCalendarController {

    @AuraEnabled
    public static list<Event> fetchAllEvents(String appointmentView){
        List<Event> eventList = new List<Event>();

        list<User> lstUser = [select id,contactId,contact.AccountId from user where id=: userInfo.getUserId() and contactId != null];
        
        String strQuery = 'SELECT Id, Subject,Status__c, WhatId,What.Name, WhoId,Type, Location,Description,'+
                          'EndDate, EndDateTime,Location__c, OwnerId,StartDateTime,ActivityDate, ActivityDateTime FROM Event ';
                    
        //If Portal User
        if( !lstUser.isEmpty() ){
            strQuery += ' WHERE WhatId=\''+ lstUser[0].contact.AccountId+'\'';
        }
        //If Internal User
        else{
            if(appointmentView == 'My Appointments'){
                strQuery += 'WHERE  OwnerId=\''+ UserInfo.getUserId()+'\'';
            }
        }
        
        return Database.query(strQuery);
    }

}