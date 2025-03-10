#!/bin/bash
# filepath: \home\dove\CrazySpottedDove\github.io\scripts\sql.sh
#!/bin/bash

KEYWORDS=(
  'use' 'create' 'view' 'table' 'index' 'drop' 'alter' 'add'
  'delete' 'insert' 'into' 'values' 'update' 'set' 'select'
  'from' 'where' 'group' 'by' 'having' 'order' 'asc' 'desc'
  'distinct' 'and' 'or' 'not' 'null' 'like' 'join' 'inner'
  'outer' 'on' 'union' 'intersect' 'except' 'all' 'some'
  'case' 'when' 'then' 'else' 'end' 'primary' 'key' 'foreign'
  'references' 'constraint' 'check' 'unique' 'exists' 'is'
  'default' 'cascade' 'before' 'after' 'trigger' 'assertion'
  'domain' 'with' 'referencing' 'old' 'new' 'as' 'of' 'for' 'each' 'statement' 'row'
)

for file in "$@"
do
  for keyword in "${KEYWORDS[@]}"
  do
    sed -i -E "s/\\<$keyword\\>/${keyword^^}/gI" "$file"
  done
done