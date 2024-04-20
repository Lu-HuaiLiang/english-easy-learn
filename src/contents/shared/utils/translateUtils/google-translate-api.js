import querystring from 'querystring';
import got from 'got';
import safeEval from 'safe-eval';
import token from './google-translate-token.js'
import languages from './languages.js';

async function translate(text, opts = {}) {
    for (const lang of [opts.from, opts.to]) {
        if (lang && !languages.isSupported(lang)) {
            const e = new Error();
            e.code = 400;
            e.message = `The language '${lang}' is not supported`;
            throw e;
        }
    }

    opts.from = opts.from || 'auto';
    opts.to = opts.to || 'en';

    opts.from = languages.getCode(opts.from);
    opts.to = languages.getCode(opts.to);

    const { name, value } = await token.get(text);
    const url = 'https://translate.google.com/translate_a/single';
    const data = {
        client: 'gtx',
        sl: opts.from,
        tl: opts.to,
        hl: opts.to,
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
        ie: 'UTF-8',
        oe: 'UTF-8',
        otf: 1,
        ssel: 0,
        tsel: 0,
        kc: 7,
        q: text,
    };
    data[name] = value;

    const urlWithQuery = `${url}?${querystring.stringify(data)}`;

    try {
        const res = await got(urlWithQuery);
        const result = {
            text: '',
            from: {
                language: {
                    didYouMean: false,
                    iso: '',
                },
                text: {
                    autoCorrected: false,
                    value: '',
                    didYouMean: false,
                },
            },
            raw: '',
        };

        if (opts.raw) {
            result.raw = res.body;
        }

        const body = safeEval(res.body);
        body[0].forEach(obj => {
            if (obj[0]) {
                result.text += obj[0];
            }
        });

        if (body[2] === body[8][0][0]) {
            result.from.language.iso = body[2];
        } else {
            result.from.language.didYouMean = true;
            result.from.language.iso = body[8][0][0];
        }

        if (body[7] && body[7][0]) {
            let str = body[7][0];

            str = str.replace(/<b><i>/g, '[');
            str = str.replace(/<\/i><\/b>/g, ']');

            result.from.text.value = str;

            if (body[7][5] === true) {
                result.from.text.autoCorrected = true;
            } else {
                result.from.text.didYouMean = true;
            }
        }

        return result;
    } catch (err) {
        const e = new Error();
        if (err.statusCode !== undefined && err.statusCode !== 200) {
            e.code = 'BAD_REQUEST';
        } else {
            e.code = 'BAD_NETWORK';
        }
        throw e;
    }
}

export default translate;
export { languages };
