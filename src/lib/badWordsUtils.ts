import { Filter } from "bad-words";

class FilterEx extends Filter {
    /**
     * Replace a word with empty string;
     * @param {string} string - String to replace.
     */
    replaceWordEmptyString(string: string) {
        return string
            .replace(this.regex, '')
            .replace(this.replaceRegex, '');
    }

    /**
     * Evaluate a string for profanity and return an edited version with profane words removed.
     * @param {string} input - String to filter.
     */
    cleanExclude(input: string) {
        const delimiter = this.splitRegex.exec(input);
        if (!input || !delimiter) {
            return input;
        }
        return input
            .split(this.splitRegex)
            .map((word) => {
            return this.isProfane(word) ? this.replaceWordEmptyString(word) : word;
        })
            .join(delimiter[0]);
    }
}

export default FilterEx;