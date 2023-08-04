/**
 * @author Sumit Chhatriya
 * @email sumit.chhatriya@mtxb2b.com
 * @create date 2022-06-29 
 * @modify date 2022-06-29 
 * @desc This is class to used to get the History of the object
 */
 
 // SeeAllData = true is used because we can not get History records in TestClass.
@isTest(SeeAllData = true)
public class CME_RecordHistoryControllerTest{
    
    
    public static testMethod void getHistoryValidate(){
       
       Account objA = CME_TestDataFactory.createAccount('Client','testFname','testLName','fl@g.com');
       objA.Preferred_Name__c = 'testPref';
       insert objA;
       
       String query= 'SELECT Id, Field, NewValue, OldValue, CreatedBy.Name,CreatedById, CreatedDate FROM AccountHistory WHERE AccountId = \'RECORD_ID\'';
       
       test.startTest();
       CME_RecordHistoryController.getHistory(objA.id,'Account',query);
       test.stopTest();
    }
}