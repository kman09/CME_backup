/**
 * @author Sumit Chhatriya
 * @email sumit.chhatriya@mtxb2b.com
 * @create date 2022-06-23 
 * @modify date 2022-06-23 
 * @desc This is used to handle the scenario of event
 */
trigger CME_EventTrigger on Event (before insert,before update) {
    
    new CME_EventTriggerHandler().run();
}