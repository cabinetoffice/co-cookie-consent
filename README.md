# Cabinet Office Cookie Consent Module for Node.js

The purpose of this module is to provide common Cookie Consent components (UI and functionalities) for speedy development. It is targeted for node.js application that uses [govuk-frontend] module as part of [GOV.UK Design System].

This module also setup and dispatch Google Analytics events.

## Quick Start

- Follow [GOV.UK Frontend Instructions] to install `govuk_frontend` module.
- Install `co-cookie-consent` module with npm and save it as dependencies:

      npm install "github:cabinetoffice/co-cookie-consent" --save

- Import the Sass source file to include `co-cookie-consent` styling:

      @import "node_modules/co-cookie-consent/cocs/all";

- Source the Javascript code `js.all` using a script tag. Alternatively, compile the source file if the target project already has `browserify` for example setup.

      <script src="<YOUR-JAVASCRIPT-FOLDER>/all.js"></script>
      <script>
          window.COCookieConsent.init(GA_ID, GA_DOMAIN)
      </script>

  - Google Analytics Id and Domain are expected as parameters to the `init()` function.
  - Google Analytics Id is needed to initialse Google Analytics where Google Analytics Domain is needed for removal of the cookies.

## UI Components

`co-cookie-consent` offers 3 components including `Cookie Banner`, `Preference Centre` and `Cookie Policy`. All of them are written in [Nunjucks] and can be customised by the following variables:

- `cocs_service_name` - Name of the service.

- `cocs_policy_href` - href link to the cookie policy page.

- `cocs_pref_href` - href link to the preference centre page.

- `cocs_last_updated` - Used at the end of cookie policy page as the last updated date.

### Cookie Banner Usage

    {% include "cocs/banner.njk" %}

### Preference Centre Usage

    {% include "cocs/preference.njk" %}

### Cookie Policy Usage

    {% include "cocs/policy.njk" %}

A section in the Cookie Policy is service specific and can be overridden by extending `co-cookie-consent/policy.njk` and defining the `service_specific_policy` block as follows:

    {% extends "co-cookie-consent/policy.njk" %}
    {% import "marcos.njk" as cocsMarcos %}

    {% block service_specific_policy %}
      <p class="govuk-body">
        Service specific policy description
      </p>
	    {{ cocsMarcos.cookieTable([
		    [
			    "Cookie name",
			    "Purpose of cookie",
			    "12 hours"
		    ]
	    ]) }}
    {% endblock %}

[govuk-frontend]: https://github.com/alphagov/govuk-frontend
[GOV.UK Design System]: https://design-system.service.gov.uk/
[GOV.UK Frontend Instructions]: https://frontend.design-system.service.gov.uk/get-started/#get-started
[Nunjucks]: https://mozilla.github.io/nunjucks/
