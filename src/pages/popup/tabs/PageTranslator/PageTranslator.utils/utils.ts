import { RecordValues } from '../../../../../types/utils';

import { languagePreferenceOptions, sitePreferenceOptions } from '../PageTranslator';
import { SitePrefs } from '../PageTranslator@tab';

/**
 * Convert site preferences for `lang` to string
 *
 * It need to generate UI from preferences
 */
export const getTranslatePreferencesForSite = (
	lang: string,
	sitePreferences: SitePrefs,
) => {
	// Set default
	let translatePreference: RecordValues<typeof sitePreferenceOptions> =
		sitePreferenceOptions.DEFAULT;

	if (sitePreferences !== null) {
		// Check for forced source language first
		if (sitePreferences.forceSourceLanguage) {
			translatePreference = sitePreferenceOptions.ALWAYS_FORCE_LANGUAGE;
		} else if (!sitePreferences.enableAutoTranslate) {
			translatePreference = sitePreferenceOptions.NEVER;
		} else if (
			sitePreferences.autoTranslateIgnoreLanguages.length === 0 &&
			sitePreferences.autoTranslateLanguages.length === 0
		) {
			translatePreference = sitePreferenceOptions.ALWAYS;
		} else {
			// Set default for site
			translatePreference = sitePreferenceOptions.DEFAULT_FOR_THIS_LANGUAGE;

			const isAutoTranslatedLang =
				sitePreferences.autoTranslateLanguages.includes(lang);
			const isIgnoredLang =
				sitePreferences.autoTranslateIgnoreLanguages.includes(lang);

			if (isIgnoredLang) {
				translatePreference = sitePreferenceOptions.NEVER_FOR_THIS_LANGUAGE;
			} else if (isAutoTranslatedLang) {
				translatePreference = sitePreferenceOptions.ALWAYS_FOR_THIS_LANGUAGE;
			}
		}
	}

	return translatePreference;
};

/**
 * Decide is require translate for `lang` by state of `sitePreferences`
 *
 * Return `boolean` with precision result or `null` for default behavior
 */
export const isRequireTranslateBySitePreferences = (
	lang: string,
	sitePreferences: SitePrefs,
) => {
	const result = getTranslatePreferencesForSite(lang, sitePreferences);

	switch (result) {
		case sitePreferenceOptions.NEVER:
		case sitePreferenceOptions.NEVER_FOR_THIS_LANGUAGE:
			return false;
		case sitePreferenceOptions.ALWAYS:
		case sitePreferenceOptions.ALWAYS_FOR_THIS_LANGUAGE:
		case sitePreferenceOptions.ALWAYS_FORCE_LANGUAGE:
			return true;
		default:
			return null;
	}
};

/**
 * Get the forced source language from site preferences, if set
 */
export const getForcedSourceLanguage = (sitePreferences: SitePrefs): string | null => {
	if (sitePreferences === null) return null;
	return sitePreferences.forceSourceLanguage ?? null;
};

/**
 * Convert language preferences to const value of `languagePreferenceOptions`
 */
export const mapLanguagePreferences = (state: boolean | null) =>
	state === null
		? languagePreferenceOptions.DISABLE
		: state
			? languagePreferenceOptions.ENABLE
			: languagePreferenceOptions.DISABLE_FOR_ALL;
