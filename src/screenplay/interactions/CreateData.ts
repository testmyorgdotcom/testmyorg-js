import { FieldValue, TypedRecordBuilder } from "../../data";
import {
  AnswersQuestions,
  Interaction,
  UsesAbilities,
} from "@serenity-js/core";
import { CallSalesforceApi } from "../abilities/CallSalesforceApi";

export class Create {
  static record() {
    return {
      of: (objectType: string) =>
        new CreateRecord(new TypedRecordBuilder(objectType)),
    };
  }

  static account() {
    return this.record().of("Account");
  }

  static contact() {
    return this.record().of("Contact");
  }
}

class CreateRecord extends Interaction {
  private fields: { [fieldName: string]: FieldValue };

  constructor(private readonly recordBuilder: TypedRecordBuilder) {
    super();
  }

  withFields(fields: { [fieldName: string]: FieldValue }) {
    this.fields = fields;
    return this;
  }

  async performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
    const callSalesforceAPI = CallSalesforceApi.as(actor);
    callSalesforceAPI.insert(this.recordBuilder.like(this.fields).record());
  }
}
