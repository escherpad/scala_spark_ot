# Operational Transform Design Doc

### Todo
- [ ] conflict resolution on object insertion with both key and order index
- [ ] client usage, client sync loop are not finished
- [ ] object edit/diff format is unfinished
- [ ] conflict cases and resolution

#### Finished items
- [x] string edit/diff is finished
- [x] selection handling is finished

## Overall Client-Server-Client Synchronization Flow and Network Considerations

Cursor handling is separate from the operational transforms. Only a single patch can be "in-flight"
between each client and the server. Each operation is not invertable--meaning that a delete operation
does not need to contain the string that it removes. The client maintains a stack of "undo" operations
which it uses to undo edits. Server side undo is done via a similarly maintained undo list. Undo can
be done for either indivudual user or the entire collaborative edit stack.

## Usage

The client side usage of the OT class follows this pattern:

1. editor generates an updated new version of the `{source, selection, update}` pair.
2. the update object is sent to the `store$`, an `OT reducer` applys the update, and
generates an collection of `undos`.
3. The update gets put into a update stack `edits` (in a generator)
```javascript
    const updates = [
        {
            type: "UPDATE_POST",
            agent: "$me",
            time: 1484535194324,
            id: "post_id_string",
            source: {$e: [0, "Hi! "]},
            selection: {$s: [0, 1]}
        }
    ]
```
4. the undo gets put into a local undo stack `undos`.
```javascript
    const undos = [
        {"$me": [0, "Hi ", 2, {d: 1}, 2, "! "]}
    ];
```
> **Server-client communcation management**
>
> You don't want to keep all of the synced edits forever. Therefore edits are cleared as soon
as they are confirmed by the server.

5. At some point, the upload process
decides to send the current edit stack to the server. At this time, the upload process
    - inserts a new edit stack to the editStack hence closes the edits being sent over

6. More edits keeps coming in, but now insert into the new empty edits array at the end
of the editStack.

7. At the time the http call fails. The client combines the `in-flight` edits with `fresh-edits`
and attemps step 5 again.

8. this time the call clears, the `in-flight` edits are cleared.
    - [ ] todo: how to: ~~checks the base version number from the server's updated edits~~
    - [ ] todo: how to handle partial resolution of edits?

### Cursor Handling

```typescript
let _selection, undos = applyStringCursor(selection, edits:<edit>[])
```

- each selection has an `anchor` and a `head`. Head can be before anchor in a "backward" selection.
- cursor handling (transform) is handled completely separately from the operational transforms.
- the operations do not have to retain the directional information of the selection. For example,
    a `delete` operation does not have to know whether the anchor is at the begining of the deleted
    range, or the end.


### Model

```typescript
let object = <plain, serializable object>;
let _object, undos = apply(object, edits:<edit>[])
```
## Operations Format
|        type       | methods                               | op format                                                                                                                                                                                                                                                     | op example                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|:-----------------:|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| char              | set                                   | {$set:"new value"}                                                                                                                                                                                                                                            | {$set:"new value"}                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| number            | set(new_value) add(+1/-1)             | {$set:<number>} {$inc:<number>}                                                                                                                                                                                                                               | {$set:100} {$add: -1} note: also include date                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| string            | $set ins del mov                      | {$set:string_value<string>} [ind<num>,value<string>] [ind<num>, length<num>] [ind<num>, {length<num>,des<num>}]                                                                                                                                               | effectively an array of char only array<char>                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| array             | $set ins del mov update(index, [op…]) | {$set: array_value<array>} [ind<num>, insert_item_value<string>] [ind<num>, {$del: number_of_items<num>:1}] [ind<num>, {$mov:<num> , $to<num>}] [ind<num>, {$ops:<ops...>}] [compoundKey<dot.separated.key.integer-string>, {$ops}]                           | [ind<num>, […new_array]] → need to insert(add) new_array as item. [ind<num>, {$set: […new_array]}] → need to add new_array as item. [ind<num>, {…new_obj}] → need to add new_obj as item [ind<num>, {$del: 1}] → delet item#ind [ind<num>, {$mov: 1, $to: 4}] → move item#1 to #4 [ind<num>, {$set: “new_string”} → set item#ind to “new_string” [ind<num>, number] → insert item#ind a number [ind<num>, {$ops: […operations]}]                                                 |
| associative-array | $set ins del changeKey update         | {$set: associativeArray_value<array>} [key<num/string>, insert_item_value<string>] [key<num/string>, {$del:number_of_items<num>:1}] [key<num/string>, {$key<num/string>:}] [key<num/string>, {$ops<ops...>:}] [compoundKey<dot.separated.key-string>, {$ops}] | {key<num/string>, […newAssociateArray]} [key<num/string>, {$set: […new_array]}] → need to add new_array as item. [key<num/string>, {…new_obj}] → need to add new_obj as item [key<num/string>, {$del: 1}] → delet item#ind. Only one item at a time [key<num/string>, {$mov: 1, $to: 4}] → move item#1 to #4 [key<num/string>, {$set: “new_string”} → set item#ind to “new_string” [key<num/string>, number] → insert item#ind a number [key<num/string>, {$ops: […operations]}] |

## OT char
### set (Set a new char)
format

`"a new char"`

example

`{$set:"A"}`

## OT number
### set (Set a new number)
format

`{$set:value<number>}`

example

`{$set:100}`
### add (Addition/Subtraction)
'add' could be negative or positive

not: Also include 'date' type

format

`{$inc:<number>}`

example

`{$add: -1}`

## OT String

### set (Set a new string)
format

`{$set: string_value<string>}`

example

`{$set: "Hello World"}`

### ins(Insert)
format

`[index<num>, insertValue<string>]`

example

`[5,"Hello"]`

### del(Delete)
format

`[index<num>, length<num>]`

example

`[5,2]`

### Replace 

`[index, {d: length}, index, insertValue]`

### mov(Move)

format 

`[ind<num>, {length<num>, des<num>}]`

example

`[2, {3, 9}]`

this way, edits that follows would be able to maintain the reference to
the text when a very large piece of text is moved that is being actively
by another client.

### Examples

simple insertion and deletion

```javascript
[0, "Hey! ", 4, 1] // => "" -> "Hey!"
```

### Operation Transforms

#### insert over insert
```javascript
[op1.ind <= op0.ind ?
    op1.ind :
    op1.ind + op0.value.length,
op1.value]
```

#### insert over delete

##### strategy

maintain the insert operations that follow a delete even when the
insertion happened inside the deleted segment.

```javascript
[op1.ind < op0.ind ?
    op1.ind :
    Math.max(op1.ind - op0.length, op0.ind)
    // or:
    op1.ind < op0.ind + op0.length ?
        op0.ind :
        op1.ind - op0.length,
op1.value]
```

#### delete over insert

```javascript
[op1.ind + op1.length < op0.ind ?
    op1.ind :
    Math.max(op1.ind - op0.length, op0.ind)
    // or:
    op1.ind < op0.ind + op0.length ?
        op0.ind :
        op1.ind - op0.length,
op1.value]
```

#### delete over delete

```javascript
[op1.ind < op0.ind ?
    op1.ind :
    Math.max(op1.ind - op0.length, op0.ind),
op1.length]
```

##### cursor handling

if `delete` needs to be transformed to after `delete`


## OT Ordered Array
### set (Set as a new array)
format

`{$set: array_value<array>}`

example

in previous level:
`[ind<num>, {$set: […new_array]}]`

### ins(Insert)
format

`[index, insertValue]`

example

`[1, {…new_obj}] `

### del(Delete)
format

`[index, {d: length}]`

example

`[3, {$del: 2}]`

### mov(Move)
format

`[ind<num>, {$mov: <num>, $to<num>}]`

example

`[1, {$mov: 1, $to: 4}]`

### update
format

`[ind<num>, {$ops:<ops…>}]`

ops may contains compound key

`[compoundKey<dot.separated.key.integer-string>, {$ops}]`

example

`[2, {$ops: […operations]}]`

### Replace
`[index, {d: length}, index, insertValue]`

### example
insertion and deletion

```javascript
[0, {name: a, value:b}, 3, 1]
```

## OT Associative Array
### set (Set as a new array)
format
`{$set: associativeArray_value<array>}`

example

in previous level:
`["0a1", {$set: ["0a11":obj1, ...]}]`

### ins(Insert)
format
`[key<num|string>, insert_item_value<string>]`

example
`[1, {…new_obj}] `

### del(Delete one object at a time)
format
`[key<num|string>, {$del:number_of_items<num>:1}]`

example
`["0a2", {$del: 1}]`

### changeKey
format
`[key<num|string>, {$key:<num|string>}]`

example
`["0a1", {$key: "0a2"}]`

### update
format

`[key<num|string>, {$ops:<ops…>}]`

ops may contains compound key

`[compoundKey<dot.separated.key.integer-string>, {$ops}]`

example

`["0a2", {$ops: […operations]}]`


## OT Type: `object`

### Insert
`[<path>[], {i: insertValue}]`

### Delete
`[<path>[], {d: length}]`

### Move
`[<path>[], {m: new index}]`

### Replace
`[<path>[], {d: length, i: insertValue}]`

### Edit
`[<path>[], [<child_path|index|key>[], "insertion_string", ... ], ... ]`

### example
```javascript
[
    ["source","0123"], [0, "Hey! ", 3, {d:1}],
    "source", [
```

with arrays, in each operation the array_index is handled by the operational
transform. In objects, there is no implicit ordering of the keys and the key
generation is handled by the client. As a result, there is always a risk for
two clients to push the same key, therefore resulting in a conflict.

Therefore in object insert, there should be a case where key generation is
automatically transformed by the OT algorithm. All subsequent operations
involving this new key will and should be updated to use a conflict-resolved
key.

OT-JSON0 format[^ot-JSON-wiki]'s edit format has too much redundancy. For
example, to delete an element, `edit = {p: index, ld: item_as_object}`.
The actual item itself has to be included in the edit. This is a bit cumbersom,
and for extremely long string items, the comparison can take a while.


[^ot-JSON-wiki]: [https://github.com/ottypes/json0](https://github.com/ottypes/json0)


## OT Type: `ordered array with associative keys`




## Heuristics for handling carets:

Centralized algo:

## Communicating Over the Network

at any time, only one packet is allowed between each client and the server.

Example of an edit session:

1. client A inputs "a brow fo", client B inputs "John => is typing this"
2. A's edit reaches the server first. Base version is 0, client B's edits are moved *after* through A's edits.
3. As A's edits are accepted by the server, it is published to all clients. Client B receives this edit, and
transforms it's own edits behind. This transform should be identical to that happens on the server.
4. Now B's edits are also accepted by the server. server again publishes these edits to all clients. B receives
these edits and removes the edits that have been sent back from it's active edit stack.

On the client: each object has
- transform stack
- undo stack
- these stacks could be saved in a generator outside of the document object itself.

### Typical work flow:

#### action:
```
    { type: "UPDATE_POST", id: <post_id>, edits: [20, " muhaha", 20, {d: 3}] }
```
#### object update edit stack:
```
    {
        type: "UPDATE_POST",
        id: <post_id>,
        edits: [{
            p: <key> or [key0, key1...],
            na, li, ld, lm, oi, od, oc, si, sd, sc,
                or [na, ns, li, ld, lm, lc, ...]
        }]
    }
```
#### server saving
