> if you undo a lot, copy something, and redo back to the present (a common operation), the document should not change. This may seem obvious but the single-player implementation of redo means “put back what I did” which may end up overwriting what other people did next if you’re not careful.\
    -- [figma's blog post on collaborative editing](https://medium.com/figma-design/multiplayer-editing-in-figma-8f8076c6c3a6#.9549bwfx5) 
    
- undo does persist the change to the server. There is no vitual "look back/ahead".

example edit

version | Server Edit Stack          |  state                       |    operation from client | client undo stack
:-----: | ---------------------      | -------------                |    ----------------      | ----   
   1    | 0, [0, "Hey! "]            |  "Hey! "                     | 0, [0, "What's your n"]  | [0, {d: 13}]
   2    | 1, [1, {d:2, r:"i"} ]      |  "Hi! "                      | send patch to server     |
   3    | 0, 2, [0, "What's your n"] |  "Hi! What's your n"         | 1, [13, "umber? "]       | [13, {d: 7}, 0, {d: 13}]
   4    | 1, 3, [13, "umber? "]      |  "Hi! What's your number? "  |                          | [17, {d: 7}, 4, {d: 13}]
   5    | 4, [16, {d: 6, r: "name"}] |  "Hi! What's your name? "    |                          |     

How to rebase client undo stack? 
0. `_v0` is the last confirmed version from the server.
1. wind back to `_v0` by applying `local undos`
2. `local undo` stack should be empty
2. apply rebased `local edits` to `_v0`, and generate new undo stack.
3. send original local edits with `_v0` being the base version to the server
4. the server rebases

push first collaboration: server does all of the rebase and conflict merging. 

Synchronization Walk-through
0. `_v0` is the last confirmed **base version** from the server.
1. client makes edit 0 and edit 1 locally, saved in `local edits`.
1. client **initiates sync** by pushing these changes to server. In exchange, it gets remote edits 0 and 1.
    - `local edits` gets put into `patch`, `local edits` is now empty, allowing the user to keep making 
        changes locally.
    - **only-once-delivery**: client timeout need to be slighly longer than server timeout to make sure 
       that edits are not delivered to the server more than once.
    - if the push times out, `patch` is merged with `local edits` and client intiates another attempt.
    - if the push returns with `remote edits`, `patch` and `local edits` will be rebased.
    - conflicting information in `patch` is preserved on the server by quoting the base version number
    - however the new `local edits` (created after `patch` is sent out) wil not be conflict preserving. 
       This is a good compromise because during active collaborative editing, the extra `local edits` 
       occured after a `patch` has been sent out is likely small and insignificant, therefore can be 
       easily recovered by the user outside the algorithmic context. 
    - another alternative way to make sure that **all** conflicts are preservative, is to lock
        the client during a patch request. This is useful when the client has a large collection of 
        **stale edits** that are created while off-line (like on an airplane).
1. client then winds back to `_v0` by applying `local undos` (or by retrieving a backup copy).
2. `local undo` stack should be empty
2. apply rebased `local edits` to `_v0`, and generate new undo stack.
3. send original local edits with `_v0` being the base version to the server
4. the server rebases

