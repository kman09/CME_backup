import { LightningElement,api } from 'lwc';
import getHistory from '@salesforce/apex/CME_RecordHistoryController.getHistory';

export default class Cme_record_history extends LightningElement {
    @api recordId;
    @api sObject;
    @api Query;
    data;

    columns = [
        { label: 'Date', fieldName: 'createdDate', 
            type: "date",
            typeAttributes:{            
                year: "numeric",
                month: "numeric",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }    
        },
        { label: 'Field', fieldName: 'field'},
        { label: 'User', fieldName: 'createdBy'},
        { label: 'Original Value', fieldName: 'oldValue'},
        { label: 'New Value', fieldName: 'newValue' }
    ];

    connectedCallback(){
        this.fetchHistory();
    }

    fetchHistory(){
        //Example Attribute Values
        //'SELECT Id, Field, NewValue, OldValue, CreatedBy.Name,CreatedById, CreatedDate FROM ClinicalEncounterHistory WHERE ClinicalEncounterId = \'RECORD_ID\' AND DataType != \'EntityId\' ORDER BY CreatedDate DESC'
        //'ClinicalEncounterHistory',
        this.data = undefined;
        
        getHistory({
            recordId: this.recordId, 
            objectName : this.sObject,
            query : this.Query
        })
        .then(result =>{
            this.data  = result;
        })
        .catch(err=>{
            console.error(err);
        });
    }
}