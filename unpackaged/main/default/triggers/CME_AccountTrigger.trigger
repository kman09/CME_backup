trigger CME_AccountTrigger on Account (after delete) {
    
    new CME_AccountTriggerHandler().run();
}