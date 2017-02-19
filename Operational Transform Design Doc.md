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



## Collaborative String

### Insert

`[index, insertValue]`

### Delete

`[index, {d: length}]`

### Replace

`[index, {d: length}, index, insertValue]`

### Move

or alternatively `[index, {d:length, m: new index}]`

this way, edits that follows would be able to maintain the reference to 
the text when a very large piece of text is moved that is being actively
by another client.

### Examples

simple insertion and deletion

```javascript
[0, "Hey! ", 4, {d:1}] // => "" -> "Hey!"
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


## OT Type: `array`

### Insert
`[index, insertValue]`

### Delete
`[index, {d: length}]`

### Move
`[index, {m: new index}]`

### Replace
`[index, {d: length}, index, insertValue]`

### example
simple insertion and deletion

```javascript
[
    0, {i}, 
    "source", [
```

object insertion and deletion

```javascript
[
    0, [0, "Hey! ", 3, {d:1}], 
    "source", [
```

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