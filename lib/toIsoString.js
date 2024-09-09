/**
 * Production Offset
 */

export function toIsoString(date) {
    var pad = function(num) {
        return (num < 10 ? '0' : '') + num;
    };

    var offsetHours = 7; // UTC offset for Western Indonesia Time (WIB)

    var utcDate = new Date(date.getTime() + (offsetHours * 60 * 60 * 1000));

    return utcDate.getFullYear() +
        '-' + pad(utcDate.getMonth() + 1) +
        '-' + pad(utcDate.getDate()) +
        'T' + pad(utcDate.getHours()) +
        ':' + pad(utcDate.getMinutes()) +
        ':' + pad(utcDate.getSeconds());
}

/**
 * Development Offset
 */

// export function toIsoString(date) {
//     var tzo = -date.getTimezoneOffset(),
//         dif = tzo >= 0 ? '+' : '-',
//         pad = function(num) {
//             return (num < 10 ? '0' : '') + num;
//         };

//     return date.getFullYear() +
//         '-' + pad(date.getMonth() + 1) +
//         '-' + pad(date.getDate()) +
//         'T' + pad(date.getHours()) +
//         ':' + pad(date.getMinutes()) +
//         ':' + pad(date.getSeconds())
// }