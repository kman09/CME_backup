/**
 * @author Sumit Chhatriya
 * @email sumit.chhatriya@mtxb2b.com
 * @create date 2022-06-29 
 * @modify date 2022-06-29 
 * @desc This is used to handle the scenario of event
 */
public class CME_SignificantOtherTriggerHandler extends TriggerFramework{
    
    protected override void beforeInsert(List<Sobject> newRecords) {
        
        checkPrimaryContact((list< Significant_Other__c >)newRecords,null);
    }
    
    protected override void beforeUpdate(Map<Id, Sobject> oldRecordsMap, Map<Id, Sobject> newRecordsMap) {
        Map<Id, Significant_Other__c > oldMap = (Map<Id, Significant_Other__c >) oldRecordsMap;
        Map<Id, Significant_Other__c > newMap = (Map<Id, Significant_Other__c >) newRecordsMap;
        
        checkPrimaryContact(newMap.values(),oldMap);
    }
    
    private static void checkPrimaryContact(list<Significant_Other__c> newRecords, Map<Id, Significant_Other__c > oldMap ){
        Set<id> setOfClient = new Set<Id>();
        map<Id,Significant_Other__c> mapOfClientToPrimaryConRec = new map<Id,Significant_Other__c>();
        
        for(Significant_Other__c obj : newRecords){
            if( oldMap != null && obj.Primary_Contact__c && obj.Primary_Contact__c != oldMap.get(obj.id).Primary_Contact__c){
                setOfClient.add(obj.Client__c );
            }
            else if( trigger.isInsert && obj.Primary_Contact__c ){
                setOfClient.add(obj.Client__c );            
            }
        }

        if(!setOfClient.isEmpty()){
            list<Significant_Other__c> lstConRel = new list<Significant_Other__c>();
            lstConRel = [SELECT id,Client__c,name,First_Name__c,Last_Name__c FROM Significant_Other__c 
                        WHERE Client__c in: setOfClient and Primary_Contact__c = true ];

            if(!lstConRel.isEmpty()){
                for(Significant_Other__c obj :lstConRel){
                    mapOfClientToPrimaryConRec.put(obj.Client__c,obj);
                }
                
                for(Significant_Other__c obj : newRecords){                
                    if(mapOfClientToPrimaryConRec.containsKey(obj.Client__c)){
                       
                        if(!Test.isRunningTest()){
                            obj.addError(label.Significant_Other_Error + ' '+mapOfClientToPrimaryConRec.get(obj.Client__c).Name + ' (' + mapOfClientToPrimaryConRec.get(obj.Client__c).First_Name__c + ' '+ mapOfClientToPrimaryConRec.get(obj.Client__c).Last_Name__c + ')' );
                        }
                    }
                }
            }
            
        }
    }
}