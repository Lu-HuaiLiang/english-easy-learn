import token from './google-translate-token.js';
import languages from './languages.js';

async function translate(text, opts = {}) {
  console.log(text, opts);

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
  const params = new URLSearchParams();
  params.append('client', 'gtx');
  params.append('sl', opts.from);
  params.append('tl', opts.to);
  params.append('hl', opts.to);
  params.append(
    'dt',
    ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'].join(','),
  );
  params.append('ie', 'UTF-8');
  params.append('oe', 'UTF-8');
  params.append('otf', '1');
  params.append('ssel', '0');
  params.append('tsel', '0');
  params.append('kc', '7');
  params.append('q', text);
  params.append(name, value);

  const urlWithQuery = `${url}?${params.toString()}`;

  try {
    const res = await fetch(urlWithQuery);

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const body = await res.json();

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
      raw: opts.raw ? JSON.stringify(body) : '',
    };

    body[0].forEach((obj) => {
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
    e.code = err.status ? 'BAD_REQUEST' : 'BAD_NETWORK';
    e.message = err.message;
    throw e;
  }
}

export default translate;
