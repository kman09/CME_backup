/**
 * @author Sumit Chhatriya
 * @email sumit.chhatriya@mtxb2b.com
 * @create date 2022-06-29 
 * @modify date 2022-06-29 
 * @desc This is class to used to check the appoinment scenarios
 */
 
@isTest
public class CME_AppointmentCalendarControllerTest{
    
    @testSetup
    public static void createData(){
        
        Account objA = CME_TestDataFactory.createAccount('Client','testFname','testLName','fl@g.com');
        insert objA;
        Event objE = CME_TestDataFactory.createEvent(objA.id,'call','Scheduled','Assessment',system.Now(),system.Now().addHours(2));
        insert objE;
        
    }
    
    @isTest
    public static void fetchAllEventsValidate(){
        
        list<Event>  lstE = [select id from Event where subject = 'call'];
        CME_AppointmentCalendarController.fetchAllEvents('My Appointments');
        system.assertEquals(lstE.size(),1);
    }
}