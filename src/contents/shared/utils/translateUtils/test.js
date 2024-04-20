import translate from './google-translate-api.js'

translate('Hillary completed the look with pointed-toe shoes and accessorized with delicate jewelry, including a simple string necklace and sparkling studs. The former first lady has fashioned caftan looks in the past, including a dazzling powder blue look embellished with crystals she wore to the 2022 Venice Film Festival.', {to: 'zh-cn'}).then(res => {
  console.log(res)
}).catch(err => {
  console.error(err.code);
});

