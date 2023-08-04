trigger CME_SignificantOtherTrigger on Significant_Other__c (before insert, before update) {
new CME_SignificantOtherTriggerHandler().run();
}