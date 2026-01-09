import * as migration_20251207_154313 from './20251207_154313';
import * as migration_20260108_125815_gidaisai_collections from './20260108_125815_gidaisai_collections';

export const migrations = [
  {
    up: migration_20251207_154313.up,
    down: migration_20251207_154313.down,
    name: '20251207_154313',
  },
  {
    up: migration_20260108_125815_gidaisai_collections.up,
    down: migration_20260108_125815_gidaisai_collections.down,
    name: '20260108_125815_gidaisai_collections'
  },
];
