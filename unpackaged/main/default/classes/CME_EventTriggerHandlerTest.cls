/**
 * @author Sumit Chhatriya
 * @email sumit.chhatriya@mtxb2b.com
 * @create date 2022-06-29 
 * @modify date 2022-06-29 
 * @desc This is class to used to check the Event related scenarios
 */
 
@isTest
public class CME_EventTriggerHandlerTest{
    
    @testSetup
    public static void createData(){
        
        Account objA = CME_TestDataFactory.createAccount('Client','testFname','testLName','fl@g.com');
        insert objA;
        Account objEA = CME_TestDataFactory.createAccount('Client','V1Name','V1Lastn','fl11@g.com');
        insert objEA;
        Event objE = CME_TestDataFactory.createEvent(objA.id,'call','Scheduled','Assessment',system.Now(),system.Now().addHours(2));
        insert objE;
        
    }
    
    @isTest
    public static void validateEvents(){
        
        new CME_EventTriggerHandler();
        
        list<Event> lst = [select id,whatId from event where subject = 'call' ];
        list<Account> lstA = [select id from Account where Firstname = 'V1Name' ];
        if(!lst.isEmpty()){
            lst[0].WhatId = lstA[0].id;
            update lst[0];
            
            system.assertEquals(lst[0].WhatId,lstA[0].id);
        }
    }
}