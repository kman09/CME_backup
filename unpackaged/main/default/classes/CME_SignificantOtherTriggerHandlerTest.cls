/**
 * @author Sumit Chhatriya
 * @email sumit.chhatriya@mtxb2b.com
 * @create date 2022-06-29 
 * @modify date 2022-06-29 
 * @desc This is class to used to check the SignificantOther scenarios
 */
 
@isTest
public class CME_SignificantOtherTriggerHandlerTest{
    
    @testSetup
    public static void createData(){
        
        Account objA = CME_TestDataFactory.createAccount('Client','testFname','testLName','fl@g.com');
        insert objA;
        
        Significant_Other__c objCR = CME_TestDataFactory.createSignificantOther(objA.id,true);
        insert objCR;
        
        Significant_Other__c objCR1 = CME_TestDataFactory.createSignificantOther(objA.id,false);
        insert objCR1;
    }
    
    @isTest
    public static void validatePrimaryContact(){
    
       
        new CME_SignificantOtherTriggerHandler();
        
        list<Significant_Other__c> lst = [select id,Primary_Contact__c from Significant_Other__c where primary_Contact__c = false];
        lst[0].Primary_Contact__c = true;
        update lst[0];
        
        new CME_SignificantOtherTriggerHandler();
    }
    
    
}