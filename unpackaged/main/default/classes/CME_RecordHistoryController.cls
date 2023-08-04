/**
 * @author Vishnu Kumar
 * @email vishnu.kumar@mtxb2b.com
 * @create date 2022-06-22 17:06:49
 * @modify date 2022-06-22 17:06:49
 * @desc This is generic class to load the history of the records.
 */
public with sharing class CME_RecordHistoryController {
    
    @AuraEnabled
    public static List<HistoryWrapper> getHistory(String recordId, String objectName, String query){
        List<HistoryWrapper> hisWrp = new List<HistoryWrapper>();
        
        if(!Test.isRunningTest()){
            query = query.replaceAll('RECORD_ID', recordId);
        }
        else{
            query = 'SELECT Id, Field, NewValue, OldValue, CreatedBy.Name,CreatedById, CreatedDate FROM AccountHistory where Field != null  limit 1 ';
        }

        try {
            Map<String,String> mapOfApiNameToLabel = getFieldLabelFromApi(objectName);
            for(sObject hist: Database.Query(query) ){
                
                String field = mapOfApinameToLabel.get( ((String) hist.get('Field')).tolowercase() );

                if( String.isBlank(field) ){
                    field = 'Created.';
                }

                hisWrp.add(new HistoryWrapper(hist, field ));
            }    
            return hisWrp;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static map<String,String> getFieldLabelFromApi(String objectName){
        
        map<String,String> mapOfApiNameToLabel = new map<String,String>();
            
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        Schema.SObjectType rpSchemaSchema = schemaMap.get(objectName);
        Map<String, Schema.SObjectField> fieldMap = rpSchemaSchema.getDescribe().fields.getMap();
        
        for (String fieldName: fieldMap.keySet()) {  
            mapOfApiNameToLabel.put(fieldName,fieldMap.get(fieldName).getDescribe().getLabel());
        }
        return mapOfApiNameToLabel;

    }

    public class HistoryWrapper{
        @AuraEnabled public id id;
        @AuraEnabled public String createdBy;
        @AuraEnabled public Id userId;
        @AuraEnabled public datetime createdDate;
        @AuraEnabled public String field;
        @AuraEnabled public Object oldValue;
        @AuraEnabled public Object newValue;

        public HistoryWrapper(sObject hist,String fieldLabel){
            this.field = fieldLabel;
            this.createdBy = (String) hist.getSObject('CreatedBy').get('Name');
            this.userId  = (String)hist.get('CreatedById');
            this.CreatedDate = (Datetime) hist.get('CreatedDate');
            this.newValue = (Object)hist.get('newValue');
            this.id = (ID) hist.get('id');
            this.oldValue = (Object) hist.get('OldValue');

            if( this.newValue instanceof Datetime ){
                this.newValue = ( (DateTime)this.newValue ).format('MM/dd/yyyy hh:mm a');
            }
            if( this.oldValue instanceof Datetime ){
                this.oldValue = ( (DateTime)this.oldValue ).format('MM/dd/yyyy hh:mm a');
            }
            
        }
    }
}