// export function msToTime(valueMsEpoch: number) {
//   const seconds = Math.floor((valueMsEpoch / 1000) % 60);
//   const minutes = Math.floor((valueMsEpoch / (1000 * 60)) % 60);
//   const hours = Math.floor((valueMsEpoch / (1000 * 60 * 60)) % 24);
//
//   return hours + ':' + minutes + ':' + seconds;
// }
//
// export function msToClock(valueMsEpoch: number) {
//   const minutes = Math.floor((valueMsEpoch / (1000 * 60)) % 60);
//   const hours = Math.floor((valueMsEpoch / (1000 * 60 * 60)) % 24);
//
//   return hours + ':' + minutes;
// }

function getTimezoneList(): { [key: number]: string } {
  const timezoneTable: { [key: number]: string } = {
    '-43200000': '(GMT -12:00) Eniwetok, Kwajalein',
    '-39600000': '(GMT -11:00) Midway Island, Samoa',
    '-36000000': '(GMT -10:00) Hawaii',
    '-32400000': '(GMT -9:00) Alaska',
    '-28800000': '(GMT -8:00) Pacific Time',
    '-25200000': '(GMT -7:00) Mountain Time',
    '-21600000': '(GMT -6:00) Central Time, Mexico City',
    '-18000000': '(GMT -5:00) Eastern Time, Bogota, Lima',
    '-14400000': '(GMT -4:00) Atlantic Time, Caracas, La Paz',
    '-12600000': '(GMT -3:30) Newfoundland',
    '-10800000': '(GMT -3:00) Brazil, Buenos Aires, Georgetown',
    '-7200000': '(GMT -2:00) Mid-Atlantic',
    '-3600000': '(GMT -1:00) Azores, Cape Verde Islands',
    '0': '(GMT) Western Europe Time, London',
    '3600000': '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris',
    '7200000': '(GMT +2:00) Kaliningrad, South Africa',
    '10800000': '(GMT +3:00) Baghdad, Riyadh, Moscow',
    '12600000': '(GMT +3:30) Tehran',
    '14400000': '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi',
    '16200000': '(GMT +4:30) Kabul',
    '18000000': '(GMT +5:00) Islamabad, Karachi, Tashkent',
    '19800000': '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi',
    '21600000': '(GMT +6:00) Almaty, Dhaka, Colombo',
    '25200000': '(GMT +7:00) Bangkok, Hanoi, Jakarta',
    '28800000': '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong',
    '32400000': '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk',
    '34200000': '(GMT +9:30) Adelaide, Darwin',
    '36000000': '(GMT +10:00) Eastern Australia, Guam, Vladivostok',
    '39600000': '(GMT +11:00) Magadan, Solomon Islands',
    '43200000': '(GMT +12:00) Auckland, Wellington, Fiji',
  };
  return timezoneTable;
}

// export function timezoneDropdown(selectedOffset: string): { text: string, value: string, selected: boolean }[] {
//   const timezones = getTimezoneList();
//   // foreach timezone
//   const formattedTimezones = Object.keys(timezones).map((offset) => ({
//     text: timezones[offset],
//     value: offset,
//     selected: offset === selectedOffset,
//   }));
//   return formattedTimezones;
// }

export function offsetToTimezone(offset: number) {
  const timezones = getTimezoneList();
  return timezones[offset];
}

export const DEFAULT_LOCALE_TIMEZONE = {'locale': 'en', 'offset': 0, 'id': 'UTC'};
