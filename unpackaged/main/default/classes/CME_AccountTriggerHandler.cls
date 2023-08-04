/**
 * @author Sumit Chhatriya
 * @email sumit.chhatriya@mtxb2b.com
 * @create date 2022-07-07 
 * @modify date 2022-07-07 
 * @desc This is used to handle the scenario of event
 */
public class CME_AccountTriggerHandler extends TriggerFramework{
    
    protected override void afterDelete(Map<Id,Sobject> olMapRecords) {
        
        Map<Id, Account> oldMap = (Map<Id, Account>) olMapRecords;
        
        updateDuplicateKeyAsBlank(oldMap.values());
        
    }
    private static void updateDuplicateKeyAsBlank(list<Account> lstAcc){
    
        set<Id> setOfMasterId = new set<Id>();
        list<Account> lstAccUpdate = new list<Account>();
    
        if(!lstAcc.isEmpty()){
            for (Account objA : lstAcc) {
                if(objA.MasterRecordId != null && objA.Duplicate_key__c != null ){
                    setOfMasterId.add(objA.MasterRecordId);
                }
            }
            
            if(!setOfMasterId.isEmpty()){
                updateMasterRecord(setOfMasterId);
            }
        } 
    } 
        
    @future
    public static void  updateMasterRecord(set<Id> setOfMasterRecId){
        
        list<Account> lstAccUpdate = new list<Account>();
    
        for(Account obj :[select id,Duplicate_Key__c from Account where id in: setOfMasterRecId ]){
            Account objAccUpdate = new Account();
            objAccUpdate.duplicate_key__c = '';
            objAccUpdate.id = obj.id;
            lstAccUpdate.add(objAccUpdate);
        }
        if(!lstAccUpdate.isEmpty()){
            update lstAccUpdate;
        }
    }
        
    
}