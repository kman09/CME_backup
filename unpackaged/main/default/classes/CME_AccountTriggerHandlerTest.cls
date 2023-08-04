@isTest
public class CME_AccountTriggerHandlerTest{
    
    @testSetup
    public static void createData(){
        
        list<Account> lst = new list<Account>();
        Account objA = CME_TestDataFactory.createAccount('Client','testFname11','testLName12','fl@g.com');
        objA.PersonBirthDate = system.today();
        objA.duplicate_key__c = '123';
        //insert objA;
        Account objEA = CME_TestDataFactory.createAccount('Client','testFname','testLName','fl11@g.com');
        objEA.PersonBirthDate = system.today();
        objEA.duplicate_key__c = '123';
        //insert objEA;
        lst.add(objA);
        lst.add(objEA);
        insert lst;
    }    
    @isTest
    public static void validateAccount(){
            
    
        list<Account> lstA = [select id from Account where personemail = 'fl@g.com' ];
        list<Account> lstA1 = [select id from Account where personemail = 'fl11@g.com' ];
        
        test.startTest();
        merge lstA[0] lstA1[0];
        test.stopTest();
        new CME_AccountTriggerHandler();
        
        
    }
        
    
}