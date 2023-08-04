/**
 * @author Sumit Chhatriya
 * @email sumit.chhatriya@mtxb2b.com
 * @create date 2022-06-29 
 * @modify date 2022-06-29 
 * @desc This is used to handle the scenario of event
 */
public class CME_EventTriggerHandler extends TriggerFramework{
    
    protected override void beforeInsert(List<Sobject> newRecords) {
        
        updateName((list<Event>)newRecords,null);
    }
    
    protected override void beforeUpdate(Map<Id, Sobject> oldRecordsMap, Map<Id, Sobject> newRecordsMap) {
        Map<Id, Event> oldMap = (Map<Id, Event>) oldRecordsMap;
        Map<Id, Event> newMap = (Map<Id, Event>) newRecordsMap;
        
        updateName(newMap.values(),oldMap);
    }
    
    public static void updateName(list<Event> newRecords,Map<Id, Event> oldRecordsMap){
        
        if(!newRecords.isEmpty()){
            set<Id> setOfAccId = new set<Id>();
            for(Event obj : newRecords){
                if(oldRecordsMap != null && obj.WhatId != null && oldRecordsMap.get(obj.id).WhatId != obj.WhatId ){
                    setOfAccId.add( obj.WhatId);
                }
                else if(oldRecordsMap == null){
                    setOfAccId.add( obj.WhatId);
                }
            }
            
            if(!setOfAccId.isEmpty()){
                map<Id,Id> mapOfAccIdToConId = new map<Id,Id>();
                list<Contact> lstCon = new list<Contact>([select id,AccountId from Contact where AccountId in: setOfAccId]);
                if(!lstCon.isEmpty()){
                    for(Contact objC : lstCon){
                        mapOfAccIdToConId.put(objC.AccountId,objC.id);
                    }
                }
                for(Event obj : newRecords){
                   obj.WhoId =  mapOfAccIdToConId.get(obj.WhatId) ;
                }
            }
        }
    }
}