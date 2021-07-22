import { Authenticate, CallSalesforceApi } from "../abilities";
import {
  Actor,
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
  /**
   * @description
   *  Instructs actor to login via the regular login form. You can even use it for custom login forms, just make sure
   *  the form has the same ids as standard Salesforce login form.
   *
   * @returns {Interaction}
   */
  static viaForm() {
    return new LoginViaForm();
  }

  /**
   * @description
   *  Instructs actor to login using URL parameters `un` and `pw`
   *
   * @returns {Interaction}
   */
  static withCredentialsInUrl() {
    return new LoginWithCredentialsInUrl();
  }

  /**
   * @description
   *  Instructs actor to login frontdoor URL. User logs in via API first, then passes session id to frontdoor.jsp.
   *  This is considered to be the fastest way, if your user can call API.
   *
   * @returns {Interaction}
   */
  static viaFrontdoorUrl() {
    return new LoginViaFrontdoorUrl();
  }

  /**
   * @description
   *  Use this, if you don't care which way to go. We'll keep this with the fastest check available. Currently the
   *  priority is: viaFrontdoorUrl is Acotr can {@link Call}.salesforceAPI(), withCredentialsInUrl otherwise.
   *
   * @returns {Interaction}
   */
  static quickly() {
    return new QuickLogin();
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

    return actor.attemptsTo(
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
    const creds = getCredentials(actor);
    const url = `${defaultConfig.loginUrl()}/login.jsp?un=${creds.username()}&pw=${creds.password()}`;
    return actor.attemptsTo(
      Navigate.to(url),
      Ensure.that(theLoginForm, not(isVisible()))
    );
  }
}

class LoginViaFrontdoorUrl extends Interaction {
  async performAs(
    actor: UsesAbilities & AnswersQuestions & PerformsActivities
  ): Promise<void> {
    const callApiAbility = CallSalesforceApi.as(actor);
    const { sessionId, instanceUrl } = await callApiAbility.login(
      getCredentials(actor)
    );
    return actor.attemptsTo(
      Navigate.to(`${instanceUrl}/secur/frontdoor.jsp?sid=${sessionId}`),
      Ensure.that(theLoginForm, not(isVisible()))
    );
  }
}

class QuickLogin extends Interaction {
  async performAs(actor: Actor): Promise<void> {
    // hack for safe ability check
    const canCallSalesforceAPI = Boolean(
      (actor as any).findAbilityTo(CallSalesforceApi)
    );
    if (canCallSalesforceAPI) {
      return actor.attemptsTo(new LoginViaFrontdoorUrl());
    } else {
      return actor.attemptsTo(new LoginWithCredentialsInUrl());
    }
  }
}
