# Data Expressions

## Anatomy of a Data Expression

Expression Format:

  `{<provider>:<data-key>(?<default>)}`

* Provider: The data provider name
* Data Key: The data value key within the provider \*
* Default: An optional default value if the provider's key is empty.

\* _If there are any dots in the key, the evaluator attempts to parse the base value as JSON, then uses the dot-notation to select a value from the object. For example, the expression `{session:user.name}` means the session value 'user' is a JSON object, parse it and replace with the 'name' property._

### Build-in Providers

* Browser Session: **session**
* Browser Storage: **storage**
* Cookies: **cookie**
* Route: **route**
* Query: **query**
* Inline Data: **data**


> See [data providers](/data/providers) to learn how to add custom data providers.

## Special Functions

didVisit('url') => boolean
