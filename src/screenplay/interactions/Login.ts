import { Authenticate } from "../abilities";
import {
  AnswersQuestions,
  Interaction,
  PerformsActivities,
  UsesAbilities,
} from "@serenity-js/core";
import {
  Enter,
  Target,
  Click,
  isVisible,
  Navigate,
  Value,
} from "@serenity-js/playwright";
import { Ensure, equals, not } from "@serenity-js/assertions";
import defaultConfig from "../../config";

const { the } = Target;

export class Login {
  static viaForm() {
    return new LoginViaForm();
  }
}

class LoginViaForm extends Interaction {
  async performAs(
    actor: UsesAbilities & AnswersQuestions & PerformsActivities
  ): Promise<void> {
    const authAbility = Authenticate.as(actor);
    const creds = authAbility.credentials();

    const theLoginForm = the("login form").selectedBy("id=login_form");
    const theUsernameField = the("username field")
      .selectedBy("id=username")
      .of(theLoginForm);
    const thePasswordField = the("password field")
      .selectedBy("id=password")
      .of(theLoginForm);
    const theLoginButton = the("login button")
      .selectedBy("id=Login")
      .of(theLoginForm);

    await actor.attemptsTo(
      Navigate.to(defaultConfig.loginUrl()),
      Ensure.that(theLoginForm, isVisible()),
      Enter.theValue(creds.username()).into(theUsernameField),
      Enter.theValue(creds.password()).into(thePasswordField),
      Ensure.that(Value.of(theUsernameField), not(equals(""))),
      Ensure.that(Value.of(theUsernameField), equals(creds.username())),
      Ensure.that(Value.of(thePasswordField), not(equals(""))),
      Ensure.that(Value.of(thePasswordField), equals(creds.password())),
      Click.on(theLoginButton),
      Ensure.that(theLoginForm, not(isVisible()))
    );
  }
}
