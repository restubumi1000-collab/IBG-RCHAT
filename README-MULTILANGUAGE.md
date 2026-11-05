# NICCA Connect+ v9.0 Multilanguage UI

Added Indonesian / Japanese / English interface switchers on login and header.

## Deployment
Upload all files in this folder to the same GitHub Pages directory (keep filenames). Existing Firebase configuration and Firestore rules are unchanged.

## Scope
Translates UI labels in login, chat controls, KPI cards, history, admin, and Excel import. Translation runs on rendered UI labels including dynamically added labels; user-generated chat messages, descriptions, Excel cell data, Firestore field names, and numeric data are not translated. User-selected language is saved locally in the browser (nicca_ui_language).

## Note
This is a source-level integration with syntax checks, not an end-to-end Firebase browser test. Verify admin/user workflows and all three languages in a staging deployment before replacing production. Some longer dynamically generated import statuses and error messages may remain in Indonesian; translate them in language.js as needed.
