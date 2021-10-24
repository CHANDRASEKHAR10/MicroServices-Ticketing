import { ExpirationCompleteEvent, PublisherAbstract, SubjectsEnum } from "@chantickets/common";

export class ExpirationCompletePublisher extends PublisherAbstract<ExpirationCompleteEvent> {
    readonly subject = SubjectsEnum.ExpirationComplete;
    
}