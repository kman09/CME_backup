public class CME_TestDataFactory{

    public static Account createAccount(string recordTypeName,String fName, String lName,String email){
    
        Account acc= new Account();
        Id recTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get(recordTypeName).getRecordTypeId();
        
        if(recordTypeName == 'Client'){
            acc.RecordTypeID=recTypeId ;
            acc.FirstName=fName;
            acc.LastName=lName;
            acc.personMailingStreet = 'TestStreet';
            acc.personMailingCity = 'TestCity';
            acc.personMailingState= 'TestState';
            acc.personMailingCountry = 'Australia';
            acc.personMailingpostalCode = '12345';
            acc.PersonEmail=email;
        }
        else{
            acc.RecordTypeID=recTypeId ;
            acc.Name = lName;
        }
        return acc;
    }
    
    public static Event createEvent(string whatId,String subject,String status, String Type,dateTime startDT, dateTime endDT){
    
        Event objE= new Event();
        objE.whatId = whatId;
        objE.subject = subject;
        objE.Status__c = status;
        objE.StartdateTime = startDT;
        objE.EnddateTime = endDT;
        objE.Type = type;
        return objE;
    }
    
    public static Significant_Other__c createSignificantOther(string clientId,boolean isPrimary){
    
        Significant_Other__c objCR= new Significant_Other__c();
        objCR.Client__c = clientId;
        objCR.First_name__c = 'testFname';
        objCR.Last_name__c = 'testLastName';
        objCR.Relationship_Status__c = 'Active';
        objCR.Type__c = 'Son';
        objCR.Primary_Contact__c = isPrimary;
        return objCR;
    }
    
    
   
}