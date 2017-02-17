Key Conflict Case: insertion inside deleted segment
: mark deleted segment as hidden therefore keep all of the insertions.

then when pasted back, use version number and text range.

this is effectively just moving the deletion after the insertion.

use cut and paste instead. Cut just marks the text selected. edits can still
be inserted. paste then atomically moves that range somewhere else.

A deletes the entire article.
B keeps inserting edits.
B realize suddently all of his edits disappeared, and they are not inside his 
undo stack. 

Naive Resolution
: remove all insertions that happened inside the deleted range.
    
    this is obvious not the best way to handle the conflict when large chunck
    of text is removed. Changes someone else's edit is in that removed text
    range. However, for small edits this allows automatic conflict resolution.

Complicated algorithm
:   text to start with: `"Hey Jude, "`

    A's edit (arrives first): `[1, {d: 4}]` => `"Hude, "`
    
    B's edit: `[2, "is ", 3, {d: 1}]` => `"Hei y Jude, "`
    
    B receives A's accepted edits from the server and needs to resolve the 
    conflict. B removes 