//
// Collection of uint8array's created by the (malloc) function.
// By adding them here, we prevent garbage collection.

let malloc_nogc = []; 

//
// This is not the C-Related malloc (memoryallocate) function but
// instead a simple implementation which allows for "allocating"
// and/or creating arrays of custom (sz) size, and adding them to
// the malloc_nogc array to prevent garbage collection.
// ----
// Summary:
// First a new Uint8Array (unsigned 8-bit integer array) instance
// the size of (sz) is created and added to the malloc_nogc array.
// Then we obtain the value returned by our read_ptr_at function,
// by passing the resulting value of:
//    Adding 0x10 (16) to the return value of addrof(<newarray>)
//
// to the read_ptr_at function, after which it gets returned.

function malloc(sz) {
  let newarr = new Uint8Array(sz);
  malloc_nogc.push(newarr);
  return read_ptr_at(addrof(arr) + 0x10);
}
