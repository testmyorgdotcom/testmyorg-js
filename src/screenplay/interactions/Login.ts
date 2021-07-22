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

  static withCredentialsInUrl() {
    return new LoginWithCredentialsInUrl();
  }
}

const getCredentials = (actor: UsesAbilities) =>
  Authenticate.as(actor).credentials();

const theLoginForm = the("login form").selectedBy("id=login_form");
const loginPage = {
  theLoginForm,
  theUsernameField: the("username field")
    .selectedBy("id=username")
    .of(theLoginForm),
  thePasswordField: the("password field")
    .selectedBy("id=password")
    .of(theLoginForm),
  theLoginButton: the("login button").selectedBy("id=Login").of(theLoginForm),
};

class LoginViaForm extends Interaction {
  async performAs(
    actor: UsesAbilities & AnswersQuestions & PerformsActivities
  ): Promise<void> {
    const creds = getCredentials(actor);

    await actor.attemptsTo(
      Navigate.to(defaultConfig.loginUrl()),
      Ensure.that(theLoginForm, isVisible()),
      Enter.theValue(creds.username()).into(loginPage.theUsernameField),
      Enter.theValue(creds.password()).into(loginPage.thePasswordField),
      Ensure.that(Value.of(loginPage.theUsernameField), not(equals(""))),
      Ensure.that(
        Value.of(loginPage.theUsernameField),
        equals(creds.username())
      ),
      Ensure.that(Value.of(loginPage.thePasswordField), not(equals(""))),
      Ensure.that(
        Value.of(loginPage.thePasswordField),
        equals(creds.password())
      ),
      Click.on(loginPage.theLoginButton),
      Ensure.that(theLoginForm, not(isVisible()))
    );
  }
}

class LoginWithCredentialsInUrl extends Interaction {
  performAs(
    actor: UsesAbilities & AnswersQuestions & PerformsActivities
  ): Promise<void> {
    // http://test.salesforce.com/login.jsp?un=test-zbdpfn5qeap0@example.com&pw=ld18xi3-z*0xZ
    const creds = getCredentials(actor);
    const url = `${defaultConfig.loginUrl()}/login.jsp?un=${creds.username()}&pw=${creds.password()}`;
    return actor.attemptsTo(Navigate.to(url));
  }
}
