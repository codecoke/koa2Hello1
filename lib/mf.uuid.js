
const randomBytes = require('crypto').randomBytes;

/**
 * Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [
  '00','01','02','03','04','05','06','07','08','09','0a','0b','0c','0d','0e','0f',
  '10','11','12','13','14','15','16','17','18','19','1a','1b','1c','1d','1e','1f',
  '20','21','22','23','24','25','26','27','28','29','2a','2b','2c','2d','2e','2f',
  '30','31','32','33','34','35','36','37','38','39','3a','3b','3c','3d','3e','3f',
  '40','41','42','43','44','45','46','47','48','49','4a','4b','4c','4d','4e','4f',
  '50','51','52','53','54','55','56','57','58','59','5a','5b','5c','5d','5e','5f',
  '60','61','62','63','64','65','66','67','68','69','6a','6b','6c','6d','6e','6f',
  '70','71','72','73','74','75','76','77','78','79','7a','7b','7c','7d','7e','7f',
  '80','81','82','83','84','85','86','87','88','89','8a','8b','8c','8d','8e','8f',
  '90','91','92','93','94','95','96','97','98','99','9a','9b','9c','9d','9e','9f',
  'a0','a1','a2','a3','a4','a5','a6','a7','a8','a9','aa','ab','ac','ad','ae','af',
  'b0','b1','b2','b3','b4','b5','b6','b7','b8','b9','ba','bb','bc','bd','be','bf',
  'c0','c1','c2','c3','c4','c5','c6','c7','c8','c9','ca','cb','cc','cd','ce','cf',
  'd0','d1','d2','d3','d4','d5','d6','d7','d8','d9','da','db','dc','dd','de','df',
  'e0','e1','e2','e3','e4','e5','e6','e7','e8','e9','ea','eb','ec','ed','ee','ef',
  'f0','f1','f2','f3','f4','f5','f6','f7','f8','f9','fa','fb','fc','fd','fe','ff'
];
const unixMillisec = 12219292800000 ;


function bytesToUuid(buf, offset) {
  let i = offset || 0;
  let bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}





const rngByMath = function() {
  let rnds = new Array(16);

  for (let i = 0, r; i < 16; i++) {
    if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
    rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
  }

  return rnds;
};

// var rng = require('./mf.node.rng');
// random #'s we need to init node and clockseq
const rngByNode= function () {
  return randomBytes(16);
};

const _seedBytes = rngByNode();


const _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
let _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;
// Previous uuid creation time
let _lastMSecs = 0, _lastNSecs = 0;


function v1(options={}, buf, offset) {
  let i = buf && offset || 0;
  let b = buf || [];


  // options = options || {};

  // let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;
  let clockseq = options.clockseq || _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  let msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  let dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += unixMillisec;
  // msecs += 12219292800000;
  //       12219292800000 * 10000

  // `time_low`
  let tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  let tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // bytesArr[10..15]
  let node = options.node || _nodeId;
  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}


function v11(options={}) {
  let i = options.offset || 0;
  let b = [];
  let spacer = options.spacer || '-';

  let clockseq = options.clockseq || _clockseq;
  let msecs = options.msecs || new Date().getTime();
  let nsecs = options.nsecs || _lastNSecs + 1;

  let dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  if (nsecs >= 10000) {
    throw new Error('uuid.v11(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  msecs += unixMillisec;
  // msecs += 12219292800000;

  // `time_low`
  let tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  let tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;  //b[7]

  if (options.clockseq) {
    b[i++] = clockseq >>> 8 | 0x80; //b[8]
    b[i++] = clockseq & 0xff; //b[9]
  }

  let rnds = rngByNode();
  let _boffset = (16-b.length);   // bytesArr[10..15]
  // let node = options.node || _nodeId;
  for (let n = 0; n < _boffset; ++n) {
    b[i + n] = rnds[_boffset + n];
  }
  // return bytesToUuid2(b);
  let bth = byteToHex;
  return bth[b[0]] + bth[b[1]] +
    bth[b[2]] + bth[b[3]] + spacer +
    bth[b[4]] + bth[b[5]] + spacer +
    bth[b[6]] + bth[b[7]] + spacer +
    bth[b[8]] + bth[b[9]] + spacer +
    bth[b[10]] + bth[b[11]] + bth[b[12]] + bth[b[13]] + bth[b[14]] + bth[b[15]]
  ;
}




function v4(options, buf, offset) {
  let i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  let rnds = options.random || (options.rng || rngByNode)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  //  buf[10..15]
  if (buf) {
    for (let ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }
  return buf || bytesToUuid(rnds);
}

function get_uuid_v1_time(uuid_str,spacer='-') {
  let [s,day,year] = uuid_str.split( spacer );
  let timeIntValue = Number.parseInt(
    year.substring( 1 ) +'' + day + ''+ s,
    16
  );
  timeIntValue = timeIntValue / 10000 ;
  let int_millisec = Math.floor(timeIntValue - unixMillisec);
  return new Date( int_millisec);
}

const uuid = v4;
uuid.v1 = v1;
uuid.v11 = v11;
uuid.v4 = v4;
uuid.time = get_uuid_v1_time;
uuid.byteToHex = byteToHex ;

module.exports = uuid;
