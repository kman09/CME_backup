import { LightningElement } from 'lwc';

export default class Cme_assessment_demo extends LightningElement {

    stepNames = [
        'consent',
        'obligations',
        'question1'
    ];

    currentStepIndex = 0;

    get showConsent() {
        return this.currentStepIndex === 0;
    }

    get showObligations() {
        return this.currentStepIndex === 1;
    }

    get showQuestion1() {
        return this.currentStepIndex === 2;
    }

    get currentStep() {
        return this.stepNames[this.currentStepIndex];
    }

    get showPrevious() {
        return this.currentStepIndex > 0;
    }

    get showNext() {
        return this.currentStepIndex < (this.stepNames.length-1);
    }

    get showSubmit() {
        return this.currentStepIndex == (this.stepNames.length-1);
    }

    handlePrevious(event) {
        --this.currentStepIndex;
    }

    handleNext(event) {
        ++this.currentStepIndex;
    }

    handleSubmit(event) {

    }

}